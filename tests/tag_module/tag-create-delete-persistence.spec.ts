import { test, expect } from '@playwright/test';
import { SELECTORS, TagModuleHelpers, TestDataGenerator, TEST_CONFIG } from './setup';

test.describe('Tag Create, Delete and Persistence Tests', () => {
  let helpers: TagModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TagModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToTagModule();
  });

  test('TC-10: Verify new tag can be created and appears in the list', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('CREATE');
    const description = TestDataGenerator.generateUniqueTagDescription('Create Test');

    // Scope to unique prefix so parallel workers don't interfere
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), { timeout: 5000 })
      .toBe(0);

    await helpers.createTag(prefix, description);

    // After create: wait for exactly 1 matching row under the prefix filter
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000, 1000, 2000],
      })
      .toBeGreaterThanOrEqual(1);

    const row = page.locator(`table tbody tr:has-text("${prefix}")`).first();
    await expect(row).toBeVisible();

    // Clean up
    await helpers.deleteTagByPrefix(prefix);
  });

  test('TC-11: Verify tag deletion removes record and updates count', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('DELETE');
    await helpers.createTag(prefix, 'Delete test tag');

    // Verify the row exists under the prefix filter before deleting
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), { timeout: 10000 })
      .toBeGreaterThanOrEqual(1);

    await helpers.deleteTagByPrefix(prefix);

    // After delete: prefix-filtered list must return 0 rows
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000, 1000, 2000],
      })
      .toBe(0);
  });

  test('TC-12: Verify newly created tag persists after refresh and navigation', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('PERSIST');
    await helpers.createTag(prefix, 'Persistence test');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await helpers.navigateToTagModule();
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect(await helpers.findRowByPrefix(prefix)).toBeVisible();

    await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'domcontentloaded' });
    await helpers.navigateToTagModule();
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect(await helpers.findRowByPrefix(prefix)).toBeVisible();

    await helpers.deleteTagByPrefix(prefix);
  });

  test('TC-13: Verify delete confirmation modal displays tag prefix and successful deletion', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('DELETE_MODAL');
    const description = TestDataGenerator.generateUniqueTagDescription('Delete Modal Test');
    await helpers.createTag(prefix, description);

    // Find the row and click delete
    const row = await helpers.findRowByPrefix(prefix);
    await row.scrollIntoViewIfNeeded();
    const deleteButton = row.locator(SELECTORS.deleteActionIcon).first();
    await deleteButton.click();

    // Verify delete modal appears
    await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

    // Verify modal displays the correct tag prefix
    const modalPrefixText = await page.locator(SELECTORS.deleteModalPrefix).innerText();
    expect(modalPrefixText).toContain(prefix);

    // Click delete in modal
    const confirmDeleteButton = page.locator(SELECTORS.deleteConfirmButton);
    await confirmDeleteButton.click();

    // Verify success toaster
    await page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action });
    const toastText = await page.locator(SELECTORS.toastSuccess).innerText();
    expect(toastText).toContain('Tag deleted successfully');

    // Verify tag is removed from list
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect(page.locator(SELECTORS.noResultsMessage)).toBeVisible();
  });

  test('TC-14: Verify cancel in delete confirmation modal closes without deleting', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('DELETE_CANCEL');
    const description = TestDataGenerator.generateUniqueTagDescription('Delete Cancel Test');
    await helpers.createTag(prefix, description);

    // Find the row and click delete
    const row = await helpers.findRowByPrefix(prefix);
    await row.scrollIntoViewIfNeeded();
    const deleteButton = row.locator(SELECTORS.deleteActionIcon).first();
    await deleteButton.click();

    // Verify delete modal appears
    await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

    // Click cancel in modal
    const cancelButton = page.locator(SELECTORS.deleteCancelButton);
    await cancelButton.click();

    // Verify modal closes
    await expect(page.locator(SELECTORS.deleteModal)).not.toBeVisible();

    // Verify tag still exists under the unique prefix filter
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    await expect(await helpers.findRowByPrefix(prefix)).toBeVisible();

    // Clean up
    await helpers.deleteTagByPrefix(prefix);
  });
});
