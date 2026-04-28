# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\happy_path_scenarios\happy-path-scenarios-tests.spec.ts >> Happy Path Scenarios >> TC-34: Equipment Creation with Minimal Required Data (Mandatory Fields Only)
- Location: tests\TPS_addEquipment_Flow\happy_path_scenarios\happy-path-scenarios-tests.spec.ts:79:7

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
  31  |   manufacturerField: 'input[placeholder="Type to search or add new..."]:nth-of-type(1)',
  32  |   supplierField: 'input[placeholder="Type to search or add new..."]:nth-of-type(2)',
  33  |   supplierIdField: 'input[placeholder="V-1001-A"]',
  34  |   featureField: 'input:nth-of-type(4)',
  35  |   modelInfoField: 'input:nth-of-type(5)',
  36  | 
  37  |   // Buttons
  38  |   saveButton: 'button:has-text("Save Equipment")',
  39  |   cancelButton: 'button:has-text("Cancel")',
  40  |   newEquipmentButton: 'button:has-text("New Equipment")',
  41  | 
  42  |   // Error messages
  43  |   manufacturerError: 'text="Manufacturer is required."',
  44  |   supplierError: 'text="Supplier is required."',
  45  |   supplierIdError: 'text="Supplier Identification Number is required."',
  46  | 
  47  |   // Navigation
  48  |   equipmentModule: 'text="Equipment"',
  49  |   backButton: 'button[aria-label="Back"]',
  50  | 
  51  |   // Page elements
  52  |   pageHeader: 'h1, h2, h3, h4, h5, h6',
  53  |   equipmentList: 'text="Global Equipment Data"'
  54  | };
  55  | 
  56  | // Test data fixtures
  57  | export const TEST_DATA = {
  58  |   manufacturers: {
  59  |     existing: 'ABB',
  60  |     new: 'TestManufacturer2026'
  61  |   },
  62  |   suppliers: {
  63  |     existing: 'SG SUPPLIER 1',
  64  |     new: 'TestSupplier2026'
  65  |   },
  66  |   supplierIds: {
  67  |     valid: 'TEST-001',
  68  |     duplicate: 'TEST-001', // Same as valid for duplicate testing
  69  |     unique: 'TEST-002'
  70  |   },
  71  |   features: {
  72  |     valid: 'High Efficiency',
  73  |     empty: ''
  74  |   },
  75  |   modelInfo: {
  76  |     valid: 'Model XYZ-2024',
  77  |     empty: ''
  78  |   },
  79  |   categories: {
  80  |     pumps: 'PUMPS',
  81  |     analytical: 'ANALYTICAL',
  82  |     valves: 'PROCESS VALVES'
  83  |   },
  84  |   types: {
  85  |     pump: 'PUMP',
  86  |     valve: 'VALVE',
  87  |     sensor: 'SENSOR'
  88  |   },
  89  |   statuses: {
  90  |     active: 'ACTIVE',
  91  |     obsolete: 'OBSOLETE'
  92  |   }
  93  | };
  94  | 
  95  | // Common helper functions
  96  | export class EquipmentFormHelpers {
  97  | 
  98  |   constructor(private page: Page) {}
  99  | 
  100 |   /**
  101 |    * Login to the application
  102 |    */
  103 |   async login() {
  104 |     await this.page.goto(TEST_CONFIG.loginUrl);
  105 |     await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
  106 |     await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
  107 |     await this.page.click(SELECTORS.loginButton);
  108 |     await this.page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.timeouts.navigation });
  109 | 
  110 |     // After login, navigate to equipment page
  111 |     await this.page.goto(TEST_CONFIG.equipmentUrl);
  112 |     await this.page.waitForLoadState('networkidle');
  113 |   }
  114 | 
  115 |   /**
  116 |    * Navigate to New Equipment form
  117 |    */
  118 |   async navigateToNewEquipment() {
  119 |     await this.page.goto(TEST_CONFIG.equipmentUrl);
  120 |     await this.page.click(SELECTORS.newEquipmentButton);
  121 |     await this.page.waitForLoadState('networkidle');
  122 |   }
  123 | 
  124 |   /**
  125 |    * Fill mandatory fields only
  126 |    */
  127 |   async fillMandatoryFields(manufacturer = TEST_DATA.manufacturers.existing,
  128 |                            supplier = TEST_DATA.suppliers.existing,
  129 |                            supplierId = TEST_DATA.supplierIds.valid) {
  130 |     await this.page.fill(SELECTORS.manufacturerField, manufacturer);
> 131 |     await this.page.fill(SELECTORS.supplierField, supplier);
      |                     ^ Error: page.fill: Test timeout of 30000ms exceeded.
  132 |     await this.page.fill(SELECTORS.supplierIdField, supplierId);
  133 |   }
  134 | 
  135 |   /**
  136 |    * Fill all fields including optional ones
  137 |    */
  138 |   async fillAllFields(data: {
  139 |     manufacturer?: string;
  140 |     supplier?: string;
  141 |     supplierId?: string;
  142 |     category?: string;
  143 |     type?: string;
  144 |     feature?: string;
  145 |     modelInfo?: string;
  146 |     status?: string;
  147 |   } = {}) {
  148 |     const defaults = {
  149 |       manufacturer: TEST_DATA.manufacturers.existing,
  150 |       supplier: TEST_DATA.suppliers.existing,
  151 |       supplierId: TEST_DATA.supplierIds.valid,
  152 |       category: TEST_DATA.categories.pumps,
  153 |       type: TEST_DATA.types.pump,
  154 |       feature: TEST_DATA.features.valid,
  155 |       modelInfo: TEST_DATA.modelInfo.valid,
  156 |       status: TEST_DATA.statuses.active
  157 |     };
  158 | 
  159 |     const finalData = { ...defaults, ...data };
  160 | 
  161 |     // Fill mandatory fields
  162 |     await this.fillMandatoryFields(finalData.manufacturer, finalData.supplier, finalData.supplierId);
  163 | 
  164 |     // Fill optional fields
  165 |     if (finalData.category) {
  166 |       await this.page.selectOption(SELECTORS.categoryDropdown, finalData.category);
  167 |     }
  168 |     if (finalData.type) {
  169 |       await this.page.selectOption(SELECTORS.typeDropdown, finalData.type);
  170 |     }
  171 |     if (finalData.feature) {
  172 |       await this.page.fill(SELECTORS.featureField, finalData.feature);
  173 |     }
  174 |     if (finalData.modelInfo) {
  175 |       await this.page.fill(SELECTORS.modelInfoField, finalData.modelInfo);
  176 |     }
  177 |     if (finalData.status) {
  178 |       await this.page.selectOption(SELECTORS.statusDropdown, finalData.status);
  179 |     }
  180 |   }
  181 | 
  182 |   /**
  183 |    * Save the equipment form
  184 |    */
  185 |   async saveEquipment() {
  186 |     await this.page.click(SELECTORS.saveButton);
  187 |     await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.save });
  188 |   }
  189 | 
  190 |   /**
  191 |    * Cancel the equipment form
  192 |    */
  193 |   async cancelEquipment() {
  194 |     await this.page.click(SELECTORS.cancelButton);
  195 |     await this.page.waitForLoadState('networkidle');
  196 |   }
  197 | 
  198 |   /**
  199 |    * Get current TPS ID value
  200 |    */
  201 |   async getCurrentTpsId(): Promise<string> {
  202 |     return await this.page.inputValue(SELECTORS.tpsIdField);
  203 |   }
  204 | 
  205 |   /**
  206 |    * Wait for validation errors to appear
  207 |    */
  208 |   async waitForValidationErrors() {
  209 |     await this.page.waitForTimeout(1000); // Allow time for validation to trigger
  210 |   }
  211 | 
  212 |   /**
  213 |    * Check if validation error is visible for a field
  214 |    */
  215 |   async isValidationErrorVisible(errorSelector: string): Promise<boolean> {
  216 |     try {
  217 |       await this.page.waitForSelector(errorSelector, { timeout: 2000 });
  218 |       return true;
  219 |     } catch {
  220 |       return false;
  221 |     }
  222 |   }
  223 | 
  224 |   /**
  225 |    * Take screenshot on failure
  226 |    */
  227 |   async takeScreenshotOnFailure(testName: string) {
  228 |     await this.page.screenshot({ path: `test-results/screenshots/${testName}-failure.png`, fullPage: true });
  229 |   }
  230 | }
  231 | 
```