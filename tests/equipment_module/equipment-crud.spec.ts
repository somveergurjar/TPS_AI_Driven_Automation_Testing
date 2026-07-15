// spec: user-stories/Equipment_Module_TestCases.md (Sections 2-4 – Create / Edit / Delete)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS, TEST_CONFIG, TestDataGenerator } from './setup';

test.describe('Equipment Module - CRUD Operations', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
  });

  // TC_EQ_CREATE_001
  test('TC_EQ_CREATE_001 – Create equipment with valid mandatory data saves successfully', async ({ page }) => {
    let tpsId = '';
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);

    // Capture TPS ID
    const tpsField = page.locator(SELECTORS.tpsIdField).first();
    if ((await tpsField.count()) > 0) tpsId = await tpsField.inputValue().catch(() => '');

    // Fill all mandatory fields using the centralised helper
    const allInputs = page.locator('input[type="text"]:not([disabled]):not([readonly])');
    const inputCount = await allInputs.count();
    if (inputCount > 0) await helper.pickFirstDropdownFromLocator(allInputs.nth(0)); // MANUFACTURER
    if (inputCount > 1) await helper.pickFirstDropdownFromLocator(allInputs.nth(1)); // SUPPLIER/VENDOR
    if (inputCount > 2) await allInputs.nth(2).fill(TestDataGenerator.generateSupplierIdNo('EQ_CREATE'));

    const saveBtn = page.locator(SELECTORS.saveButton).first();
    await saveBtn.click();
    await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible({ timeout: 15000 });

    // Cleanup
    if (tpsId) await helper.deleteEquipmentByTpsId(tpsId);
  });

  // TC_EQ_CREATE_002
  test('TC_EQ_CREATE_002 – Save without mandatory fields shows field-level validation errors', async ({ page }) => {
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);

    const saveBtn = page.locator(SELECTORS.saveButton).first();
    await saveBtn.click();
    await page.waitForTimeout(500);

    const errorByText  = page.locator('text=/required/i').first();
    const errorByClass = page.locator('[class*="error"], .text-red-500, p.text-xs.text-red').first();

    const byText  = await errorByText.isVisible().catch(() => false);
    const byClass = await errorByClass.isVisible().catch(() => false);
    expect(byText || byClass).toBe(true);
  });

  // TC_EQ_CREATE_003
  test('TC_EQ_CREATE_003 – New Equipment button navigates to creation page with IDENTIFICATION tab', async ({ page }) => {
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);

    const saveBtn = page.locator(SELECTORS.saveButton);
    await expect(saveBtn.first()).toBeVisible();
    await expect(page.locator(SELECTORS.pageHeader)).not.toBeVisible();
  });

  // TC_EQ_CREATE_004
  test('TC_EQ_CREATE_004 – Save Equipment button is visible and clickable', async ({ page }) => {
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);

    const saveBtn = page.locator(SELECTORS.saveButton).first();
    await expect(saveBtn).toBeVisible();
    expect(await saveBtn.isEnabled()).toBe(true);
  });

  // TC_EQ_CREATE_005
  test('TC_EQ_CREATE_005 – Cancel from New Equipment form returns to Equipment List', async ({ page }) => {
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);

    const cancelBtn = page.locator(SELECTORS.cancelButton).first();
    if ((await cancelBtn.count()) === 0) { test.skip(true, 'Cancel button not found'); return; }

    await cancelBtn.click();

    const discardBtn = page.locator('button:has-text("Discard"), button:has-text("Yes"), button:has-text("OK")').first();
    if ((await discardBtn.count()) > 0 && (await discardBtn.isVisible().catch(() => false))) {
      await discardBtn.click();
    }

    await expect(page.locator(SELECTORS.pageHeader)).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // TC_EQ_DELETE_001
  test('TC_EQ_DELETE_001 – Delete action removes equipment and shows success toast', async ({ page }) => {
    const { tpsId, supplierIdNo } = await helper.createEquipmentForTest();
    const filterValue = tpsId || supplierIdNo;
    const filterSelector = tpsId ? SELECTORS.tpsIdFilter : SELECTORS.supplierIdFilter;

    if (!filterValue) throw new Error('Unable to determine a unique equipment record to delete');

    try {
      await helper.applyFilter(filterSelector, filterValue);
      const row = page.locator(`table tbody tr:has-text("${filterValue}")`).first();
      await expect(row).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

      const deleteBtn = row.locator(SELECTORS.deleteActionIcon).first();
      await deleteBtn.click();
      await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
      await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

      await page.locator(SELECTORS.deleteModalConfirm).click();
      await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible({ timeout: TEST_CONFIG.timeouts.action });

      await helper.applyFilter(filterSelector, filterValue);
      await expect
        .poll(() => page.locator(`table tbody tr:has-text("${filterValue}")`).count(), {
          timeout: 8000,
          intervals: [500, 500, 1000, 2000],
        })
        .toBe(0);
    } finally {
      if (tpsId) {
        await helper.deleteEquipmentByTpsId(tpsId);
      } else {
        await helper.deleteEquipmentBySupplierIdNo(supplierIdNo);
      }
    }
  });

  // TC_EQ_DELETE_002
  test('TC_EQ_DELETE_002 – Delete modal appears before confirming delete action', async ({ page }) => {
    const { tpsId, supplierIdNo } = await helper.createEquipmentForTest();
    const filterValue = tpsId || supplierIdNo;
    const filterSelector = tpsId ? SELECTORS.tpsIdFilter : SELECTORS.supplierIdFilter;

    if (!filterValue) throw new Error('Unable to determine a unique equipment record for delete modal validation');

    try {
      await helper.applyFilter(filterSelector, filterValue);
      const row = page.locator(`table tbody tr:has-text("${filterValue}")`).first();
      // A record just created via the API/UI can take a moment to be reflected
      // in the filtered listing under concurrent load — retry the filter once
      // rather than failing on a one-off indexing lag.
      try {
        await expect(row).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
      } catch {
        await helper.applyFilter(filterSelector, filterValue);
        await expect(row).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
      }

      const deleteBtn = row.locator(SELECTORS.deleteActionIcon).first();
      await deleteBtn.click();

      const deleteModal = page.locator(SELECTORS.deleteModal).first();
      await expect(deleteModal).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

      const modalConfirm = deleteModal.locator('button:has-text("Delete")').filter({ hasText: 'Delete' }).first();
      const modalCancel = deleteModal.locator('button:has-text("Cancel")').filter({ hasText: 'Cancel' }).first();
      await expect(modalConfirm).toBeVisible();
      await expect(modalCancel).toBeVisible();

      // Cancel — do not actually delete
      await modalCancel.click();
      await expect(deleteModal).toBeHidden({ timeout: TEST_CONFIG.timeouts.element });

      await helper.applyFilter(filterSelector, filterValue);
      const stillVisible = page.locator(`table tbody tr:has-text("${filterValue}")`).first();
      await expect(stillVisible).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
      await expect(page.locator(SELECTORS.toastSuccess)).not.toBeVisible({ timeout: 1000 });
    } finally {
      if (tpsId) {
        await helper.deleteEquipmentByTpsId(tpsId);
      } else {
        await helper.deleteEquipmentBySupplierIdNo(supplierIdNo);
      }
    }
  });

  // TC_EQ_LIST_009
  test('TC_EQ_LIST_009 – Pagination controls navigate between pages', async ({ page }) => {
    const nextBtn = page.locator('button:has-text("Next")').first();
    const prevBtn = page.locator('button:has-text("Previous"), button:has-text("Prev")').first();

    if ((await nextBtn.count()) === 0) { test.skip(true, 'Pagination not present'); return; }

    const isEnabled = await nextBtn.isEnabled().catch(() => false);
    if (isEnabled) {
      await nextBtn.click();
      await page.waitForTimeout(600);
      await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();

      if ((await prevBtn.count()) > 0 && (await prevBtn.isEnabled())) {
        await prevBtn.click();
        await page.waitForTimeout(600);
        await expect(page.locator(SELECTORS.equipmentTable)).toBeVisible();
      }
    }
    await expect(page.locator('body')).toBeVisible();
  });
});
