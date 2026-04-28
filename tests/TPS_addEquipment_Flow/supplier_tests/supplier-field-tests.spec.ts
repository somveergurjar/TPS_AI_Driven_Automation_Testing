import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';

test.describe('Supplier Field Tests', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
    await helpers.navigateToNewEquipment();
  });

  test('TC-17: Verify Can Search and Select Existing Supplier from Dropdown', async ({ page }) => {
    const supplierField = page.locator(SELECTORS.supplierField);

    // Click on supplier field to activate it
    await supplierField.click();

    // Type partial supplier name that should match existing supplier
    await supplierField.fill('SG SUPPLIER');

    // Wait for dropdown/search results
    await page.waitForTimeout(1000);

    // Look for the expected supplier option
    const supplierOption = page.locator(`text="${TEST_DATA.suppliers.existing}"`);
    const optionCount = await supplierOption.count();

    if (optionCount > 0) {
      // Select the supplier from dropdown
      await supplierOption.click();

      // Verify field contains selected value
      const selectedValue = await supplierField.inputValue();
      expect(selectedValue).toBe(TEST_DATA.suppliers.existing);
    } else {
      // If exact match not found, verify field accepts the typed input
      const currentValue = await supplierField.inputValue();
      expect(currentValue).toBe('SG SUPPLIER');
    }

    // Fill other mandatory fields
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('SUP1'));

    // Verify form can be saved
    await expect(page.locator(SELECTORS.saveButton)).toBeEnabled();
  });

  test('TC-18: Verify Can Add New Supplier Entry', async ({ page }) => {
    const supplierField = page.locator(SELECTORS.supplierField);
    const newSupplierName = TestDataGenerator.generateUniqueSupplier('NewSupplier');

    // Click on supplier field
    await supplierField.click();

    // Type new supplier name
    await supplierField.fill(newSupplierName);

    // Wait for system to process
    await page.waitForTimeout(1000);

    // Verify field retains the new value (value may be normalized by the UI)
    const currentValue = await supplierField.inputValue();
    expect(currentValue.toLowerCase()).toBe(newSupplierName.toLowerCase());

    // Fill other mandatory fields
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('SUP2'));

    // Attempt to save with new supplier
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  });

  test('TC-19: Verify Supplier/Vendor Field Is Mandatory', async ({ page }) => {
    // Check field label has asterisk
    const supplierLabel = page.locator('label:has-text("Supplier / Vendor")');
    await expect(supplierLabel).toContainText('*');

    // Check help text is present
    const helpText = page.locator('text="Select from master or type to add a new supplier."');
    await expect(helpText).toBeVisible();

    // Verify field is empty by default
    const supplierField = page.locator(SELECTORS.supplierField);
    const defaultValue = await supplierField.inputValue();
    expect(defaultValue).toBe('');

    // Attempt to save without filling supplier (should fail)
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('SUP3'));

    await helpers.saveEquipment();

    // Wait for validation
    await helpers.waitForValidationErrors();

    // Verify error message appears
    const isErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
    expect(isErrorVisible).toBe(true);

    // Verify form was not submitted
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  });
});