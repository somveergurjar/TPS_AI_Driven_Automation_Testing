import { test, expect, Page } from '@playwright/test';

// Test configuration
export const TEST_CONFIG = {
  baseUrl: 'https://dev.liveaccess.ai',
  loginUrl: 'https://dev.liveaccess.ai/login',
  equipmentUrl: 'https://dev.liveaccess.ai/equipment',
  credentials: {
    email: 'somveergurjar.megaminds@gmail.com',
    password: 'Qwert@123'
  },
  timeouts: {
    navigation: 30000,
    element: 15000,
    save: 30000
  }
};

// Element selectors based on exploratory testing
export const SELECTORS = {
  // Login page
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton: 'button:has-text("Continue to Verification")',

  // Equipment form fields
  tpsIdField: 'input[placeholder="Auto-generated"], [aria-label="Auto-generated"]',
  statusDropdown: 'label:has-text("Status") >> select',
  categoryDropdown: 'label:has-text("Equipment Category") >> select',
  typeDropdown: 'label:has-text("Equipment Type") >> select',
  manufacturerField: 'css=input[placeholder="Type to search or add new..."] >> nth=0',
  supplierField: 'css=input[placeholder="Type to search or add new..."] >> nth=1',
  supplierIdField: 'input[placeholder="V-1001-A"]',
  featureField: 'input:nth-of-type(4)',
  modelInfoField: 'input:nth-of-type(5)',

  // Buttons
  saveButton: 'button:has-text("Save Equipment")',
  cancelButton: 'button:has-text("Cancel")',
  newEquipmentButton: 'button:has-text("New Equipment")',

  // Error messages
  manufacturerError: 'text="Manufacturer is required."',
  supplierError: 'text="Supplier is required."',
  supplierIdError: 'text="Supplier Identification Number is required."',

  // Navigation
  equipmentModule: 'text="Equipment"',
  backButton: 'button[aria-label="Back"]',

  // Page elements
  pageHeader: 'h1, h2, h3, h4, h5, h6',
  equipmentList: 'text=Equipment List'
};

// Test data fixtures
export const TEST_DATA = {
  manufacturers: {
    existing: 'ABB',
    new: 'TestManufacturer2026'
  },
  suppliers: {
    existing: 'SG SUPPLIER 1',
    new: 'TestSupplier2026'
  },
  supplierIds: {
    valid: 'TEST-001',
    duplicate: 'TEST-001', // Same as valid for duplicate testing
    unique: 'TEST-002'
  },
  features: {
    valid: 'High Efficiency',
    empty: ''
  },
  modelInfo: {
    valid: 'Model XYZ-2024',
    empty: ''
  },
  categories: {
    pumps: 'PUMPS',
    analytical: 'ANALYTICAL',
    valves: 'PROCESS VALVES'
  },
  types: {
    pump: 'PUMP',
    valve: 'VALVE',
    sensor: 'SENSOR'
  },
  statuses: {
    active: 'ACTIVE',
    obsolete: 'OBSOLETE'
  }
};

// Common helper functions
export class EquipmentFormHelpers {

  constructor(private page: Page) {}

  /**
   * Login to the application
   */
  async login() {
    await this.page.context().clearCookies();
    await this.page.goto(TEST_CONFIG.loginUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation * 3 });
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.page.waitForSelector(SELECTORS.emailInput, { timeout: TEST_CONFIG.timeouts.navigation * 3 });
    await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
    await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
    await this.page.click(SELECTORS.loginButton);

    await this.page.waitForSelector(SELECTORS.emailInput, { state: 'detached', timeout: TEST_CONFIG.timeouts.navigation * 3 });

    if (!this.page.url().includes('/equipment')) {
      await this.page.goto(TEST_CONFIG.equipmentUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation * 3 });
      await this.page.waitForSelector(SELECTORS.newEquipmentButton, { timeout: TEST_CONFIG.timeouts.navigation * 3 });
    } else {
      await this.page.waitForSelector(SELECTORS.newEquipmentButton, { timeout: TEST_CONFIG.timeouts.navigation * 3 });
    }
  }

  /**
   * Navigate to New Equipment form
   */
  async navigateToNewEquipment() {
    if (!this.page.url().includes('/equipment')) {
      await this.page.goto(TEST_CONFIG.equipmentUrl, { waitUntil: 'domcontentloaded', timeout: TEST_CONFIG.timeouts.navigation * 3 });
    }

    await this.page.waitForSelector(SELECTORS.newEquipmentButton, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.click(SELECTORS.newEquipmentButton);
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });

    // Wait for form fields to load
    await Promise.all([
      this.page.waitForSelector(SELECTORS.tpsIdField, { timeout: TEST_CONFIG.timeouts.navigation }),
      this.page.waitForSelector(SELECTORS.manufacturerField, { timeout: TEST_CONFIG.timeouts.navigation })
    ]);
  }

  /**
   * Fill mandatory fields only
   */
  async fillMandatoryFields(manufacturer = TEST_DATA.manufacturers.existing,
                           supplier = TEST_DATA.suppliers.existing,
                           supplierId = TEST_DATA.supplierIds.valid) {
    await this.page.locator(SELECTORS.manufacturerField).fill(manufacturer);
    await this.page.locator(SELECTORS.supplierField).fill(supplier);
    await this.page.fill(SELECTORS.supplierIdField, supplierId);
  }

  /**
   * Fill all fields including optional ones
   */
  async fillAllFields(data: {
    manufacturer?: string;
    supplier?: string;
    supplierId?: string;
    category?: string;
    type?: string;
    feature?: string;
    modelInfo?: string;
    status?: string;
  } = {}) {
    const defaults = {
      manufacturer: TEST_DATA.manufacturers.existing,
      supplier: TEST_DATA.suppliers.existing,
      supplierId: TEST_DATA.supplierIds.valid,
      category: TEST_DATA.categories.pumps,
      type: TEST_DATA.types.pump,
      feature: TEST_DATA.features.valid,
      modelInfo: TEST_DATA.modelInfo.valid,
      status: TEST_DATA.statuses.active
    };

    const finalData = { ...defaults, ...data };

    // Fill mandatory fields
    await this.fillMandatoryFields(finalData.manufacturer, finalData.supplier, finalData.supplierId);

    // Fill optional fields
    if (finalData.category) {
      await this.page.locator(SELECTORS.categoryDropdown).selectOption(finalData.category);
    }
    if (finalData.type) {
      await this.page.locator(SELECTORS.typeDropdown).selectOption(finalData.type);
    }
    if (finalData.feature) {
      const featureField = this.page.locator(SELECTORS.featureField);
      if (await featureField.count() > 0) {
        await featureField.fill(finalData.feature);
      }
    }
    if (finalData.modelInfo) {
      const modelInfoField = this.page.locator(SELECTORS.modelInfoField);
      if (await modelInfoField.count() > 0) {
        await modelInfoField.fill(finalData.modelInfo);
      }
    }
    if (finalData.status) {
      await this.page.locator(SELECTORS.statusDropdown).selectOption(finalData.status);
    }
  }

  /**
   * Save the equipment form
   */
  async saveEquipment() {
    await this.page.click(SELECTORS.saveButton);
    await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.save });
  }

  /**
   * Cancel the equipment form
   */
  async cancelEquipment() {
    await this.page.click(SELECTORS.cancelButton);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current TPS ID value
   */
  async getCurrentTpsId(): Promise<string> {
    return await this.page.inputValue(SELECTORS.tpsIdField);
  }

  /**
   * Wait for validation errors to appear
   */
  async waitForValidationErrors() {
    await this.page.waitForTimeout(1000); // Allow time for validation to trigger
  }

  /**
   * Check if validation error is visible for a field
   */
  async isValidationErrorVisible(errorSelector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(errorSelector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot on failure
   */
  async takeScreenshotOnFailure(testName: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${testName}-failure.png`, fullPage: true });
  }
}

// Global test setup
export const globalSetup = test.extend<{
  helpers: EquipmentFormHelpers;
}>({
  helpers: async ({ page }, use) => {
    const helpers = new EquipmentFormHelpers(page);
    await use(helpers);
  },
});

// Test data generator for unique values
export class TestDataGenerator {
  static generateUniqueSupplierId(prefix = 'AUTO'): string {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  }

  static generateUniqueManufacturer(prefix = 'AutoMfg'): string {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  }

  static generateUniqueSupplier(prefix = 'AutoSupplier'): string {
    const timestamp = Date.now();
    return `${prefix}-${timestamp}`;
  }
}