import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI       = !!process.env.CI;
const headless   = process.env.HEADLESS !== 'false';
const workers    = parseInt(process.env.WORKERS ?? (isCI ? '1' : '4'));
const retries    = isCI ? 2 : parseInt(process.env.RETRIES ?? '0');

export default defineConfig({
  testDir: './tests',
  globalTeardown: './global-teardown.ts',

  // Not real test cases — kept in the repo for reference, excluded from runs:
  //   zz-inspect.spec.ts: ad-hoc DOM-inspection script, no assertions
  //   seed.spec.ts: empty placeholder scaffold
  testIgnore: ['**/zz-inspect.spec.ts', '**/seed.spec.ts'],

  /* ── Execution ──────────────────────────────────────────────────────────── */
  fullyParallel: true,
  workers,
  retries,
  timeout:   60_000,   // per-test timeout
  expect: {
    timeout: parseInt(process.env.TIMEOUT_ELEMENT ?? '15000'),
  },
  forbidOnly: isCI,

  /* ── Reporters ──────────────────────────────────────────────────────────── */
  reporter: [
    ['html',  { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { detail: true, outputFolder: 'allure-results', suiteTitle: false }],
    ['list'],
    ['./src/reporters/failure-screenshot.reporter.ts'],
    ...(isCI ? [['github'] as ['github']] : []),
  ],

  /* ── Global settings ────────────────────────────────────────────────────── */
  use: {
    headless,
    baseURL:        process.env.BASE_URL ?? 'https://dev.liveaccess.ai',
    actionTimeout:  parseInt(process.env.TIMEOUT_ACTION  ?? '10000'),
    navigationTimeout: parseInt(process.env.TIMEOUT_NAVIGATION ?? '30000'),

    // Capture artifacts on failure
    screenshot: 'only-on-failure',
    video:      (process.env.VIDEO_ON_FAILURE ?? 'retain-on-failure') as 'retain-on-failure',
    trace:      'retain-on-failure',

    // Viewport
    viewport: { width: 1440, height: 900 },

    // Ignore HTTPS errors in dev
    ignoreHTTPSErrors: true,
  },

  /* ── Output ─────────────────────────────────────────────────────────────── */
  outputDir: 'test-results',

  /* ── Browser projects ───────────────────────────────────────────────────── */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless,
        launchOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], headless },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], headless },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'], headless },
    },
  ],
});
