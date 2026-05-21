## 1.Page Load Validation

# TC_DOC_001 - Verify Document Page Loads Successfully
Steps
Login to application
Navigate to Document module
Observe page loading
Expected Result
Document page should load successfully
No UI crash or blank screen should appear
# TC_DOC_002 - Verify Document Grid Loads Properly
Steps
Open Document module
Observe document table/grid
Expected Result
Grid should load successfully
Rows and columns should be visible
# TC_DOC_003 - Verify Column Headers Visibility
Steps
Open Document module
Verify table headers
Expected Result

The following headers should be visible:

TPS ID
Supplier Doc ID
Document Name
Document Type
Supplier
Revisions
Linked Equipment
Linked Spares
Remarks
Actions
# TC_DOC_004 - Verify New Document Button Visibility
Steps
Open Document module
Verify New Document button
Expected Result
New Document button should be visible
Button should be enabled
# TC_DOC_005 - Verify No Broken UI Elements
Steps
Open Document module
Observe UI components
Expected Result
No broken icons
No overlapping text
No alignment issues
No hidden controls
# TC_DOC_006 - Verify Visual Layout Consistency
Steps
Open Document module
Compare current UI with baseline screenshot
Expected Result
Layout should match expected design
No unexpected visual regression

# 2. Document List Validation

# TC_DOC_007 - Verify Rows Load Correctly
Steps
Open Document module
Observe grid rows
Expected Result
Rows should display properly
No blank or corrupted rows
# TC_DOC_008 - Verify Data Visibility in All Columns
Steps
Open Document module
Verify row data across all columns
Expected Result
Data should display correctly in all columns
No missing values
# TC_DOC_009 - Verify Pagination Functionality
Steps
Open Document module
Navigate between pages
Expected Result
Pagination should work correctly
Correct records should display
# TC_DOC_010 - Verify Total Record Count
Steps
Open Document module
Verify displayed record count
Expected Result
Record count should match backend/API response
# TC_DOC_011 - Verify Empty State Handling
Steps
Apply filter with no matching data
Expected Result
Proper empty state message should display
Grid should not crash
# TC_DOC_012 - Verify Dynamic Row Rendering
Steps
Open Document module
Scroll through records
Expected Result
Dynamic rows should load correctly
No duplicate or missing rows

# 3. Search & Filter Validation

# TC_DOC_013 - Verify TPS ID Filter
Steps
Enter TPS ID in filter
Apply filter
Expected Result
Only matching TPS ID records should display
# TC_DOC_014 - Verify Supplier Doc ID Filter
Steps
Enter Supplier Doc ID
Apply filter
Expected Result
Correct matching records should display
# TC_DOC_015 - Verify Document Name Filter
Steps
Enter document name
Apply filter
Expected Result
Matching document records should display
# TC_DOC_016 - Verify Document Type Filter
Steps
Select document type
Apply filter
Expected Result
Only selected document type records should display
# TC_DOC_017 - Verify Supplier Filter
Steps
Select supplier
Apply filter
Expected Result
Supplier-specific records should display
# TC_DOC_018 - Verify Revision Filter
Steps
Enter revision value
Apply filter
Expected Result
Matching revision records should display
# TC_DOC_019 - Verify Remarks Filter
Steps
Enter remarks keyword
Apply filter
Expected Result
Matching remarks records should display
# TC_DOC_020 - Verify Multiple Filter Combination
Steps
Apply multiple filters simultaneously
Expected Result
Grid should display records matching all filters
# TC_DOC_021 - Verify Reset Filter Functionality
Steps
Apply filters
Click Reset Filters
Expected Result
All filters should reset
Complete document list should display
# TC_DOC_022 - Verify Invalid Filter Handling
Steps
Enter invalid/random filter value
Expected Result
No matching records message should display
Application should remain stable

# 4. Action Button Validation

# TC_DOC_023 - Verify Download Button Visibility
Steps
Open Document module
Observe action icons
Expected Result
Download icon should be visible for documents
# TC_DOC_024 - Verify Download Functionality
Steps
Click download icon
Expected Result
Document should download successfully
# TC_DOC_025 - Verify Delete Button Visibility
Steps
Open Document module
Verify delete icon
Expected Result
Delete icon should display based on permissions
# TC_DOC_026 - Verify Unauthorized Delete Restriction
Steps
Login as non-authorized user
Observe delete action
Expected Result
Unauthorized users should not access delete functionality
# TC_DOC_027 - Verify New Document Navigation
Steps
Click New Document button
Expected Result
User should navigate to document creation page
# TC_DOC_028 - Verify Action Icons Alignment
Steps
Observe action column
Expected Result
Icons should align correctly
No broken/missing icons
# TC_DOC_029 - Verify Action Button Accessibility
Steps
Hover/click action buttons
Expected Result
Buttons should be clickable


# 5. identification tab - validation for mandetory feilds 

Tab 1 – Identification
# TC_DOC_IDENTIFICATION_001 – Verify validation when all mandatory fields are blank

Verify that when the user clicks on the Save button without entering values in Document Name, Document Type, and Supplier fields, the system should prevent document creation and display validation messages below each field. The following validations should be displayed:

"Document name is required"
"Document type is required"
"Supplier is required"
# TC_DOC_IDENTIFICATION_002 – Verify Document Name mandatory field validation

Verify that when the user leaves the Document Name field blank while entering valid values in Document Type and Supplier fields and clicks Save, the system should display the validation message "Document name is required" below the Document Name field and the document should not be saved.

# TC_DOC_IDENTIFICATION_003 – Verify Document Type mandatory field validation

Verify that when the user enters a valid Document Name and Supplier but leaves the Document Type field blank and clicks Save, the system should display the validation message "Document type is required" below the Document Type field and prevent saving the document.

# TC_DOC_IDENTIFICATION_004 – Verify Supplier mandatory field validation

Verify that when the user enters valid values in Document Name and Document Type fields but leaves the Supplier field blank and clicks Save, the system should display the validation message "Supplier is required" below the Supplier field and prevent document creation.

# TC_DOC_IDENTIFICATION_005 – Verify validations are removed after entering valid data

Verify that once the user enters valid values in all mandatory fields after validation messages are displayed, the validation messages should disappear and the user should be able to proceed with document creation successfully.

# TC_DOC_IDENTIFICATION_006 – Verify red border/highlight for mandatory fields

Verify that all mandatory fields display red border highlighting when validation errors are triggered after clicking Save without entering required information.

# TC_DOC_IDENTIFICATION_007 – Verify system prevents document save with missing mandatory fields

Verify that the system does not allow the document to be saved if any of the mandatory fields are empty.

# TC_DOC_IDENTIFICATION_008 – Verify validation message placement and UI alignment

Verify that validation messages are displayed correctly below their respective fields in red color without overlapping or breaking the UI layout.

# TC_DOC_IDENTIFICATION_009 – Verify spaces-only input in Document Name field

Verify that when the user enters only blank spaces in the Document Name field and clicks Save, the system should treat the value as empty and display the validation message "Document name is required".

# TC_DOC_IDENTIFICATION_010 – Verify trimming of leading and trailing spaces

Verify that when the user enters leading or trailing spaces in the Document Name field along with valid text, the system trims unnecessary spaces and saves the valid document name successfully.

# TC_DOC_IDENTIFICATION_011 – Verify invalid dropdown entry for Document Type

Verify that if the user types a value in the Document Type field without selecting a valid dropdown option and clicks Save, the system should display the validation message for mandatory selection if applicable.

# TC_DOC_IDENTIFICATION_012 – Verify invalid dropdown entry for Supplier

Verify that if the user types a value in the Supplier field without selecting an actual supplier from the dropdown and clicks Save, the system should display the validation message "Supplier is required" or prevent save based on business validation.

# TC_DOC_IDENTIFICATION_013 – Verify validations after page refresh

Verify that mandatory field validations continue to work correctly after refreshing the page.

# TC_DOC_IDENTIFICATION_014 – Verify validations after tab switching

Verify that validation messages remain accurate and functional even after navigating between Identification and Revisions tabs.

# TC_DOC_IDENTIFICATION_015 – Verify multiple rapid Save clicks

Verify that clicking the Save button multiple times rapidly without entering mandatory data does not create duplicate validation messages or break the UI.

# TC_DOC_IDENTIFICATION_016 – Verify mandatory validations using keyboard Enter key

Verify that pressing the Enter key triggers the same mandatory field validations as clicking the Save button.

# TC_DOC_IDENTIFICATION_017 – Verify mandatory field behavior with browser autofill

Verify that browser autofill should not bypass mandatory field validations and incomplete autofilled values should still trigger validation errors.

# TC_DOC_IDENTIFICATION_018 – Verify maximum length handling in Document Name field

Verify that the system properly handles very large input values in the Document Name field and displays appropriate validation if maximum length is exceeded.

# TC_DOC_IDENTIFICATION_019 – Verify special character handling in Document Name field

Verify that the system handles special characters entered in the Document Name field according to business rules without breaking validation logic.



# 6. Revision Tab – Validation Happy Path Test Cases

# TC_REV_HP_001 – Verify validation message is displayed when no revision is uploaded

Verify that when the user navigates to the Revisions tab and clicks Save without uploading any revision file, the system should display the validation message:
"A document must include at least one revision. Please upload a file before saving."


# TC_REV_HP_002 – Verify validation message is removed after successful revision upload

Verify that after uploading a valid revision file successfully, the validation message should disappear automatically and the user should be allowed to proceed with document save.

# TC_REV_HP_003 – Verify successful upload of valid revision file

Verify that the user is able to upload a valid revision file successfully using the "Choose files" and "Upload Revision" buttons.


# TC_REV_HP_006 – Verify Upload Revision button behavior

Verify that the "Upload Revision" button remains disabled until a valid file is selected and becomes enabled after file selection.

# TC_REV_HP_007 – Verify next revision number display

Verify that the system displays the correct next revision number (e.g., Rev1) before uploading the first revision.


# TC_REV_HP_009 – Verify multiple revision uploads

Verify that the user is able to upload multiple revisions successfully and each uploaded revision appears correctly in the revisions grid.

# TC_REV_HP_010 – Verify file selection cancel behavior

Verify that if the user clicks "Choose files" and cancels file selection, no file should be uploaded and the validation message should still appear during Save action.




Tooltip/accessibility labels should work properly


AI Driven Validation Coverage
AI Validation Areas
Visual regression detection
Broken layout detection
Smart filter validation
Dynamic grid comparison
AI-generated edge-case testing
Self-healing locator support
Unauthorized action anomaly detectio