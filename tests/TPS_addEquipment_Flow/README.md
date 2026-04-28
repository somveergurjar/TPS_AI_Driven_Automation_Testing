# TPS Add Equipment Flow - Playwright Test Suite

This test suite contains comprehensive automated tests for the SCRUM-101 Add Equipment workflow in the TPS Live Access application.

## Test Structure

```
tests/TPS_addEquipment_Flow/
├── setup.ts                           # Common configuration, selectors, and helper functions
├── ui_validation/                     # UI validation tests (5 tests)
├── tps_id_generation/                 # TPS ID auto-generation tests (3 tests)
├── mandatory_field_validation/        # Mandatory field validation tests (5 tests)
├── manufacturer_tests/                # Manufacturer field functionality (3 tests)
├── supplier_tests/                    # Supplier field functionality (3 tests)
├── supplier_id_tests/                 # Supplier ID validation (4 tests)
├── optional_fields_tests/             # Optional fields handling (3 tests)
├── dropdown_tests/                    # Dropdown functionality (5 tests)
├── happy_path_scenarios/              # Happy path test scenarios (4 tests)
└── navigation_tests/                  # Navigation and error recovery (3 tests)
```

## Test Coverage

**Total Test Cases: 38** (matching the test plan)

| Category | Tests | Description |
|----------|-------|-------------|
| UI Validation | 5 | Form structure, field presence, layout |
| TPS ID Generation | 3 | Auto-generation, uniqueness, immutability |
| Mandatory Validation | 5 | Required field enforcement |
| Manufacturer Tests | 3 | Search, selection, new entry creation |
| Supplier Tests | 3 | Search, selection, new entry creation |
| Supplier ID Tests | 4 | Input validation, uniqueness, immutability |
| Optional Fields | 3 | Empty field handling |
| Dropdown Tests | 5 | Category, Type, Status dropdowns |
| Happy Path | 4 | Complete workflows with various data sets |
| Navigation | 3 | Cancel, tab switching, back button |

## Prerequisites

- Node.js and npm installed
- Playwright installed: `npm install @playwright/test`
- Valid test credentials for TPS Live Access

## Configuration

Test configuration is centralized in `setup.ts`:

- **Base URL**: https://dev.liveaccess.ai
- **Credentials**: somveergurjar.megaminds@gmail.com / Qwert@123
- **Timeouts**: Navigation (10s), Element (5s), Save (15s)
- **Selectors**: All element selectors based on exploratory testing

## Running Tests

### Run All Tests
```bash
npx playwright test tests/TPS_addEquipment_Flow/
```

### Run Specific Test Category
```bash
# UI Validation tests
npx playwright test tests/TPS_addEquipment_Flow/ui_validation/

# Happy path scenarios
npx playwright test tests/TPS_addEquipment_Flow/happy_path_scenarios/

# All mandatory field validation tests
npx playwright test tests/TPS_addEquipment_Flow/mandatory_field_validation/
```

### Run with Browser Selection
```bash
# Run on specific browser
npx playwright test --project=chromium tests/TPS_addEquipment_Flow/

# Run on multiple browsers
npx playwright test --project=chromium --project=firefox tests/TPS_addEquipment_Flow/
```

### Run with Debugging
```bash
# Run in debug mode
npx playwright test --debug tests/TPS_addEquipment_Flow/ui_validation/

# Run headed (visible browser)
npx playwright test --headed tests/TPS_addEquipment_Flow/happy_path_scenarios/
```

## Test Data

The test suite uses predefined test data fixtures:

### Manufacturers
- Existing: "ABB"
- Generated: Auto-generated unique names for new entries

### Suppliers
- Existing: "SG SUPPLIER 1"
- Generated: Auto-generated unique names for new entries

### Supplier IDs
- Format: "PREFIX-timestamp" (e.g., "TEST-1640995200000")
- Unique: Each test generates unique IDs to avoid conflicts

### Categories & Types
- Categories: PUMPS, ANALYTICAL, PROCESS VALVES, etc.
- Types: PUMP, VALVE, SENSOR, INSTRUMENT, etc.

## Key Features

### Helper Functions
- `login()`: Automated login process
- `navigateToNewEquipment()`: Navigate to equipment form
- `fillMandatoryFields()`: Fill required fields only
- `fillAllFields()`: Fill complete form with all data
- `saveEquipment()`: Submit form and wait for completion
- `cancelEquipment()`: Cancel form and return to list

### Validation Helpers
- `waitForValidationErrors()`: Wait for error messages to appear
- `isValidationErrorVisible()`: Check if specific error is shown
- `getCurrentTpsId()`: Retrieve current TPS ID value

### Test Data Generation
- `TestDataGenerator.generateUniqueSupplierId()`: Create unique supplier IDs
- `TestDataGenerator.generateUniqueManufacturer()`: Create unique manufacturer names
- `TestDataGenerator.generateUniqueSupplier()`: Create unique supplier names

## Element Selectors

All selectors are based on exploratory testing findings:

```javascript
// Key selectors used throughout tests
const SELECTORS = {
  tpsIdField: '[aria-label="Auto-generated"]',
  manufacturerField: 'input[placeholder="Type to search or add new..."]:nth-of-type(1)',
  supplierField: 'input[placeholder="Type to search or add new..."]:nth-of-type(2)',
  supplierIdField: 'input[placeholder="V-1001-A"]',
  statusDropdown: 'select:nth-of-type(1)',
  categoryDropdown: 'select:nth-of-type(2)',
  typeDropdown: 'select:nth-of-type(3)',
  saveButton: 'button:has-text("Save Equipment")',
  cancelButton: 'button:has-text("Cancel")'
};
```

## Browser Support

Tests are configured to run on:
- Chromium (default)
- Firefox
- WebKit (Safari)

## Error Handling

- Automatic screenshot capture on test failures
- Detailed error messages in test output
- Validation error detection and reporting
- Timeout handling for slow operations

## Maintenance Notes

### Updating Selectors
If UI changes affect selectors, update them in `setup.ts`:
1. Run exploratory tests to identify new selectors
2. Update SELECTORS object
3. Verify all tests still pass

### Adding New Test Data
Add new test data to TEST_DATA object in `setup.ts`:
```javascript
manufacturers: {
  existing: 'ABB',
  new: 'TestManufacturer2026'
}
```

### Test Isolation
Each test is designed to be independent with:
- Unique test data generation
- Fresh browser session per test
- No dependencies between tests

## Troubleshooting

### Common Issues
1. **Login failures**: Verify credentials and network connectivity
2. **Element not found**: UI may have changed, update selectors
3. **Timeouts**: Increase timeout values in setup.ts for slow networks
4. **Validation errors**: Check test data uniqueness requirements

### Debug Mode
Run tests in debug mode to step through execution:
```bash
npx playwright test --debug tests/TPS_addEquipment_Flow/ui_validation/ui-validation-tests.spec.ts
```

## Test Results

Results are saved to `test-results/` directory with:
- Screenshots of failures
- HTML report: `npx playwright show-report`
- JUnit XML for CI/CD integration

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Use helper functions from setup.ts
3. Generate unique test data
4. Include proper assertions and error handling
5. Update this README if adding new categories