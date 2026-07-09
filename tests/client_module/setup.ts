import { expect, Locator, Page } from '@playwright/test';
import { ENV } from '../../config/env';

export const TEST_CONFIG = {
  baseUrl:         ENV.baseUrl,
  loginUrl:        ENV.loginUrl,
  clientModuleUrl: ENV.urls.client,
  credentials:     ENV.credentials,
  timeouts:        ENV.timeouts,
};

// ─────────────────────────────────────────────────────────────────────────────
// Selectors — derived from actual UI screenshots
// Form is a full page (not a modal); fields are identified via label text.
// ─────────────────────────────────────────────────────────────────────────────
export const SELECTORS = {
  // Auth
  emailInput:    'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton:   'button:has-text("Continue to Verification")',

  // Page & listing
  pageHeader:         'h1:has-text("Client List"), h2:has-text("Client List"), h3:has-text("Client List"), h4:has-text("Client List")',
  totalRecordsCount:  'text=/\\d+ (records?|clients?)/i',
  newClientButton:    'button:has-text("New Client")',
  resetFiltersButton: 'button:has-text("Reset Filters")',
  exportCsvButton:    'button:has-text("Export CSV")',

  // Table
  clientTable:     'table',
  // Excludes the "No clients found matching your filters." placeholder row so
  // zero-result assertions (toBe(0)) aren't thrown off by that row counting as 1.
  clientTableRows: 'table tbody tr:not(:has-text("No clients found"))',

  // Table column headers
  colClientName:     'th:has-text("CLIENT NAME")',
  colCountry:        'th:has-text("COUNTRY")',
  colType:           'th:has-text("TYPE")',
  colCategory:       'th:has-text("CATEGORY")',
  colProduct:        'th:has-text("PRODUCT")',
  colLastLogin:      'th:has-text("LAST LOGIN")',
  colStatus:         'th:has-text("STATUS")',
  colActiveProjects: 'th:has-text("ACTIVE PROJECTS")',
  colActions:        'th:has-text("ACTIONS")',

  // Column header filters
  clientNameFilter: 'th:has-text("CLIENT NAME") input, th:has-text("CLIENT NAME") [role="combobox"]',
  countryFilter:    'th:has-text("COUNTRY") input, th:has-text("COUNTRY") [role="combobox"]',
  typeFilter:       'th:has-text("TYPE") input, th:has-text("TYPE") [role="combobox"]',
  categoryFilter:   'th:has-text("CATEGORY") input, th:has-text("CATEGORY") [role="combobox"]',
  productFilter:    'th:has-text("PRODUCT") input, th:has-text("PRODUCT") [role="combobox"]',
  statusFilter:     'th:has-text("STATUS") input, th:has-text("STATUS") [role="combobox"]',

  // No-results state
  noResultsMessage: 'text=/No clients found matching your filters/i',

  // ── Create / Edit form ────────────────────────────────────────────────────
  // CSS fallback selectors — the primary path is getByLabel() inside helpers.
  formClientName: [
    'div:has(label:has-text("CLIENT NAME")) input[type="text"]',
    'div:has(label:has-text("CLIENT NAME")) input',
    'label:has-text("CLIENT NAME") + input',
    'label:has-text("CLIENT NAME") ~ input',
  ].join(', '),

  formStatus: [
    'div:has(label:has-text("STATUS")) select',
    'label:has-text("STATUS") + select',
    'label:has-text("STATUS") ~ select',
  ].join(', '),

  formType: [
    'div:has(label:has-text("TYPE")) select',
    'label:has-text("TYPE") + select',
    'label:has-text("TYPE") ~ select',
  ].join(', '),

  formCategory: [
    'div:has(label:has-text("CATEGORY")) input',
    'div:has(label:has-text("CATEGORY")) [role="combobox"]',
    'input[placeholder*="SEARCH OR ADD" i]',
  ].join(', '),

  formProduct: [
    'div:has(label:has-text("PRODUCT")) input',
    'div:has(label:has-text("PRODUCT")) [role="combobox"]',
  ].join(', '),

  saveClientButton: 'button:has-text("Save Client")',
  cancelButton:     'button:has-text("Cancel")',

  formPageTitle: 'h1:has-text("New Client"), h2:has-text("New Client"), h1:has-text("Edit Client"), h2:has-text("Edit Client")',

  basicInfoTab: '[role="tab"]:has-text("Basic Information"), button:has-text("Basic Information")',
  addressTab:   '[role="tab"]:has-text("Address"), button:has-text("Address")',

  formAddressLine1:    'div:has(label:has-text("ADDRESS LINE 1")) input, input[placeholder*="address" i]',
  formCity:            'div:has(label:has-text("CITY")) input, input[placeholder*="city" i]',
  formPostalCode:      'div:has(label:has-text("POSTAL")) input, input[placeholder*="postal" i]',
  formCountryDropdown: 'div:has(label:has-text("COUNTRY")) select, div:has(label:has-text("COUNTRY")) [role="combobox"]',

  validationClientName: 'text=/Client Name is required/i',
  validationStatus:     'text=/Status is required/i',

  // Delete flow — confirmation modal uses "Delete" / "Cancel" buttons
  deleteActionIcon:    'button:has(svg.lucide-trash2), button[title*="delete" i], button[aria-label*="delete" i]',
  deleteModal:         'text=/Delete Client/i',
  deleteConfirmYes:    'button:has-text("Delete")',
  deleteConfirmCancel: 'button:has-text("Cancel")',
  // Broadened — some builds say "deleted" without "successfully"
  toastDeleteSuccess:  'text=/deleted/i',

  toastSaveSuccess: 'text=/saved successfully/i',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
export class ClientModuleHelpers {
  constructor(private page: Page) {}

  async login() {
    await this.page.context().clearCookies();
    await this.page.goto(TEST_CONFIG.loginUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TEST_CONFIG.timeouts.navigation * 3,
    });
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.page.waitForSelector(SELECTORS.emailInput, {
      timeout: TEST_CONFIG.timeouts.navigation,
    });
    await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
    await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
    await this.page.click(SELECTORS.loginButton);

    await this.page.waitForLoadState('networkidle', {
      timeout: TEST_CONFIG.timeouts.navigation,
    });

    if (this.page.url().includes('/login')) {
      throw new Error('Login failed – still on login page after credential submission');
    }
  }

  async navigateToClientModule() {
    const url = this.page.url();
    const inClientSection = url.includes('/client');
    const onClientListing =
      inClientSection &&
      !url.includes('/new') &&
      !url.includes('/edit') &&
      !url.match(/\/client\/\d/);

    if (!onClientListing) {
      if (inClientSection) {
        // Clicking the sidebar "Clients" link no-ops when already inside the Client
        // section (leaving an edit/detail sub-route) — go back through SPA history instead.
        await this.page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
      } else {
        const navButton = this.page.locator('a:has-text("Clients"), button:has-text("Clients")').first();
        if (await navButton.count() > 0) {
          await navButton.click({ timeout: TEST_CONFIG.timeouts.element });
        } else {
          await this.page.goto(TEST_CONFIG.clientModuleUrl, { waitUntil: 'domcontentloaded' });
        }
      }
      await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});
    }

    const newClientBtn = this.page.locator(SELECTORS.newClientButton);
    await newClientBtn
      .waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.navigation })
      .catch(async () => {
        // goBack() may not land on the listing (e.g. no prior history entry) — fall back
        // to the sidebar link.
        const navButton = this.page.locator('a:has-text("Clients"), button:has-text("Clients")').first();
        if (await navButton.count() > 0) {
          await navButton.click({ timeout: TEST_CONFIG.timeouts.element });
        }
        await newClientBtn.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.navigation });
      });
  }

  async openNewClientForm() {
    await this.page.locator(SELECTORS.newClientButton).click({ timeout: TEST_CONFIG.timeouts.element });

    await this.page.locator(SELECTORS.saveClientButton).waitFor({
      state: 'visible',
      timeout: TEST_CONFIG.timeouts.navigation,
    });

    const nameInput = await this.getClientNameInput();
    await nameInput.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });

    await this.page.waitForTimeout(300);
  }

  /**
   * Click a listing row to open the client edit page, then wait until the
   * "Save Client" button is visible — the same reliable indicator used in
   * openNewClientForm(). Works regardless of the edit form's label structure.
   */
  async openEditForm(row: Locator) {
    await row.click({ timeout: 10000 });
    await this.page.locator(SELECTORS.saveClientButton).waitFor({
      state: 'visible',
      timeout: TEST_CONFIG.timeouts.navigation,
    });
    await this.page.waitForTimeout(300);
  }

  /**
   * Resolves the CLIENT NAME input via getByLabel first (works for both the
   * create and edit form regardless of HTML element type), then falls back to
   * the CSS selector list if the ARIA association is absent.
   */
  private async getClientNameInput(): Promise<Locator> {
    const byLabel = this.page.getByLabel(/client name/i, { exact: false });
    if (await byLabel.count() > 0) return byLabel.first();
    return this.page.locator(SELECTORS.formClientName).first();
  }

  /** Fill the Client Name field and optionally set Status / Type */
  async fillBasicInfo(clientName: string, status?: string, type?: string) {
    const nameInput = await this.getClientNameInput();
    await nameInput.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
    await nameInput.fill(clientName);

    if (status) {
      const statusSelect = this.page.locator(SELECTORS.formStatus).first();
      if (await statusSelect.count() > 0) {
        await statusSelect.selectOption({ label: status }).catch(async () => {
          await statusSelect.selectOption({ label: status.toUpperCase() }).catch(() =>
            statusSelect.selectOption({ value: status.toLowerCase() })
          );
        });
      }
    }

    if (type) {
      const typeSelect = this.page.locator(SELECTORS.formType).first();
      if (await typeSelect.count() > 0) {
        await typeSelect.selectOption({ label: type }).catch(() =>
          typeSelect.selectOption({ value: type.toLowerCase() })
        );
      }
    }
  }

  /**
   * Fill ALL available form fields for thorough end-to-end tests:
   *   Basic Info tab  — CLIENT NAME, STATUS, TYPE (first available option)
   *   Address tab     — ADDRESS LINE 1, CITY, POSTAL CODE
   *
   * status defaults to 'Active'; pass 'Obsolete' for an obsolete record.
   */
  async fillAllFields(clientName: string, status = 'Active', fillAddress = true) {
    await this.fillBasicInfo(clientName, status);

    // TYPE – pick the first non-placeholder option
    const typeSelect = this.page.locator(SELECTORS.formType).first();
    if (await typeSelect.count() > 0) {
      const options = await typeSelect.locator('option').all();
      for (const opt of options) {
        const val  = await opt.getAttribute('value');
        const text = (await opt.textContent()) ?? '';
        if (val && val.trim() !== '' && !text.includes('Select')) {
          await typeSelect.selectOption({ value: val }).catch(() => {});
          break;
        }
      }
    }

    if (fillAddress) {
      const addressTab = this.page.locator(SELECTORS.addressTab).first();
      if (await addressTab.count() > 0 && await addressTab.isVisible()) {
        await addressTab.click();
        await this.page.waitForTimeout(300);

        const addr = TestDataGenerator.generateUniqueAddress();

        const addrLine1 = this.page.locator(SELECTORS.formAddressLine1).first();
        if (await addrLine1.count() > 0) await addrLine1.fill(addr.addressLine1);

        const cityField = this.page.locator(SELECTORS.formCity).first();
        if (await cityField.count() > 0) await cityField.fill(addr.city);

        const postalField = this.page.locator(SELECTORS.formPostalCode).first();
        if (await postalField.count() > 0) await postalField.fill(addr.postalCode);

        // Switch back so Save Client button remains accessible
        const basicTab = this.page.locator(SELECTORS.basicInfoTab).first();
        if (await basicTab.count() > 0 && await basicTab.isVisible()) {
          await basicTab.click();
          await this.page.waitForTimeout(200);
        }
      }
    }
  }

  async saveClient() {
    const saveBtn = this.page.locator(SELECTORS.saveClientButton);
    await saveBtn.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
    await saveBtn.click({ timeout: TEST_CONFIG.timeouts.element });

    await this.page.waitForSelector(SELECTORS.toastSaveSuccess, {
      timeout: TEST_CONFIG.timeouts.action,
    }).catch(() => {});

    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /** Create a client (mandatory fields only) and return its name */
  async createClient(nameSeed = 'AUTO'): Promise<string> {
    const clientName = TestDataGenerator.generateUniqueClientName(nameSeed);
    await this.navigateToClientModule();
    await this.openNewClientForm();
    await this.fillBasicInfo(clientName);
    await this.saveClient();
    await this.navigateToClientModule();
    return clientName;
  }

  /**
   * Create a client with ALL fields filled (CLIENT NAME, STATUS, TYPE, Address).
   * status defaults to 'Active'; pass 'Obsolete' to create an obsolete record.
   */
  async createClientFull(nameSeed = 'AUTO', status = 'Active'): Promise<string> {
    const clientName = TestDataGenerator.generateUniqueClientName(nameSeed);
    await this.navigateToClientModule();
    await this.openNewClientForm();
    await this.fillAllFields(clientName, status);
    await this.saveClient();
    await this.navigateToClientModule();
    return clientName;
  }

  async applyFilter(filterSelector: string, value: string) {
    await this.page.waitForTimeout(300);

    const field = this.page.locator(filterSelector).first();
    try {
      await field.waitFor({ state: 'visible', timeout: 5000 });
      await field.fill('');
      await field.fill(value);
    } catch {
      const fallback = this.page.locator('table th input').first();
      try {
        await fallback.waitFor({ state: 'visible', timeout: 3000 });
        await fallback.fill('');
        await fallback.fill(value);
      } catch {
        // Filter not found — continue
      }
    }

    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async resetFilters() {
    const resetBtn = this.page.locator(SELECTORS.resetFiltersButton);
    if (await resetBtn.count() > 0) {
      await resetBtn.click({ timeout: TEST_CONFIG.timeouts.element });
    }
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.action }).catch(() => {});
    await this.page.waitForTimeout(300);
  }

  async getRecordCount(): Promise<number> {
    const badge = this.page.locator(SELECTORS.totalRecordsCount).first();
    if (await badge.count() === 0) {
      return await this.page.locator(SELECTORS.clientTableRows).count();
    }
    const label = await badge.innerText().catch(() => '');
    const match = label.match(/(\d+)/);
    if (match) return Number(match[1]);
    return await this.page.locator(SELECTORS.clientTableRows).count();
  }

  async deleteClientByName(clientName: string) {
    await this.navigateToClientModule();
    await this.applyFilter(SELECTORS.clientNameFilter, clientName);

    const row = this.page.locator(`table tbody tr:has-text("${clientName}")`).first();
    try {
      await row.waitFor({ state: 'visible', timeout: 8000 });
    } catch {
      return; // Already gone or was never created
    }

    await row.scrollIntoViewIfNeeded();
    const deleteBtn = row.locator(SELECTORS.deleteActionIcon).first();
    await deleteBtn.click({ timeout: TEST_CONFIG.timeouts.element });

    await this.page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
    await this.page.locator(SELECTORS.deleteConfirmYes).click({ timeout: TEST_CONFIG.timeouts.element });

    // Non-fatal: success is confirmed by row absence, not just the toast
    await this.page.waitForSelector(SELECTORS.toastDeleteSuccess, {
      timeout: TEST_CONFIG.timeouts.action,
    }).catch(() => {});

    await this.page.waitForTimeout(300);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test data generator
// ─────────────────────────────────────────────────────────────────────────────
export class TestDataGenerator {
  static generateUniqueClientName(seed = 'AUTO'): string {
    return `TEST-CLIENT-${seed}-${Date.now()}`;
  }

  static generateUniqueAddress() {
    return {
      addressLine1: `${Math.floor(Math.random() * 9000) + 1000} Test Street`,
      city:         'TestCity',
      state:        'TestState',
      postalCode:   `${Math.floor(Math.random() * 90000) + 10000}`,
    };
  }
}
