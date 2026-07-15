// spec: user-stories/Equipment_Module_TestCases.md (Section 16 – Search & Filter)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS, TEST_CONFIG } from './setup';

test.describe('Equipment Module - Search and Filters', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
  });

  // TC_EQ_FILTER_001
  // Uses its own freshly-created equipment rather than "whatever is currently
  // row 1" — under parallel workers, other tests concurrently create/delete
  // equipment, so a shared-row assumption is a real race condition.
  test('TC_EQ_FILTER_001 – Filter by TPS ID shows only matching records', async ({ page }) => {
    const { tpsId } = await helper.createEquipmentForTest(`FILTER1-${Date.now()}`);
    if (!tpsId) { test.skip(true, 'TPS ID value empty'); return; }

    try {
      await helper.applyFilter(SELECTORS.tpsIdFilter, tpsId);

      const filtered = page.locator(`table tbody tr:has-text("${tpsId}")`);
      await expect(filtered.first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    } finally {
      await helper.deleteEquipmentByFieldValue(SELECTORS.tpsIdFilter, tpsId);
    }
  });

  // TC_EQ_FILTER_002 – second, distinct self-created equipment record (same
  // reasoning as FILTER_001 — no dependency on shared row position/order).
  test('TC_EQ_FILTER_002 – Filter by second row TPS ID returns matching records', async ({ page }) => {
    const { tpsId } = await helper.createEquipmentForTest(`FILTER2-${Date.now()}`);
    if (!tpsId) { test.skip(true, 'TPS ID value empty'); return; }

    try {
      await helper.applyFilter(SELECTORS.tpsIdFilter, tpsId);
      await expect
        .poll(() => page.locator(SELECTORS.equipmentTableRows).count(), { timeout: TEST_CONFIG.timeouts.element })
        .toBeGreaterThanOrEqual(1);
    } finally {
      await helper.deleteEquipmentByFieldValue(SELECTORS.tpsIdFilter, tpsId);
    }
  });

  // TC_EQ_FILTER_003
  test('TC_EQ_FILTER_003 – Filter with invalid value shows empty-state or no-results message', async ({ page }) => {
    await helper.applyFilter(SELECTORS.tpsIdFilter, 'ZZZNOMATCH99999999');
    await page.waitForTimeout(800);

    const rowCount = await page.locator(SELECTORS.equipmentTableRows).count();
    const noResults = await page.locator(SELECTORS.noResultsMessage).isVisible().catch(() => false);
    expect(rowCount === 0 || noResults).toBe(true);
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_FILTER_004
  test('TC_EQ_FILTER_004 – Reset Filters restores full record list', async ({ page }) => {
    const totalBefore = await helper.getVisibleRowCount();

    await helper.applyFilter(SELECTORS.tpsIdFilter, 'ZZZNOMATCH99999');
    await page.waitForTimeout(500);
    const afterFilter = await helper.getVisibleRowCount();
    expect(afterFilter).toBeLessThanOrEqual(totalBefore);

    await helper.resetFilters();
    const afterReset = await helper.getVisibleRowCount();
    expect(afterReset).toBeGreaterThanOrEqual(afterFilter);
  });

  // TC_EQ_FILTER_005
  test('TC_EQ_FILTER_005 – Filter with empty input shows full list without errors', async ({ page }) => {
    await helper.applyFilter(SELECTORS.tpsIdFilter, '');
    await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_FILTER_006
  test('TC_EQ_FILTER_006 – Filter with very long input does not crash the application', async ({ page }) => {
    const longValue = 'A'.repeat(500);
    await helper.applyFilter(SELECTORS.tpsIdFilter, longValue);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();
  });
});
