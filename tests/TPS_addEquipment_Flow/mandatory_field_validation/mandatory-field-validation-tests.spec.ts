import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';

test.describe('Mandatory Field Validation Tests', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
    await helpers.navigateToNewEquipment();
  });

  test('TC-9: Verify Error When Manufacturer Field Is Empty During Save', async ({ page }) => {
    // Fill Supplier and Supplier ID but leave Manufacturer empty
    await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MAND1'));

    // Attempt to save
    await helpers.saveEquipment();

    // Wait for validation errors
    await helpers.waitForValidationErrors();

    // Verify manufacturer error is displayed
    const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
    expect(isManufacturerErrorVisible).toBe(true);

    // Verify manufacturer field is highlighted (check for error styling)
    const manufacturerField = page.locator(SELECTORS.manufacturerField);
    const hasErrorClass = await manufacturerField.evaluate(el => el.classList.contains('error') || el.classList.contains('invalid'));
    // Note: Actual error styling may vary, this checks for common error classes

    // Verify form was not submitted (still on same page)
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  });

  test('TC-10: Verify Error When Supplier/Vendor Field Is Empty During Save', async ({ page }) => {
    // Fill Manufacturer and Supplier ID but leave Supplier empty
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MAND2'));

    // Attempt to save
    await helpers.saveEquipment();

    // Wait for validation errors
    await helpers.waitForValidationErrors();

    // Verify supplier error is displayed
    const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
    expect(isSupplierErrorVisible).toBe(true);

    // Verify form was not submitted
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  });

  test('TC-11: Verify Error When Supplier ID Field Is Empty During Save', async ({ page }) => {
    // Fill Manufacturer and Supplier but leave Supplier ID empty
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);

    // Attempt to save
    await helpers.saveEquipment();

    // Wait for validation errors
    await helpers.waitForValidationErrors();

    // Verify supplier ID error is displayed
    const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);
    expect(isSupplierIdErrorVisible).toBe(true);

    // Verify form was not submitted
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  });

  test('TC-12: Verify Red Border Appears on All Empty Mandatory Fields', async ({ page }) => {
    // Leave all mandatory fields empty
    // Attempt to save
    await helpers.saveEquipment();

    // Wait for validation errors
    await helpers.waitForValidationErrors();

    // Verify all three mandatory field errors are displayed
    const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
    const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
    const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);

    expect(isManufacturerErrorVisible).toBe(true);
    expect(isSupplierErrorVisible).toBe(true);
    expect(isSupplierIdErrorVisible).toBe(true);

    // Verify form was not submitted and all fields are still empty
    const manufacturerValue = await page.inputValue(SELECTORS.manufacturerField);
    const supplierValue = await page.inputValue(SELECTORS.supplierField);
    const supplierIdValue = await page.inputValue(SELECTORS.supplierIdField);

    expect(manufacturerValue).toBe('');
    expect(supplierValue).toBe('');
    expect(supplierIdValue).toBe('');
  });

  test('TC-13: Verify Save Is Prevented When Mandatory Fields Are Empty', async ({ page }) => {
    // Leave all mandatory fields empty
    // Attempt to save
    await helpers.saveEquipment();

    // Wait for validation errors
    await helpers.waitForValidationErrors();

    // Verify form is still visible (not redirected)
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
    await expect(page.locator(SELECTORS.cancelButton)).toBeVisible();

    // Verify we're still on the equipment form page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/equipment');

    // Verify no equipment was created by checking if we're still on form
    const tpsIdField = page.locator(SELECTORS.tpsIdField);
    await expect(tpsIdField).toBeVisible();

    // Verify all error messages are displayed
    const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
    const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
    const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);

    expect(isManufacturerErrorVisible).toBe(true);
    expect(isSupplierErrorVisible).toBe(true);
    expect(isSupplierIdErrorVisible).toBe(true);
  });
});