import { test, expect, Page } from '@playwright/test';

export const TEST_CONFIG = {
  baseUrl: 'https://dev.liveaccess.ai',
  loginUrl: 'https://dev.liveaccess.ai/login',
  documentModuleUrl: 'https://dev.liveaccess.ai/document',
  credentials: {
    email: 'somveergurjar.megaminds@gmail.com',
    password: 'Qwert@123'
  },
  timeouts: {
    navigation: 30000,
    element: 15000,
    action: 10000
  }
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

    // Wait for navigation to complete with a longer timeout
    try {
      await this.page.waitForNavigation({ timeout: TEST_CONFIG.timeouts.navigation });
    } catch (e) {
      console.log('Navigation did not occur after login, continuing anyway');
    }

    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });

    // If we're still on login page, wait a bit more
    const isStillOnLogin = this.page.url().includes('/login');
    if (isStillOnLogin) {
      console.log('Still on login page, waiting additional time...');
      await this.page.waitForTimeout(3000);
    }
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