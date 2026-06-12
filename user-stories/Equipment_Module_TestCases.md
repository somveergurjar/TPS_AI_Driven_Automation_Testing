# Equipment Module QA Test Cases

## Module Overview
Comprehensive QA test cases for the Equipment module covering page load, list rendering, CRUD operations, tab-wise validation (Identification, Process, Automation, Commercial), spare parts/documents linking, search & filter, and end-to-end flows.

---

## 1. Page Load & Basic UI

### TC_EQ_LIST_001 – Equipment page loads successfully
**Steps:** Login → Navigate to Equipment module → Observe page loading  
**Expected:** Equipment page loads; no blank screen or UI crash; URL contains `/equipment`

### TC_EQ_LIST_002 – Equipment grid loads properly
**Steps:** Open Equipment module → Observe table/grid  
**Expected:** Rows and columns visible; no missing grid structure

### TC_EQ_LIST_003 – Column headers are visible
**Steps:** Open Equipment module → Verify header row  
**Expected:** TPS ID, Equipment Name, Equipment Type, Supplier, Category, Status, Actions headers visible

### TC_EQ_LIST_004 – New Equipment button is visible and enabled
**Steps:** Open Equipment module → Locate New Equipment button  
**Expected:** Button visible, enabled, and interactive

### TC_EQ_LIST_005 – No broken UI elements on Equipment page
**Steps:** Open Equipment module → Inspect icons, labels, spacing  
**Expected:** No broken icons, no overlapping text, no alignment issues, no hidden controls

### TC_EQ_LIST_006 – Visual layout is correct
**Steps:** Open Equipment module → Verify table and New Equipment button co-exist  
**Expected:** Layout matches expected design; no visual regressions

### TC_EQ_LIST_007 – Rows load correctly with non-empty text
**Steps:** Open Equipment module → Review first row  
**Expected:** Rows display properly; no blank or corrupted rows

### TC_EQ_LIST_008 – Data visible across all columns in first row
**Steps:** Open Equipment module → Inspect first row cells  
**Expected:** Non-empty values in at least the primary columns

### TC_EQ_LIST_009 – Pagination controls navigate between pages
**Steps:** Open Equipment module → Click Next/Previous pagination buttons  
**Expected:** Page navigates correctly; correct records display on each page

---

## 2. Create Equipment

### TC_EQ_CREATE_001 – Create equipment with valid mandatory data saves successfully
**Priority:** High | **Tags:** Smoke, Regression, CRUD  
**Steps:**
1. Navigate to Equipment module
2. Click New Equipment
3. Fill: Equipment Name, Tag Prefix, Supplier, Supplier Identification No.
4. Click Save Equipment  
**Expected:** Success toast appears; record appears in Equipment List

### TC_EQ_CREATE_002 – Save without mandatory fields shows validation errors
**Priority:** High | **Tags:** Validation, Regression  
**Steps:**
1. Navigate to New Equipment page
2. Leave all mandatory fields empty
3. Click Save Equipment  
**Expected:** Field-level validation errors appear; record is not saved

### TC_EQ_CREATE_003 – New Equipment button navigates to creation page with Identification tab active
**Steps:** Click New Equipment button  
**Expected:** Navigates to New Equipment Record page; Identification tab is active by default

### TC_EQ_CREATE_004 – Save Equipment button is visible and clickable
**Steps:** Open New Equipment form → Observe Save button  
**Expected:** Save Equipment button is visible and enabled

### TC_EQ_CREATE_005 – Cancel from New Equipment form returns to Equipment List
**Steps:** Open New Equipment → Click Cancel  
**Expected:** Returns to Equipment List; unsaved data discarded; confirmation dialog shown if data entered

---

## 3. Delete Equipment

### TC_EQ_DELETE_001 – Delete action removes equipment and shows success toast
**Priority:** High | **Tags:** CRUD, Regression  
**Steps:**
1. Create a test equipment record
2. Find it in the list
3. Click Delete icon → Confirm in modal  
**Expected:** Success toast appears; record no longer appears in the filtered list

### TC_EQ_DELETE_002 – Delete modal appears before confirming delete action
**Steps:** Click Delete icon for a record  
**Expected:** Confirmation modal appears with Delete and Cancel buttons; Cancel keeps the record

---

## 4. Identification Tab

### TC_EQ_IDENT_001 – TPS ID is auto-generated and read-only
**Steps:** Open New Equipment → Observe TPS ID field  
**Expected:** TPS ID field is read-only/disabled; value is system-generated

### TC_EQ_IDENT_002 – Saving without Equipment Name shows validation error
**Steps:** Leave Equipment Name empty → Click Save  
**Expected:** Validation error displayed for Equipment Name

### TC_EQ_IDENT_003 – Saving without Supplier shows validation error
**Steps:** Fill Equipment Name only → Click Save  
**Expected:** Validation error displayed for Supplier field

### TC_EQ_IDENT_004 – Identification tab is active by default
**Steps:** Navigate to New Equipment  
**Expected:** Identification tab is highlighted/active; Identification fields visible

### TC_EQ_IDENT_005 – Supplier dropdown lists available options
**Steps:** Click Supplier input on Identification tab  
**Expected:** Dropdown expands showing available supplier options

### TC_EQ_IDENT_006 – Status dropdown defaults to ACTIVE
**Steps:** Open New Equipment → Observe Status field  
**Expected:** Status field shows ACTIVE as default value

### TC_EQ_IDENT_007 – Cancel discards form and returns to Equipment List
**Steps:** Open New Equipment → Click Cancel  
**Expected:** Returns to Equipment List; confirmation dialog if data entered

### TC_EQ_IDENT_008 – Supplier Identification No. accepts unique value
**Steps:** Enter a unique Supplier Identification No.  
**Expected:** Field accepts the value; no error

---

## 5. Tab Navigation

### TC_EQ_NAV_001 – User can navigate to Process tab after filling mandatory Identification fields
**Steps:** Fill mandatory Identification fields → Click Process tab  
**Expected:** Process tab opens without validation error

### TC_EQ_NAV_002 – User can navigate to Automation tab
**Steps:** Complete Identification → Navigate Process → Click Automation tab  
**Expected:** Automation tab renders correctly

### TC_EQ_NAV_003 – User can navigate to Commercial tab
**Steps:** Complete Identification → Process → Automation → Click Commercial tab  
**Expected:** Commercial tab renders correctly

### TC_EQ_NAV_004 – Navigating to Process tab without mandatory fields shows validation
**Steps:** Leave mandatory fields empty → Click Process tab  
**Expected:** Validation message shown or navigation blocked; app remains stable

---

## 6. Process Tab

### TC_EQ_PROC_001 – Process tab renders and all fields are optional
**Steps:** Navigate to Process tab  
**Expected:** Tab renders; no mandatory field markers; blank fields do not block save

### TC_EQ_PROC_002 – Process tab fields accept values without inline validation errors
**Steps:** Enter values in Process tab text fields  
**Expected:** No validation error shown immediately; values accepted

---

## 7. Automation Tab

### TC_EQ_AUTO_001 – Automation tab renders without crash
**Steps:** Navigate to Automation tab  
**Expected:** Tab content renders; no error or blank screen

### TC_EQ_AUTO_002 – Toggle switches (AS-i, IO-Link, Profinet, Motor Starter) are interactive
**Steps:** Click each toggle on Automation tab  
**Expected:** Toggles respond; ON/OFF state changes; page remains stable

---

## 8. Commercial Tab

### TC_EQ_COM_001 – Commercial tab renders without crash
**Steps:** Navigate to Commercial tab  
**Expected:** Tab content renders; no error or blank screen

### TC_EQ_COM_002 – Commercial fields accept optional values
**Steps:** Enter HS Code, Country of Origin, List Price  
**Expected:** Fields accept values; no validation errors for optional fields

---

## 9. Spare Parts Linking

### TC_EQ_SPLINK_001 – Spare Parts tab displays Available and Linked sections
**Steps:** Open New Equipment → Navigate to Spare Parts tab  
**Expected:** Two sections visible: Available Spare Parts and Linked Spare Parts

### TC_EQ_SPLINK_002 – User can link a spare part by clicking an available card
**Steps:** Open Spare Parts tab → Click first available item card  
**Expected:** Item moves to Linked section; count updates; page remains stable

### TC_EQ_SPLINK_003 – Spare parts search bar filters available items
**Steps:** Enter search term in Spare Parts search bar  
**Expected:** Only matching items shown; "No spare parts found" on no match; app stable

### TC_EQ_SPLINK_004 – Linked count is visible in tab header or corner
**Steps:** Open Spare Parts tab  
**Expected:** Count of linked vs. total (e.g., 0 / 12) is displayed

---

## 10. Documents Linking

### TC_EQ_DOC_001 – Documents tab displays Available and Linked sections
**Steps:** Open New Equipment → Navigate to Documents tab  
**Expected:** Available Documents and Linked Documents sections visible

### TC_EQ_DOC_002 – User can link a document by clicking an available card
**Steps:** Open Documents tab → Click first available document card  
**Expected:** Document moves to Linked section; page remains stable

### TC_EQ_DOC_003 – Documents search bar filters available items
**Steps:** Enter search term in Documents search bar  
**Expected:** Only matching documents shown; "No documents found" on no match

### TC_EQ_DOC_004 – Linked document count is visible in tab header or corner
**Steps:** Open Documents tab  
**Expected:** Count of linked vs. total documents displayed

---

## 11. Search & Filter

### TC_EQ_FILTER_001 – Filter by TPS ID shows only matching records
**Steps:** Enter a valid TPS ID in TPS ID filter column  
**Expected:** Only records matching the TPS ID are displayed

### TC_EQ_FILTER_002 – Filter by Equipment Name returns matching records
**Steps:** Enter an equipment name keyword in Name filter  
**Expected:** Records matching the name keyword are shown

### TC_EQ_FILTER_003 – Filter with invalid value shows no-results state
**Steps:** Enter a random value with no matches  
**Expected:** Empty state or "No equipment found" message; app remains stable

### TC_EQ_FILTER_004 – Reset Filters restores full record list
**Steps:** Apply filter → Click Reset Filters  
**Expected:** All filter fields cleared; complete equipment list displayed

### TC_EQ_FILTER_005 – Filter with empty input shows full list without errors
**Steps:** Clear a filter field → Apply  
**Expected:** All records displayed; no error

### TC_EQ_FILTER_006 – Filter with very long input does not crash the application
**Steps:** Enter 500+ character string in Name filter  
**Expected:** App handles input without crash; appropriate empty-state shown

---

## 12. End-to-End Flow

### TC_EQ_E2E_001 – Create, link, save, search and delete equipment successfully
**Priority:** Critical | **Tags:** E2E, Smoke, Regression  
**Steps:**
1. Navigate to Equipment List — verify page loads
2. Click New Equipment
3. Capture auto-generated TPS ID
4. Fill Equipment Name, Tag Prefix, Supplier, Supplier Identification No.
5. Navigate Process tab (optional fields)
6. Navigate Automation tab (toggle a switch)
7. Navigate Commercial tab (optional fields)
8. Navigate Spare Parts tab → link a spare part if available
9. Navigate Documents tab → link a document if available
10. Click Save Equipment — verify success toast
11. Navigate back to Equipment List
12. Search by TPS ID — verify record appears
13. Search by Equipment Name — verify record appears
14. Verify Delete button is visible
15. Click Delete → confirm in modal → verify success toast
16. Verify deleted record no longer appears in filtered list  
**Expected:** Full CRUD flow completes without errors; all linked data persists
