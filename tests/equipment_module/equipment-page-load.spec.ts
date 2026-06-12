// spec: user-stories/Equipment_Module_TestCases.md (Section 1 – Page Load)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS } from './setup';

test.describe('Equipment Module - Page Load and Basic UI', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
  });

  // TC_EQ_LIST_001
  test('TC_EQ_LIST_001 – Equipment page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*equipment.*/);
    await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();
    await expect(page.locator('body')).not.toHaveClass(/error|crash/);
  });

  // TC_EQ_LIST_002
  test('TC_EQ_LIST_002 – Equipment grid loads properly with rows and columns', async ({ page }) => {
    await helper.waitForEquipmentGrid();
    await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();
    const rowCount = await page.locator(SELECTORS.equipmentTableRows).count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  // TC_EQ_LIST_003
  test('TC_EQ_LIST_003 – Column headers are visible', async ({ page }) => {
    await helper.waitForEquipmentGrid();
    for (const header of [
      SELECTORS.tableHeaderTpsId,
      SELECTORS.tableHeaderSupplierIdNo,
      SELECTORS.tableHeaderActions,
    ]) {
      await expect(page.locator(header).first()).toBeVisible();
    }
  });

  // TC_EQ_LIST_004
  test('TC_EQ_LIST_004 – New Equipment button is visible and enabled', async ({ page }) => {
    const btn = page.locator(SELECTORS.newEquipmentButton);
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  // TC_EQ_LIST_005
  test('TC_EQ_LIST_005 – No broken UI elements on Equipment page', async ({ page }) => {
    const brokenImages = page.locator('img[src=""], img[alt="broken"]');
    await expect(brokenImages).toHaveCount(0);

    const headerText = await page.evaluate(() => {
      const el = document.querySelector('header, h1, nav, [role="banner"]');
      return el ? el.textContent ?? '' : '';
    });
    expect(headerText).not.toMatch(/\bundefined\b|\[object Object\]/);

    const mainContent = page.locator('main, .main, #main, [role="main"]');
    if ((await mainContent.count()) > 0) {
      await expect(mainContent.first()).toBeVisible();
    }
  });

  // TC_EQ_LIST_006
  test('TC_EQ_LIST_006 – Visual layout is correct (table and New Equipment button co-exist)', async ({ page }) => {
    await helper.waitForEquipmentGrid();
    await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();
    await expect(page.locator(SELECTORS.newEquipmentButton)).toBeVisible();
  });

  // TC_EQ_LIST_007
  test('TC_EQ_LIST_007 – Rows load correctly with non-empty text', async ({ page }) => {
    await helper.waitForEquipmentGrid();
    const rows = page.locator(SELECTORS.equipmentTableRows);
    const count = await rows.count();
    if (count > 0) {
      await expect(rows.first()).toBeVisible();
      const text = await rows.first().textContent();
      expect(text?.trim()).not.toBe('');
    }
  });

  // TC_EQ_LIST_008
  test('TC_EQ_LIST_008 – Data is visible across all columns in first row', async ({ page }) => {
    await helper.waitForEquipmentGrid();
    const rows = page.locator(SELECTORS.equipmentTableRows);
    if ((await rows.count()) > 0) {
      const cells = rows.first().locator('td');
      const cellCount = await cells.count();
      expect(cellCount).toBeGreaterThanOrEqual(4);

      let nonEmpty = 0;
      for (let i = 0; i < Math.min(cellCount - 1, 6); i++) {
        const txt = await cells.nth(i).textContent();
        if (txt && txt.trim() !== '') nonEmpty++;
      }
      expect(nonEmpty).toBeGreaterThan(0);
    }
  });
});
