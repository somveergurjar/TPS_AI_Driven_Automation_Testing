import { test, expect } from '@playwright/test';
import { SELECTORS, TagModuleHelpers, TestDataGenerator } from './setup';

test.describe('Tag Module End-to-End Flow', () => {
  let helpers: TagModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TagModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToTagModule();
  });

  test('TC-E2E: Click Tag module, add tag prefix Test_SG1, save and verify toaster', async ({ page }) => {
    // Use a unique prefix to avoid conflicts
    const prefix = TestDataGenerator.generateUniqueTagPrefix('TEST_SG1');
    
    // Delete if exists from previous runs
    await helpers.deleteTagIfExistsByPrefix(prefix);
    
    // Click on + New Tag button
    await helpers.openNewTagModal();

    // Add Tag Prefix value
    await page.fill(SELECTORS.tagPrefixInput, prefix);

    // Save the tag
    await page.click(SELECTORS.saveTagButton);

    // Verify success toaster appears
    await expect(page.locator(SELECTORS.toastSaveSuccess)).toBeVisible({ timeout: 10000 });

    // Verify the new tag appears in the list after save
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix);
    const savedRow = await helpers.findRowByPrefix(prefix);
    await expect(savedRow).toBeVisible();

    // Cleanup created tag
    await helpers.deleteTagByPrefix(prefix);
  });
});
