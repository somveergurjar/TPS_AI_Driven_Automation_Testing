import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';

test.describe('Dropdown Functionality Tests', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
    await helpers.navigateToNewEquipment();
  });

  test('TC-27: Verify Equipment Category Dropdown Displays All Options', async ({ page }) => {
    const categoryDropdown = page.locator(SELECTORS.categoryDropdown);

    // Click to open dropdown
    await categoryDropdown.click();

    // Wait for options to appear
    await page.waitForTimeout(500);

    // Verify the options list has loaded and contains the default option
    const optionCount = await categoryDropdown.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(7);
  });

  test('TC-28: Verify Equipment Type Dropdown Displays All Options', async ({ page }) => {
    const typeDropdown = page.locator(SELECTORS.typeDropdown);

    // Click to open dropdown
    await typeDropdown.click();

    // Wait for options to appear
    await page.waitForTimeout(500);

    // Verify the options list has loaded and contains the default option
    const optionCount = await typeDropdown.locator('option').count();
    expect(optionCount).toBeGreaterThanOrEqual(8);
  });

  test('TC-29: Verify Can Select from Equipment Category Dropdown', async ({ page }) => {
    const categoryDropdown = page.locator(SELECTORS.categoryDropdown);

    // Verify initial state is SELECT...
    await expect(categoryDropdown).toHaveValue('');

    // Select PUMPS category
    await categoryDropdown.selectOption('PUMPS');

    // Verify selection
    await expect(categoryDropdown).toHaveValue('PUMPS');

    // Verify value persists
    const selectedValue = await categoryDropdown.evaluate(el => el.value);
    expect(selectedValue).toBe('PUMPS');

    // Fill mandatory fields and verify form can be saved with category selected
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('CAT1')
    );

    await expect(page.locator(SELECTORS.saveButton)).toBeEnabled();
  });

  test('TC-30: Verify Can Select from Equipment Type Dropdown', async ({ page }) => {
    const typeDropdown = page.locator(SELECTORS.typeDropdown);

    // Verify initial state is SELECT...
    await expect(typeDropdown).toHaveValue('');

    // Select VALVE type
    await typeDropdown.selectOption('VALVE');

    // Verify selection
    await expect(typeDropdown).toHaveValue('VALVE');

    // Verify value persists
    const selectedValue = await typeDropdown.evaluate(el => el.value);
    expect(selectedValue).toBe('VALVE');

    // Fill mandatory fields and verify form can be saved with type selected
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('TYPE1')
    );

    await expect(page.locator(SELECTORS.saveButton)).toBeEnabled();
  });

  test('TC-31: Verify Status Can Be Changed from ACTIVE to OBSOLETE', async ({ page }) => {
    const statusDropdown = page.locator(SELECTORS.statusDropdown);

    // Verify initial state is ACTIVE
    await expect(statusDropdown).toHaveValue('ACTIVE');

    // Change to OBSOLETE
    await statusDropdown.selectOption('OBSOLETE');

    // Verify selection changed
    await expect(statusDropdown).toHaveValue('OBSOLETE');

    // Verify value persists
    const selectedValue = await statusDropdown.evaluate(el => el.value);
    expect(selectedValue).toBe('OBSOLETE');

    // Fill mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('STATUS1')
    );

    // Save equipment with OBSOLETE status
    await helpers.saveEquipment();

    // Verify successful save and landing on the equipment list page
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible({ timeout: TEST_CONFIG.timeouts.save });
  });
});