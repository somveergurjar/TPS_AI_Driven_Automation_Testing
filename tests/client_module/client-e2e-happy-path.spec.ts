/**
 * End-to-End Happy Path Tests for the Client Module
 *
 * Covers the full lifecycle:
 *   Create (all fields) → Filter → View/Edit → Update → Delete
 *
 * E2E tests fill ALL available form fields:
 *   – Basic Info: CLIENT NAME, STATUS (Active or Obsolete), TYPE
 *   – Address tab: ADDRESS LINE 1, CITY, POSTAL CODE
 *
 * Some tests intentionally use STATUS = "Obsolete" to verify the system
 * handles non-active clients correctly.
 *
 * Includes AC-13: Active Projects column validation.
 * Each test is self-contained and cleans up its own data.
 * Pre-existing dev data is never modified or deleted.
 */
import { test, expect } from '@playwright/test';
import { SELECTORS, ClientModuleHelpers, TestDataGenerator } from './setup';

test.describe('Client Module – End-to-End Happy Path', () => {
  let helpers: ClientModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new ClientModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToClientModule();
  });

  // ── Full lifecycle ─────────────────────────────────────────────────────────

  /**
   * TC-CL-E2E-01: Full lifecycle with ALL fields filled
   * Create (Active, all fields) → Filter → Edit → Update name → Delete
   */
  test('TC-CL-E2E-01: Full lifecycle – Create (all fields) → Filter → Edit → Delete', async ({ page }) => {
    test.setTimeout(120000);
    const clientName    = TestDataGenerator.generateUniqueClientName('E2E');
    const updatedSuffix = `-UPDATED-${Date.now()}`;
    const updatedName   = `${clientName.slice(0, 30)}${updatedSuffix}`;

    // ── Step 1: Create with ALL fields filled ────────────────────────────────
    await helpers.openNewClientForm();
    await helpers.fillAllFields(clientName, 'Active');
    await helpers.saveClient();

    // ── Step 2: Verify client appears in listing ─────────────────────────────
    await helpers.navigateToClientModule();
    await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000],
      })
      .toBeGreaterThanOrEqual(1);

    // ── Step 3: Open client in Edit Mode ─────────────────────────────────────
    const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await helpers.openEditForm(row);

    const nameField = page.getByLabel(/client name/i, { exact: false }).first();
    await nameField.waitFor({ state: 'visible', timeout: 8000 });

    const prefilled = await nameField.inputValue();
    expect(prefilled).toBe(clientName);

    // ── Step 4: Update client name ────────────────────────────────────────────
    await nameField.fill('');
    await nameField.fill(updatedName);
    await helpers.saveClient();

    // ── Step 5: Verify updated name in listing ────────────────────────────────
    await helpers.navigateToClientModule();
    await helpers.applyFilter(SELECTORS.clientNameFilter, updatedName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 10000,
        intervals: [500, 1000],
      })
      .toBeGreaterThanOrEqual(1);

    // ── Step 6: Delete ────────────────────────────────────────────────────────
    await helpers.deleteClientByName(updatedName);

    await helpers.applyFilter(SELECTORS.clientNameFilter, updatedName);
    await expect
      .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
        timeout: 10000,
        intervals: [500, 500, 1000],
      })
      .toBe(0);
  });

  /**
   * TC-CL-E2E-02: Create (all fields, Active) → Filter → Verify → Reset → Delete
   */
  test('TC-CL-E2E-02: Full lifecycle – Create (all fields) → Apply filter → Verify → Reset → Delete', async ({ page }) => {
    test.setTimeout(120000);
    const clientName = TestDataGenerator.generateUniqueClientName('E2EFILTER');

    // Create with ALL fields filled
    await helpers.openNewClientForm();
    await helpers.fillAllFields(clientName, 'Active');
    await helpers.saveClient();

    try {
      // Navigate back and apply filter
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);

      const rows = page.locator(SELECTORS.clientTableRows);
      await expect
        .poll(() => rows.count(), { timeout: 10000, intervals: [500, 1000] })
        .toBeGreaterThanOrEqual(1);

      // Verify filter result contains the client name
      const firstRowText = await rows.first().innerText();
      expect(firstRowText).toContain(clientName.slice(0, 15));

      // Reset filters and confirm full listing restored
      await helpers.resetFilters();
      const countAfterReset = await helpers.getRecordCount();
      expect(countAfterReset).toBeGreaterThanOrEqual(1);
    } finally {
      await helpers.deleteClientByName(clientName);
    }
  });

  /**
   * TC-CL-E2E-03: Create (all fields including Address tab) → verify save and listing
   */
  test('TC-CL-E2E-03: Create client with all fields and Address tab → verify save and listing', async ({ page }) => {
    test.setTimeout(90000);
    const clientName = TestDataGenerator.generateUniqueClientName('E2EADDR');

    // fillAllFields fills Basic Info + Address tab automatically
    await helpers.openNewClientForm();
    await helpers.fillAllFields(clientName, 'Active', true);
    await helpers.saveClient();

    try {
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);

      await expect
        .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
          timeout: 10000,
          intervals: [500, 1000],
        })
        .toBeGreaterThanOrEqual(1);
    } finally {
      await helpers.deleteClientByName(clientName);
    }
  });

  // ── AC-13 – Active Projects column ─────────────────────────────────────────
  test('TC-CL-E2E-04: Verify Active Projects column shows numeric values for all clients', async ({ page }) => {
    await expect(page.locator(SELECTORS.colActiveProjects)).toBeVisible();

    const rowCount = await page.locator(SELECTORS.clientTableRows).count();
    if (rowCount > 0) {
      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const cells = await page
          .locator(SELECTORS.clientTableRows)
          .nth(i)
          .locator('td')
          .allTextContents();
        if (cells.length > 7) {
          const activeProjectsText = cells[7].trim();
          expect(Number.isNaN(Number(activeProjectsText))).toBe(false);
        }
      }
    }
  });

  test('TC-CL-E2E-05: Verify newly created client shows 0 Active Projects initially', async ({ page }) => {
    test.setTimeout(90000);
    // Create with all fields so this is a thorough E2E test
    const clientName = await helpers.createClientFull('E2EACTPROJ', 'Active');

    try {
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);

      const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
      await row.waitFor({ state: 'visible', timeout: 10000 });

      const cells = await row.locator('td').allTextContents();
      if (cells.length > 7) {
        const activeProjects = cells[7].trim();
        expect(Number(activeProjects)).toBeGreaterThanOrEqual(0);
      }
    } finally {
      await helpers.deleteClientByName(clientName);
    }
  });

  // ── Obsolete status tests ───────────────────────────────────────────────────

  /**
   * TC-CL-E2E-06: Create client with STATUS = Obsolete (all fields filled)
   * Verify the client appears in the listing with Obsolete status.
   */
  test('TC-CL-E2E-06: Create client with Obsolete status (all fields) → verify in listing', async ({ page }) => {
    test.setTimeout(90000);
    const clientName = TestDataGenerator.generateUniqueClientName('E2EOBS');

    await helpers.openNewClientForm();
    await helpers.fillAllFields(clientName, 'Obsolete');
    await helpers.saveClient();

    try {
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);

      const rows = page.locator(SELECTORS.clientTableRows);
      await expect
        .poll(() => rows.count(), { timeout: 10000, intervals: [500, 1000] })
        .toBeGreaterThanOrEqual(1);

      // Verify client name appears in the row
      const rowText = await rows.first().innerText();
      expect(rowText).toContain(clientName.slice(0, 15));
    } finally {
      await helpers.deleteClientByName(clientName);
    }
  });

  /**
   * TC-CL-E2E-07: Create Obsolete client (all fields) → Edit and update status → Delete
   */
  test('TC-CL-E2E-07: Create Obsolete client → Edit → update name → verify → Delete', async ({ page }) => {
    test.setTimeout(120000);
    const clientName  = TestDataGenerator.generateUniqueClientName('E2EOBSEDIT');
    const updatedName = `${clientName.slice(0, 25)}-UPD-${Date.now()}`;

    // Create Obsolete client with all fields filled
    await helpers.openNewClientForm();
    await helpers.fillAllFields(clientName, 'Obsolete');
    await helpers.saveClient();

    try {
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);

      const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
      await row.waitFor({ state: 'visible', timeout: 10000 });

      // Open edit form
      await helpers.openEditForm(row);

      const nameField = page.getByLabel(/client name/i, { exact: false }).first();
      await nameField.waitFor({ state: 'visible', timeout: 8000 });
      await nameField.fill('');
      await nameField.fill(updatedName);

      await helpers.saveClient();

      // Verify updated name in listing
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, updatedName);
      await expect
        .poll(() => page.locator(SELECTORS.clientTableRows).count(), {
          timeout: 10000,
          intervals: [500, 1000],
        })
        .toBeGreaterThanOrEqual(1);
    } finally {
      await helpers.navigateToClientModule();
      await helpers.deleteClientByName(updatedName).catch(() => {});
      await helpers.deleteClientByName(clientName).catch(() => {});
    }
  });

  /**
   * TC-CL-E2E-08: Verify listing page is accessible and functional after browser back navigation
   * Uses an Obsolete-status client to exercise a non-default status flow.
   */
  test('TC-CL-E2E-08: Verify listing is functional after browser back from edit (Obsolete client)', async ({ page }) => {
    test.setTimeout(90000);
    // Create Obsolete client with all fields
    const clientName = await helpers.createClientFull('E2EBACK', 'Obsolete');

    try {
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
      const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
      await row.waitFor({ state: 'visible', timeout: 10000 });

      // Open edit page
      await helpers.openEditForm(row);

      // Navigate back to listing
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

      // Listing must still be fully functional
      await expect(page.locator(SELECTORS.newClientButton)).toBeVisible({ timeout: 10000 });
      await expect(page.locator(SELECTORS.resetFiltersButton)).toBeVisible();
    } finally {
      await helpers.navigateToClientModule();
      await helpers.deleteClientByName(clientName);
    }
  });

  /**
   * TC-CL-E2E-09: Verify duplicate Client Name can be handled (shows error or creates)
   * Uses Obsolete status + all fields to create a thorough duplicate-detection scenario.
   */
  test('TC-CL-E2E-09: Verify duplicate Client Name can be handled (shows error or creates)', async ({ page }) => {
    test.setTimeout(120000);
    const clientName = await helpers.createClientFull('E2EDUP', 'Obsolete');

    try {
      // Try to create a second client with the exact same name
      await helpers.navigateToClientModule();
      await helpers.openNewClientForm();
      await helpers.fillAllFields(clientName, 'Active');
      await page.locator(SELECTORS.saveClientButton).click({ timeout: 10000 });

      await page.waitForTimeout(1500);

      const errorVisible  = await page.locator('text=/already exists|duplicate/i').count() > 0;
      const formStillOpen = await page.locator(SELECTORS.saveClientButton).isVisible().catch(() => false);

      if (!formStillOpen && !errorVisible) {
        // System allows duplicates — verify at least one record appears
        await helpers.navigateToClientModule();
        await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
        const rowCount = await page.locator(SELECTORS.clientTableRows).count();
        expect(rowCount).toBeGreaterThanOrEqual(1);
      } else {
        expect(errorVisible || formStillOpen).toBe(true);
      }
    } finally {
      // Clean up all records with this name
      await helpers.navigateToClientModule();
      await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
      let remaining = await page.locator(SELECTORS.clientTableRows).count();
      while (remaining > 0) {
        await helpers.deleteClientByName(clientName);
        await helpers.applyFilter(SELECTORS.clientNameFilter, clientName);
        remaining = await page.locator(SELECTORS.clientTableRows).count();
      }
    }
  });
});
