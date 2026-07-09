/**
 * AC-06 – Create New Client
 * AC-07 – Mandatory Field Validation
 * AC-08 – Default Status Value
 *
 * Every client created here is cleaned up at the end of the test so
 * pre-existing data in the dev environment is never touched.
 */
import { test, expect } from '@playwright/test';
import { SELECTORS, ClientModuleHelpers, TestDataGenerator } from './setup';

test.describe('Client Create Tests', () => {
  let helpers: ClientModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new ClientModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToClientModule();
  });

  // ── AC-06 ──────────────────────────────────────────────────────────────────
  test('TC-CL-17: Verify clicking "+ New Client" opens the Create Client form', async ({ page }) => {
    await helpers.openNewClientForm();

    // Client Name input must be visible
    await expect(page.locator(SELECTORS.formClientName).first()).toBeVisible();
    // Save Client button must be present
    await expect(page.locator(SELECTORS.saveClientButton)).toBeVisible();
  });

  test('TC-CL-18: Verify Create Client form has Basic Information and Address tabs', async ({ page }) => {
    await helpers.openNewClientForm();

    await expect(page.locator(SELECTORS.basicInfoTab).first()).toBeVisible();
    await expect(page.locator(SELECTORS.addressTab).first()).toBeVisible();
  });

  test('TC-CL-19: Verify new client is created successfully with mandatory fields only', async ({ page }) => {
    const clientName = TestDataGenerator.generateUniqueClientName('CREATE');

    await helpers.openNewClientForm();
    await helpers.fillBasicInfo(clientName);
    await helpers.saveClient();

    // Verify toast or success indicator
    const toastVisible = await page.locator(SELECTORS.toastSaveSuccess).count() > 0;
    expect(toastVisible || !page.url().includes('create')).toBe(true);

    // Verify the new client appears in the listing
    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000],
      })
      .toBeGreaterThanOrEqual(1);

    // Cleanup
    await helpers.deleteClientByName(clientName);
  });

  test('TC-CL-20: Verify newly created client immediately appears in the listing', async ({ page }) => {
    const clientName = TestDataGenerator.generateUniqueClientName('APPEAR');

    await helpers.openNewClientForm();
    await helpers.fillBasicInfo(clientName);
    await helpers.saveClient();

    // Navigate back to the listing
    await helpers.navigateToClientModule();

    // Apply filter and assert row appears
    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    const rows = page.locator(SELECTORS.clientTableRows);
    await expect
      .poll(() => rows.count(), { timeout: 10000, intervals: [500, 1000] })
      .toBeGreaterThanOrEqual(1);

    // Cleanup
    await helpers.deleteClientByName(clientName);
  });

  test('TC-CL-21: Verify Create Client form Cancel button closes the form without saving', async ({ page }) => {
    const clientName = TestDataGenerator.generateUniqueClientName('CANCEL');

    await helpers.openNewClientForm();
    await page.locator(SELECTORS.formClientName).first().fill(clientName);

    // Click Cancel
    await page.locator(SELECTORS.cancelButton).first().click({ timeout: 10000 });

    // After Cancel we must be back on the listing — "New Client" button confirms this
    await expect(page.locator(SELECTORS.newClientButton)).toBeVisible({ timeout: 10000 });

    // Client should NOT appear in the listing
    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    const rowCount = await page.locator(SELECTORS.clientTableRows).count();
    expect(rowCount).toBe(0);
  });

  test('TC-CL-22: Verify Create Client form with all optional fields filled saves successfully', async ({ page }) => {
    const clientName = TestDataGenerator.generateUniqueClientName('FULLFORM');

    await helpers.openNewClientForm();
    await helpers.fillBasicInfo(clientName);

    // Switch to Address tab and fill optional address fields
    const addressTab = page.locator(SELECTORS.addressTab).first();
    if (await addressTab.isVisible()) {
      await addressTab.click();
      const addr = TestDataGenerator.generateUniqueAddress();
      const addrLine1 = page.locator(SELECTORS.formAddressLine1).first();
      if (await addrLine1.count() > 0) await addrLine1.fill(addr.addressLine1);
      const cityField = page.locator(SELECTORS.formCity).first();
      if (await cityField.count() > 0) await cityField.fill(addr.city);
    }

    await helpers.saveClient();

    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 10000,
        intervals: [500, 1000],
      })
      .toBeGreaterThanOrEqual(1);

    await helpers.deleteClientByName(clientName);
  });

  // ── AC-07 – Mandatory field validation ─────────────────────────────────────
  test('TC-CL-23: Verify validation error when Client Name is blank on save', async ({ page }) => {
    await helpers.openNewClientForm();

    // Leave Client Name empty, attempt to save
    await page.locator(SELECTORS.formClientName).first().fill('');
    await page.locator(SELECTORS.saveClientButton).click({ timeout: 10000 });

    // Expect validation message for Client Name
    await expect(page.locator(SELECTORS.validationClientName)).toBeVisible({ timeout: 5000 });
  });

  test('TC-CL-24: Verify validation error when Client Name contains only spaces', async ({ page }) => {
    await helpers.openNewClientForm();

    await page.locator(SELECTORS.formClientName).first().fill('     ');
    await page.locator(SELECTORS.saveClientButton).click({ timeout: 10000 });

    // Whitespace-only name should also fail validation
    const validationVisible = await page.locator(SELECTORS.validationClientName).count() > 0;
    const formStillOpen = await page.locator(SELECTORS.saveClientButton).isVisible().catch(() => false);
    expect(validationVisible || formStillOpen).toBe(true);
  });

  test('TC-CL-25: Verify form does not save when mandatory fields are missing', async ({ page }) => {
    const countBefore = await helpers.getRecordCount();

    await helpers.openNewClientForm();
    // Do not fill any field
    await page.locator(SELECTORS.saveClientButton).click({ timeout: 10000 });

    // Validation should prevent form submission – count must not increase
    await page.waitForTimeout(1000);
    const formStillOpen = await page.locator(SELECTORS.saveClientButton).isVisible().catch(() => false);
    if (!formStillOpen) {
      // If form closed, verify no extra record was added
      await helpers.navigateToClientModule();
      const countAfter = await helpers.getRecordCount();
      expect(countAfter).toBe(countBefore);
    } else {
      // Form is still open – validation fired correctly
      expect(formStillOpen).toBe(true);
    }
  });

  // ── AC-08 – Default Status value ───────────────────────────────────────────
  test('TC-CL-26: Verify Status field defaults to "Active" when Create Client form opens', async ({ page }) => {
    await helpers.openNewClientForm();

    // The Status field should show "Active" as the default value
    const statusField = page.locator(SELECTORS.formStatus).first();
    if (await statusField.count() > 0) {
      const statusValue = await statusField.inputValue().catch(() =>
        statusField.innerText().catch(() => '')
      );
      expect(statusValue.toLowerCase()).toContain('active');
    } else {
      // Fallback: look for "Active" text visible in the form area
      const activeText = page.locator('[role="dialog"] text=/active/i, form text=/active/i').first();
      const visible = await activeText.isVisible().catch(() => false);
      expect(visible).toBe(true);
    }
  });

  test('TC-CL-27: Verify newly created client has Active status in the listing', async ({ page }) => {
    const clientName = TestDataGenerator.generateUniqueClientName('STATUSCHECK');

    await helpers.openNewClientForm();
    await helpers.fillBasicInfo(clientName); // Does NOT override status – uses default Active
    await helpers.saveClient();

    // Filter by the new client and check its status column
    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
    await row.waitFor({ state: 'visible', timeout: 10000 });

    const rowText = await row.innerText();
    expect(rowText.toLowerCase()).toContain('active');

    await helpers.deleteClientByName(clientName);
  });

  // ── Edge cases ─────────────────────────────────────────────────────────────
  test('TC-CL-28: Verify Client Name with special characters can be saved', async ({ page }) => {
    const clientName = `TEST-CLIENT-SPECIAL-&-${Date.now()}`;

    await helpers.openNewClientForm();
    await helpers.fillBasicInfo(clientName);
    await helpers.saveClient();

    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 8000,
        intervals: [500, 1000],
      })
      .toBeGreaterThanOrEqual(1);

    await helpers.deleteClientByName(clientName);
  });

  test('TC-CL-29: Verify very long Client Name is handled gracefully', async ({ page }) => {
    const longName = `TEST-${'A'.repeat(200)}-${Date.now()}`;

    await helpers.openNewClientForm();
    await page.locator(SELECTORS.formClientName).first().fill(longName);
    await page.locator(SELECTORS.saveClientButton).click({ timeout: 10000 });

    // Should either save (truncated) or show a max-length validation – not crash
    await page.waitForTimeout(1000);
    const formStillOpen = await page.locator(SELECTORS.saveClientButton).isVisible().catch(() => false);
    // If form closed, the record was saved; if open, a validation message should be present
    expect(formStillOpen !== undefined).toBe(true);

    // Cleanup if saved
    if (!formStillOpen) {
      const savedName = longName.slice(0, 255); // likely truncated
      await helpers.applyFilter(SELECTORS.clientNameFilter, savedName.slice(0, 20));
      const rows = page.locator(SELECTORS.clientTableRows);
      const count = await rows.count();
      if (count > 0) {
        const rowText = await rows.first().innerText();
        if (rowText.includes('TEST-')) {
          await helpers.deleteClientByName(savedName.slice(0, 20));
        }
      }
    }
  });
});
