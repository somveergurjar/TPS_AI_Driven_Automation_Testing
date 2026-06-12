import { expect, Page } from '@playwright/test';
import path from 'path';
import { ENV } from '../../config/env';

// TEST_CONFIG is derived from the central config so credentials and URLs
// are never hardcoded here. Set TEST_EMAIL / TEST_PASSWORD in .env to override.
export const TEST_CONFIG = {
  baseUrl:           ENV.baseUrl,
  loginUrl:          ENV.loginUrl,
  documentModuleUrl: ENV.urls.document,
  credentials:       ENV.credentials,
  timeouts:          ENV.timeouts,
};

export const SELECTORS = {
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton: 'button:has-text("Continue to Verification")',
  pageHeader: 'h1:has-text("Document List")',
  totalRecordsCount: 'text=/\\d+ records?/i',
  newDocumentButton: 'button:has-text("New Document")',
  resetFiltersButton: 'button:has-text("Reset Filters")',
  applyFiltersButton: 'button:has-text("Apply")',
  documentTable: 'table',
  documentTableRows: 'table tbody tr',
  documentTableHeaderTPSID: 'th:has-text("TPS ID")',
  documentTableHeaderSupplierDocID: 'th:has-text("SUPPLIER DOC ID")',
  documentTableHeaderDocumentName: 'th:has-text("DOCUMENT NAME")',
  documentTableHeaderDocumentType: 'th:has-text("DOCUMENT TYPE")',
  documentTableHeaderSupplier: 'th:has-text("SUPPLIER"):not(:has-text("DOC"))',
  documentTableHeaderRevisions: 'th:has-text("REVISIONS")',
  documentTableHeaderLinkedEquipment: 'th:has-text("LINKED EQUIPMENT")',
  documentTableHeaderLinkedSpares: 'th:has-text("LINKED SPARES")',
  documentTableHeaderRemarks: 'th:has-text("REMARKS")',
  documentTableHeaderActions: 'th:has-text("ACTIONS")',
  // Filter selectors
  tpsIdFilter: 'th:has-text("TPS ID") input[placeholder="Filter..."]',
  supplierDocIdFilter: 'th:has-text("SUPPLIER DOC ID") input[placeholder="Filter..."]',
  documentNameFilter: 'th:has-text("DOCUMENT NAME") input[placeholder="Filter..."]',
  documentTypeFilter: 'th:has-text("DOCUMENT TYPE") select',
  supplierFilter: 'th:has-text("SUPPLIER"):not(:has-text("DOC")) select',
  revisionsFilter: 'th:has-text("REVISIONS") input[placeholder="Filter..."]',
  remarksFilter: 'th:has-text("REMARKS") input[placeholder="Filter..."]',
  // Action buttons
  downloadActionIcon: 'button:has(svg.lucide-download)',
  deleteActionIcon: 'button:has(svg.lucide-trash2)',
  // Modals and dialogs
  deleteModal: 'text=/Delete Document/i',
  deleteModalConfirm: 'button:has-text("Delete")',
  deleteModalCancel: 'button:has-text("Cancel")',
  // Messages
  noResultsMessage: 'div:has(span:has-text("No documents found matching your filters"))',
  emptyStateMessage: 'div:has(span:has-text("No documents available"))',
  toastSuccess: 'text=/successfully/i',
  toastError: 'text=/error/i',
  // Pagination
  paginationNext: 'button:has-text("Next")',
  paginationPrevious: 'button:has-text("Previous")',
  paginationPage: 'button[data-page]'
};

export class DocumentModuleHelpers {
  constructor(private page: Page) {}

  async login() {
    await this.page.context().clearCookies();
    await this.page.goto(TEST_CONFIG.loginUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.page.waitForSelector(SELECTORS.emailInput, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
    await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
    await this.page.click(SELECTORS.loginButton);

    // Wait for the login redirect to complete — URL leaves /login
    await this.page.waitForURL(url => !url.href.includes('/login'), {
      timeout: TEST_CONFIG.timeouts.navigation,
      waitUntil: 'domcontentloaded',
    }).catch(() => {});

    // Ensure the landing page DOM is fully loaded
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
  }

  async navigateToDocumentModule() {
    // Check current URL first
    const currentUrl = this.page.url();
    console.log('Current URL after login:', currentUrl);

    if (!currentUrl.includes('/document')) {
      console.log('Not on document page, navigating directly...');
      // Navigate directly to the document module URL
      await this.page.goto(TEST_CONFIG.documentModuleUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation });
      
      // Wait for page to fully load
      await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {
        console.log('Network idle timeout, continuing anyway');
      });
    }
  }

  async waitForDocumentGrid() {
    await this.page.waitForSelector(SELECTORS.documentTable, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
  }

  async applyFilter(selector: string, value: string) {
    // Wait a moment for the page to settle
    await this.page.waitForTimeout(300);

    let field = this.page.locator(selector);

    // If it's a generic filter selector, try to use the first available
    if (selector.includes('input[placeholder=')) {
      field = field.first();
    }

    // Wait for the field to be visible
    try {
      await field.waitFor({ timeout: 5000, state: 'visible' });
    } catch (e) {
      // If field not found, try alternative approach
      const table = this.page.locator('table');
      if (await table.count() > 0) {
        field = table.locator('input[placeholder="Filter..."]').first();
        await field.waitFor({ timeout: 5000, state: 'visible' });
      }
    }

    // Clear any existing value
    await field.fill('');

    // Fill the filter value
    await field.fill(value);

    // Wait for filter to apply
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
    await this.page.waitForTimeout(500);
  }

  async applySelectFilter(selector: string, value: string) {
    const select = this.page.locator(selector);
    await select.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'visible' });
    await select.selectOption({ label: value });
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
    await this.page.waitForTimeout(500);
  }

  async resetFilters() {
    // Clear all filter inputs
    const filterInputs = [
      SELECTORS.tpsIdFilter,
      SELECTORS.supplierDocIdFilter,
      SELECTORS.documentNameFilter,
      SELECTORS.revisionsFilter,
      SELECTORS.remarksFilter
    ];

    for (const selector of filterInputs) {
      try {
        const input = this.page.locator(selector).first();
        if (await input.count() > 0) {
          await input.fill('');
        }
      } catch (e) {
        // Continue if filter not found
      }
    }

    // Reset select filters
    const selectFilters = [SELECTORS.documentTypeFilter, SELECTORS.supplierFilter];
    for (const selector of selectFilters) {
      try {
        const select = this.page.locator(selector).first();
        if (await select.count() > 0) {
          await select.selectOption({ index: 0 }); // Select first option (usually empty)
        }
      } catch (e) {
        // Continue if filter not found
      }
    }

    // Click Reset Filters button as backup
    const resetButton = this.page.locator(SELECTORS.resetFiltersButton);
    if (await resetButton.count() > 0) {
      await resetButton.click();
    }

    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
  }

  async getRecordCount(): Promise<number> {
    try {
      const countLabel = await this.page.locator(SELECTORS.totalRecordsCount).first().innerText().catch(() => '0 records');
      const value = countLabel.match(/(\d+)/);
      if (value) {
        return Number(value[1]);
      }
    } catch (e) {
      // Fallback to counting table rows
    }
    return await this.page.locator(SELECTORS.documentTableRows).count();
  }

  async getVisibleRowCount(): Promise<number> {
    return await this.page.locator(SELECTORS.documentTableRows).count();
  }

  async findRowByTPSId(tpsId: string) {
    // Apply filter to ensure the document is visible
    await this.applyFilter(SELECTORS.tpsIdFilter, tpsId);
    const row = this.page.locator(`table tbody tr:has-text("${tpsId}")`).first();
    return row;
  }

  async clickDownloadForRow(row: any) {
    const downloadButton = row.locator(SELECTORS.downloadActionIcon).first();
    await downloadButton.click();
    // Wait for download to start (this is tricky to test fully in Playwright)
    await this.page.waitForTimeout(1000);
  }

  async clickDeleteForRow(row: any) {
    const deleteButton = row.locator(SELECTORS.deleteActionIcon).first();
    await deleteButton.click();

    // Wait for delete confirmation modal
    await this.page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });

    // Click the Delete button in the modal
    const confirmDeleteButton = this.page.locator(SELECTORS.deleteModalConfirm);
    await confirmDeleteButton.click();

    // Wait for success toast or modal to disappear
    await this.page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async navigateToNewDocument() {
    const newDocumentButton = this.page.locator(SELECTORS.newDocumentButton);
    await newDocumentButton.click();

    // Wait for navigation to new document page
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation });
  }

  async scrollToBottom() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(1000);
  }

  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await this.page.waitForTimeout(500);
  }

  /**
   * Creates a minimal but complete document (name + type + supplier + one revision)
   * and navigates back to the document list when done.
   * Intended for tests that need their own test data to avoid touching shared records.
   */
  async createDocumentForTest(docName: string): Promise<void> {
    await this.navigateToNewDocument();

    // Fill Document Name — try known attribute selectors, then label-adjacent fallback
    let nameFilled = false;
    for (const sel of [
      'input[name="documentName"]',
      'input[id*="documentName"]',
      'input[placeholder*="Document Name" i]',
    ]) {
      const el = this.page.locator(sel).first();
      if ((await el.count()) > 0 && (await el.isEnabled())) {
        await el.fill(docName);
        nameFilled = true;
        break;
      }
    }
    if (!nameFilled) {
      // The Document Name input has no distinguishing attributes in this app —
      // pick the first editable input that is not a known dropdown trigger.
      const fallback = this.page.locator(
        'input:not([disabled]):not([readonly])' +
        ':not([placeholder="SELECT OR TYPE TO ADD NEW..."])' +
        ':not([placeholder="TYPE TO SEARCH OR ADD NEW..."])',
      ).first();
      if ((await fallback.count()) > 0) await fallback.fill(docName);
    }

    // Select Document Type — open dropdown, pick first option
    const docTypeInput = this.page.locator('input[placeholder="SELECT OR TYPE TO ADD NEW..."]').first();
    if ((await docTypeInput.count()) > 0) {
      await docTypeInput.click();
      const firstOption = this.page.locator('div.absolute.z-50 > div:first-child').first();
      await firstOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if ((await firstOption.count()) > 0) await firstOption.click();
    }

    // Select Supplier — open dropdown, pick first option
    const supplierInput = this.page.locator('input[placeholder="TYPE TO SEARCH OR ADD NEW..."]').first();
    if ((await supplierInput.count()) > 0) {
      await supplierInput.click();
      const firstOption = this.page.locator('div.absolute.z-50 > div:first-child').first();
      await firstOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if ((await firstOption.count()) > 0) await firstOption.click();
    }

    // Navigate to Revisions tab
    const revisionsTab = this.page.locator('main button:has-text("Revisions")').first();
    if ((await revisionsTab.count()) > 0) {
      await revisionsTab.click();
      await this.page.locator('input[type="file"]').waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
    }

    // Upload one revision file
    const fixturePdf = path.resolve(__dirname, '../../test-data/calibration-certificate-rev1.pdf');
    const fileInput = this.page.locator('input[type="file"]').first();
    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles(fixturePdf);
      const uploadBtn = this.page.locator('button:has-text("Upload Revision")').first();
      await uploadBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if ((await uploadBtn.count()) > 0 && (await uploadBtn.isEnabled())) {
        await uploadBtn.click();
        // Wait for at least one revision row to appear
        await expect
          .poll(() => this.page.locator('table tbody tr').count(), { timeout: 8000 })
          .toBeGreaterThanOrEqual(1);
      }
    }

    // Save
    const saveBtn = this.page.locator('button:has-text("Save Document")').first();
    await saveBtn.click();
    await this.page.locator(SELECTORS.toastSuccess).waitFor({ state: 'visible', timeout: 15000 });

    // Return to document list
    await this.navigateToDocumentModule();
    await this.waitForDocumentGrid();
  }

  /**
   * Filters by document name and deletes the matching record.
   * Silently no-ops if the document is not found — safe to call in finally/afterEach.
   */
  async deleteDocumentByName(docName: string): Promise<void> {
    try {
      await this.navigateToDocumentModule();
      await this.waitForDocumentGrid();
      await this.applyFilter(SELECTORS.documentNameFilter, docName);

      const row = this.page.locator(`table tbody tr:has-text("${docName}")`).first();
      await row.waitFor({ state: 'visible', timeout: 5000 });

      const deleteBtn = row.locator(SELECTORS.deleteActionIcon).first();
      await deleteBtn.click();
      await this.page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
      await this.page.locator(SELECTORS.deleteModalConfirm).click();
      await this.page.locator(SELECTORS.toastSuccess).waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.action });
    } catch {
      // Document not found or already deleted — best-effort cleanup, do not throw
    }
  }
}

export class TestDataGenerator {
  static generateRandomTPSId(): string {
    return `TPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static generateRandomSupplierDocId(): string {
    return `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static generateRandomDocumentName(): string {
    return `Test Document ${Date.now()}`;
  }

  static generateLongString(length: number = 1000): string {
    return 'A'.repeat(length);
  }

  static generateRandomKeyword(): string {
    const keywords = ['test', 'sample', 'demo', 'example', 'draft'];
    return keywords[Math.floor(Math.random() * keywords.length)];
  }
}