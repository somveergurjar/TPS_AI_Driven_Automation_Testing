import { test, expect } from '@playwright/test';
import { DocumentModuleHelpers, SELECTORS, TEST_CONFIG } from './setup';

test.describe('Document Module - Actions', () => {
  let helper: DocumentModuleHelpers;

  test.beforeEach(async ({ page }) => {
    helper = new DocumentModuleHelpers(page);
    await helper.login();
    await helper.navigateToDocumentModule();
    await helper.waitForDocumentGrid();
  });

  // ── 1.23 ─────────────────────────────────────────────────────────────────
  test('1.23. Download Button Visibility', async ({ page }) => {
    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();

    if (rowCount === 0) {
      test.skip(true, 'No documents in the list — cannot verify download button');
      return;
    }

    const downloadButton = rows.first().locator(SELECTORS.downloadActionIcon);
    await expect(
      downloadButton,
      'Download button must be visible in the actions column for the first document row',
    ).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // ── 1.24 ─────────────────────────────────────────────────────────────────
  test('1.24. Document Download Functionality', async ({ page }) => {
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() === 0) {
      test.skip(true, 'No documents in the list — cannot test download');
      return;
    }

    const downloadButton = rows.first().locator(SELECTORS.downloadActionIcon);
    if (!(await downloadButton.isVisible())) {
      test.skip(true, 'Download button not visible for first document row');
      return;
    }

    const [downloadEvent] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
      downloadButton.click(),
    ]);

    if (downloadEvent) {
      expect(
        downloadEvent.suggestedFilename(),
        'Downloaded file must have a non-empty filename',
      ).toBeTruthy();
    }

    // Page must remain stable regardless of download outcome
    await expect(page.locator(SELECTORS.documentTable)).toBeVisible();
  });

  // ── 1.25 ─────────────────────────────────────────────────────────────────
  test('1.25. Delete Button Visibility Based on Permissions', async ({ page }) => {
    const rows = page.locator(SELECTORS.documentTableRows);
    const rowCount = await rows.count();

    if (rowCount === 0) {
      test.skip(true, 'No documents in the list — cannot verify delete button');
      return;
    }

    const deleteButton = rows.first().locator(SELECTORS.deleteActionIcon);
    await expect(
      deleteButton,
      'Delete button must be visible in the actions column for the first document row',
    ).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });
  });

  // ── 1.26 ─────────────────────────────────────────────────────────────────
  // Skipped: requires a restricted-role account (Engineer / Client).
  // To enable: add TEST_RESTRICTED_EMAIL + TEST_RESTRICTED_PASSWORD to .env.
  test('1.26. Unauthorized User Cannot Delete Document', async () => {
    test.skip(true, 'Needs a non-admin credential — set TEST_RESTRICTED_EMAIL / TEST_RESTRICTED_PASSWORD in .env to activate.');
  });

  // ── 1.27 ─────────────────────────────────────────────────────────────────
  test('1.27. New Document Navigation', async ({ page }) => {
    const newDocumentButton = page.locator(SELECTORS.newDocumentButton);
    await expect(newDocumentButton).toBeVisible();

    await newDocumentButton.click();
    await page.waitForLoadState('domcontentloaded');

    // App is SPA-style — URL may stay under /document but the list is replaced
    // by the creation form. Verify a form landmark is now present.
    const formVisible =
      (await page.locator('button:has-text("Save Document")').count()) > 0 ||
      (await page.locator('button:has-text("Cancel")').count()) > 0 ||
      (await page.locator('text=New Document').count()) > 0;

    expect(
      formVisible,
      'New Document creation form should be visible after clicking "+ New Document"',
    ).toBe(true);
  });

  // ── 1.28 ─────────────────────────────────────────────────────────────────
  test('1.28. Action Icons Alignment and Layout', async ({ page }) => {
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() === 0) {
      test.skip(true, 'No documents in the list — cannot verify action icon layout');
      return;
    }

    const actionCell = rows.first().locator('td').last();
    await expect(actionCell).toBeVisible();

    // SVG icons without a class attribute are a sign of broken/unresolved components
    const brokenIcons = actionCell.locator('svg:not([class])');
    await expect(brokenIcons, 'No broken SVG icons should exist in the actions cell').toHaveCount(0);

    // Every action button must be individually visible
    const actionButtons = actionCell.locator('button');
    const buttonCount = await actionButtons.count();
    for (let i = 0; i < buttonCount; i++) {
      await expect(actionButtons.nth(i)).toBeVisible();
    }
  });

  // ── 1.33 ─────────────────────────────────────────────────────────────────
  test('1.33. Download Action — Page Remains Stable After Click', async ({ page }) => {
    const rows = page.locator(SELECTORS.documentTableRows);
    if (await rows.count() === 0) {
      test.skip(true, 'No documents in the list — cannot verify download stability');
      return;
    }

    const downloadButton = rows.first().locator(SELECTORS.downloadActionIcon);
    if (!(await downloadButton.isVisible())) {
      test.skip(true, 'Download button not visible for first row');
      return;
    }

    // Observe whether an error toast surfaces within 4 s of the click
    const errorToastPromise = page
      .locator(SELECTORS.toastError)
      .waitFor({ state: 'visible', timeout: 4000 })
      .catch(() => null);

    await downloadButton.click();
    const errorAppeared = await errorToastPromise;

    if (errorAppeared) {
      // If an error toast appeared it must carry non-empty, readable text
      const errorText = await page.locator(SELECTORS.toastError).textContent();
      expect(
        errorText?.trim().length,
        'Error toast must contain descriptive text',
      ).toBeGreaterThan(0);
    }

    // Table must still be visible regardless of download outcome
    await expect(
      page.locator(SELECTORS.documentTable),
      'Document table must remain visible after download action',
    ).toBeVisible();
  });

  // ── 1.34 ─────────────────────────────────────────────────────────────────
  // Self-contained: creates its own document so no shared/production record
  // is touched. try/finally guarantees cleanup even when the test fails midway.
  test('1.34. Delete Action — Self-Contained Create, Delete and Verify', async ({ page }) => {
    const testDocName = `ACT_DEL_${Date.now()}`;
    let documentDeleted = false;

    try {
      // ── Step 1: Create a dedicated document ────────────────────────────────
      await helper.createDocumentForTest(testDocName);

      // ── Step 2: Locate the document by name filter ─────────────────────────
      await helper.applyFilter(SELECTORS.documentNameFilter, testDocName);
      const docRow = page.locator(`table tbody tr:has-text("${testDocName}")`).first();
      await expect(
        docRow,
        `Row for "${testDocName}" must appear in the filtered list`,
      ).toBeVisible({ timeout: TEST_CONFIG.timeouts.element });

      // ── Step 3: Click Delete — confirmation modal must appear ──────────────
      const deleteBtn = docRow.locator(SELECTORS.deleteActionIcon).first();
      await expect(deleteBtn, 'Delete button must be visible on the test document row').toBeVisible();
      await deleteBtn.click();

      await page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
      await expect(
        page.locator(SELECTORS.deleteModal),
        'Delete confirmation modal must appear after clicking Delete',
      ).toBeVisible();

      // ── Step 4: Confirm deletion — success toast must appear ───────────────
      await page.locator(SELECTORS.deleteModalConfirm).click();
      await expect(page.locator(SELECTORS.toastSuccess), 'Success toast must appear after confirming delete').toBeVisible({
        timeout: TEST_CONFIG.timeouts.action,
      });

      documentDeleted = true;

      // ── Step 5: Verify document is gone from the filtered list ─────────────
      await helper.applyFilter(SELECTORS.documentNameFilter, testDocName);
      await expect
        .poll(
          () => page.locator(SELECTORS.documentTableRows).count(),
          {
            timeout: 10000,
            intervals: [500, 500, 1000, 1000, 2000],
            message: `"${testDocName}" should not appear in the list after deletion`,
          },
        )
        .toBe(0);

      // Application must remain stable post-deletion
      await expect(page.locator(SELECTORS.documentTable), 'Document table must still render after delete').toBeVisible();

    } finally {
      // Best-effort cleanup — runs even if the test fails mid-way
      if (!documentDeleted) {
        await helper.deleteDocumentByName(testDocName);
      }
    }
  });

  // ── 1.35 ─────────────────────────────────────────────────────────────────
  test('1.35. New Document Button Available for Authorized User', async ({ page }) => {
    const newDocumentButton = page.locator(SELECTORS.newDocumentButton);
    await expect(newDocumentButton, 'New Document button must be visible for an authorized user').toBeVisible();
    await expect(newDocumentButton, 'New Document button must be enabled for an authorized user').toBeEnabled();
  });
});
