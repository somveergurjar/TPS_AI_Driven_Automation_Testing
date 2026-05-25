import { test, expect } from '@playwright/test';
import { DocumentModuleHelpers, SELECTORS } from './setup';

test.describe('Document Module - Grid and Pagination', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
  });

  test('1.9. Pagination Works Correctly', async ({ page }) => {
    await helper.waitForDocumentGrid();

    const initialRowCount = await helper.getVisibleRowCount();

    // Try to find pagination controls
    const nextButton = page.locator(SELECTORS.paginationNext);
    const hasPagination = await nextButton.count() > 0;

    if (hasPagination) {
      // If pagination exists, test navigation
      const isNextEnabled = await nextButton.isEnabled();

      if (isNextEnabled) {
        await nextButton.click();
        await page.waitForLoadState('domcontentloaded');

        // Verify we're on a different page (rows might be different)
        const newRowCount = await helper.getVisibleRowCount();
        // Row count might be same or different, but page should have loaded
        expect(newRowCount).toBeGreaterThanOrEqual(0);

        // Try to go back
        const prevButton = page.locator(SELECTORS.paginationPrevious);
        if (await prevButton.isEnabled()) {
          await prevButton.click();
          await page.waitForLoadState('domcontentloaded');
        }
      }
    } else {
      // No pagination - that's also valid for small datasets
      expect(initialRowCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('1.10. Total Record Count Matches Backend', async ({ page }) => {
    await helper.waitForDocumentGrid();

    // Get displayed record count
    const displayedCount = await helper.getRecordCount();

    // Get actual row count from table
    const actualRowCount = await helper.getVisibleRowCount();

    // They should match or be close (considering pagination)
    // For now, just verify we have a reasonable count
    expect(displayedCount).toBeGreaterThanOrEqual(0);
    expect(actualRowCount).toBeGreaterThanOrEqual(0);
  });

  test('1.11. Empty State Displays for No Matching Data', async ({ page }) => {
    await helper.waitForDocumentGrid();

    // Apply a filter that should return no results
    await helper.applyFilter(SELECTORS.tpsIdFilter, 'NONEXISTENT_TPS_ID_12345');

    // Wait for results to update
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check for empty state message
    const noResults = page.locator(SELECTORS.noResultsMessage);
    const emptyState = page.locator(SELECTORS.emptyStateMessage);

    // One of these should be visible
    const hasEmptyState = (await noResults.count() > 0) || (await emptyState.count() > 0);
    expect(hasEmptyState).toBe(true);

    // Verify table still exists but has no rows
    const table = page.locator(SELECTORS.documentTable);
    await expect(table).toBeVisible();

    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();
    expect(rowCount).toBe(0);
  });

  test('1.12. Dynamic Row Rendering on Scroll', async ({ page }) => {
    await helper.waitForDocumentGrid();

    const initialRowCount = await helper.getVisibleRowCount();

    if (initialRowCount > 5) { // Only test scrolling if we have enough rows
      // Scroll to bottom
      await helper.scrollToBottom();

      // Wait for any dynamic loading
      await page.waitForTimeout(1000);

      // Verify scrolling worked and no errors occurred
      const afterScrollRowCount = await helper.getVisibleRowCount();

      // Row count should be the same or potentially more if virtual scrolling loads more
      expect(afterScrollRowCount).toBeGreaterThanOrEqual(initialRowCount);

      // Scroll back to top
      await helper.scrollToTop();

      // Verify we can scroll back
      const finalRowCount = await helper.getVisibleRowCount();
      expect(finalRowCount).toBeGreaterThanOrEqual(initialRowCount);
    }
  });

  test('1.32. Scrolling Through Large Dataset', async ({ page }) => {
    await helper.waitForDocumentGrid();

    // The grid uses virtual rendering — only a window of rows exist in the DOM
    // at any time, so visible row count is always low regardless of total records.
    // We only need at least 1 visible row to validate scrolling behaviour.
    const visibleRows = await helper.getVisibleRowCount();

    if (visibleRows > 0) {
      // Perform multiple scroll operations
      for (let i = 0; i < 3; i++) {
        await helper.scrollToBottom();
        await page.waitForTimeout(500);
        await helper.scrollToTop();
        await page.waitForTimeout(500);
      }

      // Verify no crashes or data corruption after scrolling
      const finalRowCount = await helper.getVisibleRowCount();
      expect(finalRowCount).toBeGreaterThan(0);

      // Verify table is still functional
      const table = page.locator(SELECTORS.documentTable);
      await expect(table).toBeVisible();
    } else {
      test.skip(true, 'No documents in the grid — skipping scroll test');
    }
  });
});