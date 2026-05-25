/**
 * baseTest — extended Playwright test fixture that injects page objects
 * automatically. Import `test` from here instead of `@playwright/test`
 * to get typed page objects and automatic login in every test.
 *
 * Usage:
 *   import { test, expect } from '../../fixtures/baseTest';
 *
 *   test('my test', async ({ documentListPage }) => {
 *     await documentListPage.navigate();
 *     await documentListPage.assertTableVisible();
 *   });
 */

import { test as base, expect } from '@playwright/test';
import { LoginPage }         from '../pages/LoginPage';
import { DocumentListPage }  from '../pages/DocumentListPage';
import { DocumentFormPage }  from '../pages/DocumentFormPage';
import { TagPage }           from '../pages/TagPage';

export type PageFixtures = {
  loginPage:        LoginPage;
  documentListPage: DocumentListPage;
  documentFormPage: DocumentFormPage;
  tagPage:          TagPage;
};

export type OptionFixtures = {
  /** Set to true to skip the automatic login step. */
  skipLogin: boolean;
};

// ─── Base fixture (no auto-login) ────────────────────────────────────────────

export const test = base.extend<PageFixtures & OptionFixtures>({
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

  tagPage: async ({ page }, use) => {
    await use(new TagPage(page));
  },
});

// ─── Authenticated fixture (auto-login before every test) ────────────────────

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

  tagPage: async ({ page }, use) => {
    await use(new TagPage(page));
  },

  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page    = await context.newPage();
    await new LoginPage(page).login();
    await use(page);
    await context.close();
  },
});

export { expect };
