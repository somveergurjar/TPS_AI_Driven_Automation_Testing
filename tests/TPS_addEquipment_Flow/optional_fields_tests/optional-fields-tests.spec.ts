import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';

test.describe('Optional Fields Tests', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
    await helpers.navigateToNewEquipment();
  });

  test('TC-24: Verify Feature Field Can Be Left Empty and Form Saves', async ({ page }) => {
    if (await page.locator(SELECTORS.featureField).count() === 0) {
      test.skip(true, 'Feature/Model Information fields are not present in this app version');
    }

    // Fill all mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('OPT1')
    );

    // Explicitly leave Feature field empty (it should be empty by default)
    const featureField = page.locator(SELECTORS.featureField);
    const featureValue = await featureField.inputValue();
    expect(featureValue).toBe(''); // Confirm it's empty

    // Leave Model Information empty too
    const modelField = page.locator(SELECTORS.modelInfoField);
    const modelValue = await modelField.inputValue();
    expect(modelValue).toBe(''); // Confirm it's empty

    // Attempt to save
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify no error messages appeared for empty optional fields
    const errorCount = await page.locator('text=/required|error/i').count();
    expect(errorCount).toBe(0);
  });

  test('TC-25: Verify Model Information Field Can Be Left Empty and Form Saves', async ({ page }) => {
    if (await page.locator(SELECTORS.featureField).count() === 0) {
      test.skip(true, 'Feature/Model Information fields are not present in this app version');
    }

    // Fill all mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('OPT2')
    );

    // Fill Feature field but leave Model Information empty
    await page.fill(SELECTORS.featureField, TEST_DATA.features.valid);

    // Confirm Model Information is empty
    const modelField = page.locator(SELECTORS.modelInfoField);
    const modelValue = await modelField.inputValue();
    expect(modelValue).toBe('');

    // Attempt to save
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify no validation errors for empty Model Information
    const modelErrorCount = await page.locator('text=/Model Information.*required/i').count();
    expect(modelErrorCount).toBe(0);
  });

  test('TC-26: Verify Both Optional Fields Can Be Left Empty and Form Still Saves', async ({ page }) => {
    if (await page.locator(SELECTORS.featureField).count() === 0) {
      test.skip(true, 'Feature/Model Information fields are not present in this app version');
    }

    // Fill ONLY mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('OPT3')
    );

    // Confirm both optional fields are empty
    const featureField = page.locator(SELECTORS.featureField);
    const modelField = page.locator(SELECTORS.modelInfoField);

    expect(featureValue).toBe('');
    expect(modelValue).toBe('');

    // Leave all dropdowns as default (SELECT...)
    const categoryDropdown = page.locator(SELECTORS.categoryDropdown);
    const typeDropdown = page.locator(SELECTORS.typeDropdown);

    await expect(categoryDropdown).toHaveValue('');
    await expect(typeDropdown).toHaveValue('');

    // Leave status as default ACTIVE
    const statusDropdown = page.locator(SELECTORS.statusDropdown);
    await expect(statusDropdown).toHaveValue('ACTIVE');

    // Attempt to save with minimal data
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify no validation errors appeared
    const errorMessages = await page.locator('text=/required|error/i').count();
    expect(errorMessages).toBe(0);

    // Verify equipment was created with minimal data
    const equipmentListText = await page.locator(SELECTORS.equipmentList).textContent();
    expect(equipmentListText).toContain('Global Equipment Data');
  });
});