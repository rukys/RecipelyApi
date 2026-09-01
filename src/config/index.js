import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  baseUrl: process.env.BASE_URL || 'https://www.masakapahariini.com',
  upstreamTimeoutMs: parseInt(process.env.UPSTREAM_TIMEOUT_MS || '15000', 10),
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10), // 5 mins
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 min
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '120', 10), // 120 reqs/min
  defaultUserAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  storeHeader: 'masakapahariini_id_id_BFA335_8999999017002',
  assortmentCode: 'BFA335'
};
