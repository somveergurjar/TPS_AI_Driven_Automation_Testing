import { test, expect } from '@playwright/test';
import { GlobalSearchHelpers, SELECTORS } from './setup';

test.describe('Global Search – Page Load & Chat UI Structure', () => {
  let helper: GlobalSearchHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new GlobalSearchHelpers(page);
    await helper.login();
    await helper.navigateToGlobalSearch();
    await helper.waitForPageReady();
  });

  // TC_GS_001
  test('TC_GS_001 – Global Search page loads and URL is correct', async ({ page }) => {
    await expect(page).toHaveURL(/.*global-search.*/);
    await expect(page.locator('body')).not.toHaveClass(/error|crash/);
  });

  // TC_GS_002
  test('TC_GS_002 – Page title "Global Search" is visible', async ({ page }) => {
    await expect(page.locator(SELECTORS.pageTitle)).toBeVisible();
  });

  // TC_GS_003
  test('TC_GS_003 – "+ New Search" button is visible and clickable', async ({ page }) => {
    const btn = page.locator(SELECTORS.newSearchButton).first();
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  // TC_GS_004
  test('TC_GS_004 – Query History panel is visible in the left sidebar', async ({ page }) => {
    await expect(page.locator(SELECTORS.queryHistoryLabel)).toBeVisible();
  });

  // TC_GS_005
  test('TC_GS_005 – Follow-up input and Ask button are visible at the bottom', async ({ page }) => {
    const input = page.locator(SELECTORS.followUpInput).first();
    const askBtn = page.locator(SELECTORS.askButton).first();
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    await expect(askBtn).toBeVisible();
  });

  // TC_GS_006
  test('TC_GS_006 – Follow-up input has correct placeholder text', async ({ page }) => {
    const input = page.locator(SELECTORS.followUpInput).first();
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toMatch(/follow|ask/i);
  });

  // TC_GS_007
  test('TC_GS_007 – Conversation turn counter is visible', async ({ page }) => {
    await expect(page.locator(SELECTORS.turnCounter)).toBeVisible();
  });

  // TC_GS_008
  test('TC_GS_008 – No broken UI elements on Global Search page', async ({ page }) => {
    const brokenImages = page.locator('img[src=""], img[alt="broken"]');
    await expect(brokenImages).toHaveCount(0);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    expect(bodyText).not.toMatch(/\bundefined\b|\[object Object\]/);
  });

  // TC_GS_009
  test('TC_GS_009 – Follow-up input accepts keyboard input', async ({ page }) => {
    const input = page.locator(SELECTORS.followUpInput).first();
    await input.click();
    await input.fill('test message');
    await expect(input).toHaveValue('test message');
  });

  // TC_GS_010
  test('TC_GS_010 – Navigating from Dashboard to Global Search via sidebar works', async ({ page }) => {
    await page.goto(`${page.url().split('/global')[0]}/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('domcontentloaded');

    const navLink = page.locator(
      'nav a:has-text("Global Search"), aside a:has-text("Global Search"), a:has-text("Global Search")',
    ).first();

    if ((await navLink.count()) > 0) {
      await navLink.click();
      await page.waitForURL(/global-search/, { timeout: 15000 });
      await expect(page.locator(SELECTORS.pageTitle)).toBeVisible();
    } else {
      test.skip(true, 'Sidebar nav link not found');
    }
  });
});
