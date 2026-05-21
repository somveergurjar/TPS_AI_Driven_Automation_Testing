import { test as base, expect } from '@playwright/test';
import { LoginPage }        from '../pages/auth/LoginPage';
import { DocumentListPage } from '../pages/document/DocumentListPage';
import { DocumentFormPage } from '../pages/document/DocumentFormPage';
import { ENV }              from '../config/env.config';

/**
 * PageFixtures — all page objects injected into every test automatically.
 *
 * Usage in tests:
 *   import { test } from '../../src/fixtures/base.fixture';
 *
 *   test('my test', async ({ loginPage, documentListPage }) => { ... });
 */
export type PageFixtures = {
  loginPage:        LoginPage;
  documentListPage: DocumentListPage;
  documentFormPage: DocumentFormPage;
};

/**
 * OptionFixtures — test-level options that can be overridden per test.
 */
export type OptionFixtures = {
  skipLogin: boolean;
};

export const test = base.extend<PageFixtures & OptionFixtures>({

  // ─── Options (overridable per-test) ──────────────────────────────────────
  skipLogin: [false, { option: true }],

  // ─── Page objects ─────────────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  documentListPage: async ({ page }, use) => {
    await use(new DocumentListPage(page));
  },

  documentFormPage: async ({ page }, use) => {
    await use(new DocumentFormPage(page));
  },
});

/**
 * AuthenticatedTest — extends base fixture with auto-login.
 * All page objects are ready to use; login happens automatically in beforeEach.
 */
export const authenticatedTest = base.extend<PageFixtures & OptionFixtures>({
  skipLogin: [false, { option: true }],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  documentListPage: async ({ page }, use) => {
    await use(new DocumentListPage(page));
  },

  documentFormPage: async ({ page }, use) => {
    await use(new DocumentFormPage(page));
  },

  // Auto-login before every test that uses this fixture
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page    = await context.newPage();
    const login   = new LoginPage(page);

    await login.login(ENV.credentials);

    await use(page);
    await context.close();
  },
});

export { expect };
