# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\manufacturer_tests\manufacturer-field-tests.spec.ts >> Manufacturer Field Tests >> TC-14: Verify Can Search and Select Existing Manufacturer from Dropdown
- Location: tests\TPS_addEquipment_Flow\manufacturer_tests\manufacturer-field-tests.spec.ts:13:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('input[placeholder="Type to search or add new..."]:nth-of-type(1)') resolved to 2 elements:
    1) <input value="" type="text" placeholder="Type to search or add new..." class="w-full px-3 py-2 bg-white text-black border rounded-lg focus:outline-none focus:ring-2 shadow-sm text-sm uppercase disabled:bg-slate-100 disabled:text-slate-500 border-slate-300 focus:ring-blue-500"/> aka getByRole('textbox', { name: 'Type to search or add new...' }).first()
    2) <input value="" type="text" placeholder="Type to search or add new..." class="w-full px-3 py-2 bg-white text-black border rounded-lg focus:outline-none focus:ring-2 shadow-sm text-sm uppercase disabled:bg-slate-100 disabled:text-slate-500 border-slate-300 focus:ring-blue-500"/> aka getByRole('textbox', { name: 'Type to search or add new...' }).nth(1)

Call log:
  - waiting for locator('input[placeholder="Type to search or add new..."]:nth-of-type(1)')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - img "TPS" [ref=e7]
      - generic [ref=e8]:
        - button "Dashboard" [ref=e9] [cursor=pointer]:
          - img [ref=e10]
          - text: Dashboard
        - button "Global Search" [ref=e15] [cursor=pointer]:
          - img [ref=e16]
          - text: Global Search
        - generic [ref=e19]: Master Data
        - button "Equipment" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
          - text: Equipment
        - button "Spare Part" [ref=e25] [cursor=pointer]:
          - img [ref=e26]
          - text: Spare Part
        - button "Document" [ref=e28] [cursor=pointer]:
          - img [ref=e29]
          - text: Document
        - button "Tag" [ref=e31] [cursor=pointer]:
          - img [ref=e32]
          - text: Tag
        - button "Pricing Rules" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
          - text: Pricing Rules
        - generic [ref=e38]: Management
        - button "Clients" [ref=e39] [cursor=pointer]:
          - img [ref=e40]
          - text: Clients
        - button "Projects" [ref=e45] [cursor=pointer]:
          - img [ref=e46]
          - text: Projects
        - generic [ref=e49]: Admin
        - button "Users" [ref=e50] [cursor=pointer]:
          - img [ref=e51]
          - text: Users
        - button "Audit Log" [ref=e54] [cursor=pointer]:
          - img [ref=e55]
          - text: Audit Log
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]: SO
          - generic [ref=e60]:
            - paragraph [ref=e61]: somveer gurjar
            - paragraph [ref=e62]: Super Admin
        - button "Sign Out" [ref=e63] [cursor=pointer]:
          - img [ref=e64]
          - text: Sign Out
  - generic [ref=e67]:
    - banner [ref=e68]:
      - generic [ref=e69]:
        - heading "equipment" [level=1] [ref=e70]
        - generic [ref=e73]: Sunday, April 12, 2026
    - main [ref=e74]:
      - generic [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e79]:
            - button [ref=e80] [cursor=pointer]:
              - img [ref=e81]
            - generic [ref=e83]:
              - heading "New Equipment Record" [level=1] [ref=e84]
              - generic [ref=e85]:
                - generic [ref=e86]: E11038
                - generic [ref=e87]: •
                - generic [ref=e88]: NEW
          - generic [ref=e89]:
            - button "Equipment Identification" [ref=e90] [cursor=pointer]:
              - img [ref=e91]
              - text: Equipment Identification
            - button "Performance" [ref=e95] [cursor=pointer]:
              - img [ref=e96]
              - text: Performance
            - button "Mechanical" [ref=e98] [cursor=pointer]:
              - img [ref=e99]
              - text: Mechanical
            - button "Automation / Control" [ref=e101] [cursor=pointer]:
              - img [ref=e102]
              - text: Automation / Control
            - button "Electrical Protection" [ref=e105] [cursor=pointer]:
              - img [ref=e106]
              - text: Electrical Protection
            - button "Motor Data" [ref=e108] [cursor=pointer]:
              - img [ref=e109]
              - text: Motor Data
            - button "Rotating Equipment" [ref=e111] [cursor=pointer]:
              - img [ref=e112]
              - text: Rotating Equipment
            - button "Gearbox Data" [ref=e115] [cursor=pointer]:
              - img [ref=e116]
              - text: Gearbox Data
            - button "Commercial" [ref=e127] [cursor=pointer]:
              - img [ref=e128]
              - text: Commercial
            - button "Spare Parts Linking" [ref=e133] [cursor=pointer]:
              - img [ref=e134]
              - text: Spare Parts Linking
            - button "Documents Linking" [ref=e137] [cursor=pointer]:
              - img [ref=e138]
              - text: Documents Linking
        - generic [ref=e143]:
          - heading "1. Equipment Identification" [level=3] [ref=e144]
          - generic [ref=e145]:
            - generic [ref=e147]:
              - generic [ref=e148]: TPS ID
              - textbox "Auto-generated" [disabled] [ref=e149]: E11038
            - generic [ref=e150]:
              - generic [ref=e151]: Status
              - generic [ref=e152]:
                - combobox [ref=e153]:
                  - option "SELECT..."
                  - option "ACTIVE" [selected]
                  - option "OBSOLETE"
                - img
            - generic [ref=e154]:
              - generic [ref=e155]: Equipment Category
              - generic [ref=e156]:
                - combobox [ref=e157]:
                  - option "SELECT..." [selected]
                  - option "ANALYTICAL"
                  - option "FLOW MEASUREMENT"
                  - option "PROCESS VALVES"
                  - option "PUMPS"
                  - option "TANKS"
                  - option "UTILITY"
                - img
            - generic [ref=e158]:
              - generic [ref=e159]: Equipment Type
              - generic [ref=e160]:
                - combobox [ref=e161]:
                  - option "SELECT..." [selected]
                  - option "ELEVATED"
                  - option "HOSE"
                  - option "INSTRUMENT"
                  - option "PUMP"
                  - option "SENSOR"
                  - option "SPARE PART TC"
                  - option "VALVE"
                - img
            - generic [ref=e162]:
              - generic [ref=e163]: Manufacturer *
              - generic [ref=e164]:
                - textbox "Type to search or add new..." [ref=e165]
                - img
              - paragraph [ref=e166]: Select from master or type to add a new manufacturer.
            - generic [ref=e167]:
              - generic [ref=e168]: Supplier / Vendor *
              - generic [ref=e169]:
                - textbox "Type to search or add new..." [ref=e170]
                - img
              - paragraph [ref=e171]: Select from master or type to add a new supplier.
            - generic [ref=e172]:
              - generic [ref=e173]: Supplier Identification Number *
              - textbox "V-1001-A" [ref=e174]
              - paragraph [ref=e175]: Unique identifier. Cannot be changed after creation.
            - generic [ref=e176]:
              - generic [ref=e177]: Feature
              - textbox [ref=e178]
            - generic [ref=e180]:
              - generic [ref=e181]: Model Information
              - textbox [ref=e182]
        - generic [ref=e184]:
          - button "Cancel" [ref=e185] [cursor=pointer]
          - button "Save Equipment" [ref=e186] [cursor=pointer]:
            - img [ref=e187]
            - text: Save Equipment
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';
  3   | 
  4   | test.describe('Manufacturer Field Tests', () => {
  5   |   let helpers: EquipmentFormHelpers;
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     helpers = new EquipmentFormHelpers(page);
  9   |     await helpers.login();
  10  |     await helpers.navigateToNewEquipment();
  11  |   });
  12  | 
  13  |   test('TC-14: Verify Can Search and Select Existing Manufacturer from Dropdown', async ({ page }) => {
  14  |     const manufacturerField = page.locator(SELECTORS.manufacturerField);
  15  | 
  16  |     // Click on manufacturer field to activate it
> 17  |     await manufacturerField.click();
      |                             ^ Error: locator.click: Error: strict mode violation: locator('input[placeholder="Type to search or add new..."]:nth-of-type(1)') resolved to 2 elements:
  18  | 
  19  |     // Type partial manufacturer name
  20  |     await manufacturerField.fill('ABB');
  21  | 
  22  |     // Wait for dropdown/search results
  23  |     await page.waitForTimeout(1000);
  24  | 
  25  |     // Check if dropdown appears with matching results
  26  |     // Note: Based on exploratory testing, ABB may show as new entry, but we'll test the interaction
  27  |     const dropdownOptions = page.locator('text="ABB"');
  28  |     const optionCount = await dropdownOptions.count();
  29  | 
  30  |     if (optionCount > 0) {
  31  |       // If existing manufacturer found, select it
  32  |       await dropdownOptions.first().click();
  33  |       const selectedValue = await manufacturerField.inputValue();
  34  |       expect(selectedValue).toBe('ABB');
  35  |     } else {
  36  |       // If not found, verify field accepts the input
  37  |       const currentValue = await manufacturerField.inputValue();
  38  |       expect(currentValue).toBe('ABB');
  39  |     }
  40  | 
  41  |     // Verify field retains the value
  42  |     const finalValue = await manufacturerField.inputValue();
  43  |     expect(finalValue).toBe('ABB');
  44  | 
  45  |     // Fill other mandatory fields to test complete flow
  46  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  47  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MFG1'));
  48  | 
  49  |     // Verify save is possible
  50  |     await expect(page.locator(SELECTORS.saveButton)).toBeEnabled();
  51  |   });
  52  | 
  53  |   test('TC-15: Verify Can Add New Manufacturer Entry', async ({ page }) => {
  54  |     const manufacturerField = page.locator(SELECTORS.manufacturerField);
  55  |     const newManufacturerName = TestDataGenerator.generateUniqueManufacturer('NewMfg');
  56  | 
  57  |     // Click on manufacturer field
  58  |     await manufacturerField.click();
  59  | 
  60  |     // Type new manufacturer name
  61  |     await manufacturerField.fill(newManufacturerName);
  62  | 
  63  |     // Wait for system to recognize as new entry
  64  |     await page.waitForTimeout(1000);
  65  | 
  66  |     // Based on exploratory testing, system should show "New entry will be created" message
  67  |     // Check if the field retains the value
  68  |     const currentValue = await manufacturerField.inputValue();
  69  |     expect(currentValue).toBe(newManufacturerName);
  70  | 
  71  |     // Fill other mandatory fields
  72  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  73  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MFG2'));
  74  | 
  75  |     // Attempt to save - this should work with new manufacturer
  76  |     await helpers.saveEquipment();
  77  | 
  78  |     // Verify successful save (navigated away from form)
  79  |     await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.save });
  80  |     await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  81  |   });
  82  | 
  83  |   test('TC-16: Verify Manufacturer Field Is Mandatory', async ({ page }) => {
  84  |     // Check field label has asterisk
  85  |     const manufacturerLabel = page.locator('label:has-text("Manufacturer")');
  86  |     await expect(manufacturerLabel).toContainText('*');
  87  | 
  88  |     // Check help text is present
  89  |     const helpText = page.locator('text="Select from master or type to add a new manufacturer."');
  90  |     await expect(helpText).toBeVisible();
  91  | 
  92  |     // Verify field is empty by default
  93  |     const manufacturerField = page.locator(SELECTORS.manufacturerField);
  94  |     const defaultValue = await manufacturerField.inputValue();
  95  |     expect(defaultValue).toBe('');
  96  | 
  97  |     // Attempt to save without filling manufacturer (should fail)
  98  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  99  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MFG3'));
  100 | 
  101 |     await helpers.saveEquipment();
  102 | 
  103 |     // Wait for validation
  104 |     await helpers.waitForValidationErrors();
  105 | 
  106 |     // Verify error message appears
  107 |     const isErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
  108 |     expect(isErrorVisible).toBe(true);
  109 | 
  110 |     // Verify form was not submitted
  111 |     await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  112 |   });
  113 | });
```