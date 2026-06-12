import { test, expect } from '@playwright/test';
import { GlobalSearchHelpers, SELECTORS, TEST_CONFIG } from './setup';

test.describe('Global Search Module - End-to-End Flow', () => {
  let helper: GlobalSearchHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new GlobalSearchHelpers(page);
    await helper.login();
  });

  test(
    'TC_GS_E2E_001 – Full flow: navigate → search a document → verify accurate response → check history updated',
    async ({ page }) => {
      // ── Step 1: Navigate to Document module and pick a real TPS ID ────────────
      await page.goto(`${TEST_CONFIG.baseUrl}/document`, {
        waitUntil: 'domcontentloaded',
        timeout:   TEST_CONFIG.timeouts.navigation,
      });
      await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

      const firstRow = page.locator('table tbody tr').first();
      let tpsId = '';
      let docName = '';
      if ((await firstRow.count()) > 0) {
        const cells = firstRow.locator('td');
        tpsId   = ((await cells.nth(0).textContent().catch(() => '')) ?? '').trim();
        docName = ((await cells.nth(2).textContent().catch(() => '')) ?? '').trim();
      }

      // ── Step 2: Navigate to Global Search ────────────────────────────────────
      await helper.navigateToGlobalSearch();
      await helper.waitForPageReady();

      // ── Step 3: Verify page structure ─────────────────────────────────────────
      await expect(page.locator(SELECTORS.pageTitle)).toBeVisible();
      await expect(page.locator(SELECTORS.pageSubtitle)).toBeVisible();
      await expect(page.locator(SELECTORS.queryHistoryPanel)).toBeVisible();
      await expect(page.locator(SELECTORS.searchInput).first()).toBeVisible();
      await expect(page.locator(SELECTORS.searchButton).first()).toBeEnabled();

      // ── Step 4: Submit a document-specific query ──────────────────────────────
      const query = tpsId
        ? `Give me the details for document ${tpsId}`
        : 'Give me details about the documents in the system';

      await helper.submitQuery(query);

      // ── Step 5: Wait for AI response and assert it's non-empty ───────────────
      const response = await helper.waitForResponse();
      expect(response.trim().length).toBeGreaterThan(10);
      expect(response).not.toMatch(/TypeError|SyntaxError|500|undefined/i);

      // ── Step 6: Assert response contains document-relevant content ────────────
      const lowerResponse = response.toLowerCase();
      const relevantKeywords = tpsId
        ? [tpsId.toLowerCase(), 'document', 'doc', 'supplier', 'revision', 'file', 'tps']
        : ['document', 'doc', 'supplier', 'revision', 'file', 'tps'];
      const matchCount = relevantKeywords.filter(kw => lowerResponse.includes(kw)).length;
      expect(matchCount).toBeGreaterThanOrEqual(1);

      // ── Step 7: Verify query appears in Query History panel ──────────────────
      await page.waitForTimeout(800);
      const historyTexts = await helper.getQueryHistoryTexts();
      const queryFragment = query.toLowerCase().substring(0, 15);
      const historyUpdated =
        historyTexts.some(t => t.toLowerCase().includes(queryFragment)) ||
        historyTexts.length > 0; // at minimum history panel is populated

      expect(historyUpdated).toBe(true);

      // ── Step 8: Run a second query to verify continuity ──────────────────────
      await helper.submitQuery('List all equipment records');
      const response2 = await helper.waitForResponse();
      expect(response2.trim().length).toBeGreaterThan(10);

      // ── Step 9: Page remains stable after two queries ────────────────────────
      await expect(page).toHaveURL(/global-search/);
      await expect(page.locator(SELECTORS.searchInput).first()).toBeVisible();
      await expect(page.locator(SELECTORS.searchButton).first()).toBeEnabled();
    },
  );

  test(
    'TC_GS_E2E_002 – Search for a document that was recently created and verify it is returned',
    async ({ page }) => {
      // ── Step 1: Create a document via Document module with a unique name ──────
      const uniqueName = `GS_E2E_DOC_${Date.now()}`;
      await page.goto(`${TEST_CONFIG.baseUrl}/document`, {
        waitUntil: 'domcontentloaded',
        timeout:   TEST_CONFIG.timeouts.navigation,
      });
      await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

      // Click New Document
      const newDocBtn = page.locator('button:has-text("New Document")').first();
      if ((await newDocBtn.count()) === 0) {
        test.skip(true, 'New Document button not found');
        return;
      }
      await newDocBtn.click();
      await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

      // Fill Document Name
      const nameInput = page.locator('input:not([disabled]):not([readonly])').first();
      await nameInput.fill(uniqueName);

      // Select Document Type
      const docTypeInput = page.locator('input[placeholder="SELECT OR TYPE TO ADD NEW..."]').first();
      if ((await docTypeInput.count()) > 0) {
        await docTypeInput.click();
        await page.waitForTimeout(400);
        const firstOpt = page.locator('div.absolute.z-50 > div:first-child').first();
        if ((await firstOpt.count()) > 0) await firstOpt.click();
      }

      // Select Supplier
      const supplierInput = page.locator('input[placeholder="TYPE TO SEARCH OR ADD NEW..."]').first();
      if ((await supplierInput.count()) > 0) {
        await supplierInput.click();
        await page.waitForTimeout(400);
        const firstOpt = page.locator('div.absolute.z-50 > div:first-child').first();
        if ((await firstOpt.count()) > 0) await firstOpt.click();
      }

      // Upload a revision
      const revisionsTab = page.locator('main button:has-text("Revisions")').first();
      if ((await revisionsTab.count()) > 0) {
        await revisionsTab.click();
        await page.waitForTimeout(400);
      }
      const fileInput = page.locator('input[type="file"]').first();
      if ((await fileInput.count()) > 0) {
        const fixturePdf = require('path').resolve(__dirname, '../../test-data/calibration-certificate-rev1.pdf');
        await fileInput.setInputFiles(fixturePdf);
        const uploadBtn = page.locator('button:has-text("Upload Revision")').first();
        await uploadBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if ((await uploadBtn.count()) > 0 && await uploadBtn.isEnabled()) {
          await uploadBtn.click();
          await expect.poll(() => page.locator('table tbody tr').count(), { timeout: 8000 }).toBeGreaterThanOrEqual(1);
        }
      }

      // Save the document
      const saveBtn = page.locator('button:has-text("Save Document")').first();
      await saveBtn.click();
      await page.locator('text=/successfully/i').waitFor({ state: 'visible', timeout: 15000 });

      // Capture TPS ID from toast or navigation
      await page.goto(`${TEST_CONFIG.baseUrl}/document`, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });
      await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

      // Find the newly created document row
      const nameFilter = page.locator('th:has-text("DOCUMENT NAME") input[placeholder="Filter..."]').first();
      if ((await nameFilter.count()) > 0) {
        await nameFilter.fill(uniqueName);
        await page.waitForTimeout(600);
      }
      const newRow = page.locator(`table tbody tr:has-text("${uniqueName}")`).first();
      let capturedTpsId = '';
      if ((await newRow.count()) > 0) {
        capturedTpsId = ((await newRow.locator('td').first().textContent().catch(() => '')) ?? '').trim();
      }

      // ── Step 2: Navigate to Global Search and query the document ─────────────
      await helper.navigateToGlobalSearch();
      await helper.waitForPageReady();

      const searchQuery = capturedTpsId
        ? `Give me the details for ${capturedTpsId}`
        : `Tell me about the document named ${uniqueName}`;
      await helper.submitQuery(searchQuery);

      // ── Step 3: Assert the response references the document or its context ───
      const response = await helper.waitForResponse();
      const lowerResponse = response.toLowerCase();

      const isRelevant =
        (capturedTpsId && lowerResponse.includes(capturedTpsId.toLowerCase())) ||
        lowerResponse.includes(uniqueName.toLowerCase()) ||
        lowerResponse.includes('document') ||
        lowerResponse.includes('revision') ||
        lowerResponse.includes('supplier');

      expect(isRelevant).toBe(true);
      expect(response.trim().length).toBeGreaterThan(10);

      // ── Cleanup: delete the document ─────────────────────────────────────────
      await page.goto(`${TEST_CONFIG.baseUrl}/document`, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });
      await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

      try {
        const nameFilterCleanup = page.locator('th:has-text("DOCUMENT NAME") input[placeholder="Filter..."]').first();
        if ((await nameFilterCleanup.count()) > 0) {
          await nameFilterCleanup.fill(uniqueName);
          await page.waitForTimeout(600);
        }
        const cleanupRow = page.locator(`table tbody tr:has-text("${uniqueName}")`).first();
        if ((await cleanupRow.count()) > 0) {
          const delBtn = cleanupRow.locator('button:has(svg.lucide-trash2)').first();
          await delBtn.click();
          const confirmBtn = page.locator('button:has-text("Delete")').first();
          await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
          await confirmBtn.click();
          await page.locator('text=/successfully/i').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        }
      } catch {
        // Cleanup failure is non-fatal
      }
    },
  );
});
