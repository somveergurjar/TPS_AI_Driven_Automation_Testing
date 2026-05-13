# Document Module Playwright Tests

This directory contains comprehensive Playwright tests for the Document module, covering all test cases from the QA test plan.

## Test Structure

The tests are organized into the following files:

- `setup.ts` - Configuration, selectors, and helper methods
- `document-page-load.spec.ts` - Page load and basic UI validation tests
- `document-grid.spec.ts` - Grid rendering, pagination, and scrolling tests
- `document-filters.spec.ts` - All filter functionality tests
- `document-actions.spec.ts` - Action buttons (download, delete, new document) tests

## Test Coverage

The tests cover all 35 test cases from the Document_Module_Test_Plan.md:

### Page Load & UI (8 tests)
- Document page loads successfully
- Document grid loads properly
- Column headers visibility
- New Document button visibility
- No broken UI elements
- Visual layout consistency
- Rows load correctly
- Data visibility in all columns

### Grid & Pagination (5 tests)
- Pagination functionality
- Total record count validation
- Empty state handling
- Dynamic row rendering on scroll
- Large dataset scrolling

### Filters (11 tests)
- Filter by TPS ID, Supplier Doc ID, Document Name
- Filter by Document Type, Supplier
- Filter by Revision Value, Remarks Keyword
- Multiple filters combined
- Reset filters functionality
- Invalid filter handling
- Empty input filtering
- Very long input value handling

### Actions (11 tests)
- Download button visibility and functionality
- Delete button visibility and permissions
- Unauthorized delete restrictions
- New document navigation
- Action icons alignment and layout
- Action button accessibility
- Download action failure handling
- Delete action failure handling
- Missing permissions for new document

## Configuration

The tests use the following configuration from `setup.ts`:

- **Base URL**: `https://dev.liveaccess.ai`
- **Login URL**: `https://dev.liveaccess.ai/login`
- **Document Module URL**: `https://dev.liveaccess.ai/document`
- **Credentials**: Email and password (same as tag module)

## Running the Tests

### Prerequisites
1. Ensure Playwright is installed: `npm install`
2. Update credentials in `setup.ts` if needed
3. Ensure the application is accessible at the configured URLs

### Run All Document Tests
```bash
npx playwright test tests/document_module/
```

### Run Specific Test File
```bash
npx playwright test tests/document_module/document-filters.spec.ts
```

### Run Single Test
```bash
npx playwright test tests/document_module/ --grep "Filter by TPS ID"
```

### Run with Browser Visible
```bash
npx playwright test tests/document_module/ --headed
```

### Generate Test Report
```bash
npx playwright show-report
```

## Test Results

Test results are saved to `test-results/` directory with detailed HTML reports.

## Notes

- Tests are designed to be independent and can run in any order
- Some tests may be skipped if certain conditions aren't met (e.g., no data available)
- Error handling tests verify application stability under failure conditions
- Authentication may require additional setup depending on the application's login flow

## Troubleshooting

If tests fail due to login issues:
1. Verify credentials in `setup.ts`
2. Check if 2FA or additional verification steps are required
3. Ensure the application URLs are accessible
4. Review browser console logs for authentication errors

If navigation fails:
1. Verify the Document module URL in configuration
2. Check if the navigation menu structure has changed
3. Update selectors in `setup.ts` if needed