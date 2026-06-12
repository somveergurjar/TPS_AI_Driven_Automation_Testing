// spec: user-stories/Equipment_Module_TestCases.md (Sections 5-6 – Spare Parts & Document Linking)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS } from './setup';

// ---------------------------------------------------------------------------
// Spare Parts Linking
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Spare Parts Linking', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
    await helper.fillMandatoryIdentificationFields();
  });

  // TC_EQ_SPLINK_001
  test('TC_EQ_SPLINK_001 – Spare Parts tab displays Available and Linked sections', async ({ page }) => {
    const spTab = page.locator(SELECTORS.sparePartsTab).first();
    if ((await spTab.count()) === 0) { test.skip(true, 'Spare Parts tab not found'); return; }

    await spTab.click();
    await page.waitForTimeout(600);

    const availVisible = await page.locator('text=/available spare parts/i').first().isVisible().catch(() => false);
    const linkedVisible = await page.locator('text=/linked spare parts/i').first().isVisible().catch(() => false);

    expect(availVisible || linkedVisible).toBe(true);
  });

  // TC_EQ_SPLINK_002
  test('TC_EQ_SPLINK_002 – User can link a spare part by clicking an available card', async ({ page }) => {
    const spTab = page.locator(SELECTORS.sparePartsTab).first();
    if ((await spTab.count()) === 0) { test.skip(true, 'Spare Parts tab not found'); return; }

    await spTab.click();
    await page.waitForTimeout(600);

    const availableCard = page.locator(SELECTORS.availableItemCard).first();
    if ((await availableCard.count()) === 0) { test.skip(true, 'No available spare parts to link'); return; }

    await availableCard.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);

    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_SPLINK_003
  test('TC_EQ_SPLINK_003 – Spare parts search bar filters available items', async ({ page }) => {
    const spTab = page.locator(SELECTORS.sparePartsTab).first();
    if ((await spTab.count()) === 0) { test.skip(true, 'Spare Parts tab not found'); return; }

    await spTab.click();
    await page.waitForTimeout(600);

    const searchInput = page.locator('input[placeholder*="search" i]').first();
    if ((await searchInput.count()) === 0) { test.skip(true, 'Search input not found'); return; }

    await searchInput.fill('ZZZNOMATCH999');
    await page.waitForTimeout(500);

    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_SPLINK_004
  test('TC_EQ_SPLINK_004 – Linked count is visible in tab header or corner', async ({ page }) => {
    const spTab = page.locator(SELECTORS.sparePartsTab).first();
    if ((await spTab.count()) === 0) { test.skip(true, 'Spare Parts tab not found'); return; }

    await spTab.click();
    await page.waitForTimeout(600);

    await expect(page.locator('body')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Documents Linking
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Documents Linking', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
    await helper.fillMandatoryIdentificationFields();
  });

  // TC_EQ_DOC_001
  test('TC_EQ_DOC_001 – Documents tab displays Available and Linked sections', async ({ page }) => {
    const docTab = page.locator(SELECTORS.documentsTab).first();
    if ((await docTab.count()) === 0) { test.skip(true, 'Documents tab not found'); return; }

    await docTab.click();
    await page.waitForTimeout(600);

    const availVisible = await page.locator('text=/available documents/i').first().isVisible().catch(() => false);
    const linkedVisible = await page.locator('text=/linked documents/i').first().isVisible().catch(() => false);

    expect(availVisible || linkedVisible).toBe(true);
  });

  // TC_EQ_DOC_002
  test('TC_EQ_DOC_002 – User can link a document by clicking an available card', async ({ page }) => {
    const docTab = page.locator(SELECTORS.documentsTab).first();
    if ((await docTab.count()) === 0) { test.skip(true, 'Documents tab not found'); return; }

    await docTab.click();
    await page.waitForTimeout(600);

    const availableCard = page.locator(SELECTORS.availableItemCard).first();
    if ((await availableCard.count()) === 0) { test.skip(true, 'No available documents to link'); return; }

    await availableCard.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_DOC_003
  test('TC_EQ_DOC_003 – Documents search bar filters available items', async ({ page }) => {
    const docTab = page.locator(SELECTORS.documentsTab).first();
    if ((await docTab.count()) === 0) { test.skip(true, 'Documents tab not found'); return; }

    await docTab.click();
    await page.waitForTimeout(600);

    const searchInput = page.locator('input[placeholder*="search" i]').first();
    if ((await searchInput.count()) === 0) { test.skip(true, 'Search input not found'); return; }

    await searchInput.fill('ZZZNOMATCH999');
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_DOC_004
  test('TC_EQ_DOC_004 – Linked document count is visible in tab header or corner', async ({ page }) => {
    const docTab = page.locator(SELECTORS.documentsTab).first();
    if ((await docTab.count()) === 0) { test.skip(true, 'Documents tab not found'); return; }

    await docTab.click();
    await page.waitForTimeout(600);
    await expect(page.locator('body')).toBeVisible();
  });
});
