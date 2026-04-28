# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\navigation_tests\navigation-error-recovery-tests.spec.ts >> Navigation & Error Recovery Tests >> TC-37: Tab Navigation Preserves Entered Data
- Location: tests\TPS_addEquipment_Flow\navigation_tests\navigation-error-recovery-tests.spec.ts:42:7

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
  4   | test.describe('Navigation & Error Recovery Tests', () => {
  5   |   let helpers: EquipmentFormHelpers;
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     helpers = new EquipmentFormHelpers(page);
  9   |     await helpers.login();
  10  |     await helpers.navigateToNewEquipment();
  11  |   });
  12  | 
  13  |   test('TC-36: Cancel Button Discards Form Without Saving', async ({ page }) => {
  14  |     // Fill some fields with test data
  15  |     await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
  16  |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  17  |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('CANCEL'));
  18  |     await page.fill(SELECTORS.featureField, 'Test Feature for Cancel');
  19  | 
  20  |     // Verify fields are filled
  21  |     await expect(page.locator(SELECTORS.manufacturerField)).not.toHaveValue('');
  22  |     await expect(page.locator(SELECTORS.supplierField)).not.toHaveValue('');
  23  |     await expect(page.locator(SELECTORS.supplierIdField)).not.toHaveValue('');
  24  |     await expect(page.locator(SELECTORS.featureField)).not.toHaveValue('');
  25  | 
  26  |     // Click cancel button
  27  |     await helpers.cancelEquipment();
  28  | 
  29  |     // Verify navigation back to equipment list
  30  |     await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.navigation });
  31  |     await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  32  | 
  33  |     // Verify the equipment was NOT created (by checking we're back at the list without the new record)
  34  |     // Since we can't easily verify the exact count, we verify we're on the equipment list page
  35  |     const currentUrl = page.url();
  36  |     expect(currentUrl).toContain('/equipment');
  37  | 
  38  |     // Verify no confirmation dialog appeared (or if it did, it was handled)
  39  |     // The test passes if we successfully navigate back
  40  |   });
  41  | 
  42  |   test('TC-37: Tab Navigation Preserves Entered Data', async ({ page }) => {
  43  |     // Fill fields on Equipment Identification tab
  44  |     const testManufacturer = TEST_DATA.manufacturers.existing;
  45  |     const testSupplier = TEST_DATA.suppliers.existing;
  46  |     const testSupplierId = TestDataGenerator.generateUniqueSupplierId('TAB');
  47  |     const testFeature = 'Tab Navigation Test Feature';
  48  | 
  49  |     await page.fill(SELECTORS.manufacturerField, testManufacturer);
> 50  |     await page.fill(SELECTORS.supplierField, testSupplier);
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  51  |     await page.fill(SELECTORS.supplierIdField, testSupplierId);
  52  |     await page.fill(SELECTORS.featureField, testFeature);
  53  | 
  54  |     // Verify data is entered
  55  |     await expect(page.locator(SELECTORS.manufacturerField)).toHaveValue(testManufacturer);
  56  |     await expect(page.locator(SELECTORS.supplierField)).toHaveValue(testSupplier);
  57  |     await expect(page.locator(SELECTORS.supplierIdField)).toHaveValue(testSupplierId);
  58  |     await expect(page.locator(SELECTORS.featureField)).toHaveValue(testFeature);
  59  | 
  60  |     // Click on Performance tab (if available)
  61  |     const performanceTab = page.locator('text="Performance"');
  62  |     if (await performanceTab.isVisible()) {
  63  |       await performanceTab.click();
  64  | 
  65  |       // Wait for Performance tab to load
  66  |       await page.waitForLoadState('networkidle');
  67  | 
  68  |       // Return to Equipment Identification tab
  69  |       const equipmentTab = page.locator('text="Equipment Identification"');
  70  |       await equipmentTab.click();
  71  | 
  72  |       // Wait for tab to load
  73  |       await page.waitForLoadState('networkidle');
  74  | 
  75  |       // Verify all entered data is preserved
  76  |       await expect(page.locator(SELECTORS.manufacturerField)).toHaveValue(testManufacturer);
  77  |       await expect(page.locator(SELECTORS.supplierField)).toHaveValue(testSupplier);
  78  |       await expect(page.locator(SELECTORS.supplierIdField)).toHaveValue(testSupplierId);
  79  |       await expect(page.locator(SELECTORS.featureField)).toHaveValue(testFeature);
  80  | 
  81  |       // Verify TPS ID is still the same
  82  |       const tpsIdAfterTabSwitch = await helpers.getCurrentTpsId();
  83  |       expect(tpsIdAfterTabSwitch).toMatch(/^E\d{5}$/);
  84  |     } else {
  85  |       // If Performance tab is not available, skip this part but still verify data persistence
  86  |       console.log('Performance tab not available, verifying data persistence on current tab');
  87  | 
  88  |       // Re-check data after a short wait
  89  |       await page.waitForTimeout(1000);
  90  |       await expect(page.locator(SELECTORS.manufacturerField)).toHaveValue(testManufacturer);
  91  |       await expect(page.locator(SELECTORS.supplierField)).toHaveValue(testSupplier);
  92  |       await expect(page.locator(SELECTORS.supplierIdField)).toHaveValue(testSupplierId);
  93  |       await expect(page.locator(SELECTORS.featureField)).toHaveValue(testFeature);
  94  |     }
  95  |   });
  96  | 
  97  |   test('TC-38: Back Button Navigation to Equipment List', async ({ page }) => {
  98  |     // Fill some test data
  99  |     await page.fill(SELECTORS.manufacturerField, TEST_DATA.manufacturers.existing);
  100 |     await page.fill(SELECTORS.supplierField, TEST_DATA.suppliers.existing);
  101 |     await page.fill(SELECTORS.supplierIdField, TestDataGenerator.generateUniqueSupplierId('BACK'));
  102 | 
  103 |     // Click back button (arrow in top-left)
  104 |     const backButton = page.locator(SELECTORS.backButton);
  105 |     if (await backButton.isVisible()) {
  106 |       await backButton.click();
  107 | 
  108 |       // Verify navigation to equipment list
  109 |       await page.waitForURL('**/equipment**', { timeout: TEST_CONFIG.timeouts.navigation });
  110 |       await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  111 | 
  112 |       // Verify we're on the equipment list page
  113 |       const currentUrl = page.url();
  114 |       expect(currentUrl).toContain('/equipment');
  115 |     } else {
  116 |       // If back button is not found, try alternative navigation
  117 |       console.log('Back button not found, using alternative navigation');
  118 | 
  119 |       // Navigate directly to equipment URL
  120 |       await page.goto(TEST_CONFIG.equipmentUrl);
  121 |       await expect(page.locator(SELECTORS.equipmentList)).toBeVisible();
  122 |     }
  123 |   });
  124 | });
```