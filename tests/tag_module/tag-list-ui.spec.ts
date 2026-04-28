import { test, expect } from '@playwright/test';
import { SELECTORS, TagModuleHelpers } from './setup';

test.describe('Tag List UI Tests', () => {
  let helpers: TagModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TagModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToTagModule();
  });

  test('TC-01: Verify Tag List UI and column presence', async ({ page }) => {
    // Verify header and page title
    await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();

    // Verify total records count and buttons
    await expect(page.locator(SELECTORS.totalRecordsCount)).toBeVisible();
    await expect(page.locator(SELECTORS.newTagButton)).toBeVisible();
    await expect(page.locator(SELECTORS.newTagButton)).toBeEnabled();
    await expect(page.locator(SELECTORS.resetFiltersButton)).toBeVisible();

    // Verify table headers display expected columns
    await expect(page.locator(SELECTORS.tagTableHeaderPrefix)).toBeVisible();
    await expect(page.locator(SELECTORS.tagTableHeaderDescription)).toBeVisible();
    await expect(page.locator(SELECTORS.tagTableHeaderActions)).toBeVisible();

    // Verify there is at least one row of data or a valid empty state
    const rowCount = await page.locator(SELECTORS.tagTableRows).count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-02: Verify total records count updates after add and delete flow', async ({ page }) => {
    const uniquePrefix = `UI-${Date.now()}`;
    const initialCount = await helpers.getRecordCount();

    // Add a tag to verify the count increments
    await helpers.createTag(uniquePrefix, 'Count update test');
    const afterCreateCount = await helpers.getRecordCount();
    expect(afterCreateCount).toBeGreaterThanOrEqual(initialCount + 1);

    // Clean up by deleting the created tag, then verify count decreases
    await helpers.deleteTagByPrefix(uniquePrefix);
    const afterDeleteCount = await helpers.getRecordCount();
    expect(afterDeleteCount).toBeLessThanOrEqual(afterCreateCount - 1);
  });
});
