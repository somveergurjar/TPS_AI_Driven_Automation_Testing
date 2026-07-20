import { expect, Page } from '@playwright/test';
import { ENV } from '../../config/env';
import { performLogin } from '../support/loginFlow';

export const TEST_CONFIG = {
  baseUrl:            ENV.baseUrl,
  loginUrl:           ENV.loginUrl,
  equipmentModuleUrl: ENV.urls.equipment,
  credentials:        ENV.credentials,
  timeouts:           ENV.timeouts,
};

export const SELECTORS = {
  // Auth
  emailInput:    'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton:   'button:has-text("Continue to Verification")',

  // Page
  pageHeader:         'h1:has-text("Equipment List")',
  totalRecordsCount:  'text=/\\d+ records?/i',
  newEquipmentButton: 'button:has-text("New Equipment")',
  resetFiltersButton: 'button:has-text("Reset Filters")',

  // Table
  equipmentTable:              'table',
  equipmentTableRows:          'table tbody tr',
  tableHeaderTpsId:            'th:has-text("TPS ID")',
  tableHeaderSupplierIdNo:     'th:has-text("SUPPLIER IDENTIFICATION NUMBER")',
  tableHeaderEquipmentCategory:'th:has-text("EQUIPMENT CATEGORY")',
  tableHeaderEquipmentType:    'th:has-text("EQUIPMENT TYPE")',
  tableHeaderActions:          'th:has-text("ACTIONS")',

  // Column-header filter inputs
  tpsIdFilter:      'th:has-text("TPS ID") input[placeholder="Filter..."]',
  supplierIdFilter: 'th:has-text("SUPPLIER IDENTIFICATION NUMBER") input',

  // Action icons (trash icon = delete, copy icon = duplicate)
  deleteActionIcon: 'button:has(svg.lucide-trash2)',

  // New-equipment form — actual tab names from the live UI
  identificationTab: 'button:has-text("Equipment Identification"), [role="tab"]:has-text("Equipment Identification")',
  processTab:        'button:has-text("Performance"), [role="tab"]:has-text("Performance")',
  automationTab:     'button:has-text("Automation"), [role="tab"]:has-text("Automation")',
  commercialTab:     'button:has-text("Commercial"), [role="tab"]:has-text("Commercial")',
  sparePartsTab:     'button:has-text("Spare Parts"), [role="tab"]:has-text("Spare Parts")',
  documentsTab:      'button:has-text("Documents Linking"), [role="tab"]:has-text("Documents Linking")',

  // Identification form fields
  // The "TYPE TO SEARCH OR ADD NEW..." text is on the container div — the actual <input>
  // inside has no placeholder attribute. Use positional .nth() on all editable text inputs:
  //   nth(0) = MANUFACTURER, nth(1) = SUPPLIER/VENDOR, nth(2) = SUPPLIER IDENTIFICATION NUMBER
  comboboxInput:   'input[type="text"]:not([disabled]):not([readonly])',
  supplierIdInput: 'input[type="text"]:not([disabled]):not([readonly])', // use .nth(2)

  // Kept for backwards-compat
  supplierInput:   'input[type="text"]:not([disabled]):not([readonly])',
  tpsIdField:        'input[readonly], input[disabled]',
  statusDropdown:    'select[name="status"]',
  dropdownContainer: 'div.absolute.z-50',

  // Form actions
  saveButton:   'button:has-text("Save Equipment")',
  cancelButton: 'button:has-text("Cancel")',

  // Linking sections
  availableItemCard: 'main [class*="cursor-pointer"]:has(p)',

  // Modals / dialogs
  // The full-screen backdrop wrapper (fixed inset-0 z-50) is the only element with
  // this class combination, so it uniquely identifies the confirmation modal —
  // unlike a plain `div:has-text(...)`, which also matches every ancestor wrapper.
  deleteModal:        'div.fixed.inset-0.z-50:has-text("Delete Equipment")',
  deleteModalConfirm: 'div.fixed.inset-0.z-50 button:has-text("Delete")',
  deleteModalCancel:  'div.fixed.inset-0.z-50 button:has-text("Cancel")',

  // Toasts
  toastSuccess:     'text=/successfully/i',
  toastError:       'text=/error/i',
  noResultsMessage: 'text=/No Equipment records found/i',

  // Validation
  validationRequired: 'text=/required/i',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export class EquipmentModuleHelpers {
  constructor(private page: Page) {}

  async login() {
    await performLogin(this.page, {
      loginUrl: TEST_CONFIG.loginUrl,
      email: TEST_CONFIG.credentials.email,
      password: TEST_CONFIG.credentials.password,
      gotoTimeout: TEST_CONFIG.timeouts.navigation,
      selectorTimeout: TEST_CONFIG.timeouts.navigation,
      selectors: SELECTORS,
    });
    await this.page.waitForURL(url => !url.href.includes('/login'), {
      timeout: TEST_CONFIG.timeouts.navigation,
      waitUntil: 'domcontentloaded',
    }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
  }

  async navigateToEquipmentModule() {
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/equipment')) {
      await this.page.goto(TEST_CONFIG.equipmentModuleUrl, {
        waitUntil: 'domcontentloaded',
        timeout: TEST_CONFIG.timeouts.navigation,
      });
      await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});
    }
  }

  async waitForEquipmentGrid() {
    await this.page.waitForSelector(SELECTORS.equipmentTable, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
  }

  async navigateToNewEquipment() {
    const btn = this.page.locator(SELECTORS.newEquipmentButton);
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});
  }

  async applyFilter(selector: string, value: string) {
    await this.page.waitForTimeout(300);
    let field = this.page.locator(selector).first();
    try {
      await field.waitFor({ timeout: 5000, state: 'visible' });
    } catch {
      const table = this.page.locator('table');
      if ((await table.count()) > 0) {
        field = table.locator('input[placeholder="Filter..."]').first();
        await field.waitFor({ timeout: 5000, state: 'visible' });
      }
    }
    await field.fill('');
    await field.fill(value);
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
    await this.page.waitForTimeout(500);
  }

  async resetFilters() {
    const resetBtn = this.page.locator(SELECTORS.resetFiltersButton);
    if ((await resetBtn.count()) > 0) await resetBtn.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.action });
    await this.page.waitForTimeout(300);
  }

  async getRecordCount(): Promise<number> {
    try {
      const text = await this.page.locator(SELECTORS.totalRecordsCount).first().innerText().catch(() => '0');
      const m = text.match(/(\d+)/);
      if (m) return Number(m[1]);
    } catch { /* ignore */ }
    return this.page.locator(SELECTORS.equipmentTableRows).count();
  }

  async getVisibleRowCount(): Promise<number> {
    return this.page.locator(SELECTORS.equipmentTableRows).count();
  }

  async pickFirstDropdownOption(inputSelector: string): Promise<boolean> {
    const input = this.page.locator(inputSelector).first();
    if ((await input.count()) === 0) return false;
    await input.click();
    await this.page.waitForTimeout(400);
    const container = this.page.locator(SELECTORS.dropdownContainer).first();
    if ((await container.count()) > 0) {
      const first = container.locator('> div').first();
      if ((await first.count()) > 0) { await first.click(); await this.page.waitForTimeout(300); return true; }
    }
    return false;
  }

  /** Pick first dropdown option from an already-resolved locator (not selector string). */
  async pickFirstDropdownFromLocator(inputLocator: import('@playwright/test').Locator): Promise<boolean> {
    if ((await inputLocator.count()) === 0) return false;

    await inputLocator.click();
    await this.page.waitForTimeout(200);

    // pressSequentially sends keystrokes to THIS element, triggering React onChange
    await inputLocator.pressSequentially('a', { delay: 50 });
    await this.page.waitForTimeout(800);

    // 1. Click the "New entry … will be created on save." suggestion that always appears
    const newEntry = this.page.locator('text=/will be created/i').first();
    if ((await newEntry.count()) > 0 && await newEntry.isVisible().catch(() => false)) {
      await newEntry.click();
      await this.page.waitForTimeout(400);
      return true;
    }

    // 2. Standard ARIA option roles
    for (const sel of ['[role="option"]', '[cmdk-item]', 'li[role="option"]', '[role="listbox"] > div']) {
      const opt = this.page.locator(sel).first();
      if ((await opt.count()) > 0 && await opt.isVisible().catch(() => false)) {
        await opt.click();
        await this.page.waitForTimeout(300);
        return true;
      }
    }

    // 3. Keyboard ArrowDown + Enter (standard ARIA combobox pattern)
    await inputLocator.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await inputLocator.press('Enter');
    await this.page.waitForTimeout(400);
    return true;
  }

  /**
   * Fills the mandatory Equipment Identification fields:
   *   MANUFACTURER (1st editable text input → nth(0)),
   *   SUPPLIER/VENDOR (2nd editable text input → nth(1)),
   *   SUPPLIER IDENTIFICATION NUMBER (3rd editable text input → nth(2)).
   *
   * The "TYPE TO SEARCH OR ADD NEW..." text is on the container div, NOT on the
   * <input> element, so we address fields by DOM position, not by placeholder.
   */
  async fillMandatoryIdentificationFields(uniqueId?: string): Promise<string> {
    const id = uniqueId ?? `SID-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    const allInputs = this.page.locator('input[type="text"]:not([disabled]):not([readonly])');
    const count = await allInputs.count();

    // MANUFACTURER — nth(0)
    if (count > 0) await this.pickFirstDropdownFromLocator(allInputs.nth(0));

    // SUPPLIER/VENDOR — nth(1)
    if (count > 1) await this.pickFirstDropdownFromLocator(allInputs.nth(1));

    // SUPPLIER IDENTIFICATION NUMBER — nth(2)
    if (count > 2) {
      const sidEl = allInputs.nth(2);
      if (await sidEl.isEnabled()) await sidEl.fill(id);
    }

    return id;
  }

  /**
   * Creates a minimal equipment record and returns to the Equipment List.
   * Returns the TPS ID captured from the form and the Supplier ID used.
   */
  async createEquipmentForTest(uniqueId?: string): Promise<{ tpsId: string; supplierIdNo: string }> {
    await this.navigateToNewEquipment();
    await this.page.waitForTimeout(600);

    // Capture auto-generated TPS ID (the readonly/disabled field)
    let tpsId = '';
    const tpsField = this.page.locator(SELECTORS.tpsIdField).first();
    if ((await tpsField.count()) > 0) {
      tpsId = await tpsField.inputValue().catch(() => '');
    }

    // Fill all mandatory fields using positional nth() strategy
    const supplierIdNo = await this.fillMandatoryIdentificationFields(uniqueId);

    const saveBtn = this.page.locator(SELECTORS.saveButton).first();
    await saveBtn.click();
    // Generous timeout: under concurrent multi-worker load, the shared dev
    // backend's save response can genuinely take longer than a single-worker run.
    await this.page.locator(SELECTORS.toastSuccess).waitFor({ state: 'visible', timeout: 30000 });

    await this.navigateToEquipmentModule();
    await this.waitForEquipmentGrid();

    return { tpsId, supplierIdNo };
  }

  /**
   * Filters by TPS ID and deletes the matching record.
   * Silent no-op if the record does not exist — safe for finally/afterEach.
   */
  async deleteEquipmentByFieldValue(filterSelector: string, value: string): Promise<void> {
    if (!value) return;
    try {
      await this.navigateToEquipmentModule();
      await this.waitForEquipmentGrid();
      await this.applyFilter(filterSelector, value);

      const row = this.page.locator(`table tbody tr:has-text("${value}")`).first();
      await row.waitFor({ state: 'visible', timeout: 5000 });

      const deleteBtn = row.locator(SELECTORS.deleteActionIcon).first();
      await deleteBtn.click();
      await this.page.waitForSelector(SELECTORS.deleteModal, { timeout: TEST_CONFIG.timeouts.element });
      await this.page.locator(SELECTORS.deleteModalConfirm).click();
      await this.page.locator(SELECTORS.toastSuccess).waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.action });
    } catch {
      // Record not found or already deleted — best-effort cleanup
    }
  }

  async deleteEquipmentByTpsId(tpsId: string): Promise<void> {
    return this.deleteEquipmentByFieldValue(SELECTORS.tpsIdFilter, tpsId);
  }

  async deleteEquipmentBySupplierIdNo(supplierIdNo: string): Promise<void> {
    return this.deleteEquipmentByFieldValue(SELECTORS.supplierIdFilter, supplierIdNo);
  }
}

// ---------------------------------------------------------------------------
// Test data generator
// ---------------------------------------------------------------------------
export class TestDataGenerator {
  static generateEquipmentName(prefix = 'EQ_AUTO'): string {
    return `${prefix}_${Date.now()}`;
  }

  static generateSupplierIdNo(prefix = 'SID'): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  }

  static generateTagPrefix(): string {
    return `TAG${Date.now().toString().slice(-6)}`;
  }

  static generateLongString(length = 1000): string {
    return 'A'.repeat(length);
  }
}
