/**
 * Global auth setup — runs once before any test project.
 * Logs in with the configured credentials, then saves the browser
 * storage state (cookies + localStorage) to disk.  Test workers
 * load this state at context creation, so they start already
 * authenticated and never need to hit the login endpoint in parallel.
 */
import { test as setup, expect } from '@playwright/test';
import * as fs   from 'fs';
import * as path from 'path';
import { ENV } from '../config/env';

const AUTH_FILE = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Ensure directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto(ENV.loginUrl, { waitUntil: 'domcontentloaded', timeout: ENV.timeouts.navigation * 3 });

  // Clear any stale session state
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.waitForSelector('input[type="email"]', { timeout: ENV.timeouts.navigation });
  await page.fill('input[type="email"]',    ENV.credentials.email);
  await page.fill('input[type="password"]', ENV.credentials.password);
  await page.click('button:has-text("Continue to Verification")');

  // Wait until we leave the login page
  await page.waitForURL(url => !url.href.includes('/login'), {
    timeout:   ENV.timeouts.navigation * 2,
    waitUntil: 'domcontentloaded',
  });

  // Confirm we are authenticated
  expect(page.url()).not.toContain('/login');

  // Persist the auth state for all workers
  await page.context().storageState({ path: AUTH_FILE });
});
