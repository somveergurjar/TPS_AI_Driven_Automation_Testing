# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\mandatory_field_validation\mandatory-field-validation-tests.spec.ts >> Mandatory Field Validation Tests >> TC-11: Verify Error When Supplier ID Field Is Empty During Save
- Location: tests\TPS_addEquipment_Flow\mandatory_field_validation\mandatory-field-validation-tests.spec.ts:56:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Type to search or add new..."]:nth-of-type(2)')

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
                - textbox "Type to search or add new..." [active] [ref=e165]: ABB
                - img
              - generic [ref=e168] [cursor=pointer]: ABB
              - paragraph [ref=e169]: Select from master or type to add a new manufacturer.
            - generic [ref=e170]:
              - generic [ref=e171]: Supplier / Vendor *
              - generic [ref=e172]:
                - textbox "Type to search or add new..." [ref=e173]
                - img
              - paragraph [ref=e174]: Select from master or type to add a new supplier.
            - generic [ref=e175]:
              - generic [ref=e176]: Supplier Identification Number *
              - textbox "V-1001-A" [ref=e177]
              - paragraph [ref=e178]: Unique identifier. Cannot be changed after creation.
            - generic [ref=e179]:
              - generic [ref=e180]: Feature
              - textbox [ref=e181]
            - generic [ref=e183]:
              - generic [ref=e184]: Model Information
              - textbox [ref=e185]
        - generic [ref=e187]:
          - button "Cancel" [ref=e188] [cursor=pointer]
          - button "Save Equipment" [ref=e189] [cursor=pointer]:
            - img [ref=e190]
            - text: Save Equipment
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers, TestDataGenerator } from '../setup';
  3   | 
  4   | test.describe('Mandatory Field Validation Tests', () => {
  5   |   let helpers: EquipmentFormHelpers;
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     helpers = new EquipmentFormHelpers(page);
  9   |     await helpers.login();
  10  |     await helpers.navigateToNewEquipment();
  11  |   });
  12  | 
  13  |   test('TC-9: Verify Error When Manufacturer Field Is Empty During Save', async ({ page }) => {
  14  |     // Fill Supplier and Supplier ID but leave Manufacturer empty
  15  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  16  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MAND1'));
  17  | 
  18  |     // Attempt to save
  19  |     await helpers.saveEquipment();
  20  | 
  21  |     // Wait for validation errors
  22  |     await helpers.waitForValidationErrors();
  23  | 
  24  |     // Verify manufacturer error is displayed
  25  |     const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
  26  |     expect(isManufacturerErrorVisible).toBe(true);
  27  | 
  28  |     // Verify manufacturer field is highlighted (check for error styling)
  29  |     const manufacturerField = page.locator(SELECTORS.manufacturerField);
  30  |     const hasErrorClass = await manufacturerField.evaluate(el => el.classList.contains('error') || el.classList.contains('invalid'));
  31  |     // Note: Actual error styling may vary, this checks for common error classes
  32  | 
  33  |     // Verify form was not submitted (still on same page)
  34  |     await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  35  |   });
  36  | 
  37  |   test('TC-10: Verify Error When Supplier/Vendor Field Is Empty During Save', async ({ page }) => {
  38  |     // Fill Manufacturer and Supplier ID but leave Supplier empty
  39  |     await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
  40  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('MAND2'));
  41  | 
  42  |     // Attempt to save
  43  |     await helpers.saveEquipment();
  44  | 
  45  |     // Wait for validation errors
  46  |     await helpers.waitForValidationErrors();
  47  | 
  48  |     // Verify supplier error is displayed
  49  |     const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
  50  |     expect(isSupplierErrorVisible).toBe(true);
  51  | 
  52  |     // Verify form was not submitted
  53  |     await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  54  |   });
  55  | 
  56  |   test('TC-11: Verify Error When Supplier ID Field Is Empty During Save', async ({ page }) => {
  57  |     // Fill Manufacturer and Supplier but leave Supplier ID empty
  58  |     await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
> 59  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  60  | 
  61  |     // Attempt to save
  62  |     await helpers.saveEquipment();
  63  | 
  64  |     // Wait for validation errors
  65  |     await helpers.waitForValidationErrors();
  66  | 
  67  |     // Verify supplier ID error is displayed
  68  |     const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);
  69  |     expect(isSupplierIdErrorVisible).toBe(true);
  70  | 
  71  |     // Verify form was not submitted
  72  |     await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  73  |   });
  74  | 
  75  |   test('TC-12: Verify Red Border Appears on All Empty Mandatory Fields', async ({ page }) => {
  76  |     // Leave all mandatory fields empty
  77  |     // Attempt to save
  78  |     await helpers.saveEquipment();
  79  | 
  80  |     // Wait for validation errors
  81  |     await helpers.waitForValidationErrors();
  82  | 
  83  |     // Verify all three mandatory field errors are displayed
  84  |     const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
  85  |     const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
  86  |     const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);
  87  | 
  88  |     expect(isManufacturerErrorVisible).toBe(true);
  89  |     expect(isSupplierErrorVisible).toBe(true);
  90  |     expect(isSupplierIdErrorVisible).toBe(true);
  91  | 
  92  |     // Verify form was not submitted and all fields are still empty
  93  |     const manufacturerValue = await page.inputValue(SELECTORS.manufacturerField);
  94  |     const supplierValue = await page.inputValue(SELECTORS.supplierField);
  95  |     const supplierIdValue = await page.inputValue(SELECTORS.supplierIdField);
  96  | 
  97  |     expect(manufacturerValue).toBe('');
  98  |     expect(supplierValue).toBe('');
  99  |     expect(supplierIdValue).toBe('');
  100 |   });
  101 | 
  102 |   test('TC-13: Verify Save Is Prevented When Mandatory Fields Are Empty', async ({ page }) => {
  103 |     // Leave all mandatory fields empty
  104 |     // Attempt to save
  105 |     await helpers.saveEquipment();
  106 | 
  107 |     // Wait for validation errors
  108 |     await helpers.waitForValidationErrors();
  109 | 
  110 |     // Verify form is still visible (not redirected)
  111 |     await expect(page.locator(SELECTORS.saveButton)).toBeVisible();
  112 |     await expect(page.locator(SELECTORS.cancelButton)).toBeVisible();
  113 | 
  114 |     // Verify we're still on the equipment form page
  115 |     const currentUrl = page.url();
  116 |     expect(currentUrl).toContain('/equipment');
  117 | 
  118 |     // Verify no equipment was created by checking if we're still on form
  119 |     const tpsIdField = page.locator(SELECTORS.tpsIdField);
  120 |     await expect(tpsIdField).toBeVisible();
  121 | 
  122 |     // Verify all error messages are displayed
  123 |     const isManufacturerErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.manufacturerError);
  124 |     const isSupplierErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierError);
  125 |     const isSupplierIdErrorVisible = await helpers.isValidationErrorVisible(SELECTORS.supplierIdError);
  126 | 
  127 |     expect(isManufacturerErrorVisible).toBe(true);
  128 |     expect(isSupplierErrorVisible).toBe(true);
  129 |     expect(isSupplierIdErrorVisible).toBe(true);
  130 |   });
  131 | });
```