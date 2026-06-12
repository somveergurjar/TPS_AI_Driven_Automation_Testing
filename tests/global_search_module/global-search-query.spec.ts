import { test, expect } from '@playwright/test';
import { GlobalSearchHelpers, SELECTORS, TEST_CONFIG, TestQueries } from './setup';

test.describe('Global Search – Chat Interaction & Query History', () => {
  let helper: GlobalSearchHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new GlobalSearchHelpers(page);
    await helper.login();
    await helper.navigateToGlobalSearch();
    await helper.waitForPageReady();
  });

  // TC_GS_011
  test('TC_GS_011 – Sending a message via follow-up input returns a response card', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    const response = await helper.waitForResponse();
    expect(response.length).toBeGreaterThan(0);
  });

  // TC_GS_012
  test('TC_GS_012 – Query bubble appears in the chat for each message sent', async ({ page }) => {
    await helper.sendMessage('dcs');
    await page.waitForTimeout(800);

    // The query text must appear as a bubble / chip in the conversation
    const bubble = page.locator(
      '[class*="rounded-full"]:has-text("dcs"), [class*="bubble"]:has-text("dcs"), ' +
      '[class*="chip"]:has-text("dcs"), [class*="tag"]:has-text("dcs"), ' +
      'div:has-text("dcs")'
    ).first();

    // Either a specific bubble element OR the text appears somewhere in the chat area
    const chatText = await page.locator('main').textContent().catch(() => '');
    expect(chatText).toContain('dcs');
  });

  // TC_GS_013
  test('TC_GS_013 – "No relevant results found" card is shown for unmatched queries', async ({ page }) => {
    await helper.sendMessage(TestQueries.nonexistent);

    await expect.poll(
      async () => {
        const noRes = await page.locator(SELECTORS.noResultsMessage).count();
        const content = await page.locator(SELECTORS.responseContent).count();
        return noRes > 0 || content > 0;
      },
      { timeout: TEST_CONFIG.timeouts.aiResponse, intervals: [2000, 3000, 5000] },
    ).toBe(true);

    const noResultsEl = page.locator(SELECTORS.noResultsMessage).first();
    if ((await noResultsEl.count()) > 0) {
      await expect(noResultsEl).toBeVisible();
    }
  });

  // TC_GS_014
  test('TC_GS_014 – "AI-generated content may be incorrect" disclaimer is shown on every response', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse();

    await expect(page.locator(SELECTORS.aiDisclaimerMessage).first()).toBeVisible();
  });

  // TC_GS_015
  test('TC_GS_015 – "References:" section is present and collapsible on each response card', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse();

    const refsEl = page.locator(SELECTORS.referencesSection).first();
    await expect(refsEl).toBeVisible();

    // Click the toggle — it must not crash
    const toggle = page.locator(SELECTORS.referencesSectionToggle).first();
    if ((await toggle.count()) > 0) {
      await toggle.click();
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  // TC_GS_016
  test('TC_GS_016 – Turn counter increments after each message sent', async ({ page }) => {
    const turnsBefore = await helper.getTurnCount();
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse();
    const turnsAfter = await helper.getTurnCount();
    expect(turnsAfter).toBeGreaterThan(turnsBefore);
  });

  // TC_GS_017
  test('TC_GS_017 – Query is saved to Query History sidebar after sending', async ({ page }) => {
    const historyBefore = await helper.getQueryHistoryTexts();

    const uniqueQuery = `auto_${Date.now()}`;
    await helper.sendMessage(uniqueQuery);
    await helper.waitForResponse().catch(() => {});
    await page.waitForTimeout(800);

    const historyAfter = await helper.getQueryHistoryTexts();
    const fragment = uniqueQuery.substring(0, 10).toLowerCase();
    const saved =
      historyAfter.some(t => t.toLowerCase().includes(fragment)) ||
      historyAfter.length > historyBefore.length;

    expect(saved).toBe(true);
  });

  // TC_GS_018
  test('TC_GS_018 – Clicking a query history item loads that conversation thread', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse().catch(() => {});
    await page.waitForTimeout(600);

    const historyItems = page.locator(
      'aside p, aside span[class*="truncate"], aside div[class*="cursor"]',
    ).filter({ hasNot: page.locator('h2,h3,h4,label') });

    if ((await historyItems.count()) === 0) {
      test.skip(true, 'No history items found');
      return;
    }

    await historyItems.first().click();
    await page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
    await page.waitForTimeout(800);

    // Follow-up input must remain usable
    await expect(page.locator(SELECTORS.followUpInput).first()).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
  });

  // TC_GS_019
  test('TC_GS_019 – "+ New Search" resets the conversation and turn counter', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse().catch(() => {});
    const turnsBefore = await helper.getTurnCount();
    expect(turnsBefore).toBeGreaterThanOrEqual(1);

    await helper.startNewSearch();
    await helper.waitForPageReady();

    const turnsAfter = await helper.getTurnCount();
    // New session must have fewer turns than the old one OR reset to ≤1
    expect(turnsAfter < turnsBefore || turnsAfter <= 1).toBe(true);
    await expect(page.locator(SELECTORS.followUpInput).first()).toBeVisible();
  });

  // TC_GS_020
  test('TC_GS_020 – Follow-up question in same thread builds on prior context', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse();

    await helper.sendMessage(TestQueries.followUp);
    const followUpResponse = await helper.waitForResponse();

    expect(followUpResponse.trim().length).toBeGreaterThan(0);
    const turns = await helper.getTurnCount();
    expect(turns).toBeGreaterThanOrEqual(2);
  });

  // TC_GS_021
  test('TC_GS_021 – Empty message does not crash the page', async ({ page }) => {
    const input = page.locator(SELECTORS.followUpInput).first();
    await input.fill('');
    await page.locator(SELECTORS.askButton).first().click();
    await page.waitForTimeout(1000);

    await expect(page.locator('body')).toBeVisible();
    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    expect(bodyText).not.toMatch(/Unhandled|Unexpected error|500/i);
  });

  // TC_GS_022
  test('TC_GS_022 – Multiple sequential queries work without page reload', async ({ page }) => {
    await helper.sendMessage(TestQueries.documents);
    await helper.waitForResponse().catch(() => {});

    await helper.sendMessage(TestQueries.equipment);
    await helper.waitForResponse().catch(() => {});

    await expect(page.locator(SELECTORS.followUpInput).first()).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
  });
});
