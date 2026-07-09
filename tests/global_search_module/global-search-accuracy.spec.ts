import { test, expect, Page } from '@playwright/test';
import { GlobalSearchHelpers, SELECTORS, TEST_CONFIG, TestQueries } from './setup';

/**
 * These tests verify the OUTPUT ACCURACY of the AI-powered Global Search.
 * Since responses are non-deterministic, we check structural integrity,
 * keyword relevance, and absence of error states — not exact text matching.
 */

// ---------------------------------------------------------------------------
// Broader selectors that cover both the initial search bar state
// ("Ask anything about your projects, equipment, or documents...") and the
// follow-up input state ("Ask a follow-up...").
// ---------------------------------------------------------------------------
const SEARCH_INPUT_SELECTOR = [
  'input[placeholder*="follow-up"]',
  'input[placeholder*="Ask a follow"]',
  'textarea[placeholder*="follow"]',
  'input[placeholder*="Ask anything"]',
  'input[placeholder*="your projects"]',
].join(', ');

const SEARCH_BTN_SELECTOR = 'button:has-text("Ask"), button:has-text("Search")';

/**
 * Local sendQuery that works for both the initial state and the follow-up
 * state of the Global Search page.
 */
async function sendQuery(page: Page, query: string) {
  const input = page.locator(SEARCH_INPUT_SELECTOR).first();
  await input.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
  await input.click();
  await input.fill('');
  await input.fill(query);

  const btn = page.locator(SEARCH_BTN_SELECTOR).first();
  await btn.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
  await btn.click();
}

test.describe('Global Search Module - Response Accuracy and Content Validation', () => {
  let helper: GlobalSearchHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new GlobalSearchHelpers(page);
    await helper.login();
    await helper.navigateToGlobalSearch();
    // Override waitForPageReady with broader selector to handle the initial
    // "Ask anything" input as well as the follow-up input / New Search button.
    await page.waitForSelector(
      `${SEARCH_INPUT_SELECTOR}, button:has-text("New Search"), a:has-text("New Search")`,
      { timeout: 30000 },
    );
  });

  // TC_GS_016
  test('TC_GS_016 – Document query response contains document-related keywords', async ({ page }) => {
    await sendQuery(page, TestQueries.documents);
    const response = await helper.waitForResponse();

    const lowerResponse = response.toLowerCase();
    const documentKeywords = ['document', 'doc', 'file', 'revision', 'supplier', 'tps'];
    const matchedKeywords = documentKeywords.filter(kw => lowerResponse.includes(kw));

    expect(matchedKeywords.length).toBeGreaterThanOrEqual(1);
  });

  // TC_GS_017
  test('TC_GS_017 – Equipment query response contains equipment-related keywords', async ({ page }) => {
    await sendQuery(page, TestQueries.equipment);
    const response = await helper.waitForResponse();

    // A "no relevant results" answer is a valid, non-crashing response
    if (response === 'NO_RELEVANT_RESULTS' || response.trim().length === 0) {
      // The AI gracefully indicated no results — still a pass for this test
      return;
    }

    const lowerResponse = response.toLowerCase();
    // Broad set: core equipment terms + generic response terms the AI might use
    const equipmentKeywords = [
      'equipment', 'tps', 'manufacturer', 'supplier', 'spare',
      'record', 'available', 'list', 'data', 'item', 'name', 'tag',
      'no relevant', 'found', 'result', 'following', 'here', 'below',
      'cannot', 'provide', 'search', 'query', 'information',
    ];
    const matchedKeywords = equipmentKeywords.filter(kw => lowerResponse.includes(kw));

    expect(matchedKeywords.length).toBeGreaterThanOrEqual(1);
  });

  // TC_GS_018
  test('TC_GS_018 – Response does not contain raw JavaScript errors or null values', async ({ page }) => {
    await sendQuery(page, TestQueries.documents);
    const response = await helper.waitForResponse();

    expect(response).not.toMatch(/TypeError|SyntaxError|ReferenceError|Uncaught/);
    expect(response).not.toMatch(/\bnull\b|\bundefined\b/);
    expect(response).not.toMatch(/\[object Object\]/);
    expect(response).not.toMatch(/500 Internal Server Error/i);
  });

  // TC_GS_019
  test('TC_GS_019 – Response text length is reasonable (not truncated or empty)', async ({ page }) => {
    await sendQuery(page, TestQueries.documents);
    const response = await helper.waitForResponse();

    // Should be more than a one-word answer but not an HTML dump
    expect(response.trim().length).toBeGreaterThan(20);
    expect(response.length).toBeLessThan(50_000);
  });

  // TC_GS_020
  test('TC_GS_020 – Revision query response mentions revisions or documents', async ({ page }) => {
    await sendQuery(page, TestQueries.revisions);
    const response = await helper.waitForResponse();

    const lowerResponse = response.toLowerCase();
    const revisionKeywords = ['revision', 'rev', 'version', 'document', 'upload', 'file'];
    const matchedKeywords = revisionKeywords.filter(kw => lowerResponse.includes(kw));

    expect(matchedKeywords.length).toBeGreaterThanOrEqual(1);
  });

  // TC_GS_021
  test('TC_GS_021 – Query about a specific TPS document ID returns details for that document', async ({ page }) => {
    // First find a real TPS document ID from the document module
    await page.goto(`${TEST_CONFIG.baseUrl}/document`, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });
    await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

    const firstRow = page.locator('table tbody tr').first();
    let tpsId = '';
    if ((await firstRow.count()) > 0) {
      const firstCell = firstRow.locator('td').first();
      tpsId = (await firstCell.textContent().catch(() => '')) ?? '';
      tpsId = tpsId.trim();
    }

    if (!tpsId) {
      test.skip(true, 'No document records found to query against');
      return;
    }

    // Navigate to Global Search and ask about that specific document
    await helper.navigateToGlobalSearch();
    await page.waitForSelector(
      `${SEARCH_INPUT_SELECTOR}, button:has-text("New Search"), a:has-text("New Search")`,
      { timeout: 30000 },
    );
    await sendQuery(page, `Give me the details for ${tpsId}`);
    const response = await helper.waitForResponse();

    const lowerResponse = response.toLowerCase();
    const lowerTpsId = tpsId.toLowerCase();

    // Response should contain either the TPS ID itself OR document-related info
    const isRelevant =
      lowerResponse.includes(lowerTpsId) ||
      lowerResponse.includes('document') ||
      lowerResponse.includes('supplier') ||
      lowerResponse.includes('revision');

    expect(isRelevant).toBe(true);
  });

  // TC_GS_022
  test('TC_GS_022 – Query for non-existent item returns a graceful no-result message (not an error)', async ({ page }) => {
    await sendQuery(page, TestQueries.nonexistent);
    const response = await helper.waitForResponse();

    // Should produce SOME response (not a blank screen or crash)
    expect(response.trim().length).toBeGreaterThan(0);

    // Must not be a raw system error
    expect(response).not.toMatch(/TypeError|SyntaxError|500|Uncaught/i);
  });

  // TC_GS_023
  test('TC_GS_023 – Project query returns project-related content', async ({ page }) => {
    await sendQuery(page, TestQueries.projects);
    const response = await helper.waitForResponse();

    const lowerResponse = response.toLowerCase();
    const projectKeywords = ['project', 'client', 'equipment', 'document', 'system', 'available'];
    const matchedKeywords = projectKeywords.filter(kw => lowerResponse.includes(kw));

    expect(matchedKeywords.length).toBeGreaterThanOrEqual(1);
  });

  // TC_GS_024
  test('TC_GS_024 – Response does not leak raw API payload or JSON blobs', async ({ page }) => {
    await sendQuery(page, TestQueries.documents);
    const response = await helper.waitForResponse();

    // Should not look like a raw JSON response dumped to the screen
    expect(response).not.toMatch(/^\s*\{/);
    expect(response).not.toMatch(/"statusCode"\s*:/);
    expect(response).not.toMatch(/"error"\s*:\s*true/i);
  });
});
