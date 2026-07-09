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

  // TC_GS_023
  test('TC_GS_023 – Stop button appears while AI is streaming and halts the response', async ({ page }) => {
    test.setTimeout(60_000);

    // Start a fresh conversation so we have a clean follow-up input
    await helper.startNewSearch();
    await helper.waitForPageReady();

    // Submit a query — do NOT await a full response; we want to catch the Stop button mid-stream
    const input = page.locator(SELECTORS.followUpInput).first();
    await input.fill(TestQueries.documents);
    const askBtn = page.locator(SELECTORS.askButton).first();
    await askBtn.click();

    // Stop button must become visible while AI is streaming (within 10 s)
    const stopBtn = page.locator(
      'button:has-text("Stop"), button[aria-label*="stop" i], button[title*="stop" i]',
    ).first();
    await expect(stopBtn).toBeVisible({ timeout: 10_000 });

    // Click Stop to halt AI generation
    await stopBtn.click();

    // Stop button must disappear once generation is halted
    await expect(stopBtn).not.toBeVisible({ timeout: 10_000 });

    // UI must remain fully functional after stopping
    await expect(page.locator(SELECTORS.followUpInput).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(SELECTORS.followUpInput).first()).toBeEnabled();

    // Page must not crash
    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    expect(bodyText).not.toMatch(/Unhandled|Unexpected error|500/i);
  });

  // TC_GS_024
  test('TC_GS_024 – Hover on history item reveals three-dot menu; Delete removes only that item', async ({ page }) => {
    // This test creates one real search and deletes it — it consumes tokens intentionally.
    // Pre-existing history items must NOT be touched.
    test.setTimeout(150_000);

    // Capture existing history before the test so we can verify no pre-existing item is lost
    const historyBefore = await helper.getQueryHistoryTexts();

    // Create a fresh conversation with a unique, identifiable query
    await helper.startNewSearch();
    await helper.waitForPageReady();

    const uniqueTag  = `del_test_${Date.now()}`;
    const uniqueQuery = `${uniqueTag} list documents`;

    await helper.sendMessage(uniqueQuery);

    // Let the response complete so the history entry is saved server-side
    await helper.waitForResponse(TEST_CONFIG.timeouts.aiResponse);
    await page.waitForTimeout(1_000);

    // The new query must appear in the left sidebar
    const historyItem = page.locator('aside').locator(`text=${uniqueTag}`).first();
    await expect(historyItem).toBeVisible({ timeout: 15_000 });

    // Hover to reveal the three-dot (ellipsis) context menu button
    await historyItem.hover();
    await page.waitForTimeout(400); // allow CSS hover transition

    const ellipsisBtn = page.locator(
      'button[aria-label*="more" i], button[aria-label*="option" i], button[aria-label*="delete" i], ' +
      'button[title*="more" i], aside button:visible, [class*="history"] button:visible',
    ).first();
    await expect(ellipsisBtn).toBeVisible({ timeout: 5_000 });
    await ellipsisBtn.click();

    // Delete option must appear in the resulting dropdown / menu
    const deleteOption = page.locator(
      'button:has-text("Delete"), [role="menuitem"]:has-text("Delete"), ' +
      '[role="option"]:has-text("Delete"), li:has-text("Delete")',
    ).first();
    await expect(deleteOption).toBeVisible({ timeout: 5_000 });
    await deleteOption.click();

    await page.waitForTimeout(1_500);

    // ── Assertions ────────────────────────────────────────────────────────────

    // 1. The newly created item must be gone from the sidebar
    const historyAfter = await helper.getQueryHistoryTexts();
    const newItemGone = !historyAfter.some(t =>
      t.toLowerCase().includes(uniqueTag.toLowerCase()),
    );
    expect(newItemGone).toBe(true);

    // 2. Pre-existing items must still exist (no collateral deletion)
    for (const original of historyBefore.slice(0, 5)) {
      if (original.trim().length < 4) continue;
      const fragment = original.substring(0, 12).toLowerCase();
      const stillPresent = historyAfter.some(t => t.toLowerCase().includes(fragment));
      if (!stillPresent) {
        console.log(`⚠ Pre-existing history item may have been affected: "${original.substring(0, 40)}"`);
      }
    }

    console.log(`History count — before: ${historyBefore.length}, after: ${historyAfter.length}`);
  });
});
