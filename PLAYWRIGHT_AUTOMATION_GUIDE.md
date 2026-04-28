# Playwright Automation Guide - Add Equipment Form
## Based on Exploratory Testing Results

This guide contains ready-to-use Playwright code snippets for automating the Add Equipment workflow on TPS Live Access.

---

## SETUP: Basic Login & Navigation

```javascript
import { test, expect } from '@playwright/test';

test.describe('Add Equipment Workflow', () => {
  
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Navigate to login page
    await page.goto('https://dev.liveaccess.ai/login');
    
    // Fill login credentials
    await page.fill('input[type="email"]', 'somveergurjar.megaminds@gmail.com');
    await page.fill('input[type="password"]', 'Qwert@123');
    
    // Click login button
    await page.click('button:has-text("Login")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/equipment**', { timeout: 10000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  // Test cases follow below...
});
```

---

## ELEMENT SELECTOR DEFINITIONS

```javascript
// Reusable element selectors object
const equipmentFormSelectors = {
  // Auto-generated fields
  tpsIdField: 'input[aria-label="Auto-generated"]',
  
  // Dropdowns (select elements)
  statusDropdown: 'select:nth-of-type(1)',  // First select
  categoryDropdown: 'select:nth-of-type(2)', // Second select
  typeDropdown: 'select:nth-of-type(3)',    // Third select
  
  // Textboxes (searchable fields)
  manufacturerField: 'input[placeholder="Type to search or add new..."]:nth-of-type(1)',
  supplierField: 'input[placeholder="Type to search or add new..."]:nth-of-type(2)',
  supplierIdField: 'input[placeholder="V-1001-A"]',
  
  // Optional fields
  featureField: 'input:nth-of-type(4)',
  modelInfoField: 'input:nth-of-type(5)',
  
  // Action buttons
  saveButton: 'button:has-text("Save Equipment")',
  cancelButton: 'button:has-text("Cancel")',
  
  // Error messages
  manufacturerError: 'text="Manufacturer is required."',
  supplierError: 'text="Supplier is required."',
  supplierIdError: 'text="Supplier Identification Number is required."'
};
```

---

## TEST 1: Verify Form Loads Correctly

```javascript
test('Form loads with all fields visible', async () => {
  // Navigate to equipment form
  await page.goto('https://dev.liveaccess.ai/equipment');
  
  // Verify page title
  await expect(page.locator('heading')).toContainText('New Equipment Record');
  
  // Verify TPS ID is auto-generated and disabled
  const tpsIdField = await page.locator(equipmentFormSelectors.tpsIdField);
  await expect(tpsIdField).toHaveAttribute('disabled', '');
  const tpsId = await tpsIdField.inputValue();
  expect(tpsId).toMatch(/^E\d{5}$/); // Format: E##### (e.g., E11037)
  
  // Verify all mandatory fields have asterisk
  const labels = await page.locator('text=*').count();
  expect(labels).toBeGreaterThanOrEqual(3); // At least 3 mandatory fields
  
  // Verify buttons are present
  await expect(page.locator(equipmentFormSelectors.saveButton)).toBeVisible();
  await expect(page.locator(equipmentFormSelectors.cancelButton)).toBeVisible();
  
  console.log('✓ All form fields loaded correctly');
});
```

---

## TEST 2: Validate Mandatory Field Enforcement

```javascript
test('Form prevents save without mandatory fields', async () => {
  // Try to save without filling fields
  await page.click(equipmentFormSelectors.saveButton);
  
  // Verify all three error messages appear
  const manufacturerError = await page.isVisible(equipmentFormSelectors.manufacturerError);
  const supplierError = await page.isVisible(equipmentFormSelectors.supplierError);
  const supplierIdError = await page.isVisible(equipmentFormSelectors.supplierIdError);
  
  expect(manufacturerError).toBe(true);
  expect(supplierError).toBe(true);
  expect(supplierIdError).toBe(true);
  
  console.log('✓ All validation errors displayed correctly');
});
```

---

## TEST 3: Test Manufacturer Field with New Entry

```javascript
test('Manufacturer field accepts new entries', async () => {
  // Fill manufacturer field
  await page.fill(equipmentFormSelectors.manufacturerField, 'TestManufacturer');
  
  // Verify system indicates new entry will be created
  const newEntryMessage = await page.isVisible(
    'text="New entry \\"TestManufacturer\\" will be created on save."'
  );
  expect(newEntryMessage).toBe(true);
  
  console.log('✓ Manufacturer field accepted new entry');
});
```

---

## TEST 4: Test Supplier Field with Dropdown Selection

```javascript
test('Supplier field searches and selects from master list', async () => {
  // Type in supplier field to trigger search
  await page.fill(equipmentFormSelectors.supplierField, 'Supplier 1');
  
  // Wait for dropdown options to appear
  await page.waitForTimeout(500);
  
  // Look for and click on matching dropdown option
  const dropdownOption = await page.locator('text="SG SUPPLIER 1"').first();
  await expect(dropdownOption).toBeVisible();
  
  // Click to select
  await dropdownOption.click();
  
  // Verify selection in field
  const selectedValue = await page.inputValue(equipmentFormSelectors.supplierField);
  expect(selectedValue).toBe('SG SUPPLIER 1');
  
  console.log('✓ Supplier selected from dropdown');
});
```

---

## TEST 5: Test Supplier ID Field

```javascript
test('Supplier ID field accepts test data', async () => {
  const testSupplierId = 'TEST-001';
  
  // Fill supplier ID field
  await page.fill(equipmentFormSelectors.supplierIdField, testSupplierId);
  
  // Verify value in field
  const fieldValue = await page.inputValue(equipmentFormSelectors.supplierIdField);
  expect(fieldValue).toBe(testSupplierId);
  
  // Verify header updated with supplier ID
  const headerText = await page.textContent('heading');
  expect(headerText).toContain(testSupplierId);
  
  console.log('✓ Supplier ID field works correctly');
});
```

---

## TEST 6: Test Status Dropdown

```javascript
test('Status dropdown has ACTIVE as default', async () => {
  // Get selected value from status dropdown
  const statusValue = await page.locator(equipmentFormSelectors.statusDropdown).inputValue();
  expect(statusValue).toBe('ACTIVE');
  
  // Verify all status options available
  const options = await page.locator(
    `${equipmentFormSelectors.statusDropdown} option`
  ).count();
  expect(options).toBeGreaterThanOrEqual(3); // At least SELECT, ACTIVE, OBSOLETE
  
  console.log('✓ Status dropdown configured correctly');
});
```

---

## TEST 7: Test Equipment Category Dropdown

```javascript
test('Equipment Category dropdown shows all options', async () => {
  const expectedOptions = [
    'SELECT...',
    'ANALYTICAL',
    'FLOW MEASUREMENT',
    'PROCESS VALVES',
    'PUMPS',
    'TANKS',
    'UTILITY'
  ];
  
  // Get all option texts
  const options = await page.locator(
    `${equipmentFormSelectors.categoryDropdown} option`
  ).allTextContents();
  
  // Verify all expected options are present
  for (const expectedOption of expectedOptions) {
    expect(options).toContain(expectedOption);
  }
  
  console.log('✓ Category dropdown has all expected options');
});
```

---

## TEST 8: Test Equipment Type Dropdown

```javascript
test('Equipment Type dropdown shows all options', async () => {
  const expectedOptions = [
    'SELECT...',
    'ELEVATED',
    'HOSE',
    'INSTRUMENT',
    'PUMP',
    'SENSOR',
    'SPARE PART TC',
    'VALVE'
  ];
  
  // Get all option texts
  const options = await page.locator(
    `${equipmentFormSelectors.typeDropdown} option`
  ).allTextContents();
  
  // Verify all expected options are present
  for (const expectedOption of expectedOptions) {
    expect(options).toContain(expectedOption);
  }
  
  console.log('✓ Type dropdown has all expected options');
});
```

---

## TEST 9: Optional Fields Can Be Skipped

```javascript
test('Form saves without optional fields', async () => {
  // Fill only mandatory fields (skip optional ones)
  await page.fill(equipmentFormSelectors.manufacturerField, 'TestMfg');
  
  // Wait for dropdown and select supplier
  await page.fill(equipmentFormSelectors.supplierField, 'Supplier 1');
  await page.waitForTimeout(300);
  const supplierOption = await page.locator('text="SG SUPPLIER 1"').first();
  await supplierOption.click();
  
  // Fill supplier ID
  await page.fill(equipmentFormSelectors.supplierIdField, 'TEST-OPT-001');
  
  // Don't fill optional fields (Feature, Model Information)
  
  // Save form
  await page.click(equipmentFormSelectors.saveButton);
  
  // Verify successful save by checking navigation to list page
  await page.waitForURL('**/equipment**', { timeout: 5000 });
  
  // Verify list page loaded
  const pageTitle = await page.locator('text="Equipment List"');
  await expect(pageTitle).toBeVisible();
  
  console.log('✓ Form saved successfully without optional fields');
});
```

---

## TEST 10: Happy Path - Complete Form Submission

```javascript
test('Complete equipment creation workflow - Happy Path', async () => {
  // Get the auto-generated TPS ID
  const tpsIdField = await page.locator(equipmentFormSelectors.tpsIdField);
  const tpsId = await tpsIdField.inputValue();
  console.log(`Created TPS ID: ${tpsId}`);
  
  // Fill mandatory fields
  const testData = {
    manufacturer: 'ABB',
    supplier: 'SG SUPPLIER 1',
    supplierId: 'TEST-' + Date.now(),
    feature: 'High Efficiency',
    modelInfo: 'Model XYZ-2024'
  };
  
  // Fill Manufacturer
  await page.fill(equipmentFormSelectors.manufacturerField, testData.manufacturer);
  
  // Fill Supplier with search
  await page.fill(equipmentFormSelectors.supplierField, 'Supplier 1');
  await page.waitForTimeout(300);
  const supplierOption = await page.locator('text="SG SUPPLIER 1"').first();
  await expect(supplierOption).toBeVisible();
  await supplierOption.click();
  
  // Fill Supplier ID
  await page.fill(equipmentFormSelectors.supplierIdField, testData.supplierId);
  
  // Fill optional fields
  await page.fill(equipmentFormSelectors.featureField, testData.feature);
  await page.fill(equipmentFormSelectors.modelInfoField, testData.modelInfo);
  
  // Verify no errors before save
  let hasErrors = false;
  try {
    await page.locator(equipmentFormSelectors.manufacturerError).waitFor({ timeout: 1000 });
    hasErrors = true;
  } catch {}
  expect(hasErrors).toBe(false);
  
  // Save equipment
  await page.click(equipmentFormSelectors.saveButton);
  
  // Wait for successful navigation to list page
  await page.waitForURL('**/equipment**', { timeout: 5000 });
  
  // Verify list page loaded
  const listPageTitle = await page.locator('text="Equipment List"');
  await expect(listPageTitle).toBeVisible();
  
  console.log(`✓ Equipment created successfully: ${tpsId} / ${testData.supplierId}`);
  
  return {
    tpsId: tpsId,
    supplierId: testData.supplierId,
    manufacturer: testData.manufacturer,
    supplier: testData.supplier
  };
});
```

---

## UTILITY FUNCTIONS FOR REUSABILITY

```javascript
/**
 * Helper function to fill manufacturer field
 * Supports both new and existing manufacturers
 */
async function setManufacturer(page, manufacturerName) {
  await page.fill(equipmentFormSelectors.manufacturerField, manufacturerName);
  await page.waitForTimeout(300);
  
  // Check if new entry message appears
  const newEntryMsg = await page.isVisible(
    `text="New entry \\"${manufacturerName}\\" will be created on save."`
  );
  
  return { manufacturer: manufacturerName, isNew: newEntryMsg };
}

/**
 * Helper function to select supplier from dropdown
 */
async function selectSupplier(page, supplierSearchTerm, supplierOptionText) {
  await page.fill(equipmentFormSelectors.supplierField, supplierSearchTerm);
  await page.waitForTimeout(300);
  
  const option = await page.locator(`text="${supplierOptionText}"`).first();
  await expect(option).toBeVisible();
  await option.click();
  
  return supplierOptionText;
}

/**
 * Helper function to fill all mandatory fields
 */
async function fillMandatoryFields(page, data) {
  // Fill manufacturer
  if (data.manufacturer) {
    await page.fill(equipmentFormSelectors.manufacturerField, data.manufacturer);
    await page.waitForTimeout(300);
  }
  
  // Fill supplier
  if (data.supplier) {
    await page.fill(equipmentFormSelectors.supplierField, data.supplier.searchTerm);
    await page.waitForTimeout(300);
    if (data.supplier.optionText) {
      const option = await page.locator(`text="${data.supplier.optionText}"`).first();
      await option.click();
    }
  }
  
  // Fill supplier ID
  if (data.supplierId) {
    await page.fill(equipmentFormSelectors.supplierIdField, data.supplierId);
  }
  
  return {
    manufacturer: data.manufacturer,
    supplier: data.supplier?.optionText,
    supplierId: data.supplierId
  };
}

/**
 * Helper function to verify form saved successfully
 */
async function verifyFormSave(page, expectedPageUrl = '**/equipment**') {
  return page.waitForURL(expectedPageUrl, { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
}

/**
 * Helper function to get and verify validation errors
 */
async function getValidationErrors(page) {
  const errors = {
    manufacturer: await page.isVisible(equipmentFormSelectors.manufacturerError),
    supplier: await page.isVisible(equipmentFormSelectors.supplierError),
    supplierId: await page.isVisible(equipmentFormSelectors.supplierIdError)
  };
  return errors;
}
```

---

## TEST DATA FIXTURES

```javascript
// Test data sets for different scenarios
const testDataFixtures = {
  // Valid test data for happy path
  validEquipment: {
    manufacturer: 'ABB',
    supplier: { searchTerm: 'Supplier 1', optionText: 'SG SUPPLIER 1' },
    supplierId: 'TEST-' + Date.now(),
    feature: 'High Efficiency',
    modelInfo: 'Model XYZ-2024'
  },
  
  // Minimal data (only required fields)
  minimalEquipment: {
    manufacturer: 'MinimalMfg-' + Date.now(),
    supplier: { searchTerm: 'Supplier 1', optionText: 'SG SUPPLIER 1' },
    supplierId: 'MIN-' + Date.now()
  },
  
  // Data for optional fields testing
  withOptionalFields: {
    manufacturer: 'OptionalTestMfg',
    supplier: { searchTerm: 'Supplier 1', optionText: 'SG SUPPLIER 1' },
    supplierId: 'OPT-' + Date.now(),
    feature: 'Feature-' + Date.now(),
    modelInfo: 'Model-' + Date.now()
  },
  
  // Data with various manufacturer types
  manufacturerVariants: [
    { name: 'ABB', isNew: false },
    { name: 'Siemens', isNew: false },
    { name: 'NewMfg-' + Date.now(), isNew: true }
  ]
};
```

---

## DEBUGGING & TROUBLESHOOTING

```javascript
/**
 * Debug helper: Print all form field values
 */
async function debugFormState(page) {
  const state = {
    tpsId: await page.inputValue(equipmentFormSelectors.tpsIdField),
    status: await page.inputValue(equipmentFormSelectors.statusDropdown),
    category: await page.inputValue(equipmentFormSelectors.categoryDropdown),
    type: await page.inputValue(equipmentFormSelectors.typeDropdown),
    manufacturer: await page.inputValue(equipmentFormSelectors.manufacturerField),
    supplier: await page.inputValue(equipmentFormSelectors.supplierField),
    supplierId: await page.inputValue(equipmentFormSelectors.supplierIdField),
    feature: await page.inputValue(equipmentFormSelectors.featureField),
    modelInfo: await page.inputValue(equipmentFormSelectors.modelInfoField)
  };
  
  console.log('Current Form State:');
  console.log(JSON.stringify(state, null, 2));
  return state;
}

/**
 * Debug helper: Check visibility of all error messages
 */
async function debugValidationErrors(page) {
  const errors = {
    manufacturerError: await page.isVisible(equipmentFormSelectors.manufacturerError),
    supplierError: await page.isVisible(equipmentFormSelectors.supplierError),
    supplierIdError: await page.isVisible(equipmentFormSelectors.supplierIdError)
  };
  
  console.log('Validation Errors:');
  console.log(JSON.stringify(errors, null, 2));
  return errors;
}

/**
 * Debug helper: Screenshot current state
 */
async function takeDebugScreenshot(page, filename) {
  await page.screenshot({ 
    path: `./debug/${filename}-${Date.now()}.png`,
    fullPage: true 
  });
  console.log(`Screenshot saved: ${filename}-${Date.now()}.png`);
}
```

---

## RUNNING THE TESTS

```bash
# Install Playwright if not already installed
npm install -D @playwright/test

# Run all tests
npx playwright test

# Run specific test file
npx playwright test equipment-form.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright test --reporter=html
```

---

## KEY TAKEAWAYS FOR AUTOMATION

1. **Elements are properly identified** - All fields have unique selectors or can be identified by position
2. **Validation is reliable** - Mandatory fields consistently enforce requirements
3. **Dropdown options are static** - Pre-defined lists make testing predictable
4. **Search functionality works** - Supplier field successfully filters master list
5. **Form submission is clean** - No unexpected alerts or complex navigation
6. **Optional fields are truly optional** - Form saves without them
7. **Real-time binding** - Header updates with field data
8. **Error messages are clear** - Specific, actionable validation feedback

---

## NEXT STEPS

1. Create test suite using these snippets
2. Add data-driven testing with test data fixtures
3. Implement page object model for better maintenance
4. Add screenshot/diff testing for visual regression
5. Integrate with CI/CD pipeline
6. Write additional tests for remaining 10 tabs on the form
