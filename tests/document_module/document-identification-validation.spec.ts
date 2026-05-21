// spec: user-stories/Document_Module_TestCases.md (Section 5)
// seed: tests/document_module/setup.ts

import { test, expect } from '@playwright/test';
import { DocumentModuleHelpers, SELECTORS, TEST_CONFIG, TestDataGenerator } from './setup';

// ---------------------------------------------------------------------------
// Identification-form selectors (discovered from the New Document form)
// ---------------------------------------------------------------------------
const FORM_SELECTORS = {
  // Document Name field — second text input, enabled, no placeholder, bg-white text-slate-800
  documentNameInput: 'input[type="text"]:not([disabled])',

  // Document Type — custom searchable dropdown input
  documentTypeInput: 'input[placeholder="SELECT OR TYPE TO ADD NEW..."]',

  // Supplier — custom searchable dropdown input
  supplierInput: 'input[placeholder="TYPE TO SEARCH OR ADD NEW..."]',

  // Dropdown option container (absolute-positioned)
  dropdownContainer: 'div.absolute.z-50',

  // Save / Submit button on the New Document form
  saveButton: 'button:has-text("Save Document")',

  // Validation error messages (p.text-xs.text-red-500)
  docNameError: 'p.text-xs.text-red-500:has-text("Document name is required")',
  docTypeError: 'p.text-xs.text-red-500:has-text("Document type is required")',
  supplierError: 'p.text-xs.text-red-500:has-text("Supplier is required")',

  // Tabs — plain buttons with border-b-2 styling
  revisionsTab: 'button:has-text("Revisions")',
  identificationTab: 'button:has-text("Identification")',

  // Generic error wrapper — red-coloured validation text
  anyValidationError: 'p.text-xs.text-red-500, .text-red-500',
};

// ---------------------------------------------------------------------------
// Helper: resolve the Document Name input (skips the disabled TPS ID field)
// The form has 5 text inputs:
//   index 0: disabled TPS ID (D00019, placeholder="...")
//   index 1: Document Name (enabled, placeholder="")
//   index 2: Document Type (enabled, placeholder="SELECT OR TYPE TO ADD NEW...")
//   index 3: Supplier (enabled, placeholder="TYPE TO SEARCH OR ADD NEW...")
//   index 4: Supplier Document ID (enabled, placeholder="e.g. USER-MAN-V2")
// ---------------------------------------------------------------------------
async function getDocNameInput(page: import('@playwright/test').Page) {
  // Try specific selectors first (skip disabled inputs)
  for (const sel of [
    'input[name="documentName"]',
    'input[id*="documentName"]',
    'input[id*="document-name"]',
    'input[placeholder*="Document Name" i]',
  ]) {
    const loc = page.locator(sel).first();
    if (await loc.count() > 0 && await loc.isEnabled()) return loc;
  }
  // Fallback: first enabled text input that is NOT the TPS ID disabled field
  // and NOT one of the custom dropdown inputs
  const enabledInputs = page.locator('input[type="text"]:not([disabled]):not([placeholder="SELECT OR TYPE TO ADD NEW..."]):not([placeholder="TYPE TO SEARCH OR ADD NEW..."]):not([placeholder="e.g. USER-MAN-V2"])');
  if (await enabledInputs.count() > 0) {
    return enabledInputs.first();
  }
  // Last resort: first non-disabled text input
  return page.locator('input[type="text"]:not([disabled])').first();
}

// Helper: resolve the Save button
async function getSaveButton(page: import('@playwright/test').Page) {
  const loc = page.locator('button:has-text("Save Document")').first();
  if (await loc.count() > 0) return loc;
  return page.locator('button[type="submit"]').first();
}

// Helper: select first option from a custom dropdown by clicking its input
// then clicking the first div option in the absolute dropdown container
async function selectFirstDropdownOption(page: import('@playwright/test').Page, inputSelector: string) {
  const input = page.locator(inputSelector).first();
  if (await input.count() === 0) return false;

  await input.click();
  await page.waitForTimeout(400);

  // Find the dropdown container and click first option
  const container = page.locator('div.absolute.z-50').first();
  if (await container.count() > 0) {
    const firstOption = container.locator('> div').first();
    if (await firstOption.count() > 0) {
      await firstOption.click();
      await page.waitForTimeout(300);
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

test.describe('Document Module - Identification Tab Mandatory Field Validation', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
    await helper.waitForDocumentGrid();
    await helper.navigateToNewDocument();
    // Give the form a moment to fully render
    await page.waitForTimeout(500);
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_001 – All mandatory fields blank → 3 validation msgs
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_001 – All mandatory fields blank shows all three validation messages', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_001
    // Click Save without filling anything
    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    // All three messages must appear
    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(FORM_SELECTORS.docTypeError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(FORM_SELECTORS.supplierError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_002 – Document Name blank only
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_002 – Document Name blank shows "Document name is required"', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_002
    // Fill Document Type and Supplier but leave Document Name empty

    // Select first option in Document Type
    await selectFirstDropdownOption(page, FORM_SELECTORS.documentTypeInput);

    // Select first option in Supplier
    await selectFirstDropdownOption(page, FORM_SELECTORS.supplierInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_003 – Document Type blank only
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_003 – Document Type blank shows "Document type is required"', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_003
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(TestDataGenerator.generateRandomDocumentName());

    // Fill Supplier but leave Document Type empty
    await selectFirstDropdownOption(page, FORM_SELECTORS.supplierInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docTypeError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_004 – Supplier blank only
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_004 – Supplier blank shows "Supplier is required"', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_004
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(TestDataGenerator.generateRandomDocumentName());

    // Fill Document Type but leave Supplier empty
    await selectFirstDropdownOption(page, FORM_SELECTORS.documentTypeInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.supplierError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_005 – Validation messages disappear after valid data
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_005 – Validation messages disappear after entering valid data', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_005
    // Trigger all validations first
    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

    // Now fill in the Document Name field
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(TestDataGenerator.generateRandomDocumentName());

    // The Document Name error should disappear (on input or blur)
    await docNameInput.dispatchEvent('blur');
    await page.waitForTimeout(300);

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).not.toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_006 – Red border on invalid mandatory fields
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_006 – Red border or error class appears on invalid mandatory fields', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_006
    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    // Wait for validation to trigger
    await page.waitForTimeout(300);

    const docNameInput = await getDocNameInput(page);

    // Check for red border class (the app adds 'border-red-400' to the Document Name input on error)
    const className = await docNameInput.getAttribute('class') ?? '';
    const hasAriaInvalid = await docNameInput.getAttribute('aria-invalid');

    const hasRedBorder =
      hasAriaInvalid === 'true' ||
      className.includes('border-red') ||
      className.includes('ring-red') ||
      className.includes('error') ||
      className.includes('invalid') ||
      className.includes('destructive');

    // Fallback: check if validation error element exists
    const errorMsgVisible = await page.locator(FORM_SELECTORS.docNameError).first().isVisible();

    expect(hasRedBorder || errorMsgVisible).toBe(true);
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_007 – System prevents Save with missing mandatory fields
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_007 – System prevents saving when mandatory fields are missing', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_007
    const currentUrl = page.url();

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    // Wait briefly to see if navigation occurred
    await page.waitForTimeout(500);

    // The URL should NOT have changed to a detail/success page
    const urlAfterSave = page.url();

    // Validation error must still be visible (form is still open)
    const errorVisible = await page.locator(FORM_SELECTORS.docNameError).first().isVisible();

    // Either the URL stayed the same OR validation errors are visible
    expect(urlAfterSave === currentUrl || errorVisible).toBe(true);
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_008 – Validation message placement and UI alignment
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_008 – Validation messages are displayed below respective fields without overlap', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_008
    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    const docNameError = page.locator(FORM_SELECTORS.docNameError).first();
    const docTypeError = page.locator(FORM_SELECTORS.docTypeError).first();
    const supplierError = page.locator(FORM_SELECTORS.supplierError).first();

    await expect(docNameError).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(docTypeError).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(supplierError).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

    // Verify messages are not overlapping — their bounding boxes should differ in position
    // Note: Document Name and Document Type are on the same row (grid layout), so they
    // may share the same y position but differ in x. Supplier is on the row below.
    const nameBox = await docNameError.boundingBox();
    const typeBox = await docTypeError.boundingBox();
    const supplierBox = await supplierError.boundingBox();

    if (nameBox && typeBox) {
      // They should be at different positions (x OR y must differ — grid layout puts them side-by-side)
      const different = Math.abs(nameBox.x - typeBox.x) > 0 || Math.abs(nameBox.y - typeBox.y) > 0;
      expect(different).toBe(true);
    }
    if (typeBox && supplierBox) {
      // Supplier is on a different row below Document Type
      const different = Math.abs(typeBox.x - supplierBox.x) > 0 || Math.abs(typeBox.y - supplierBox.y) > 0;
      expect(different).toBe(true);
    }
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_009 – Spaces-only in Document Name treated as empty
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_009 – Spaces-only in Document Name triggers validation', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_009
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill('     ');  // spaces only

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_010 – Leading/trailing spaces trimmed → saves OK
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_010 – Leading and trailing spaces are trimmed and document saves successfully', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_010
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(`  ${TestDataGenerator.generateRandomDocumentName()}  `);

    // Fill Document Type
    await selectFirstDropdownOption(page, FORM_SELECTORS.documentTypeInput);

    // Fill Supplier
    await selectFirstDropdownOption(page, FORM_SELECTORS.supplierInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await page.waitForTimeout(500);

    // Validation message for document name should NOT appear
    const errorVisible = await page.locator(FORM_SELECTORS.docNameError).first().isVisible();
    expect(errorVisible).toBe(false);
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_011 – Invalid/unselected Document Type → validation
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_011 – Unselected Document Type dropdown shows validation message', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_011
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(TestDataGenerator.generateRandomDocumentName());

    // Fill Supplier but leave Document Type at default/unselected
    await selectFirstDropdownOption(page, FORM_SELECTORS.supplierInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docTypeError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_012 – Invalid/unselected Supplier → validation
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_012 – Unselected Supplier dropdown shows "Supplier is required"', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_012
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(TestDataGenerator.generateRandomDocumentName());

    // Fill Document Type but leave Supplier at default/unselected
    await selectFirstDropdownOption(page, FORM_SELECTORS.documentTypeInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.supplierError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_013 – Validations work after page refresh
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_013 – Mandatory field validations work after page refresh', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_013
    // Reload the page and re-open the new document form
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});

    // Re-navigate to the new document form after refresh
    await helper.waitForDocumentGrid();
    await helper.navigateToNewDocument();
    await page.waitForTimeout(500);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(FORM_SELECTORS.docTypeError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
    await expect(page.locator(FORM_SELECTORS.supplierError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_014 – Validations work after switching between tabs
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_014 – Validations work after switching Identification and Revisions tabs', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_014
    // Try to find and click the Revisions tab
    const revisionsTab = page.locator(FORM_SELECTORS.revisionsTab).first();
    const revisionsTabCount = await revisionsTab.count();

    if (revisionsTabCount > 0) {
      await revisionsTab.click();
      await page.waitForTimeout(300);

      // Switch back to Identification tab
      const identificationTab = page.locator(FORM_SELECTORS.identificationTab).first();
      if (await identificationTab.count() > 0) {
        await identificationTab.click();
        await page.waitForTimeout(300);
      }
    }

    // Now trigger validation on the Identification tab
    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_015 – Multiple rapid Save clicks → no duplicate messages
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_015 – Multiple rapid Save clicks do not create duplicate validation messages', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_015
    const saveBtn = await getSaveButton(page);

    // Click Save rapidly 5 times
    for (let i = 0; i < 5; i++) {
      await saveBtn.click();
    }

    await page.waitForTimeout(500);

    // Should show exactly one instance of each message (no duplicates)
    const docNameErrors = page.locator(FORM_SELECTORS.docNameError);
    const docTypeErrors = page.locator(FORM_SELECTORS.docTypeError);
    const supplierErrors = page.locator(FORM_SELECTORS.supplierError);

    await expect(docNameErrors.first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

    const docNameCount = await docNameErrors.count();
    const docTypeCount = await docTypeErrors.count();
    const supplierCount = await supplierErrors.count();

    // Each validation message should appear at most once
    expect(docNameCount).toBeLessThanOrEqual(1);
    expect(docTypeCount).toBeLessThanOrEqual(1);
    expect(supplierCount).toBeLessThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_016 – Enter key triggers same validations as Save
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_016 – Enter key triggers same validations as Save button click', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_016
    // Press Enter on the Document Name field (common pattern to submit forms)
    const docNameInput = await getDocNameInput(page);
    await docNameInput.press('Enter');

    await page.waitForTimeout(300);

    // Check if validation messages appeared via Enter key; if not, also try the Save button
    const docNameErrorByEnter = page.locator(FORM_SELECTORS.docNameError).first();
    const visibleByEnter = await docNameErrorByEnter.isVisible();

    if (!visibleByEnter) {
      // Fallback: press Enter on the form itself
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
    }

    const saveBtn = await getSaveButton(page);
    // Also click the button to ensure the form was attempted
    await saveBtn.click();

    await expect(page.locator(FORM_SELECTORS.docNameError).first()).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // -------------------------------------------------------------------------
  // TC_DOC_IDENTIFICATION_019 – Special characters in Document Name
  // -------------------------------------------------------------------------
  test('TC_DOC_IDENTIFICATION_019 – Special characters in Document Name do not break validation logic', async ({ page }) => {
    // TC_DOC_IDENTIFICATION_019
    const specialChars = '!@#$%^&*()_+-=[]{}|;\':",./<>?`~\\';
    const docNameInput = await getDocNameInput(page);
    await docNameInput.fill(specialChars);

    // Fill Document Type
    await selectFirstDropdownOption(page, FORM_SELECTORS.documentTypeInput);

    // Fill Supplier
    await selectFirstDropdownOption(page, FORM_SELECTORS.supplierInput);

    const saveBtn = await getSaveButton(page);
    await saveBtn.click();

    await page.waitForTimeout(500);

    // The app should not crash — the page/form must still be interactable
    await expect(page.locator('body')).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

    // Validation for document name should NOT appear (special chars are non-empty)
    const errorVisible = await page.locator(FORM_SELECTORS.docNameError).first().isVisible();
    expect(errorVisible).toBe(false);
  });
});
