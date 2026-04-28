# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TPS_addEquipment_Flow\optional_fields_tests\optional-fields-tests.spec.ts >> Optional Fields Tests >> TC-26: Verify Both Optional Fields Can Be Left Empty and Form Still Saves
- Location: tests\TPS_addEquipment_Flow\optional_fields_tests\optional-fields-tests.spec.ts:71:7

# Error details

```
Error: page.waitForLoadState: Navigation failed because page crashed!
```

# Test source

```ts
  12  |   timeouts: {
  13  |     navigation: 10000,
  14  |     element: 5000,
  15  |     save: 15000
  16  |   }
  17  | };
  18  | 
  19  | // Element selectors based on exploratory testing
  20  | export const SELECTORS = {
  21  |   // Login page
  22  |   emailInput: 'input[type="email"]',
  23  |   passwordInput: 'input[type="password"]',
  24  |   loginButton: 'button:has-text("Continue to Verification")',
  25  | 
  26  |   // Equipment form fields
  27  |   tpsIdField: '[aria-label="Auto-generated"]',
  28  |   statusDropdown: 'select:nth-of-type(1)',
  29  |   categoryDropdown: 'select:nth-of-type(2)',
  30  |   typeDropdown: 'select:nth-of-type(3)',
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
> 112 |     await this.page.waitForLoadState('networkidle');
      |                     ^ Error: page.waitForLoadState: Navigation failed because page crashed!
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
  131 |     await this.page.fill(SELECTORS.supplierField, supplier);
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
```