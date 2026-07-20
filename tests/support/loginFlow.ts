import { Page } from '@playwright/test';

/**
 * Shared prefix of every module's login() — navigate to the login page,
 * clear stale session state, and submit credentials. Each module keeps
 * its own post-login wait/verify step, since those differ intentionally
 * (some throw on failure, some don't) and aren't safe to merge.
 */
export async function performLogin(
  page: Page,
  opts: {
    loginUrl: string;
    email: string;
    password: string;
    gotoTimeout: number;
    selectorTimeout: number;
    selectors: { emailInput: string; passwordInput: string; loginButton: string };
  }
): Promise<void> {
  await page.context().clearCookies();
  await page.goto(opts.loginUrl, { waitUntil: 'domcontentloaded', timeout: opts.gotoTimeout });

  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.waitForSelector(opts.selectors.emailInput, { timeout: opts.selectorTimeout });
  await page.fill(opts.selectors.emailInput, opts.email);
  await page.fill(opts.selectors.passwordInput, opts.password);
  await page.click(opts.selectors.loginButton);
}
