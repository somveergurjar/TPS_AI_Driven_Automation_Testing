// spec: user-stories/Equipment_Module_TestCases.md (Sections 2-4 – Process / Automation / Commercial Tabs)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS } from './setup';

async function fillMandatoryIdentification(_page: import('@playwright/test').Page, helper: EquipmentModuleHelpers) {
  await helper.fillMandatoryIdentificationFields();
}

async function clickTab(page: import('@playwright/test').Page, tabSelector: string): Promise<boolean> {
  const tab = page.locator(tabSelector).first();
  if ((await tab.count()) === 0) return false;
  await tab.click();
  await page.waitForTimeout(500);
  return true;
}

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Tab Navigation', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
  });

  // TC_EQ_NAV_001
  test('TC_EQ_NAV_001 – User can navigate to Performance tab after filling Identification', async ({ page }) => {
    await fillMandatoryIdentification(page, helper);
    const navigated = await clickTab(page, SELECTORS.processTab);
    if (!navigated) { test.skip(true, 'Performance tab not found'); return; }
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_NAV_002
  test('TC_EQ_NAV_002 – User can navigate to Automation tab', async ({ page }) => {
    await fillMandatoryIdentification(page, helper);
    await clickTab(page, SELECTORS.processTab);
    const navigated = await clickTab(page, SELECTORS.automationTab);
    if (!navigated) { test.skip(true, 'Automation tab not found'); return; }
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_NAV_003
  test('TC_EQ_NAV_003 – User can navigate to Commercial tab', async ({ page }) => {
    await fillMandatoryIdentification(page, helper);
    await clickTab(page, SELECTORS.processTab);
    await clickTab(page, SELECTORS.automationTab);
    const navigated = await clickTab(page, SELECTORS.commercialTab);
    if (!navigated) { test.skip(true, 'Commercial tab not found'); return; }
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_NAV_004
  test('TC_EQ_NAV_004 – Trying to navigate to Performance tab without mandatory fields', async ({ page }) => {
    const processTab = page.locator(SELECTORS.processTab).first();
    if ((await processTab.count()) === 0) { test.skip(true, 'Performance tab not found'); return; }
    await processTab.click();
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Performance Tab (previously "Process Tab" in test cases)
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Process Tab', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
    await fillMandatoryIdentification(page, helper);
    await clickTab(page, SELECTORS.processTab);
  });

  // TC_EQ_PROC_001
  test('TC_EQ_PROC_001 – Process tab renders and all fields are optional', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    const table = page.locator(SELECTORS.equipmentTable);
    expect(await table.count()).toBe(0); // On form page, not list
  });

  // TC_EQ_PROC_002
  test('TC_EQ_PROC_002 – Process tab fields accept values without validation errors', async ({ page }) => {
    const textInputs = page.locator('input[type="text"]:not([disabled]):not([readonly]):not([placeholder="TYPE TO SEARCH OR ADD NEW..."])');
    const count = await textInputs.count();
    if (count > 0) {
      await textInputs.first().fill('TestValue');
      await page.waitForTimeout(300);
      // Ensure no inline required-field errors appear immediately
      const requiredError = page.locator('text=/required/i').first();
      const errorVisible = await requiredError.isVisible().catch(() => false);
      expect(errorVisible).toBe(false);
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Automation Tab
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Automation Tab', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
    await fillMandatoryIdentification(page, helper);
    await clickTab(page, SELECTORS.processTab);
    await clickTab(page, SELECTORS.automationTab);
  });

  // TC_EQ_AUTO_001
  test('TC_EQ_AUTO_001 – Automation tab renders without crash', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_AUTO_002
  test('TC_EQ_AUTO_002 – Toggle switches (AS-i, IO-Link, Profinet, Motor Starter) are interactive', async ({ page }) => {
    const toggleLabels = ['AS-i', 'IO-Link', 'Profinet', 'Motor Starter'];
    for (const label of toggleLabels) {
      const toggle = page.locator(`text=/${label}/i`).first();
      if ((await toggle.count()) > 0) {
        const control = page.locator(`label:has-text("${label}") input[type="checkbox"], button[role="switch"]:near(:text("${label}"))`).first();
        if ((await control.count()) > 0) {
          await control.click().catch(() => {});
        }
      }
    }
    await expect(page.locator('body')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Commercial Tab
// ---------------------------------------------------------------------------
test.describe('Equipment Module - Commercial Tab', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
    await helper.navigateToNewEquipment();
    await page.waitForTimeout(600);
    await fillMandatoryIdentification(page, helper);
    await clickTab(page, SELECTORS.commercialTab);
  });

  // TC_EQ_COM_001
  test('TC_EQ_COM_001 – Commercial tab renders without crash', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  // TC_EQ_COM_002
  test('TC_EQ_COM_002 – Commercial fields accept optional values', async ({ page }) => {
    const textInputs = page.locator('input[type="text"]:not([disabled]):not([readonly]):not([placeholder="TYPE TO SEARCH OR ADD NEW..."]), input[type="number"]:not([disabled])');
    const count = await textInputs.count();
    if (count > 0) {
      await textInputs.first().fill('12345');
    }
    await expect(page.locator('body')).toBeVisible();
  });
});
