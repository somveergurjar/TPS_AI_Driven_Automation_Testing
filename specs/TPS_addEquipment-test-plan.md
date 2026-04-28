# TPS Add Equipment Test Plan - SCRUM-101

## Executive Summary

Comprehensive test plan for the SCRUM-101 Add Equipment workflow in the TPS Live Access application. This plan provides end-to-end test coverage for the Equipment Identification tab, validating all acceptance criteria (AC-1 through AC-8) and business rules (BR-1 through BR-12).

**Application URL:** https://dev.liveaccess.ai/login  
**Test User:** somveergurjar.megaminds@gmail.com  
**Test Password:** Qwert@123  

---

## Test Coverage Overview

### Total Test Cases: 40

| Test Category | Test Cases | Acceptance Criteria | Business Rules |
|---------------|-----------|-------------------|-----------------|
| UI Validation | 5 | AC-1, AC-8 | BR-9, BR-10 |
| TPS ID Generation | 3 | AC-2 | BR-1, BR-2 |
| Mandatory Field Validation | 5 | AC-3 | BR-3, BR-4, BR-5 |
| Manufacturer Functionality | 3 | AC-4 | BR-6 |
| Supplier Functionality | 3 | AC-5 | BR-6 |
| Supplier ID Validation | 4 | AC-6 | BR-7, BR-8 |
| Optional Fields | 3 | AC-7 | BR-11, BR-12 |
| Dropdown Functionality | 5 | AC-1, AC-8 | BR-9, BR-10 |
| Happy Path Scenarios | 4 | All AC | All BR |
| Navigation & Controls | 3 | N/A | N/A |

---

## UI VALIDATION TEST CASES

### TC-1: Verify All Fields Are Present in Equipment Identification Tab

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** UI Verification  

**Test Data:**
- Login credentials: somveergurjar.megaminds@gmail.com / Qwert@123

**Steps:**
1. Login with provided credentials
2. Navigate to Equipment module from sidebar
3. Click "New Equipment" button
4. Verify presence of all fields in Equipment Identification tab

**Expected Results:**
- All 9 fields are present and visible:
  - TPS ID (auto-generated, read-only)
  - Status (dropdown)
  - Equipment Category (dropdown)
  - Equipment Type (dropdown)
  - Manufacturer (searchable field, mandatory)
  - Supplier/Vendor (searchable field, mandatory)
  - Supplier ID (text field, mandatory)
  - Feature (text field, optional)
  - Model Information (text field, optional)
- Form header displays "New Equipment Record"
- TPS ID displays with format like "E11037"
- Status field displays with default ACTIVE selection
- Tab navigation shows 11 tabs (Equipment Identification, Performance, Mechanical, etc.)

---

### TC-2: Verify Mandatory Fields Are Marked with Asterisk (*)

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-3  
**Test Type:** UI Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine field labels for mandatory indicators
3. Verify asterisk presence on mandatory fields
4. Verify non-mandatory fields don't have asterisk

**Expected Results:**
- Mandatory fields with "*" indicator:
  - Manufacturer *
  - Supplier / Vendor *
  - Supplier Identification Number *
- Non-mandatory fields (no asterisk):
  - TPS ID
  - Status
  - Equipment Category
  - Equipment Type
  - Feature
  - Model Information
- Visual alignment is consistent across all field labels

---

### TC-3: Verify TPS ID Field Is Auto-Generated and Read-Only

**Acceptance Criteria:** AC-2, AC-1  
**Business Rule:** BR-1, BR-2  
**Test Type:** Field Property Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine TPS ID field properties
3. Attempt to click and edit TPS ID field
4. Try copying text from TPS ID field

**Expected Results:**
- TPS ID field contains auto-generated value (e.g., E11037)
- Field follows format: "E" followed by 5 digits
- Field has "disabled" attribute (appears grayed out)
- Field cannot accept any input/keystroke
- Placeholder text shows "Auto-generated"
- Copy functionality may be available but field is completely read-only for editing

---

### TC-4: Verify Default Status Is ACTIVE

**Acceptance Criteria:** AC-8  
**Business Rule:** BR-9  
**Test Type:** Field Value Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine Status dropdown current value
3. Click Status dropdown to view options

**Expected Results:**
- Status field displays "ACTIVE" as the selected/default value
- Status dropdown options include:
  - ACTIVE (selected)
  - OBSOLETE
- Default selection is ACTIVE without any user action

---

### TC-5: Verify Field Alignment and Visual Layout

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** UI Layout Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Verify visual alignment of fields:
   - Field labels positioning
   - Input field positioning
   - Mandatory field markers (*)
   - Help text positioning
3. Check spacing between form sections
4. Verify responsive layout of form

**Expected Results:**
- Field labels are properly aligned on the left side
- Input fields are aligned consistently
- Mandatory indicators (*) are positioned consistently
- Help text appears below relevant fields in smaller font
- Proper spacing exists between form rows
- Form layout is responsive and organized into logical sections
- Tab navigation buttons are clearly visible at the top

---

## TPS ID AUTO-GENERATION TEST CASES

### TC-6: Verify TPS ID Is Auto-Generated with Correct Format

**Acceptance Criteria:** AC-2  
**Business Rule:** BR-1, BR-2  
**Test Type:** Field Auto-Generation  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login to application
2. Navigate to Equipment module
3. Click "New Equipment" button
4. Examine TPS ID field value immediately after form loads

**Expected Results:**
- TPS ID field is automatically populated with a unique ID
- Format follows pattern: "E" followed by 5 digits (e.g., E11037)
- ID is not empty or null
- ID is unique and different from previously created equipment IDs
- No user action is required for ID generation

---

### TC-7: Verify TPS IDs Are Unique Across Multiple Equipment Records

**Acceptance Criteria:** AC-2  
**Business Rule:** BR-1, BR-2  
**Test Type:** Uniqueness Verification  

**Test Data:**
- Login credentials provided
- At least 2 equipment record creations

**Steps:**
1. Create first equipment record with mandatory fields and save
2. Note the TPS ID of first equipment (e.g., E11037)
3. Navigate back to Equipment list
4. Create second new equipment record
5. Compare TPS ID of second form with first equipment's ID

**Expected Results:**
- Each new equipment form generates a different TPS ID
- TPS IDs appear to be auto-incremented or uniquely sequenced
- No duplicate TPS IDs are assigned
- Both records remain with their original assigned TPS IDs after save

---

### TC-8: Verify TPS ID Remains Locked and Non-Editable After Creation

**Acceptance Criteria:** AC-2  
**Business Rule:** BR-1  
**Test Type:** Field Immutability  

**Test Data:**
- Login credentials provided
- Equipment record previously created and saved

**Steps:**
1. Create and save an equipment record
2. Reopen the saved equipment record for editing
3. Locate the TPS ID field
4. Attempt to modify or delete the TPS ID value
5. Try to select and copy the TPS ID value

**Expected Results:**
- TPS ID field remains disabled after record creation
- No input can be entered into the field
- Field cannot be modified or deleted
- Copy functionality may work but field is read-only
- TPS ID value persists unchanged in all views

---

## MANDATORY FIELD VALIDATION TEST CASES

### TC-9: Verify Error When Manufacturer Field Is Empty During Save

**Acceptance Criteria:** AC-3  
**Business Rule:** BR-3, BR-4  
**Test Type:** Negative - Field Validation  

**Test Data:**
- Login credentials provided
- Supplier/Vendor: Any valid supplier
- Supplier ID: Any unique valid ID (e.g., SUP-TEST-001)
- Manufacturer: LEFT EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Fill Supplier/Vendor field with valid value
3. Fill Supplier ID field with valid unique value
4. Leave Manufacturer field completely empty
5. Click "Save Equipment" button

**Expected Results:**
- Form validation is triggered immediately
- Error message appears for Manufacturer field (e.g., "Manufacturer is required")
- Manufacturer field is highlighted with red border or error styling
- Save operation is prevented and blocked
- Form remains on the same page with data preserved
- Error message clearly indicates "Manufacturer" is required

---

### TC-10: Verify Error When Supplier/Vendor Field Is Empty During Save

**Acceptance Criteria:** AC-3  
**Business Rule:** BR-3, BR-4  
**Test Type:** Negative - Field Validation  

**Test Data:**
- Login credentials provided
- Manufacturer: Any valid manufacturer
- Supplier ID: Any unique valid ID
- Supplier/Vendor: LEFT EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Fill Manufacturer field with valid value
3. Fill Supplier ID field with valid unique value
4. Leave Supplier/Vendor field completely empty
5. Click "Save Equipment" button

**Expected Results:**
- Form validation is triggered
- Error message appears for Supplier/Vendor field (e.g., "Supplier is required")
- Supplier/Vendor field is highlighted with red border or error styling
- Save operation is prevented
- Form remains with entered data preserved
- Error message clearly indicates "Supplier" is required

---

### TC-11: Verify Error When Supplier ID Field Is Empty During Save

**Acceptance Criteria:** AC-3  
**Business Rule:** BR-3, BR-4  
**Test Type:** Negative - Field Validation  

**Test Data:**
- Login credentials provided
- Manufacturer: Any valid manufacturer
- Supplier/Vendor: Any valid supplier
- Supplier ID: LEFT EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Fill Manufacturer field with valid value
3. Fill Supplier/Vendor field with valid value
4. Leave Supplier ID field completely empty
5. Click "Save Equipment" button

**Expected Results:**
- Form validation is triggered
- Error message appears for Supplier ID field (e.g., "Supplier Identification Number is required")
- Supplier ID field is highlighted with red border or error styling
- Save operation is prevented
- Form remains with entered data preserved
- Error message clearly indicates "Supplier ID" is required

---

### TC-12: Verify Red Border Appears on All Empty Mandatory Fields

**Acceptance Criteria:** AC-3  
**Business Rule:** BR-3, BR-4  
**Test Type:** Negative - Field Validation  

**Test Data:**
- Login credentials provided
- All mandatory fields: LEFT EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Leave Manufacturer, Supplier, and Supplier ID fields all empty
3. Click "Save Equipment" button

**Expected Results:**
- All three empty mandatory fields are highlighted with red border
- Error messages appear for each mandatory field
- Form shows multiple validation errors simultaneously
- Save operation is completely blocked
- Visual indication of validation failures is clear and consistent
- User can identify all required fields at once

---

### TC-13: Verify Save Is Prevented When Mandatory Fields Are Empty

**Acceptance Criteria:** AC-3  
**Business Rule:** BR-5  
**Test Type:** Negative - Save Prevention  

**Test Data:**
- Login credentials provided
- Mandatory fields: LEFT EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Leave all mandatory fields empty
3. Click "Save Equipment" button
4. Verify form state and button behavior

**Expected Results:**
- Save button click does not result in form submission
- Form remains on the same page (no redirect)
- Equipment record is not created in the system
- All validation errors are displayed
- Form data is not lost during validation
- Save action is completely blocked until all mandatory fields are filled

---

## MANUFACTURER FUNCTIONALITY TEST CASES

### TC-14: Verify Can Search and Select Existing Manufacturer from Dropdown

**Acceptance Criteria:** AC-4  
**Business Rule:** BR-6  
**Test Type:** Field Functionality - Search & Select  

**Test Data:**
- Login credentials provided
- Search term: "Sie" (to find manufacturers like Siemens)
- Supplier/Vendor: Any valid supplier
- Supplier ID: Any unique valid ID

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Manufacturer field
3. Type a partial manufacturer name (e.g., "Sie")
4. Wait for search results to appear
5. Select one of the suggested manufacturers from the dropdown
6. Continue filling other mandatory fields

**Expected Results:**
- Manufacturer field becomes active and accepts input
- Typing in the field triggers a search/filter of existing manufacturers
- Dropdown appears with matching manufacturers from master data
- Multiple matching results are displayed
- Selecting a result populates the Manufacturer field
- Dropdown closes after selection
- Selected manufacturer value persists in the field
- Can proceed to fill other fields with selected manufacturer

---

### TC-15: Verify Can Add New Manufacturer Entry

**Acceptance Criteria:** AC-4  
**Business Rule:** BR-6  
**Test Type:** Field Functionality - Add New  

**Test Data:**
- Login credentials provided
- New Manufacturer Name: "TestMfgCorp" or similar unique value
- Supplier/Vendor: Any valid supplier
- Supplier ID: Any unique valid ID

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Manufacturer field
3. Type a new manufacturer name that doesn't appear in existing dropdown options
4. Wait for system to recognize the new entry option
5. Select or confirm the new manufacturer entry
6. Continue filling other mandatory fields

**Expected Results:**
- Manufacturer field accepts free-text input
- System recognizes the typed value as a new manufacturer (not in existing list)
- Option to add new manufacturer is presented (may be implicit or explicit)
- New manufacturer value is stored and added to master data
- Manufacturer field contains the new manufacturer value
- Subsequent forms or fields can reference the newly added manufacturer
- New entry becomes available in dropdown for future selections

---

### TC-16: Verify Manufacturer Field Is Mandatory

**Acceptance Criteria:** AC-4  
**Business Rule:** BR-3, BR-6  
**Test Type:** Field Requirement Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine Manufacturer field label in the form
3. Examine help text below Manufacturer field
4. Verify the field's mandatory nature Documentation in acceptance criteria

**Expected Results:**
- Manufacturer field label displays asterisk (*) indicating mandatory
- Help text reads "Select from master or type to add a new manufacturer."
- Field cannot be left empty during form submission (verified by TC-9)
- Field appears in the mandatory fields marked section
- Error message clearly references Manufacturer as required field

---

## SUPPLIER/VENDOR FUNCTIONALITY TEST CASES

### TC-17: Verify Can Search and Select Existing Supplier from Dropdown

**Acceptance Criteria:** AC-5  
**Business Rule:** BR-6  
**Test Type:** Field Functionality - Search & Select  

**Test Data:**
- Login credentials provided
- Search term: "Vol" (to find suppliers like VOLVO SPARE)
- Manufacturer: Any valid manufacturer
- Supplier ID: Any unique valid ID

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Supplier/Vendor field
3. Type a partial supplier name (e.g., "Vol")
4. Wait for search results to appear
5. Select one of the suggested suppliers from the dropdown
6. Continue filling other mandatory fields

**Expected Results:**
- Supplier/Vendor field becomes active and accepts input
- Typing triggers a search/filter of existing suppliers
- Dropdown appears with matching suppliers from master data
- Multiple matching suppliers are displayed
- Selecting a supplier populates the field
- Dropdown closes after selection
- Selected supplier value persists in the field
- Can proceed to fill remaining mandatory fields

---

### TC-18: Verify Can Add New Supplier Entry

**Acceptance Criteria:** AC-5  
**Business Rule:** BR-6  
**Test Type:** Field Functionality - Add New  

**Test Data:**
- Login credentials provided
- New Supplier Name: "TestSupplierInc" or similar unique value
- Manufacturer: Any valid manufacturer
- Supplier ID: Any unique valid ID

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Supplier/Vendor field
3. Type a new supplier name that doesn't appear in existing options
4. Wait for system to recognize the new entry option
5. Select or confirm the new supplier entry
6. Continue filling other mandatory fields

**Expected Results:**
- Supplier/Vendor field accepts free-text input
- System recognizes typed value as new supplier (not in existing list)
- Option to add new supplier is presented
- New supplier value is stored and added to master data
- Supplier/Vendor field contains the new supplier value
- New supplier becomes available for future selections
- System confirms new entry has been added

---

### TC-19: Verify Supplier/Vendor Field Is Mandatory

**Acceptance Criteria:** AC-5  
**Business Rule:** BR-3, BR-6  
**Test Type:** Field Requirement Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine Supplier/Vendor field label
3. Examine help text below Supplier/Vendor field
4. Verify mandatory nature of the field

**Expected Results:**
- Supplier/Vendor field label displays asterisk (*) indicating mandatory
- Help text reads "Select from master or type to add a new supplier."
- Field cannot be left empty during form submission (verified by TC-10)
- Field appears in mandatory fields section
- Error message clearly references Supplier as required field

---

## SUPPLIER ID VALIDATION TEST CASES

### TC-20: Verify Supplier ID Field Accepts Valid Input

**Acceptance Criteria:** AC-6  
**Business Rule:** BR-7  
**Test Type:** Field Input Validation  

**Test Data:**
- Login credentials provided
- Supplier ID: "SUP-TEST-001" or "V-1001-A"
- Manufacturer: Any valid manufacturer
- Supplier/Vendor: Any valid supplier

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Supplier ID field
3. Type a valid supplier ID value (e.g., "SUP-TEST-001")
4. Verify field accepts the input
5. Continue filling other mandatory fields

**Expected Results:**
- Supplier ID field becomes active and editable
- Field accepts alphanumeric input
- Typed value is displayed in the field
- Value can be copied or selected
- Field allows various ID formats (letters, numbers, hyphens, etc.)
- No format error appears for valid input

---

### TC-21: Verify Supplier ID Field Is Mandatory

**Acceptance Criteria:** AC-6  
**Business Rule:** BR-3, BR-7  
**Test Type:** Field Requirement Verification  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Examine Supplier ID field label
3. Examine help text below Supplier ID field
4. Verify mandatory status

**Expected Results:**
- Supplier ID field label displays asterisk (*) indicating mandatory
- Help text reads "Unique identifier. Cannot be changed after creation."
- Field cannot remain empty during save (verified by TC-11)
- Error message clearly references Supplier ID as required
- Message indicates uniqueness requirement

---

### TC-22: Verify Supplier ID Uniqueness Is Enforced

**Acceptance Criteria:** AC-6  
**Business Rule:** BR-7, BR-8  
**Test Type:** Uniqueness Validation  

**Test Data:**
- Login credentials provided
- Supplier ID: Same ID used in previously saved equipment
- Manufacturer: Valid manufacturer
- Supplier/Vendor: Valid supplier

**Steps:**
1. Create and save first equipment with Supplier ID "SUP-001"
2. Create new equipment record
3. Fill all mandatory fields with valid values
4. Enter the same Supplier ID "SUP-001" that was already used
5. Click "Save Equipment" button

**Expected Results:**
- Form validation detects duplicate Supplier ID
- Error message appears indicating "Supplier ID already exists" or "Supplier ID must be unique"
- Supplier ID field is highlighted with error styling
- Save operation is prevented
- User is prompted to enter a different Supplier ID
- First equipment record's Supplier ID remains unchanged

---

### TC-23: Verify Supplier ID Becomes Non-Editable After Creation

**Acceptance Criteria:** AC-6  
**Business Rule:** BR-8  
**Test Type:** Field Change Prevention  

**Test Data:**
- Login credentials provided
- Previously created equipment record with Supplier ID "SUP-TEST-001"

**Steps:**
1. Create and save equipment with Supplier ID "SUP-TEST-001"
2. Navigate back to Equipment list
3. Find and open the previously created equipment for editing
4. Locate Supplier ID field in Equipment Identification tab
5. Attempt to click, select, and modify the Supplier ID value
6. Try copying the value and pasting to verify read-only status

**Expected Results:**
- Supplier ID field is disabled or read-only after record creation
- Field appears grayed out or locked
- No input can be entered into the field
- Existing value cannot be modified or deleted
- Copy functionality may be available but field cannot be edited
- System prevents any modification to Supplier ID after initial creation
- Original Supplier ID persists unchanged

---

## OPTIONAL FIELDS TEST CASES

### TC-24: Verify Feature Field Can Be Left Empty and Form Saves

**Acceptance Criteria:** AC-7  
**Business Rule:** BR-11, BR-12  
**Test Type:** Optional Field Validation  

**Test Data:**
- Login credentials provided
- Feature: LEFT EMPTY
- Manufacturer: Valid manufacturer
- Supplier/Vendor: Valid supplier
- Supplier ID: Valid unique ID

**Steps:**
1. Login and navigate to New Equipment form
2. Fill all mandatory fields (Manufacturer, Supplier/Vendor, Supplier ID)
3. Leave Feature field completely empty (no value entered)
4. Fill other optional fields or leave them empty as well
5. Click "Save Equipment" button

**Expected Results:**
- Form validation passes without errors for Feature field
- No error message appears for empty Feature field
- Equipment is successfully saved with empty Feature field
- Save confirmation is displayed
- Equipment record is created in the system
- Feature field remains empty in the saved record

---

### TC-25: Verify Model Information Field Can Be Left Empty and Form Saves

**Acceptance Criteria:** AC-7  
**Business Rule:** BR-11, BR-12  
**Test Type:** Optional Field Validation  

**Test Data:**
- Login credentials provided
- Model Information: LEFT EMPTY
- Manufacturer: Valid manufacturer
- Supplier/Vendor: Valid supplier
- Supplier ID: Valid unique ID

**Steps:**
1. Login and navigate to New Equipment form
2. Fill all mandatory fields (Manufacturer, Supplier/Vendor, Supplier ID)
3. Leave Model Information field completely empty
4. Leave other optional fields as needed
5. Click "Save Equipment" button

**Expected Results:**
- Form validation passes without errors for Model Information field
- No error message appears for empty Model Information field
- Equipment is successfully saved with empty Model Information field
- Save confirmation is displayed
- Equipment record is created in the system
- Model Information field remains empty in saved record

---

### TC-26: Verify Both Optional Fields Can Be Left Empty and Form Still Saves

**Acceptance Criteria:** AC-7  
**Business Rule:** BR-11, BR-12  
**Test Type:** Optional Fields Combined  

**Test Data:**
- Login credentials provided
- Feature: LEFT EMPTY
- Model Information: LEFT EMPTY
- Manufacturer: Valid manufacturer
- Supplier/Vendor: Valid supplier
- Supplier ID: Valid unique ID

**Steps:**
1. Login and navigate to New Equipment form
2. Fill all mandatory fields only
3. Leave both Feature and Model Information fields completely empty
4. Don't fill any other optional fields in the Equipment Identification tab
5. Click "Save Equipment" button

**Expected Results:**
- Form validation passes with only mandatory fields filled
- No error messages for empty optional fields
- Equipment is successfully saved
- Success confirmation is displayed
- Equipment record created with minimal data (only mandatory fields)
- Empty optional fields are saved as null/empty in the record

---

## DROPDOWN FUNCTIONALITY TEST CASES

### TC-27: Verify Equipment Category Dropdown Displays All Options

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** Dropdown Options Visibility  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Equipment Category dropdown field
3. Wait for dropdown options to appear
4. Count and list all available category options

**Expected Results:**
- Equipment Category dropdown opens to show all options:
  - SELECT... (default option)
  - ANALYTICAL
  - FLOW MEASUREMENT
  - PROCESS VALVES
  - PUMPS
  - TANKS
  - UTILITY
- All options are clearly visible and readable
- Options are properly formatted and consistently styled
- Dropdown has proper scroll or layout if needed

---

### TC-28: Verify Equipment Type Dropdown Displays All Options

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** Dropdown Options Visibility  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Equipment Type dropdown field
3. Wait for dropdown options to appear
4. Count and list all available type options

**Expected Results:**
- Equipment Type dropdown opens to show all options:
  - SELECT... (default)
  - ELEVATED
  - HOSE
  - INSTRUMENT
  - PUMP
  - SENSOR
  - SPARE PART TC
  - VALVE
- All options are clearly visible and readable
- Options are properly formatted
- Dropdown displays all available equipment types

---

### TC-29: Verify Can Select from Equipment Category Dropdown

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** Dropdown Selection  

**Test Data:**
- Login credentials provided
- Category to Select: PUMPS

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Equipment Category dropdown
3. Select "PUMPS" from the available options
4. Verify field value after selection

**Expected Results:**
- Equipment Category dropdown opens
- "PUMPS" option is highlighted or hoverable
- Clicking "PUMPS" selects the option
- Dropdown closes after selection
- Equipment Category field displays "PUMPS" as the selected value
- Selected value persists in the field
- Selection is retained when navigating between tabs

---

### TC-30: Verify Can Select from Equipment Type Dropdown

**Acceptance Criteria:** AC-1  
**Business Rule:** BR-10  
**Test Type:** Dropdown Selection  

**Test Data:**
- Login credentials provided
- Type to Select: VALVE

**Steps:**
1. Login and navigate to New Equipment form
2. Click on Equipment Type dropdown
3. Select "VALVE" from the available options
4. Verify field value after selection

**Expected Results:**
- Equipment Type dropdown opens
- "VALVE" option is highlighted or hoverable
- Clicking "VALVE" selects the option
- Dropdown closes after selection
- Equipment Type field displays "VALVE" as the selected value
- Selected value persists in the field
- Selection is retained during form usage

---

### TC-31: Verify Status Can Be Changed from ACTIVE to OBSOLETE

**Acceptance Criteria:** AC-8  
**Business Rule:** BR-9  
**Test Type:** Dropdown Selection - Status Change  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Verify Status field currently shows "ACTIVE" (default)
3. Click on Status dropdown
4. Select "OBSOLETE" from the available options
5. Verify the change

**Expected Results:**
- Status field initially displays "ACTIVE" as default
- Status dropdown opens when clicked
- "OBSOLETE" option is available and selectable
- Clicking "OBSOLETE" changes the field value
- Status field now displays "OBSOLETE" instead of "ACTIVE"
- Change is persistent until form is cleared or cancelled
- If saved, equipment record will have OBSOLETE status

---

## HAPPY PATH TEST CASES

### TC-32: Complete Equipment Creation with All Mandatory Fields

**Acceptance Criteria:** All AC (AC-1 to AC-8)  
**Business Rule:** All BR (BR-1 to BR-12)  
**Test Type:** Happy Path - Full Workflow  

**Test Data:**
- Login credentials: somveergurjar.megaminds@gmail.com / Qwert@123
- Manufacturer: "Siemens" (or existing manufacturer)
- Supplier/Vendor: "VOLVO SPARE" (or existing supplier)
- Supplier ID: "SUP-HappyPath-001" (unique ID)
- Status: ACTIVE (default)
- Equipment Category: (unselected - optional)
- Equipment Type: (unselected - optional)
- Feature: (empty - optional)
- Model Information: (empty - optional)

**Steps:**
1. Navigate to https://dev.liveaccess.ai/login in browser
2. Enter email: somveergurjar.megaminds@gmail.com
3. Enter password: Qwert@123
4. Click "Continue to Verification" button
5. Wait for dashboard to load
6. Navigate to Equipment module from sidebar
7. Click "New Equipment" button
8. Observe auto-generated TPS ID (e.g., E11037)
9. Fill Manufacturer field: Search and select "Siemens" or similar
10. Fill Supplier/Vendor field: Search and select "VOLVO SPARE" or similar
11. Fill Supplier ID field: Enter "SUP-HappyPath-001"
12. Verify Status shows ACTIVE (default selection)
13. Leave Equipment Category as SELECT... (optional)
14. Leave Equipment Type as SELECT... (optional)
15. Leave Feature field empty (optional)
16. Leave Model Information field empty (optional)
17. Click "Save Equipment" button

**Expected Results:**
- Login is successful and dashboard is displayed
- Equipment navigation works correctly
- New Equipment form opens with auto-generated TPS ID in format E##### 
- TPS ID field is read-only and disabled
- Manufacturer search and selection works smoothly
- Supplier selection works from dropdown
- Supplier ID accepts the unique value
- Status correctly shows ACTIVE by default
- Form validation passes with mandatory fields filled
- Equipment is saved successfully
- Success message or confirmation is displayed
- Equipment record appears in Equipment list
- TPS ID is retained and visible in the saved record
- No error messages appear during the process
- Form closes or redirects to equipment detail view

---

### TC-33: Equipment Creation with All Fields Including Optional Ones

**Acceptance Criteria:** All AC  
**Business Rule:** All BR  
**Test Type:** Happy Path - Complete Form  

**Test Data:**
- Login credentials provided
- Manufacturer: "ABB" or valid manufacturer
- Supplier/Vendor: "ROGGER CLIFF" or valid supplier
- Supplier ID: "SUP-Complete-001" (unique)
- Equipment Category: "PUMPS"
- Equipment Type: "PUMP"
- Feature: "Hydraulic"
- Model Information: "Model X-2000"
- Status: ACTIVE (default)

**Steps:**
1. Login and navigate to New Equipment form
2. Select Equipment Category: "PUMPS"
3. Select Equipment Type: "PUMP"
4. Fill Manufacturer field: "ABB"
5. Fill Supplier/Vendor field: "ROGGER CLIFF"
6. Fill Supplier ID: "SUP-Complete-001"
7. Fill Feature field: "Hydraulic"
8. Fill Model Information field: "Model X-2000"
9. Verify Status is ACTIVE (keep default)
10. Click "Save Equipment" button

**Expected Results:**
- All fields save correctly
- Equipment record includes all optional fields (Category, Type, Feature, Model Info)
- Form validation passes with complete data set
- Success confirmation appears
- Saved record contains all entered information:
  - TPS ID (auto-generated)
  - Status: ACTIVE
  - Category: PUMPS
  - Type: PUMP
  - Manufacturer: ABB
  - Supplier: ROGGER CLIFF
  - Supplier ID: SUP-Complete-001
  - Feature: Hydraulic
  - Model Information: Model X-2000
- Equipment appears in list with complete data

---

### TC-34: Equipment Creation with Minimal Required Data (Mandatory Fields Only)

**Acceptance Criteria:** All AC  
**Business Rule:** BR-3, BR-6, BR-11, BR-12  
**Test Type:** Happy Path - Minimal Data  

**Test Data:**
- Login credentials provided
- Manufacturer: "Mitsubishi" or valid manufacturer
- Supplier/Vendor: "Valid Supplier"
- Supplier ID: "SUP-Min-001" (unique)
- All optional fields: EMPTY

**Steps:**
1. Login and navigate to New Equipment form
2. Do NOT select Equipment Category (leave as SELECT...)
3. Do NOT select Equipment Type (leave as SELECT...)
4. Fill Manufacturer only
5. Fill Supplier/Vendor only
6. Fill Supplier ID only
7. Do NOT fill Feature (leave empty)
8. Do NOT fill Model Information (leave empty)
9. Do NOT change Status (keep default ACTIVE)
10. Click "Save Equipment" button

**Expected Results:**
- Form processes with only mandatory fields
- Form validation passes with minimal data
- No errors for empty optional fields
- Equipment is successfully saved
- Equipment record is created with complete mandatory data:
  - TPS ID (auto-generated)
  - Status: ACTIVE (default)
  - Manufacturer: Selected
  - Supplier: Selected
  - Supplier ID: Entered
  - Category: Empty/Default
  - Type: Empty/Default
  - Feature: Empty
  - Model Info: Empty
- Minimal equipment record is functional
- Record appears in Equipment list

---

### TC-35: Equipment Creation with Status Changed to OBSOLETE

**Acceptance Criteria:** AC-8  
**Business Rule:** BR-9  
**Test Type:** Happy Path - Status Variation  

**Test Data:**
- Login credentials provided
- Status: OBSOLETE (changed from default ACTIVE)
- Manufacturer: Valid manufacturer
- Supplier/Vendor: Valid supplier
- Supplier ID: "SUP-Obsolete-001" (unique)

**Steps:**
1. Login and navigate to New Equipment form
2. Change Status dropdown from ACTIVE to OBSOLETE
3. Fill Manufacturer field
4. Fill Supplier/Vendor field
5. Fill Supplier ID field
6. Leave other optional fields empty
7. Click "Save Equipment" button

**Expected Results:**
- Status dropdown change is successful
- Status field displays "OBSOLETE" after selection
- Form validation passes with OBSOLETE status
- Equipment is saved with OBSOLETE status
- Saved record shows Status: OBSOLETE
- Equipment appears in list with OBSOLETE designation
- TPS ID is assigned correctly despite non-default status
- All other mandatory fields are properly saved

---

## NAVIGATION & FORM CONTROL TEST CASES

### TC-36: Cancel Button Discards Form Without Saving

**Acceptance Criteria:** N/A  
**Business Rule:** N/A  
**Test Type:** Form Navigation  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Fill in multiple fields:
   - Manufacturer: "Siemens"
   - Supplier/Vendor: "VOLVO SPARE"
   - Supplier ID: "SUP-Cancel-001"
   - Feature: "Test Feature"
3. Do NOT save the form
4. Click "Cancel" button
5. Verify what happens

**Expected Results:**
- Cancel button is accessible and clickable
- Clicking Cancel closes the form without saving
- User is redirected to Equipment list page
- Entered data is not saved (verified by checking equipment list)
- No confirmation dialog appears (or if it does, confirm cancel)
- Equipment list is displayed after cancel
- Newly created equipment record does NOT appear in list
- No error messages appear after cancelling

---

### TC-37: Tab Navigation Preserves Entered Data

**Acceptance Criteria:** N/A  
**Business Rule:** N/A  
**Test Type:** Form Navigation - Data Retention  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Equipment Identification tab is active
3. Fill Manufacturer field: "ABB"
4. Fill Supplier/Vendor field: "ROGGER CLIFF"
5. Fill Supplier ID field: "SUP-Tab-001"
6. Click on "Performance" tab
7. Wait for Performance tab to load
8. Return to "Equipment Identification" tab
9. Verify previously entered data

**Expected Results:**
- Can switch to Performance tab successfully
- Performance tab loads without errors
- Equipment Identification tab remains available
- Returning to Equipment Identification tab shows previously entered data:
  - Manufacturer: "ABB" (retained)
  - Supplier/Vendor: "ROGGER CLIFF" (retained)
  - Supplier ID: "SUP-Tab-001" (retained)
  - TPS ID: Still visible and unchanged
- Data is not lost during tab navigation
- Data persists across multiple tab switches

---

### TC-38: Back Button Navigation to Equipment List

**Acceptance Criteria:** N/A  
**Business Rule:** N/A  
**Test Type:** Form Navigation  

**Test Data:**
- Login credentials provided

**Steps:**
1. Login and navigate to New Equipment form
2. Observe the back arrow button in the top-left corner of the form
3. Fill a few fields with test data
4. Click the back arrow button
5. Verify navigation result

**Expected Results:**
- Back arrow button is visible in form header (top-left)
- Button is interactive and clickable
- Clicking back arrow closes the form
- User is redirected to Equipment list page
- Equipment list is displayed properly
- Equipment list shows previously created equipment
- No newly created record appears if data wasn't saved
- Page loads without errors

---

## Test Execution Environment Requirements

### System Requirements
- **Browser:** Chrome/Chromium (latest version)
- **OS:** Windows 10+, macOS, or Linux
- **Network:** Stable internet connection to reach dev.liveaccess.ai
- **Screen Resolution:** Minimum 1366x768 pixels for full visibility

### Test Data Requirements
- **Valid Login Account:** somveergurjar.megaminds@gmail.com / Qwert@123
- **Master Data:** Existing manufacturers and suppliers (VOLVO SPARE, ROGGER CLIFF, etc.)
- **Test IDs:** Unique supplier IDs for each test case (SUP-TEST-001, SUP-HappyPath-001, etc.)

### Pre-condition Setup
1. User account is active and has access to Equipment module
2. Application is accessible at https://dev.liveaccess.ai
3. Master data (manufacturers, suppliers) exist in the system
4. Database is in clean state for testing (no data conflicts)
5. No validation or business rule conflicts with existing data

### Post-condition Cleanup
- Delete test equipment records created during testing
- Clear any test data from manufacturer/supplier master lists if added
- Verify Equipment list returns to baseline state

---

## Test Metrics & Coverage Summary

### Coverage by Acceptance Criteria
| AC | Coverage | Related Test Cases |
|----|----------|-------------------|
| AC-1 | 100% | TC-1, TC-2, TC-27, TC-28, TC-29, TC-30 |
| AC-2 | 100% | TC-3, TC-6, TC-7, TC-8 |
| AC-3 | 100% | TC-5, TC-9, TC-10, TC-11, TC-12, TC-13 |
| AC-4 | 100% | TC-14, TC-15, TC-16 |
| AC-5 | 100% | TC-17, TC-18, TC-19 |
| AC-6 | 100% | TC-20, TC-21, TC-22, TC-23 |
| AC-7 | 100% | TC-24, TC-25, TC-26 |
| AC-8 | 100% | TC-4, TC-31, TC-35 |

### Coverage by Business Rule
| BR | Coverage | Test Coverage |
|----|----------|--------------|
| BR-1, BR-2 | 100% | TC-3, TC-6, TC-7, TC-8, TC-32 |
| BR-3, BR-4, BR-5 | 100% | TC-5, TC-9, TC-10, TC-11, TC-12, TC-13 |
| BR-6 | 100% | TC-14, TC-15, TC-16, TC-17, TC-18, TC-19 |
| BR-7, BR-8 | 100% | TC-20, TC-21, TC-22, TC-23 |
| BR-9 | 100% | TC-4, TC-31, TC-35 |
| BR-10 | 100% | TC-1, TC-27, TC-28, TC-29, TC-30 |
| BR-11, BR-12 | 100% | TC-24, TC-25, TC-26, TC-32, TC-33, TC-34 |

---

## Test Execution Priority

### Priority 1 - Critical (Core Functionality)
- TC-32: Happy Path - All mandatory fields
- TC-9, TC-10, TC-11: Mandatory field validation
- TC-3: TPS ID auto-generation
- TC-14, TC-17: Manufacturer and Supplier selection

### Priority 2 - High (Important Features)
- TC-33: Complete form with all fields
- TC-20, TC-22, TC-23: Supplier ID validation
- TC-24, TC-25, TC-26: Optional fields
- TC-27, TC-28, TC-29, TC-30, TC-31: Dropdown functionality

### Priority 3 - Medium (UI & Navigation)
- TC-1, TC-2, TC-4: UI validation
- TC-36, TC-37, TC-38: Navigation and controls
- TC-5: Field alignment and layout

---

## Notes and Assumptions

1. **Test Data:** Test data assumes clean database state without conflicts
2. **Master Data:** Existing manufacturers and suppliers are available in the system
3. **User Permissions:** Test user has all necessary permissions for Equipment module
4. **System Behavior:** No known system outages or maintenance during testing
5. **Validation Messages:** Exact error message text may vary based on system configuration
6. **Timing:** Wait times account for normal network latency and page load times
7. **Browser:** Tests assume modern browser with JavaScript enabled
8. **Uniqueness:** Each test case uses unique Supplier IDs to avoid conflicts

---

## Conclusion

This comprehensive test plan provides complete coverage of the SCRUM-101 Add Equipment workflow Equipment Identification tab. The 38+ test cases systematically validate all acceptance criteria and business rules, covering UI validation, field functionality, mandatory requirements, optional field handling, dropdown operations, happy path scenarios, and form navigation. The test plan is designed for systematic execution and provides clear expected results for each scenario.
