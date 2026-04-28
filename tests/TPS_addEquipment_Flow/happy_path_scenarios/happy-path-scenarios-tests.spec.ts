import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';

test.describe('Happy Path Scenarios', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
  });

  test('TC-32: Complete Equipment Creation with All Mandatory Fields', async ({ page }) => {
    // Navigate to new equipment form
    await helpers.navigateToNewEquipment();

    // Verify TPS ID is auto-generated
    const tpsId = await helpers.getCurrentTpsId();
    expect(tpsId).toMatch(/^E\d{5}$/);

    // Fill mandatory fields with test data
    await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
    await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
    await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('HAPPY1'));

    // Verify Status is ACTIVE by default
    await expect(page.locator(SELECTORS.statusDropdown)).toHaveValue('ACTIVE');

    // Leave optional fields empty
    await expect(page.locator(SELECTORS.categoryDropdown)).toHaveValue('');
    await expect(page.locator(SELECTORS.typeDropdown)).toHaveValue('');
    if (await page.locator(SELECTORS.featureField).count() > 0) {
      await expect(page.locator(SELECTORS.featureField)).toHaveValue('');
      await expect(page.locator(SELECTORS.modelInfoField)).toHaveValue('');
    }

    // Click save
    await helpers.saveEquipment();

    // Verify successful navigation to equipment list
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify no error messages
    const errorCount = await page.locator('text=/error|required/i').count();
    expect(errorCount).toBe(0);
  });

  test('TC-33: Equipment Creation with All Fields Including Optional Ones', async ({ page }) => {
    await helpers.navigateToNewEquipment();
    const completeSupplierId = TestDataGenerator.generateUniqueSupplierId('COMPLETE');

    // Fill all fields including optional ones
    await helpers.fillAllFields({
      manufacturer: TEST_DATA.manufacturers.existing,
      supplier: TEST_DATA.suppliers.existing,
      supplierId: completeSupplierId,
      category: TEST_DATA.categories.pumps,
      type: TEST_DATA.types.pump,
      feature: TEST_DATA.features.valid,
      modelInfo: TEST_DATA.modelInfo.valid,
      status: TEST_DATA.statuses.active
    });

    // Verify all fields are filled
    await expect(page.locator(SELECTORS.manufacturerField)).toHaveValue(TEST_DATA.manufacturers.existing);
    await expect(page.locator(SELECTORS.supplierField)).toHaveValue(TEST_DATA.suppliers.existing);
    await expect(page.locator(SELECTORS.supplierIdField)).toHaveValue(completeSupplierId);
    await expect(page.locator(SELECTORS.categoryDropdown)).toHaveValue(TEST_DATA.categories.pumps);
    await expect(page.locator(SELECTORS.typeDropdown)).toHaveValue(TEST_DATA.types.pump);
    if (await page.locator(SELECTORS.featureField).count() > 0) {
      await expect(page.locator(SELECTORS.featureField)).toHaveValue(TEST_DATA.features.valid);
      await expect(page.locator(SELECTORS.modelInfoField)).toHaveValue(TEST_DATA.modelInfo.valid);
    }
    await expect(page.locator(SELECTORS.statusDropdown)).toHaveValue(TEST_DATA.statuses.active);

    // Save equipment
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  });

  test('TC-34: Equipment Creation with Minimal Required Data (Mandatory Fields Only)', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    // Fill only mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('MINIMAL')
    );

    // Verify optional fields remain at defaults
    await expect(page.locator(SELECTORS.categoryDropdown)).toHaveValue('');
    await expect(page.locator(SELECTORS.typeDropdown)).toHaveValue('');
    if (await page.locator(SELECTORS.featureField).count() > 0) {
      await expect(page.locator(SELECTORS.featureField)).toHaveValue('');
      await expect(page.locator(SELECTORS.modelInfoField)).toHaveValue('');
    }
    await expect(page.locator(SELECTORS.statusDropdown)).toHaveValue('ACTIVE');

    // Save equipment
    await helpers.saveEquipment();

    // Verify successful save with minimal data
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify no validation errors occurred
    const errorCount = await page.locator('text=/required|error/i').count();
    expect(errorCount).toBe(0);
  });

  test('TC-35: Equipment Creation with Status Changed to OBSOLETE', async ({ page }) => {
    await helpers.navigateToNewEquipment();

    // Change status to OBSOLETE
    await page.selectOption(SELECTORS.statusDropdown, 'OBSOLETE');

    // Fill mandatory fields
    await helpers.fillMandatoryFields(
      TEST_DATA.manufacturers.existing,
      TEST_DATA.suppliers.existing,
      TestDataGenerator.generateUniqueSupplierId('OBSOLETE')
    );

    // Verify status is set to OBSOLETE
    await expect(page.locator(SELECTORS.statusDropdown)).toHaveValue('OBSOLETE');

    // Save equipment
    await helpers.saveEquipment();

    // Verify successful save
    await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
    await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();

    // Verify equipment was created with OBSOLETE status
    // (This would require checking the saved record, but for this test we verify the save process)
  });
});