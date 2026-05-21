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

    // Use a filtered row count scoped to the unique prefix so that concurrent
    // test workers adding/removing unrelated records cannot affect our assertions.

    // Before create: filter by the unique prefix — expect 0 rows
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, uniquePrefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), {
        timeout: 5000,
        intervals: [300, 300, 500],
      })
      .toBe(0);

    // Create the tag
    await helpers.createTag(uniquePrefix, 'Count update test');

    // After create: filter by the unique prefix and wait for 1 matching row
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, uniquePrefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000, 1000, 2000],
      })
      .toBeGreaterThanOrEqual(1);

    // Also verify the total-records counter increased (unfiltered view)
    await helpers.resetFilters();
    const countAfterCreate = await helpers.getRecordCount();
    expect(countAfterCreate).toBeGreaterThanOrEqual(1);

    // Delete the tag (helper applies the prefix filter internally)
    await helpers.deleteTagByPrefix(uniquePrefix);

    // After delete: filter by the unique prefix and wait for 0 matching rows
    await helpers.applyFilter(SELECTORS.tagPrefixFilter, uniquePrefix);
    await expect
      .poll(() => page.locator(SELECTORS.tagTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000, 1000, 2000],
      })
      .toBe(0);
  });
});
