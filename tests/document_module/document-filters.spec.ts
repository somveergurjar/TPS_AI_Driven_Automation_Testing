import { test, expect } from '@playwright/test';
import { DocumentModuleHelpers, SELECTORS, TestDataGenerator } from './setup';

test.describe('Document Module - Filters', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
    await helper.waitForDocumentGrid();
  });

  test.afterEach(async ({ page }) => {
    // Reset filters after each test
    await helper.resetFilters();
  });

  test('1.13. Filter by TPS ID', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to find an existing TPS ID from the first row
    const firstRow = page.locator(SELECTORS.documentTableRows).first();
    if (await firstRow.count() > 0) {
      const tpsIdCell = firstRow.locator('td').first();
      const tpsId = await tpsIdCell.textContent();

      if (tpsId && tpsId.trim()) {
        await helper.applyFilter(SELECTORS.tpsIdFilter, tpsId.trim());

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.14. Filter by Supplier Doc ID', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to find an existing Supplier Doc ID
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() > 0) {
      // Look for a supplier doc id in the second column
      const supplierDocIdCell = rows.first().locator('td').nth(1);
      const supplierDocId = await supplierDocIdCell.textContent();

      if (supplierDocId && supplierDocId.trim()) {
        await helper.applyFilter(SELECTORS.supplierDocIdFilter, supplierDocId.trim());

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.15. Filter by Document Name', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to find an existing document name
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() > 0) {
      // Look for document name in the third column
      const docNameCell = rows.first().locator('td').nth(2);
      const docName = await docNameCell.textContent();

      if (docName && docName.trim()) {
        await helper.applyFilter(SELECTORS.documentNameFilter, docName.trim());

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.16. Filter by Document Type', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to select first available document type
    const select = page.locator(SELECTORS.documentTypeFilter);
    if (await select.count() > 0) {
      const options = select.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) { // More than just the default empty option
        // Select second option (first non-empty)
        await select.selectOption({ index: 1 });
        await page.waitForLoadState('domcontentloaded');

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.17. Filter by Supplier', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to select first available supplier
    const select = page.locator(SELECTORS.supplierFilter);
    if (await select.count() > 0) {
      const options = select.locator('option');
      const optionCount = await options.count();

      if (optionCount > 1) { // More than just the default empty option
        // Select second option (first non-empty)
        await select.selectOption({ index: 1 });
        await page.waitForLoadState('domcontentloaded');

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.18. Filter by Revision Value', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to find an existing revision value
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() > 0) {
      // Look for revision in the sixth column
      const revisionCell = rows.first().locator('td').nth(5);
      const revision = await revisionCell.textContent();

      if (revision && revision.trim()) {
        await helper.applyFilter(SELECTORS.revisionsFilter, revision.trim());

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.19. Filter by Remarks Keyword', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Try to find an existing remarks value
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() > 0) {
      // Look for remarks in the ninth column
      const remarksCell = rows.first().locator('td').nth(8);
      const remarks = await remarksCell.textContent();

      if (remarks && remarks.trim()) {
        await helper.applyFilter(SELECTORS.remarksFilter, remarks.trim());

        const filteredCount = await helper.getVisibleRowCount();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    }
  });

  test('1.20. Multiple Filters Combined', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Apply multiple filters if data is available
    let filtersApplied = 0;

    // Try TPS ID filter
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() > 0) {
      const tpsIdCell = rows.first().locator('td').first();
      const tpsId = await tpsIdCell.textContent();
      if (tpsId && tpsId.trim()) {
        await helper.applyFilter(SELECTORS.tpsIdFilter, tpsId.trim());
        filtersApplied++;
      }
    }

    // Try document name filter
    if (await rows.count() > 0) {
      const docNameCell = rows.first().locator('td').nth(2);
      const docName = await docNameCell.textContent();
      if (docName && docName.trim()) {
        await helper.applyFilter(SELECTORS.documentNameFilter, docName.trim());
        filtersApplied++;
      }
    }

    if (filtersApplied > 1) {
      const filteredCount = await helper.getVisibleRowCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('1.21. Reset Filters Returns Full List', async ({ page }) => {
    const initialCount = await helper.getRecordCount();

    // Apply a filter first
    await helper.applyFilter(SELECTORS.tpsIdFilter, 'TEST_FILTER');

    // Reset filters
    await helper.resetFilters();

    // Verify we're back to the full list
    const resetCount = await helper.getRecordCount();
    expect(resetCount).toBe(initialCount);
  });

  test('1.22. Invalid Filter Value Handling', async ({ page }) => {
    const initialCount = await helper.getVisibleRowCount();

    // Apply invalid filter
    await helper.applyFilter(SELECTORS.tpsIdFilter, 'INVALID_TPS_ID_12345');

    // Should show no results or empty state
    const noResults = page.locator(SELECTORS.noResultsMessage);
    const emptyState = page.locator(SELECTORS.emptyStateMessage);

    const hasEmptyState = (await noResults.count() > 0) || (await emptyState.count() > 0);
    expect(hasEmptyState).toBe(true);

    // Application should remain stable
    const table = page.locator(SELECTORS.documentTable);
    await expect(table).toBeVisible();
  });

  test('1.30. Filter with Empty Input', async ({ page }) => {
    const initialCount = await helper.getRecordCount();

    // Clear any existing filters
    await helper.applyFilter(SELECTORS.tpsIdFilter, '');

    // Should show all records
    const emptyFilterCount = await helper.getRecordCount();
    expect(emptyFilterCount).toBe(initialCount);
  });

  test('1.31. Filter with Very Long Input Value', async ({ page }) => {
    // Generate a very long string
    const longString = TestDataGenerator.generateLongString(1000);

    // Apply the long filter - should not crash
    await helper.applyFilter(SELECTORS.documentNameFilter, longString);

    // Application should remain stable
    const table = page.locator(SELECTORS.documentTable);
    await expect(table).toBeVisible();

    // Should handle the input gracefully
    const filteredCount = await helper.getVisibleRowCount();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });
});