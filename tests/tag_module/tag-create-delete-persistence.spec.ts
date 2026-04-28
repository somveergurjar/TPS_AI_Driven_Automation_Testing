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

    const initialCount = await helpers.getRecordCount();
    await helpers.createTag(prefix, description);

    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    const row = await helpers.findRowByPrefix(prefix);
    await expect(row).toBeVisible();

    // Reset filter to get total count
    await helpers.resetFilters();
    const afterCreateCount = await helpers.getRecordCount();
    expect(afterCreateCount).toBeGreaterThanOrEqual(initialCount + 1);

    // Clean up
    await helpers.deleteTagByPrefix(prefix);
  });

  test('TC-11: Verify tag deletion removes record and updates count', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('DELETE');
    await helpers.createTag(prefix, 'Delete test tag');

    const beforeDeleteCount = await helpers.getRecordCount();
    await helpers.deleteTagByPrefix(prefix);

    const afterDeleteCount = await helpers.getRecordCount();
    expect(afterDeleteCount).toBeLessThanOrEqual(beforeDeleteCount - 1);
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
});
