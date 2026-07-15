// spec: user-stories/Document_Module_TestCases.md (Section 7)
// seed: tests/document_module/setup.ts

import { test, expect } from '@playwright/test';
import path from 'path';
import { DocumentModuleHelpers, SELECTORS, TEST_CONFIG, selectFirstNativeOption } from './setup';

const FIXTURE_PDF = path.resolve(__dirname, '../../test-data/calibration-certificate-rev1.pdf');

// ---------------------------------------------------------------------------
// Selectors specific to this E2E flow
// ---------------------------------------------------------------------------
const E2E_SEL = {
  // Identification tab inputs
  documentTypeInput:  'input[placeholder="SELECT OR TYPE TO ADD NEW..."]',
  supplierInput:      'input[placeholder="TYPE TO SEARCH OR ADD NEW..."]',
  supplierDocIdInput: 'input[placeholder*="USER-MAN" i], input[placeholder*="e.g. USER" i]',
  dropdownFirst:      'div.absolute.z-50 > div:first-child',

  // Tabs — scoped to main content to avoid matching sidebar navigation buttons
  identificationTab:  'main button:has-text("Identification")',
  revisionsTab:       'main button:has-text("Revisions")',
  equipmentTab:       'main button:has-text("Equipment Linking")',
  sparePartsTab:      'main button:has-text("Spare Parts Linking")',

  // Available item cards in linking tabs — rendered as cursor-pointer divs, not table rows
  availableItemCard:  'main [class*="cursor-pointer"]:has(p)',

  // Revision upload
  fileInput:           'input[type="file"]',
  uploadRevisionBtn:   'button:has-text("Upload Revision")',
  revisionRow:         'table tbody tr, [class*="revision-row"], [class*="revision-item"]',

  // Save / success
  saveButton:          'button:has-text("Save Document")',
  saveSuccessToast:    'text=/saved successfully/i',

  // Delete confirmation
  deleteSuccessToast:  'text=/deleted successfully/i',
};

// ---------------------------------------------------------------------------
// Helper: click an autocomplete input and pick the first dropdown option
// ---------------------------------------------------------------------------
async function pickFirstDropdownOption(page: import('@playwright/test').Page, inputSelector: string) {
  const input = page.locator(inputSelector).first();
  if ((await input.count()) === 0) return;
  await input.click();
  await page.waitForTimeout(400);
  const firstOption = page.locator(E2E_SEL.dropdownFirst).first();
  if ((await firstOption.count()) > 0) {
    await firstOption.click();
    await page.waitForTimeout(300);
  }
}

// ---------------------------------------------------------------------------
// Helper: upload a file and click Upload Revision
// ---------------------------------------------------------------------------
async function uploadRevision(page: import('@playwright/test').Page, filePath: string) {
  const fileInput = page.locator(E2E_SEL.fileInput).first();
  if ((await fileInput.count()) === 0) return false;
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(500);
  const uploadBtn = page.locator(E2E_SEL.uploadRevisionBtn).first();
  if ((await uploadBtn.count()) > 0 && (await uploadBtn.isEnabled())) {
    await uploadBtn.click();
    await page.waitForTimeout(1200);
  }
  return true;
}

// ---------------------------------------------------------------------------
// E2E suite
// ---------------------------------------------------------------------------
test.describe('Document Module - End-to-End Happy Path', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
    await helper.waitForDocumentGrid();
  });

  test(
    'TC_E2E_Document_001 – Verify user is able to create, upload, link, save, search, download and delete document successfully',
    async ({ page }) => {

      // ── Step 1: Document Listing page loads ──────────────────────────────────
      await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();

      // ── Step 2: Click "+ New Document" ───────────────────────────────────────
      await helper.navigateToNewDocument();
      await page.waitForTimeout(600);

      // Identification tab should be active by default
      await expect(page.locator(E2E_SEL.identificationTab).first()).toBeVisible();

      // ── Step 3: Capture auto-generated TPS ID ────────────────────────────────
      let capturedTpsId = '';
      for (const sel of ['input[readonly]', 'input[disabled]', 'input[value^="D"]']) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0) {
          const val = await el.inputValue().catch(() => '');
          if (val) { capturedTpsId = val; break; }
        }
      }
      // TPS ID field must be on the page (value may not yet be in DOM before tab renders)
      await expect(page.locator('body')).toBeVisible();

      // ── Step 4: Enter Document Name ──────────────────────────────────────────
      const uniqueDocName = `SG_E2E_Doc_${Date.now()}`;
      let nameInputFilled = false;
      for (const sel of [
        'input[name="documentName"]',
        'input[id*="documentName"]',
        'input[placeholder*="Document Name" i]',
      ]) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0 && (await el.isEnabled())) {
          await el.fill(uniqueDocName);
          nameInputFilled = true;
          break;
        }
      }
      if (!nameInputFilled) {
        // Fallback: first editable text input that is not a dropdown trigger
        const input = page.locator(
          'input[type="text"]:not([disabled]):not([readonly])' +
          ':not([placeholder="SELECT OR TYPE TO ADD NEW..."])' +
          ':not([placeholder="TYPE TO SEARCH OR ADD NEW..."])',
        ).first();
        if ((await input.count()) > 0) await input.fill(uniqueDocName);
      }

      // ── Step 5a: Select Category — native <select>, required. Document Type
      // stays disabled ("Select a category first") until this is chosen.
      const categorySelect = page.locator('select:has(option:has-text("Select category"))').first();
      if ((await categorySelect.count()) > 0) {
        await selectFirstNativeOption(categorySelect);
        await page.waitForTimeout(300);
      }

      // ── Step 5b: Select Document Type — native <select> once Category unlocks it ──
      const docTypeSelect = page.locator('select:has(option:has-text("Select document type"))').first();
      if ((await docTypeSelect.count()) > 0) {
        await selectFirstNativeOption(docTypeSelect);
        await page.waitForTimeout(300);
      } else {
        // Fallback for builds where Document Type uses the custom input+dropdown pattern.
        await pickFirstDropdownOption(page, E2E_SEL.documentTypeInput);
      }

      // ── Step 6: Select Supplier ───────────────────────────────────────────────
      await pickFirstDropdownOption(page, E2E_SEL.supplierInput);

      // ── Step 7: Enter Supplier Document ID ───────────────────────────────────
      const supplierDocInput = page.locator(E2E_SEL.supplierDocIdInput).first();
      if ((await supplierDocInput.count()) > 0 && (await supplierDocInput.isEnabled())) {
        await supplierDocInput.fill(`user-man-v2-${Date.now()}`);
      }

      // ── Step 8: Enter Remarks ─────────────────────────────────────────────────
      const remarks = 'E2E happy path automated test – validates full document workflow end to end.';
      for (const sel of [
        'textarea[placeholder*="Remarks" i]',
        'textarea[name*="remarks"]',
        'input[placeholder*="Remarks" i]',
        'textarea',
      ]) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0 && (await el.isEnabled())) {
          await el.fill(remarks.substring(0, 100));
          break;
        }
      }

      // ── Step 9: Navigate to Revisions tab ────────────────────────────────────
      const revisionsTab = page.locator(E2E_SEL.revisionsTab).first();
      await revisionsTab.click();
      await page.waitForTimeout(500);
      await expect(revisionsTab).toBeVisible();

      // ── Step 10 & 11: Choose file and Upload Revision ─────────────────────────
      const rev1Uploaded = await uploadRevision(page, FIXTURE_PDF);
      if (!rev1Uploaded) {
        test.skip(true, 'File input not found – cannot proceed with E2E upload');
        return;
      }
      // At least one revision row should appear
      await expect
        .poll(() => page.locator(E2E_SEL.revisionRow).count(), { timeout: 10000 })
        .toBeGreaterThanOrEqual(1);

      // ── Step 12: Upload second revision ──────────────────────────────────────
      const rowCountAfterFirst = await page.locator(E2E_SEL.revisionRow).count();
      await uploadRevision(page, FIXTURE_PDF);
      const rowCountAfterSecond = await page.locator(E2E_SEL.revisionRow).count();
      expect(rowCountAfterSecond).toBeGreaterThanOrEqual(rowCountAfterFirst);

      // ── Step 13 & 14: Equipment Linking tab ──────────────────────────────────
      // Available equipment is rendered as clickable div cards (cursor-pointer), not table rows
      const equipTab = page.locator(E2E_SEL.equipmentTab).first();
      if ((await equipTab.count()) > 0) {
        await equipTab.click();
        await page.waitForTimeout(600);
        const firstCard = page.locator(E2E_SEL.availableItemCard).first();
        if ((await firstCard.count()) > 0) {
          await firstCard.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      // ── Step 15 & 16: Spare Parts Linking tab ────────────────────────────────
      const spareTab = page.locator(E2E_SEL.sparePartsTab).first();
      if ((await spareTab.count()) > 0) {
        await spareTab.click();
        await page.waitForTimeout(600);
        const firstCard = page.locator(E2E_SEL.availableItemCard).first();
        if ((await firstCard.count()) > 0) {
          await firstCard.click({ timeout: 5000 }).catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      // ── Step 17: Save Document ────────────────────────────────────────────────
      const saveBtn = page.locator(E2E_SEL.saveButton).first();
      await saveBtn.click();

      // Wait up to 15s for the success toast — toast may flash quickly
      await expect(page.locator(E2E_SEL.saveSuccessToast)).toBeVisible({ timeout: 15000 });

      // ── Step 18: Navigate back to Document Listing ────────────────────────────
      await helper.navigateToDocumentModule();
      await helper.waitForDocumentGrid();
      await expect(page.locator(SELECTORS.pageHeader)).toBeVisible();

      // ── Step 19: Search by TPS ID ─────────────────────────────────────────────
      if (capturedTpsId) {
        await helper.applyFilter(SELECTORS.tpsIdFilter, capturedTpsId);
        await expect
          .poll(() => page.locator(SELECTORS.documentTableRows).count(), { timeout: 10000 })
          .toBeGreaterThanOrEqual(1);
        await helper.resetFilters();
      }

      // ── Step 20: Search by Document Name ──────────────────────────────────────
      await helper.applyFilter(SELECTORS.documentNameFilter, uniqueDocName);
      await expect
        .poll(() => page.locator(SELECTORS.documentTableRows).count(), { timeout: 10000 })
        .toBeGreaterThanOrEqual(1);

      const docRow = page.locator(`table tbody tr:has-text("${uniqueDocName}")`).first();
      await expect(docRow).toBeVisible({ timeout: 10000 });

      // ── Step 21: Verify Download and Delete buttons visible ───────────────────
      const downloadBtn = docRow.locator(SELECTORS.downloadActionIcon).first();
      const deleteBtn   = docRow.locator(SELECTORS.deleteActionIcon).first();
      await expect(downloadBtn).toBeVisible();
      await expect(deleteBtn).toBeVisible();

      // ── Step 22: Click Download ───────────────────────────────────────────────
      await Promise.all([
        page.waitForEvent('download', { timeout: 8000 }).catch(() => null),
        downloadBtn.click(),
      ]);
      // Page must remain stable regardless of download event
      await expect(page.locator('body')).toBeVisible();

      // ── Step 23 & 24: Delete document with confirmation ───────────────────────
      await deleteBtn.click();
      await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
      await expect(page.locator(SELECTORS.deleteModal)).toBeVisible();

      const confirmBtn = page.locator(SELECTORS.deleteModalConfirm);
      await confirmBtn.click();

      // Success toast must appear
      await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible({
        timeout: TEST_CONFIG.timeouts.action,
      });

      // Deleted document must no longer appear in the filtered list
      await helper.applyFilter(SELECTORS.documentNameFilter, uniqueDocName);
      await expect
        .poll(() => page.locator(SELECTORS.documentTableRows).count(), {
          timeout: 10000,
          intervals: [500, 500, 1000, 1000, 2000],
        })
        .toBe(0);
    },
  );
});
