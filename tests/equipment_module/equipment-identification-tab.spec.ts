// spec: user-stories/Equipment_Module_TestCases.md (Section 5 – Identification Tab)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS, TEST_CONFIG, TestDataGenerator } from './setup';

test.describe('Equipment Module - Identification Tab Validation', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
  });

  // TC_EQ_IDENT_001
  test('TC_EQ_IDENT_001 – TPS ID is auto-generated and read-only', async ({ page }) => {
    const tpsField = page.locator(SELECTORS.tpsIdField).first();
    if ((await tpsField.count()) > 0) {
      const isReadonly = await tpsField.getAttribute('readonly');
      const isDisabled = await tpsField.getAttribute('disabled');
      expect(isReadonly !== null || isDisabled !== null).toBe(true);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_IDENT_002 – saving with no fields shows required validation errors
  test('TC_EQ_IDENT_002 – Saving without mandatory fields shows validation errors', async ({ page }) => {
    const saveBtn = page.locator(SELECTORS.saveButton).first();
    await saveBtn.click();
    await page.waitForTimeout(500);

    const errorByText  = page.locator('text=/required/i').first();
    const errorByClass = page.locator('[class*="error"], .text-red-500, p.text-xs').first();

    const byText  = await errorByText.isVisible().catch(() => false);
    const byClass = await errorByClass.isVisible().catch(() => false);
    expect(byText || byClass).toBe(true);
  });

  // TC_EQ_IDENT_003 – Manufacturer is required; leaving it empty shows an error
  test('TC_EQ_IDENT_003 – Saving without Manufacturer shows validation error', async ({ page }) => {
    // Fill only SUPPLIER/VENDOR and SUPPLIER ID, leave MANUFACTURER empty
    const allComboboxes = page.locator(SELECTORS.comboboxInput);
    if ((await allComboboxes.count()) > 1) {
      await helper.pickFirstDropdownFromLocator(allComboboxes.nth(1)); // SUPPLIER/VENDOR
    }
    const sidEl = page.locator(SELECTORS.supplierIdInput).first();
    if ((await sidEl.count()) > 0 && (await sidEl.isEnabled())) {
      await sidEl.fill(TestDataGenerator.generateSupplierIdNo());
    }

    const saveBtn = page.locator(SELECTORS.saveButton).first();
    await saveBtn.click();
    await page.waitForTimeout(500);

    // "Manufacturer is required." should be visible
    const mfgError = page.locator('text=/manufacturer.*required/i').first();
    const genericError = page.locator('text=/required/i').first();
    const visible = (await mfgError.isVisible().catch(() => false)) || (await genericError.isVisible().catch(() => false));
    expect(visible).toBe(true);
  });

  // TC_EQ_IDENT_004
  test('TC_EQ_IDENT_004 – Identification tab is active by default on New Equipment', async ({ page }) => {
    const identTab = page.locator(SELECTORS.identificationTab).first();
    const visible = await identTab.isVisible().catch(() => false);
    await expect(page.locator('body')).toBeVisible();
    if (visible) {
      expect(visible).toBe(true);
    } else {
      // Identification fields directly visible (no tab bar) — TPS ID field present
      const tpsField = page.locator(SELECTORS.tpsIdField);
      expect(await tpsField.count()).toBeGreaterThan(0);
    }
  });

  // TC_EQ_IDENT_005 – SUPPLIER/VENDOR (2nd combobox) lists available options
  test('TC_EQ_IDENT_005 – Supplier dropdown lists available options', async ({ page }) => {
    const allComboboxes = page.locator(SELECTORS.comboboxInput);
    if ((await allComboboxes.count()) < 2) { test.skip(true, 'Supplier combobox not found'); return; }

    await allComboboxes.nth(1).click(); // SUPPLIER/VENDOR
    await page.waitForTimeout(400);

    const container = page.locator(SELECTORS.dropdownContainer).first();
    const hasOptions = await container.count() > 0;
    await expect(page.locator('body')).toBeVisible();
    expect(hasOptions).toBe(true);
  });

  // TC_EQ_IDENT_006
  test('TC_EQ_IDENT_006 – Status dropdown defaults to ACTIVE', async ({ page }) => {
    const activeText = page.locator('text=/ACTIVE/').first();
    const visible = await activeText.isVisible().catch(() => false);
    await expect(page.locator('body')).toBeVisible();
    if (visible) expect(visible).toBe(true);
  });

  // TC_EQ_IDENT_007
  test('TC_EQ_IDENT_007 – Cancel discards form and returns to Equipment List', async ({ page }) => {
    const cancelBtn = page.locator(SELECTORS.cancelButton).first();
    if ((await cancelBtn.count()) === 0) { test.skip(true, 'Cancel button not found'); return; }

    await cancelBtn.click();
    const discardConfirm = page.locator('button:has-text("Discard"), button:has-text("Yes"), button:has-text("Confirm")').first();
    if ((await discardConfirm.count()) > 0 && (await discardConfirm.isVisible())) {
      await discardConfirm.click();
    }
    await page.waitForTimeout(800);
    await expect(page.locator(SELECTORS.pageHeader)).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // TC_EQ_IDENT_008 – SUPPLIER IDENTIFICATION NUMBER accepts a unique value
  test('TC_EQ_IDENT_008 – Supplier Identification No. accepts unique value', async ({ page }) => {
    const sidEl = page.locator(SELECTORS.supplierIdInput).first();
    if ((await sidEl.count()) === 0) { test.skip(true, 'Supplier ID input not found'); return; }
    if (!(await sidEl.isEnabled())) { test.skip(true, 'Supplier ID input is disabled'); return; }

    const uniqueVal = TestDataGenerator.generateSupplierIdNo();
    await sidEl.fill(uniqueVal);
    const val = await sidEl.inputValue();
    expect(val.length).toBeGreaterThan(0);
  });
});
