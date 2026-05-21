import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const ENV = {
  baseUrl:     required('BASE_URL'),
  loginUrl:    required('LOGIN_URL'),

  credentials: {
    email:    required('USER_EMAIL'),
    password: required('USER_PASSWORD'),
  },

  execution: {
    headless: optional('HEADLESS', 'true') === 'true',
    browser:  optional('BROWSER', 'chromium'),
    workers:  parseInt(optional('WORKERS', '4')),
    retries:  parseInt(optional('RETRIES', '0')),
  },

  timeouts: {
    navigation: parseInt(optional('TIMEOUT_NAVIGATION', '30000')),
    element:    parseInt(optional('TIMEOUT_ELEMENT', '15000')),
    action:     parseInt(optional('TIMEOUT_ACTION', '10000')),
  },

  reporting: {
    allureResultsDir:     optional('ALLURE_RESULTS_DIR', 'allure-results'),
    screenshotOnFailure:  optional('SCREENSHOT_ON_FAILURE', 'true') === 'true',
    videoOnFailure:       optional('VIDEO_ON_FAILURE', 'retain-on-failure'),
  },

  // Module URLs derived from baseUrl
  urls: {
    document:  `${required('BASE_URL')}/document`,
    equipment: `${required('BASE_URL')}/equipment`,
    tag:       `${required('BASE_URL')}/tag`,
    dashboard: `${required('BASE_URL')}/dashboard`,
  },
} as const;
