import logger from '@savid/logger';
import Shutdown from '@savid/shutdown';
import Admin from '#app/admin';
import Discoverer from '#app/discoverer';
export default async () => {
    Admin.init();
    Discoverer.init();
    Admin.healthy = true;
    Shutdown.register('app', async (error) => {
        logger.info('app shutting down');
        Admin.healthy = false;
        if (error)
            logger.error('app shutdown error', {
                error: error.toString(),
                name: error.name,
                stack: error.stack,
                code: error.code,
                detail: error.detail,
            });
        await Discoverer.shutdown();
        await Admin.shutdown();
        logger.info('app finished shutting down');
    });
    Shutdown.on('error', ({ error, register }) => logger.error('shutdown registered handler error', {
        error: error.toString(),
        stack: error.stack,
        register,
    }));
};
//# sourceMappingURL=app.js.map