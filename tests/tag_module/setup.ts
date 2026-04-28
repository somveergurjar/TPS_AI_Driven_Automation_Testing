import { test, expect, Page } from '@playwright/test';

export const TEST_CONFIG = {
  baseUrl: 'https://dev.liveaccess.ai',
  loginUrl: 'https://dev.liveaccess.ai/login',
  tagModuleUrl: 'https://dev.liveaccess.ai/tag',
  credentials: {
    email: 'somveergurjar.megaminds@gmail.com',
    password: 'Qwert@1234'
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
  pageHeader: 'h1:has-text("Tag List"), h2:has-text("Tag List")',
  totalRecordsCount: 'text=/\\d+ records?/i',
  newTagButton: 'button:has-text("New Tag")',
  resetFiltersButton: 'button:has-text("Reset Filters")',
  tagPrefixFilter: 'input[placeholder*="Filter"], th:has-text("TAG PREFIX") >> input',
  tagDescriptionFilter: 'th:has-text("TAG DESCRIPTION") >> input',
  applyFiltersButton: 'button:has-text("Apply"), button:has-text("Search"), button:has-text("Filter")',
  tagTable: 'table',
  tagTableRows: 'table tbody tr',
  tagTableHeaderPrefix: 'th:has-text("TAG PREFIX")',
  tagTableHeaderDescription: 'th:has-text("TAG DESCRIPTION")',
  tagTableHeaderActions: 'th:has-text("ACTIONS")',
  newTagModal: 'h2:has-text("New Tag"), heading:has-text("New Tag")',
  tagPrefixInput: 'input[placeholder="e.g. FIC"]',
  tagDescriptionInput: 'input[placeholder="Enter tag description..."], textarea[placeholder="Enter tag description..."]',
  saveTagButton: 'button:has-text("Save Tag")',
  cancelTagButton: 'button:has-text("Cancel")',
  closeModalButton: 'button[aria-label="Close"], button:has-text("×"), button:has-text("X")',
  validationMessagePrefix: 'text="Tag Prefix is required", text=/Tag Prefix.*required/i',
  deleteActionIcon: 'button:has-text("Delete")',
  toastSuccess: 'text="Tag deleted successfully", text=/deleted successfully/i',
  toastSaveSuccess: 'text="Tag saved successfully", text=/saved successfully/i',
  noResultsMessage: 'text="No records found", text=/no records/i'
};

export class TagModuleHelpers {
  constructor(private page: Page) {}

  async login() {
    await this.page.context().clearCookies();
    await this.page.goto(TEST_CONFIG.loginUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation * 3 });
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.page.waitForSelector(SELECTORS.emailInput, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
    await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
    await this.page.click(SELECTORS.loginButton);

    // Wait for navigation to complete - either to tag module or a verification page
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation });
    
    // If we're still on login page after some delay, the login may have failed
    const isStillOnLogin = this.page.url().includes('/login');
    if (isStillOnLogin) {
      throw new Error('Login failed - still on login page after credentials submission');
    }
  }

  async navigateToTagModule() {
    if (!this.page.url().includes('/tag')) {
      // Click the Tag button in the sidebar
      const tagButton = this.page.locator('button:has-text("Tag")').first();
      await tagButton.click({ timeout: TEST_CONFIG.timeouts.element });
      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation });
    }
    // Wait for either the page header or the new tag button to appear
    const newTagButton = this.page.locator(SELECTORS.newTagButton);
    await newTagButton.waitFor({ timeout: TEST_CONFIG.timeouts.navigation, state: 'visible' });
  }

  async openNewTagModal() {
    await this.page.click(SELECTORS.newTagButton);
    // Wait for the form inputs to be visible
    const prefixInput = this.page.locator(SELECTORS.tagPrefixInput);
    await prefixInput.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'visible' });
  }

  async createTag(prefix: string, description?: string) {
    await this.openNewTagModal();
    await this.page.fill(SELECTORS.tagPrefixInput, prefix);
    if (description !== undefined) {
      await this.page.fill(SELECTORS.tagDescriptionInput, description);
    }
    await this.page.click(SELECTORS.saveTagButton);
    // Wait for the form to be hidden or reset
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation });
  }

  async closeNewTagModal() {
    const closeButton = this.page.locator(SELECTORS.closeModalButton).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      // If close button doesn't exist, click cancel instead
      await this.page.click(SELECTORS.cancelTagButton);
    }
    // Wait for the form input to be cleared or hidden
    const prefixInput = this.page.locator(SELECTORS.tagPrefixInput);
    await prefixInput.evaluate((el: HTMLInputElement) => {
      el.value = '';
    });
  }

  async applyFilter(selector: string, value: string) {
    const field = this.page.locator(selector);
    await field.fill(value);
    // Wait for the table to be filtered - don't press Enter as it triggers global search
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action });
    // Give the filter a moment to apply
    await this.page.waitForTimeout(500);
  }

  async resetFilters() {
    // Clear the filter inputs directly
    const prefixInput = this.page.locator(SELECTORS.tagPrefixFilter).first();
    if (await prefixInput.count() > 0) {
      await prefixInput.fill('');
    }
    const descriptionInput = this.page.locator(SELECTORS.tagDescriptionFilter).first();
    if (await descriptionInput.count() > 0) {
      await descriptionInput.fill('');
    }
    // Also click the Reset Filters button as backup
    const resetButton = this.page.locator(SELECTORS.resetFiltersButton);
    if (await resetButton.count() > 0) {
      await resetButton.click();
    }
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action });
  }

  async getRecordCount(): Promise<number> {
    const countLabel = await this.page.locator(SELECTORS.totalRecordsCount).first().innerText().catch(() => '0 records');
    const value = countLabel.match(/(\d+)/);
    if (value) {
      return Number(value[1]);
    }
    return await this.page.locator(SELECTORS.tagTableRows).count();
  }

  async findRowByPrefix(prefix: string) {
    return this.page.locator(`${SELECTORS.tagTableRows}:has-text("${prefix}")`).first();
  }

  async deleteTagByPrefix(prefix: string) {
    const row = await this.findRowByPrefix(prefix);
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await row.locator(SELECTORS.deleteActionIcon).first().click();
    await this.page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action });
  }

  async deleteTagIfExistsByPrefix(prefix: string) {
    const row = this.page.locator(`${SELECTORS.tagTableRows}:has-text("${prefix}")`).first();
    if (await row.count() === 0) {
      return;
    }
    await this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await row.locator(SELECTORS.deleteActionIcon).first().click();
    await this.page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action });
  }
}

export class TestDataGenerator {
  static generateUniqueTagPrefix(prefix = 'AUTOTAG'): string {
    return `${prefix}-${Date.now()}`;
  }

  static generateUniqueTagDescription(prefix = 'Description'): string {
    return `${prefix} ${new Date().toISOString()}`;
  }
}
