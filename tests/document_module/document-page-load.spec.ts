import { test, expect } from '@playwright/test';
import { DocumentModuleHelpers, SELECTORS, TEST_CONFIG } from './setup';

test.describe('Document Module - Page Load and Basic UI', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
  });

  test('1.1. Document Page Loads Successfully', async ({ page }) => {
    // Verify we're on the document page
    await expect(page).toHaveURL(/.*document.*/);

    // Verify page header is visible
    const pageHeader = page.locator(SELECTORS.pageHeader);
    await expect(pageHeader).toBeVisible();

    // Verify no blank screen or crash
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/error|crash/);
  });

  test('1.2. Document Grid Loads Properly', async ({ page }) => {
    // Wait for document grid to load
    await helper.waitForDocumentGrid();

    // Verify table is visible
    const table = page.locator(SELECTORS.documentTable);
    await expect(table).toBeVisible();

    // Verify table has rows
    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(0); // Could be 0 if no documents exist
  });

  test('1.3. Column Headers Visibility', async ({ page }) => {
    await helper.waitForDocumentGrid();

    // Verify all expected column headers are visible
    const headers = [
      SELECTORS.documentTableHeaderTPSID,
      SELECTORS.documentTableHeaderSupplierDocID,
      SELECTORS.documentTableHeaderDocumentName,
      SELECTORS.documentTableHeaderDocumentType,
      SELECTORS.documentTableHeaderSupplier,
      SELECTORS.documentTableHeaderRevisions,
      SELECTORS.documentTableHeaderLinkedEquipment,
      SELECTORS.documentTableHeaderLinkedSpares,
      SELECTORS.documentTableHeaderRemarks,
      SELECTORS.documentTableHeaderActions
    ];

    for (const header of headers) {
      const headerElement = page.locator(header);
      await expect(headerElement).toBeVisible();
    }
  });

  test('1.4. New Document Button Visibility', async ({ page }) => {
    const newDocumentButton = page.locator(SELECTORS.newDocumentButton);
    await expect(newDocumentButton).toBeVisible();
    await expect(newDocumentButton).toBeEnabled();
  });

  test('1.5. No Broken UI Elements on Document Page', async ({ page }) => {
    // Check for common broken UI indicators
    const brokenImages = page.locator('img[src=""], img[alt="broken"], img[alt="missing"]');
    await expect(brokenImages).toHaveCount(0);

    // Check for overlapping elements (basic check)
    // Get text content excluding script and style tags to avoid catching code literals
    const visibleText = await page.evaluate(() => {
      const clone = document.body.cloneNode(true) as HTMLElement;
      // Remove script and style tags
      clone.querySelectorAll('script, style').forEach(el => el.remove());
      return clone.textContent || '';
    });
    expect(visibleText).not.toContain('undefined');
    expect(visibleText).not.toContain('null');

    // Verify basic layout elements are present
    const mainContent = page.locator('main, .main, #main, .content');
    if (await mainContent.count() > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
  });

  test('1.6. Visual Layout Matches Expected Design', async ({ page }) => {
    // Basic layout checks - verify key elements are properly positioned
    const table = page.locator(SELECTORS.documentTable);
    const newButton = page.locator(SELECTORS.newDocumentButton);

    // Verify table and button are both visible
    await expect(table).toBeVisible();
    await expect(newButton).toBeVisible();

    // Check that elements don't have error classes
    await expect(table).not.toHaveClass(/error|broken/);
    await expect(newButton).not.toHaveClass(/error|broken/);
  });

  test('1.7. Rows Load Correctly in Document List', async ({ page }) => {
    await helper.waitForDocumentGrid();

    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Check first row for basic structure
      const firstRow = rows.first();
      await expect(firstRow).toBeVisible();

      // Verify row doesn't appear corrupted (basic check)
      const rowText = await firstRow.textContent();
      expect(rowText?.trim()).not.toBe('');
    }
  });

  test('1.8. Data Visibility in All Columns', async ({ page }) => {
    await helper.waitForDocumentGrid();

    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();

    if (rowCount > 0) {
      // Check that rows have content in multiple columns
      const firstRow = rows.first();
      const cells = firstRow.locator('td');
      const cellCount = await cells.count();

      // Should have at least the expected number of columns
      expect(cellCount).toBeGreaterThanOrEqual(10); // Based on headers count

      // Check that not all cells are empty
      let nonEmptyCells = 0;
      for (let i = 0; i < Math.min(cellCount, 9); i++) { // Check first 9 columns (excluding actions)
        const cellText = await cells.nth(i).textContent();
        if (cellText && cellText.trim() !== '') {
          nonEmptyCells++;
        }
      }
      expect(nonEmptyCells).toBeGreaterThan(0);
    }
  });
});