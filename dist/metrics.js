import { collectDefaultMetrics, Counter, register } from 'prom-client';
class Metrics {
    static async metrics() {
        return register.metrics();
    }
    static nowMicro() {
        const [secs, nano] = process.hrtime();
        return Math.floor(secs * 1000000 + nano / 1000);
    }
}
Metrics.collectDefaultMetrics = collectDefaultMetrics;
Metrics.discoveredEnodes = new Counter({
    name: 'enode_discoverer_discovered_enodes_total',
    help: 'The total number of discovered enodes',
});
Metrics.remoteSends = new Counter({
    name: 'enode_discoverer_remote_send_total',
    help: 'The total number of requests sent to remote',
    labelNames: ['success'],
});
Metrics.remoteSendEnodess = new Counter({
    name: 'enode_discoverer_remote_send_enodes_total',
    help: 'The total number of enodes sent to remote',
});
Metrics.collectDefaultMetrics({ register });
export default Metrics;
//# sourceMappingURL=metrics.js.map