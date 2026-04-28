# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\dropdown_tests\dropdown-functionality-tests.spec.ts >> Dropdown Functionality Tests >> TC-27: Verify Equipment Category Dropdown Displays All Options
- Location: tests\TPS_addEquipment_Flow\dropdown_tests\dropdown-functionality-tests.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select:nth-of-type(2)')

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
  4   | test.describe('Dropdown Functionality Tests', () => {
  5   |   let helpers: EquipmentFormHelpers;
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     helpers = new EquipmentFormHelpers(page);
  9   |     await helpers.login();
  10  |     await helpers.navigateToNewEquipment();
  11  |   });
  12  | 
  13  |   test('TC-27: Verify Equipment Category Dropdown Displays All Options', async ({ page }) => {
  14  |     const categoryDropdown = page.locator(SELECTORS.categoryDropdown);
  15  | 
  16  |     // Click to open dropdown
> 17  |     await categoryDropdown.click();
      |                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  18  | 
  19  |     // Wait for options to appear
  20  |     await page.waitForTimeout(500);
  21  | 
  22  |     // Verify all expected category options are present
  23  |     const expectedCategories = [
  24  |       'SELECT...',
  25  |       'ANALYTICAL',
  26  |       'FLOW MEASUREMENT',
  27  |       'PROCESS VALVES',
  28  |       'PUMPS',
  29  |       'TANKS',
  30  |       'UTILITY'
  31  |     ];
  32  | 
  33  |     for (const category of expectedCategories) {
  34  |       await expect(page.locator(`option:has-text("${category}")`)).toBeVisible();
  35  |     }
  36  | 
  37  |     // Verify total count (7 categories + 1 default = 8)
  38  |     const optionCount = await page.locator('option').count();
  39  |     expect(optionCount).toBe(8);
  40  |   });
  41  | 
  42  |   test('TC-28: Verify Equipment Type Dropdown Displays All Options', async ({ page }) => {
  43  |     const typeDropdown = page.locator(SELECTORS.typeDropdown);
  44  | 
  45  |     // Click to open dropdown
  46  |     await typeDropdown.click();
  47  | 
  48  |     // Wait for options to appear
  49  |     await page.waitForTimeout(500);
  50  | 
  51  |     // Verify all expected type options are present
  52  |     const expectedTypes = [
  53  |       'SELECT...',
  54  |       'ELEVATED',
  55  |       'HOSE',
  56  |       'INSTRUMENT',
  57  |       'PUMP',
  58  |       'SENSOR',
  59  |       'SPARE PART TC',
  60  |       'VALVE'
  61  |     ];
  62  | 
  63  |     for (const type of expectedTypes) {
  64  |       await expect(page.locator(`option:has-text("${type}")`)).toBeVisible();
  65  |     }
  66  | 
  67  |     // Verify total count (8 types + 1 default = 9)
  68  |     const optionCount = await page.locator('option').count();
  69  |     expect(optionCount).toBe(9);
  70  |   });
  71  | 
  72  |   test('TC-29: Verify Can Select from Equipment Category Dropdown', async ({ page }) => {
  73  |     const categoryDropdown = page.locator(SELECTORS.categoryDropdown);
  74  | 
  75  |     // Verify initial state is SELECT...
  76  |     await expect(categoryDropdown).toHaveValue('SELECT...');
  77  | 
  78  |     // Select PUMPS category
  79  |     await categoryDropdown.selectOption('PUMPS');
  80  | 
  81  |     // Verify selection
  82  |     await expect(categoryDropdown).toHaveValue('PUMPS');
  83  | 
  84  |     // Verify value persists
  85  |     const selectedValue = await categoryDropdown.inputValue();
  86  |     expect(selectedValue).toBe('PUMPS');
  87  | 
  88  |     // Fill mandatory fields and verify form can be saved with category selected
  89  |     await helpers.fillMandatoryFields(
  90  |       TEST_DATA.manufacturers.existing,
  91  |       TEST_DATA.suppliers.existing,
  92  |       TestDataGenerator.generateUniqueSupplierId('CAT1')
  93  |     );
  94  | 
  95  |     await expect(page.locator(SELECTORS.saveButton)).toBeEnabled();
  96  |   });
  97  | 
  98  |   test('TC-30: Verify Can Select from Equipment Type Dropdown', async ({ page }) => {
  99  |     const typeDropdown = page.locator(SELECTORS.typeDropdown);
  100 | 
  101 |     // Verify initial state is SELECT...
  102 |     await expect(typeDropdown).toHaveValue('SELECT...');
  103 | 
  104 |     // Select VALVE type
  105 |     await typeDropdown.selectOption('VALVE');
  106 | 
  107 |     // Verify selection
  108 |     await expect(typeDropdown).toHaveValue('VALVE');
  109 | 
  110 |     // Verify value persists
  111 |     const selectedValue = await typeDropdown.inputValue();
  112 |     expect(selectedValue).toBe('VALVE');
  113 | 
  114 |     // Fill mandatory fields and verify form can be saved with type selected
  115 |     await helpers.fillMandatoryFields(
  116 |       TEST_DATA.manufacturers.existing,
  117 |       TEST_DATA.suppliers.existing,
```