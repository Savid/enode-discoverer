import logger from '@savid/logger';
import peeper from '@savid/rlpx-peeper';

import {
  BOOT_NODES,
  DNS_ADDRESS,
  DNS_NETWORKS,
  MAX_PEERS,
  REFRESH_INTERVAL,
  REMOTE_SEND_ENDPOINT,
  SHARED_SECRET,
  REMOTE_SEND_INTERVAL,
} from '#app/constants';
import Metrics from '#app/metrics';

export default class Discoverer {
  static bootnodes: Parameters<typeof peeper>[0]['bootnodes'] = [];

  static dnsNetworks: Parameters<typeof peeper>[0]['dnsNetworks'] = [];

  static discoveredENodes: string[] = [];

  static sendInterval: NodeJS.Timeout | undefined;

  static abortController: AbortController | undefined;

  static started = true;

  static init() {
    if (!BOOT_NODES) throw new Error('no valid bootnodes');
    if (!DNS_NETWORKS) throw new Error('no valid dns networks');
    BOOT_NODES.split(',').forEach((enode) => {
      const enodeUrl = new URL(enode);
      this.bootnodes?.push({
        ip: enodeUrl.hostname,
        port: Number.parseInt(enodeUrl.port),
        id: Buffer.from(enodeUrl.username, 'hex'),
      });
    });
    this.dnsNetworks = DNS_NETWORKS.split(',');
    this.sender();
    this.discover();
  }

  static async discover() {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for await (const { error, enode } of peeper({
        bootnodes: this.bootnodes,
        dnsNetworks: this.dnsNetworks,
        maxPeers: MAX_PEERS,
        refreshInterval: REFRESH_INTERVAL,
        dnsAddress: DNS_ADDRESS,
      })) {
        // check if this loop should stop
        if (!this.started) break;
        if (error) throw error;
        if (enode) {
          this.discoveredENodes.push(enode);
          Metrics.discoveredENodes.inc();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error('discover error', {
          error: error.toString(),
          stack: error.stack,
        });
      }
    }
  }

  static async sender() {
    if (this.sendInterval) clearInterval(this.sendInterval);
    this.sendInterval = setInterval(() => this.send(), REMOTE_SEND_INTERVAL);
  }

  static async send() {
    const enodes = this.discoveredENodes.splice(0);
    if (enodes.length) {
      try {
        this.abortController = new AbortController();
        await fetch(REMOTE_SEND_ENDPOINT, {
          method: 'post',
          body: JSON.stringify(enodes),
          headers: {
            'Content-Type': 'application/json',
            ...(SHARED_SECRET && { Authorization: `Basic ${SHARED_SECRET}` }),
          },
          signal: this.abortController?.signal,
        });
        Metrics.remoteSends.inc();
        Metrics.remoteSendENodes.inc(enodes.length);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('send error', {
            error: error.toString(),
            stack: error.stack,
            enodesCount: enodes.length,
          });
        }
        Metrics.remoteSendsFailed.inc();
      }
    }
  }

  static async shutdown() {
    this.started = false;
    this.abortController?.abort();
    if (this.sendInterval) clearInterval(this.sendInterval);
  }
}
