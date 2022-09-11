import { collectDefaultMetrics, Counter, register } from 'prom-client';

class Metrics {
  static collectDefaultMetrics = collectDefaultMetrics;

  static discoveredEnodes = new Counter({
    name: 'enode_discoverer_discovered_enodes_total',
    help: 'The total number of discovered enodes',
  });

  static remoteSends = new Counter({
    name: 'enode_discoverer_remote_send_total',
    help: 'The total number of requests sent to remote',
    labelNames: ['success'],
  });

  static remoteSendEnodess = new Counter({
    name: 'enode_discoverer_remote_send_enodes_total',
    help: 'The total number of enodes sent to remote',
  });

  static async metrics() {
    return register.metrics();
  }

  static nowMicro() {
    const [secs, nano] = process.hrtime();
    return Math.floor(secs * 1000000 + nano / 1000);
  }
}

Metrics.collectDefaultMetrics({ register });

export default Metrics;
