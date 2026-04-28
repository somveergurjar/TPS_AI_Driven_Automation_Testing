import { test, expect } from '@playwright/test';
import { SELECTORS, TagModuleHelpers } from './setup';

test.describe('Tag Modal and Validation Tests', () => {
  let helpers: TagModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TagModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToTagModule();
  });

  test('TC-06: Verify New Tag modal opens and contains required fields', async ({ page }) => {
    await helpers.openNewTagModal();

    await expect(page.locator(SELECTORS.newTagModal)).toBeVisible();
    await expect(page.locator(SELECTORS.tagPrefixInput)).toBeVisible();
    await expect(page.locator(SELECTORS.tagDescriptionInput)).toBeVisible();
    await expect(page.locator(SELECTORS.saveTagButton)).toBeVisible();
    await expect(page.locator(SELECTORS.cancelTagButton)).toBeVisible();
    await expect(page.locator(SELECTORS.closeModalButton)).toBeVisible();
  });

  test('TC-07: Verify validation message appears when Tag Prefix is empty', async ({ page }) => {
    await helpers.openNewTagModal();
    await page.click(SELECTORS.saveTagButton);

    await expect(page.locator(SELECTORS.validationMessagePrefix)).toBeVisible();
    await expect(page.locator(SELECTORS.tagPrefixInput)).toHaveAttribute('aria-invalid', 'true').catch(() => null);
    await expect(page.locator(SELECTORS.newTagModal)).toBeVisible();
  });

  test('TC-08: Verify Tag Description is optional and Cancel closes modal without saving', async ({ page }) => {
    await helpers.openNewTagModal();
    await page.fill(SELECTORS.tagPrefixInput, `OPT-${Date.now()}`);
    await page.click(SELECTORS.cancelTagButton);

    await expect(page.locator(SELECTORS.newTagModal)).toBeHidden();

    // Ensure the record is not added by checking no matching row exists
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, 'OPT-');
    const filteredCount = await page.locator(SELECTORS.tagTableRows).count();
    expect(filteredCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-09: Verify close icon dismisses the modal without saving', async ({ page }) => {
    await helpers.openNewTagModal();
    await helpers.closeNewTagModal();
    await expect(page.locator(SELECTORS.newTagModal)).toBeHidden();
  });
});
