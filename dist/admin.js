import http from 'http';
import { PORT_ADMIN } from '#app/constants';
import Metrics from '#app/metrics';
export default class Admin {
    static init() {
        if (Admin.server)
            return;
        Admin.server = http.createServer(async (req, res) => {
            switch (req.url) {
                case '/health':
                    res.writeHead(Admin.healthy ? 200 : 404).end();
                    break;
                case '/metrics': {
                    const metrics = await Metrics.metrics();
                    res.writeHead(200);
                    res.end(metrics);
                    break;
                }
                default:
                    res.writeHead(404).end();
                    break;
            }
        });
        Admin.server.listen(PORT_ADMIN);
    }
    static async shutdown() {
        return new Promise((res) => {
            Admin.server?.close(() => res());
        });
    }
}
Admin.healthy = false;
//# sourceMappingURL=admin.js.map