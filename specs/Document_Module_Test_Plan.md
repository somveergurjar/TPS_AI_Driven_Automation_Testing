# Document Module QA Test Plan

## Application Overview

Comprehensive QA test plan for the Document module, covering page load, list rendering, search and filter behavior, action controls, validations, and negative cases.

## Test Scenarios

### 1. Document Module

**Seed:** `tests/seed.spec.ts`

#### 1.1. Document Page Loads Successfully

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Login to the application with a valid user account.
    - expect: Login succeeds and dashboard or home page is displayed.
  2. Navigate to the Document module from the main menu.
    - expect: Document module page begins loading.
  3. Verify page content renders.
    - expect: Document page loads successfully.
    - expect: No blank screen, UI crash, or loading failure occurs.

#### 1.2. Document Grid Loads Properly

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document table or grid appears.
  2. Observe the grid rendering.
    - expect: Rows and columns are visible.
    - expect: No missing grid structure is present.

#### 1.3. Column Headers Visibility

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: The document table is displayed.
  2. Verify the table header row.
    - expect: Headers for TPS ID, Supplier Doc ID, Document Name, Document Type, Supplier, Revisions, Linked Equipment, Linked Spares, Remarks, and Actions are visible.

#### 1.4. New Document Button Visibility

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document module page is visible.
  2. Locate the New Document button.
    - expect: Button is visible and enabled.
    - expect: Button is accessible via keyboard and not disabled.

#### 1.5. No Broken UI Elements on Document Page

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: UI components render correctly.
  2. Inspect icons, labels, and spacing.
    - expect: No broken icons.
    - expect: No overlapping text.
    - expect: No misaligned elements or hidden controls.

#### 1.6. Visual Layout Matches Expected Design

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Page layout is displayed.
  2. Compare the page to the expected design or baseline layout.
    - expect: Layout matches expected design.
    - expect: No unexpected visual regressions are present.

#### 1.7. Rows Load Correctly in Document List

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document list loads.
  2. Review the rows in the grid.
    - expect: Rows display correctly.
    - expect: No blank or corrupted rows appear.

#### 1.8. Data Visibility in All Columns

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document grid is available.
  2. Inspect row data across each column.
    - expect: Each row displays data in all visible columns.
    - expect: No required data values are missing.

#### 1.9. Pagination Works Correctly

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document grid is present.
  2. Click the pagination controls to move to the next page and back.
    - expect: Pagination navigates between pages.
    - expect: The correct records display on each page.

#### 1.10. Total Record Count Matches Backend

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document grid loads.
  2. Compare the displayed record count to the API/backend response.
    - expect: Displayed record count matches the backend count.

#### 1.11. Empty State Displays for No Matching Data

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document grid is visible.
  2. Apply a filter value that has no matching records.
    - expect: A proper empty state message displays.
    - expect: The grid remains stable and does not crash.

#### 1.12. Dynamic Row Rendering on Scroll

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Document list loads.
  2. Scroll through the list of records.
    - expect: Dynamic rows render correctly.
    - expect: No duplicate or missing rows appear.

#### 1.13. Filter by TPS ID

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a valid TPS ID in the TPS ID filter field.
    - expect: Filter value is entered correctly.
  2. Apply the filter.
    - expect: Only records matching the TPS ID are displayed.

#### 1.14. Filter by Supplier Doc ID

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a valid Supplier Doc ID in the filter.
    - expect: Filter input is accepted.
  2. Apply the filter.
    - expect: Only matching Supplier Doc ID records are displayed.

#### 1.15. Filter by Document Name

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a document name search term.
    - expect: Search term is accepted.
  2. Apply the search or filter.
    - expect: Records matching the Document Name are shown.

#### 1.16. Filter by Document Type

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document Type filter dropdown.
    - expect: Dropdown expands.
  2. Select a document type and apply the filter.
    - expect: Only records with the selected Document Type are displayed.

#### 1.17. Filter by Supplier

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Supplier filter dropdown.
    - expect: Dropdown expands.
  2. Select a supplier and apply the filter.
    - expect: Only records for that supplier display.

#### 1.18. Filter by Revision Value

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a revision value in the revision filter field.
    - expect: Revision filter input is accepted.
  2. Apply the filter.
    - expect: Only matching revision records display.

#### 1.19. Filter by Remarks Keyword

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a keyword in the remarks filter field.
    - expect: Filter input is accepted.
  2. Apply the filter.
    - expect: Records with matching remarks display.

#### 1.20. Multiple Filters Combined

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Apply two or more filters at the same time.
    - expect: All filter values are accepted.
  2. Verify the filtered results.
    - expect: Records match all selected filter criteria.

#### 1.21. Reset Filters Returns Full List

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Apply one or more filters.
    - expect: Filters are applied.
  2. Click the Reset Filters button.
    - expect: All filter fields reset.
    - expect: The complete document list displays again.

#### 1.22. Invalid Filter Value Handling

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a random or invalid value into a filter field.
    - expect: Filter input accepts the value.
  2. Apply the filter.
    - expect: A no matching records message displays.
    - expect: Application remains stable with no errors.

#### 1.23. Download Button Visibility

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Action icons are visible in the grid.
  2. Verify the presence of a download icon for documents.
    - expect: Download icon is visible for documents that can be downloaded.

#### 1.24. Document Download Functionality

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Click the download icon for a document.
    - expect: Download action is triggered.
  2. Confirm the document file is downloaded.
    - expect: Document downloads successfully to the local machine or browser download location.

#### 1.25. Delete Button Visibility Based on Permissions

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module as an authorized user.
    - expect: Action icons are visible.
  2. Verify delete icon presence in the Actions column.
    - expect: Delete icon is visible for users with delete permission.

#### 1.26. Unauthorized User Cannot Delete Document

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Login as a user without delete permissions.
    - expect: User login succeeds.
  2. Open the Document module and inspect action buttons.
    - expect: Delete functionality is not available.
    - expect: Unauthorized users cannot access delete actions.

#### 1.27. New Document Navigation

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Click the New Document button.
    - expect: Navigation to the document creation page is initiated.
  2. Verify the destination page loads.
    - expect: User lands on the document creation page.

#### 1.28. Action Icons Alignment and Layout

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module.
    - expect: Grid and action column are visible.
  2. Inspect the alignment of action icons.
    - expect: Icons are aligned correctly.
    - expect: No broken or missing icons appear.

#### 1.29. Action Button Accessibility

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Hover over or click each action button in the Actions column.
    - expect: Buttons are interactive.
  2. Verify tooltips or accessibility labels appear.
    - expect: Tooltips or labels display correctly.
    - expect: Action buttons are usable via keyboard and screen readers.

#### 1.30. Filter with Empty Input

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Leave a filter field empty or clear it.
    - expect: Filter field accepts empty input.
  2. Apply the filter.
    - expect: All records display as if no filter is applied.
    - expect: No error occurs.

#### 1.31. Filter with Very Long Input Value

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Enter a very long string (e.g., 1000 characters) into a filter field like Document Name.
    - expect: Filter field accepts the long input.
  2. Apply the filter.
    - expect: Application handles the input without crashing.
    - expect: Filter applies or shows appropriate message if too long.

#### 1.32. Scrolling Through Large Dataset

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Open the Document module with a large dataset (e.g., thousands of records).
    - expect: Document list loads with many records.
  2. Scroll to the end of the list.
    - expect: Scrolling works smoothly.
    - expect: All records load without performance issues.
    - expect: No data loss or duplication.

#### 1.33. Download Action Failure State

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Click the download icon for a document.
    - expect: Download icon is clicked.
  2. Simulate or trigger a download failure (if possible, or observe in case of failure).
    - expect: An error message displays if download fails (e.g., file not found or network error).
    - expect: Application remains stable.

#### 1.34. Delete Action Failure State

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Click the delete icon for a document as an authorized user.
    - expect: Delete icon is clicked.
  2. Simulate or trigger a delete failure (if possible).
    - expect: An error message displays if delete fails (e.g., server error).
    - expect: Application remains stable and document is not deleted.

#### 1.35. Missing Permissions for New Document

**File:** `specs/Document_Module_Test_Plan.md`

**Steps:**
  1. Login as a user without permissions to create documents.
    - expect: User login succeeds.
  2. Attempt to access the New Document button.
    - expect: New Document button is not visible or disabled.
    - expect: Navigation to creation page is blocked.

  
