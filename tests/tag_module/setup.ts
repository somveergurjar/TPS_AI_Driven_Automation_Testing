import { test, expect, Page } from '@playwright/test';

export const TEST_CONFIG = {
  baseUrl: 'https://dev.liveaccess.ai',
  loginUrl: 'https://dev.liveaccess.ai/login',
  tagModuleUrl: 'https://dev.liveaccess.ai/tag',
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
  pageHeader: 'h1:has-text("Tag List")',
  totalRecordsCount: 'text=/\\d+ records?/i',
  newTagButton: 'button:has-text("New Tag")',
  resetFiltersButton: 'button:has-text("Reset Filters")',
  tagPrefixFilter: 'input[placeholder="Filter..."]',
  tagDescriptionFilter: 'input[placeholder="Filter..."]',
  applyFiltersButton: 'button:has-text("Apply")',
  tagTable: 'table',
  tagTableRows: 'table tbody tr',
  tagTableHeaderPrefix: 'th:has-text("TAG PREFIX")',
  tagTableHeaderDescription: 'th:has-text("TAG DESCRIPTION")',
  tagTableHeaderActions: 'th:has-text("ACTIONS")',
  newTagModal: 'h2:has-text("New Tag")',
  tagPrefixInput: 'input[placeholder="e.g. FIC"]',
  tagDescriptionInput: 'input[placeholder*="description"]',
  saveTagButton: 'button:has-text("Save Tag")',
  cancelTagButton: 'button:has-text("Cancel")',
  closeModalButton: '.flex.items-center.justify-between.px-6 > .p-1\\.5',
  validationMessagePrefix: 'text=/Tag Prefix.*required/i',
  deleteActionIcon: 'button:has-text("Delete")',
  toastSuccess: 'text=/deleted successfully/i',
  toastSaveSuccess: 'text=/saved successfully/i',
  noResultsMessage: 'text=/no records found/i'
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
    const newTagButton = this.page.locator(SELECTORS.newTagButton);
    await newTagButton.click({ timeout: TEST_CONFIG.timeouts.element });
    
    // Wait for the modal to be visible - wait for the input field to be ready
    const prefixInput = this.page.locator(SELECTORS.tagPrefixInput);
    await prefixInput.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'visible' });
    
    // Ensure the modal is actually visible and interactive
    await this.page.waitForTimeout(300);
  }

  async createTag(prefix: string, description?: string) {
    await this.openNewTagModal();
    await this.page.fill(SELECTORS.tagPrefixInput, prefix);
    if (description !== undefined) {
      await this.page.fill(SELECTORS.tagDescriptionInput, description);
    }
    
    // Wait for save button to be ready
    const saveButton = this.page.locator(SELECTORS.saveTagButton);
    await saveButton.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'visible' });
    
    // Click save
    await saveButton.click({ timeout: TEST_CONFIG.timeouts.element });
    
    // Wait for the save toast to appear (if any)
    await this.page.waitForSelector(SELECTORS.toastSaveSuccess, { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    
    // Wait for the modal to close
    const modal = this.page.locator(SELECTORS.newTagModal);
    await modal.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'hidden' }).catch(() => {});
    
    // Wait for table to load
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    
    // Give it a moment
    await this.page.waitForTimeout(500);
  }

  async closeNewTagModal() {
    // Try to find and click the close button - there might be multiple close mechanisms
    const closeButton = this.page.locator(SELECTORS.closeModalButton).first();
    
    try {
      // Try clicking close button first
      if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeButton.click({ timeout: TEST_CONFIG.timeouts.element });
      } else {
        // If close button not visible, click cancel instead
        const cancelButton = this.page.locator(SELECTORS.cancelTagButton);
        if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await cancelButton.click({ timeout: TEST_CONFIG.timeouts.element });
        }
      }
    } catch (e) {
      // If click fails, try cancel button
      const cancelButton = this.page.locator(SELECTORS.cancelTagButton);
      await cancelButton.click({ timeout: TEST_CONFIG.timeouts.element });
    }
    
    // Wait for modal to disappear
    const modal = this.page.locator(SELECTORS.newTagModal);
    await modal.waitFor({ timeout: TEST_CONFIG.timeouts.element, state: 'hidden' }).catch(() => {});
  }

  async applyFilter(selector: string, value: string) {
    // Wait a moment for the page to settle after any previous action
    await this.page.waitForTimeout(300);
    
    // Try to find the field using the provided selector
    let field = this.page.locator(selector);
    
    // If it's the generic filter selector, try to use the first available
    if (selector.includes('input[placeholder=')) {
      field = field.first();
    }
    
    // Wait for the field to be visible
    try {
      await field.waitFor({ timeout: 5000, state: 'visible' });
    } catch (e) {
      // If field not found, try alternative approach - find by table context
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
    
    // Wait a moment for filter to apply
    await this.page.waitForTimeout(500);
    
    // Wait for the table to update based on filter
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    
    // Give the filter a moment to apply
    await this.page.waitForTimeout(300);
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
    // Try multiple selectors to find the row
    const row = this.page.locator(`table tbody tr:has-text("${prefix}")`).first();
    return row;
  }

  async deleteTagByPrefix(prefix: string) {
    // Wait for the row to appear (max 5 seconds)
    let row = this.page.locator(`table tbody tr:has-text("${prefix}")`).first();
    
    try {
      await row.waitFor({ timeout: 5000, state: 'visible' });
    } catch (e) {
      // Row not found, check if it exists at all
      const rowCount = await row.count();
      if (rowCount === 0) {
        // Tag doesn't exist, silently return
        return;
      }
    }
    
    // Scroll row into view
    await row.scrollIntoViewIfNeeded();
    
    // Set up dialog handler before clicking delete
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    
    // Find and click the delete button in the row
    const deleteButton = row.locator(SELECTORS.deleteActionIcon).first();
    
    try {
      await deleteButton.click({ timeout: TEST_CONFIG.timeouts.element });
    } catch (e) {
      // If click fails, try to force click
      await deleteButton.click({ force: true });
    }
    
    // Wait for success toast or row to disappear
    await this.page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async deleteTagIfExistsByPrefix(prefix: string) {
    // Try to find and delete the tag if it exists
    try {
      const row = this.page.locator(`table tbody tr:has-text("${prefix}")`).first();
      const rowCount = await row.count();
      
      if (rowCount === 0) {
        return;
      }
      
      // Row exists, try to delete it
      await this.page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      
      const deleteButton = row.locator(SELECTORS.deleteActionIcon).first();
      await deleteButton.click({ force: true });
      
      // Wait for toast or give it time to delete
      await this.page.waitForSelector(SELECTORS.toastSuccess, { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
      await this.page.waitForTimeout(200);
    } catch (e) {
      // Silently ignore errors - tag might not exist
    }
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
