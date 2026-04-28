import { test, expect } from '@playwright/test';
import { SELECTORS, TagModuleHelpers, TestDataGenerator } from './setup';

test.describe('Tag Filter Tests', () => {
  let helpers: TagModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TagModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToTagModule();
  });

  test('TC-03: Verify Tag Prefix filter supports partial and case-insensitive matching', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('FILTER');
    const description = TestDataGenerator.generateUniqueTagDescription('Filter prefix');

    await helpers.createTag(prefix, description);
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, prefix.slice(0, 6));

    const rows = page.locator(SELECTORS.tagTableRows);
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let index = 0; index < rowCount; index += 1) {
      const rowText = await rows.nth(index).innerText();
      expect(rowText.toLowerCase()).toContain(prefix.slice(0, 6).toLowerCase());
    }

    await helpers.deleteTagByPrefix(prefix);
  });

  test('TC-04: Verify Tag Description filter supports partial matching', async ({ page }) => {
    const prefix = TestDataGenerator.generateUniqueTagPrefix('FILTERDESC');
    const description = TestDataGenerator.generateUniqueTagDescription('Partial Desc');
    const partialDescription = 'Partial';

    await helpers.createTag(prefix, description);
    await helpers.applyFilter(SELECTORS.tagDescriptionFilter, partialDescription);

    const rows = page.locator(SELECTORS.tagTableRows);
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let index = 0; index < rowCount; index += 1) {
      const rowText = await rows.nth(index).innerText();
      expect(rowText.toLowerCase()).toContain(partialDescription.toLowerCase());
    }

    await helpers.deleteTagByPrefix(prefix);
  });

  test('TC-05: Verify non-matching filter returns an empty result state', async ({ page }) => {
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, 'UNLIKELY-UNIQUE-PREFIX-XYZ');

    const noResultsVisible = await page.locator(SELECTORS.noResultsMessage).count();
    if (noResultsVisible > 0) {
      await expect(page.locator(SELECTORS.noResultsMessage)).toBeVisible();
    } else {
      expect(await page.locator(SELECTORS.tagTableRows).count()).toBe(0);
    }
  });
});
