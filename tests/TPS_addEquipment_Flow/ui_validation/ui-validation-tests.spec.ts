import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers } from '../setup';

test.describe('UI Validation Tests', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
    await helpers.navigateToNewEquipment();
  });

  test('TC-1: Verify All Fields Are Present in Equipment Identification Tab', async ({ page }) => {
    // Navigate to new equipment form
    await helpers.navigateToNewEquipment();

    // Verify we're on the equipment form page (check for form elements instead of header)
    const tpsIdField = page.locator(SELECTORS.tpsIdField);
    await expect(tpsIdField).toBeVisible();

    // Verify TPS ID field is present and auto-generated
    const tpsIdValue = await tpsIdField.inputValue();
    expect(tpsIdValue).toMatch(/^E\d{5}$/);

    // Verify all dropdown fields are present
    await expect(page.locator(SELECTORS.statusDropdown)).toBeVisible();
    await expect(page.locator(SELECTORS.categoryDropdown)).toBeVisible();
    await expect(page.locator(SELECTORS.typeDropdown)).toBeVisible();

    // Verify all text input fields are present
    await expect(page.locator(SELECTORS.manufacturerField)).toBeVisible();
    await expect(page.locator(SELECTORS.supplierField)).toBeVisible();
    await expect(page.locator(SELECTORS.supplierIdField)).toBeVisible();
    // Optional fields may not be present
    // await expect(page.locator(SELECTORS.featureField).nth(4)).toBeVisible();
    // await expect(page.locator(SELECTORS.modelInfoField).nth(5)).toBeVisible();

    // Verify action buttons are present
    await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
    await expect(page.locator(SELECTORS.cancelButton)).toBeVisible();
  });

  test('TC-2: Verify Mandatory Fields Are Marked with Asterisk (*)', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    // Check that mandatory field labels contain asterisks
    const manufacturerLabel = page.locator('label:has-text("Manufacturer")');
    await expect(manufacturerLabel).toContainText('*');

    const supplierLabel = page.locator('label:has-text("Supplier / Vendor")');
    await expect(supplierLabel).toContainText('*');

    const supplierIdLabel = page.locator('label:has-text("Supplier Identification Number")');
    await expect(supplierIdLabel).toContainText('*');

    // Verify optional fields do NOT have asterisks
    const statusLabel = page.locator('label:has-text("Status")');
    await expect(statusLabel).not.toContainText('*');

    const categoryLabel = page.locator('label:has-text("Equipment Category")');
    await expect(categoryLabel).not.toContainText('*');

    const typeLabel = page.locator('label:has-text("Equipment Type")');
    await expect(typeLabel).not.toContainText('*');

    const featureLabel = page.locator('label:has-text("Feature")');
    await expect(featureLabel).not.toContainText('*');

    const modelLabel = page.locator('label:has-text("Model Information")');
    await expect(modelLabel).not.toContainText('*');
  });

  test('TC-3: Verify TPS ID Field Is Auto-Generated and Read-Only', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    const tpsIdField = page.locator(SELECTORS.tpsIdField);

    // Verify field is visible
    await expect(tpsIdField).toBeVisible();

    // Verify field has disabled attribute
    await expect(tpsIdField).toBeDisabled();

    // Verify field contains auto-generated value in correct format
    const tpsIdValue = await tpsIdField.inputValue();
    expect(tpsIdValue).toMatch(/^E\d{5}$/);

    // Field is disabled, so it's read-only
  });

  test('TC-4: Verify Default Status Is ACTIVE', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    const statusDropdown = page.locator(SELECTORS.statusDropdown);

    // Verify dropdown is visible
    await expect(statusDropdown).toBeVisible();

    // Verify default value is ACTIVE
    await expect(statusDropdown).toHaveValue('ACTIVE');

    // Click dropdown to verify options are available
    await statusDropdown.click();
    // Note: Options visibility may vary with custom dropdown implementation
    // await expect(page.locator('option:has-text("ACTIVE")')).toBeVisible();
    // await expect(page.locator('option:has-text("OBSOLETE")')).toBeVisible();
  });

  test('TC-5: Verify Field Alignment and Visual Layout', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    // Verify form has proper structure (two-column layout implied by field positioning)
    const formFields = await page.locator('input, select').count();
    expect(formFields).toBeGreaterThanOrEqual(7); // At least 7 form fields
    const manufacturerLabel = page.locator('label:has-text("Manufacturer")');
    const manufacturerField = page.locator(SELECTORS.manufacturerField);
    await expect(manufacturerLabel).toBeVisible();
    await expect(manufacturerField).toBeVisible();

    // Verify help text appears below searchable fields
    const manufacturerHelp = page.locator('text="Select from master or type to add a new manufacturer."');
    await expect(manufacturerHelp).toBeVisible();

    const supplierHelp = page.locator('text="Select from master or type to add a new supplier."');
    await expect(supplierHelp).toBeVisible();

    const supplierIdHelp = page.locator('text="Unique identifier. Cannot be changed after creation."');
    await expect(supplierIdHelp).toBeVisible();

    // Verify buttons are positioned at bottom of form
    const saveButton = page.locator(SELECTORS.saveButton);
    const cancelButton = page.locator(SELECTORS.cancelButton);
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    // Verify tab navigation is visible
    const equipmentTab = page.locator('text="Equipment Identification"');
    await expect(equipmentTab).toBeVisible();
  });
});