/**
 * AC-05 – Export Client Data (CSV)
 *
 * Read-only tests: only the Export CSV button is clicked.
 * No data is created, modified, or deleted.
 */
import { test, expect } from '@playwright/test';
import { SELECTORS, ClientModuleHelpers } from './setup';

test.describe('Client Export CSV Tests', () => {
  let helpers: ClientModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new ClientModuleHelpers(page);
    await helpers.login();
    await helpers.navigateToClientModule();
  });

  // ── AC-05 ──────────────────────────────────────────────────────────────────
  test('TC-CL-46: Verify Export CSV button is visible and enabled on the listing page', async ({ page }) => {
    await expect(page.locator(SELECTORS.exportCsvButton)).toBeVisible();
    await expect(page.locator(SELECTORS.exportCsvButton)).toBeEnabled();
  });

  test('TC-CL-47: Verify clicking Export CSV initiates a file download', async ({ page }) => {
    // Listen for a download event triggered by the button click
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.locator(SELECTORS.exportCsvButton).click({ timeout: 10000 }),
    ]);

    expect(download).toBeTruthy();

    // The downloaded file name should indicate a CSV
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename.toLowerCase()).toMatch(/\.(csv)$/);
  });

  test('TC-CL-48: Verify exported CSV file is not empty', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.locator(SELECTORS.exportCsvButton).click({ timeout: 10000 }),
    ]);

    const path = await download.path();
    expect(path).toBeTruthy();

    // File should have content
    const { readFileSync } = await import('fs');
    if (path) {
      const content = readFileSync(path, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  test('TC-CL-49: Verify Export CSV button remains visible after a filter is applied', async ({ page }) => {
    // Apply a filter then verify the export button is still present
    await helpers.applyFilter(SELECTORS.clientNameFilter, 'test');
    await expect(page.locator(SELECTORS.exportCsvButton)).toBeVisible();
  });

  test('TC-CL-50: Verify Export CSV button remains visible after Reset Filters', async ({ page }) => {
    await helpers.resetFilters();
    await expect(page.locator(SELECTORS.exportCsvButton)).toBeVisible();
  });
});
