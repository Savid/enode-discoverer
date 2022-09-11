const dev = process.env.NODE_ENV === 'development';

export const LOG_LEVEL: string = process.env.LOG_LEVEL || (dev ? 'debug' : 'warn');

export const PORT_ADMIN: string = process.env.PORT_ADMIN ?? '8081';

export const { BOOT_NODES } = process.env;
export const { DNS_NETWORKS } = process.env;
export const { DNS_ADDRESS } = process.env;
export const REFRESH_INTERVAL = !Number.isNaN(Number(process.env.REFRESH_INTERVAL))
  ? Number(process.env.REFRESH_INTERVAL)
  : undefined;
export const MAX_PEERS = !Number.isNaN(Number(process.env.MAX_PEERS))
  ? Number(process.env.MAX_PEERS)
  : undefined;

export const REMOTE_SEND_ENDPOINT: string =
  process.env.REMOTE_URL ?? 'http://localhost:8080/enodes';
export const { REMOTE_SECRET } = process.env;
export const REMOTE_SEND_INTERVAL = !Number.isNaN(Number(process.env.REMOTE_SEND_INTERVAL))
  ? Number(process.env.REMOTE_SEND_INTERVAL)
  : 30_000;
