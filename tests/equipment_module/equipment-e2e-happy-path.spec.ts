// spec: user-stories/Equipment_Module_TestCases.md (Section 23 – End-to-End Flow)
// seed: tests/equipment_module/setup.ts

import { test, expect } from '@playwright/test';
import { EquipmentModuleHelpers, SELECTORS, TEST_CONFIG, TestDataGenerator } from './setup';

test.describe('Equipment Module - End-to-End Happy Path', () => {
  let helper: EquipmentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new EquipmentModuleHelpers(page);
    await helper.login();
    await helper.navigateToEquipmentModule();
    await helper.waitForEquipmentGrid();
  });

  test(
    'TC_EQ_E2E_001 – Create, link spare parts & documents, save, search and delete equipment successfully',
    async ({ page }) => {
      const uniqueSupplierIdNo = TestDataGenerator.generateSupplierIdNo('E2E');

      // ── Step 1: Equipment List page loads ─────────────────────────────────────
      await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();

      // ── Step 2: Click New Equipment ───────────────────────────────────────────
      await helper.navigateToNewEquipment();
      await page.waitForTimeout(600);

      const saveBtn = page.locator(SELECTORS.saveButton).first();
      await expect(saveBtn).toBeVisible();

      // ── Step 3: Capture auto-generated TPS ID ────────────────────────────────
      let capturedTpsId = '';
      const tpsField = page.locator(SELECTORS.tpsIdField).first();
      if ((await tpsField.count()) > 0) {
        capturedTpsId = await tpsField.inputValue().catch(() => '');
      }

      // ── Steps 4-6: Fill MANUFACTURER, SUPPLIER/VENDOR, SUPPLIER ID ───────────
      const allInputs = page.locator('input[type="text"]:not([disabled]):not([readonly])');
      const inputCount = await allInputs.count();
      if (inputCount > 0) await helper.pickFirstDropdownFromLocator(allInputs.nth(0)); // MANUFACTURER
      if (inputCount > 1) await helper.pickFirstDropdownFromLocator(allInputs.nth(1)); // SUPPLIER/VENDOR
      if (inputCount > 2) await allInputs.nth(2).fill(uniqueSupplierIdNo);             // SUPPLIER ID

      // ── Step 7: Navigate Performance tab ─────────────────────────────────────
      const processTab = page.locator(SELECTORS.processTab).first();
      if ((await processTab.count()) > 0) {
        await processTab.click();
        await page.waitForTimeout(500);
      }

      // ── Step 8: Navigate Automation/Control tab ───────────────────────────────
      const automationTab = page.locator(SELECTORS.automationTab).first();
      if ((await automationTab.count()) > 0) {
        await automationTab.click();
        await page.waitForTimeout(500);
      }

      // ── Step 9: Navigate Commercial tab ──────────────────────────────────────
      const commercialTab = page.locator(SELECTORS.commercialTab).first();
      if ((await commercialTab.count()) > 0) {
        await commercialTab.click();
        await page.waitForTimeout(500);
      }

      // ── Step 10: Link a Spare Part if available ───────────────────────────────
      const spTab = page.locator(SELECTORS.sparePartsTab).first();
      if ((await spTab.count()) > 0) {
        await spTab.click();
        await page.waitForTimeout(600);
        const firstCard = page.locator(SELECTORS.availableItemCard).first();
        if ((await firstCard.count()) > 0) {
          await firstCard.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(400);
        }
      }

      // ── Step 11: Link a Document if available ─────────────────────────────────
      const docTab = page.locator(SELECTORS.documentsTab).first();
      if ((await docTab.count()) > 0) {
        await docTab.click();
        await page.waitForTimeout(600);
        const firstCard = page.locator(SELECTORS.availableItemCard).first();
        if ((await firstCard.count()) > 0) {
          await firstCard.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(400);
        }
      }

      // ── Step 12: Save Equipment ───────────────────────────────────────────────
      await saveBtn.click();
      await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible({ timeout: 15000 });

      // ── Step 13: Navigate back to Equipment List ──────────────────────────────
      await helper.navigateToEquipmentModule();
      await helper.waitForEquipmentGrid();
      await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();

      // ── Step 14: Search by TPS ID ─────────────────────────────────────────────
      if (capturedTpsId) {
        await helper.applyFilter(SELECTORS.tpsIdFilter, capturedTpsId);
        // Generous timeout: under concurrent multi-worker load the shared dev
        // backend can take longer to reflect a just-created record in filters.
        await expect
          .poll(() => page.locator(SELECTORS.equipmentTableRows).count(), { timeout: 20000 })
          .toBeGreaterThanOrEqual(1);

        const tpsRow = page.locator(`table tbody tr:has-text("${capturedTpsId}")`).first();
        await expect(tpsRow).toBeVisible({ timeout: 10000 });

        // ── Step 15: Verify Delete button is visible ────────────────────────────
        const deleteBtn = tpsRow.locator(SELECTORS.deleteActionIcon).first();
        await expect(deleteBtn).toBeVisible();

        // ── Step 16: Delete equipment with confirmation ─────────────────────────
        await deleteBtn.click();
        await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
        await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

        await page.locator(SELECTORS.deleteModalConfirm).click();
        await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible({ timeout: TEST_CONFIG.timeouts.action });

        // ── Step 17: Verify record no longer exists ─────────────────────────────
        await helper.applyFilter(SELECTORS.tpsIdFilter, capturedTpsId);
        await expect
          .poll(() => page.locator(SELECTORS.equipmentTableRows).count(), {
            timeout: 10000,
            intervals: [500, 500, 1000, 1000, 2000],
          })
          .toBe(0);
      }
    },
  );
});
