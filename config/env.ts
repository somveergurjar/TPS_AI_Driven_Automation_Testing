/**
 * Central environment configuration.
 * Reads from environment variables — no credentials are hardcoded here.
 *
 * Required for login-dependent tests, set in your .env file locally
 * and as USER_EMAIL / USER_PASSWORD secrets in CI:
 *   USER_EMAIL=...
 *   USER_PASSWORD=...
 *   BASE_URL=...
 */
const base = process.env.BASE_URL ?? 'https://dev.liveaccess.ai';

export const ENV = {
  baseUrl:  base,
  loginUrl: `${base}/login`,

  credentials: {
    email:    process.env.USER_EMAIL    ?? '',
    password: process.env.USER_PASSWORD ?? '',
  },

  // Client credentials for revision-access isolation tests
  // Set CLIENT1_EMAIL / CLIENT1_PASSWORD and CLIENT2_EMAIL / CLIENT2_PASSWORD in .env
  client1: {
    email:    process.env.CLIENT1_EMAIL    ?? '',
    password: process.env.CLIENT1_PASSWORD ?? '',
    accessibleRevision: parseInt(process.env.CLIENT1_REVISION ?? '2'), // Rev 2 by default
  },
  client2: {
    email:    process.env.CLIENT2_EMAIL    ?? '',
    password: process.env.CLIENT2_PASSWORD ?? '',
    accessibleRevision: parseInt(process.env.CLIENT2_REVISION ?? '3'), // Rev 3 by default
  },

  timeouts: {
    navigation: parseInt(process.env.TIMEOUT_NAVIGATION ?? '30000'),
    element:    parseInt(process.env.TIMEOUT_ELEMENT    ?? '15000'),
    action:     parseInt(process.env.TIMEOUT_ACTION     ?? '10000'),
  },

  urls: {
    document:     `${base}/document`,
    tag:          `${base}/tag`,
    equipment:    `${base}/equipment`,
    dashboard:    `${base}/dashboard`,
    globalSearch: `${base}/global-search`,
    client:       `${base}/client`,
  },
} as const;
