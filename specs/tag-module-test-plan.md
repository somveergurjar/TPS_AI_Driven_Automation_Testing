# Tag Module Test Plan

## Overview
This test plan covers the Tag module for the LiveAccess application. It validates Tag List UI, filtering, New Tag modal behavior, required field validation, save/delete operations, and persistence after refresh/navigation.

### Assumptions
- The application is accessible at `https://dev.liveaccess.ai`
- User login uses the provided credentials from the user story
- The Tag module is reachable from the primary application navigation or by direct URL
- The Tag List page uses a standard table layout with filter inputs and a modal dialog for adding tags
- The environment is fresh enough to add and remove tags safely

## Test Scenarios

### Scenario 1: Verify Tag List Page UI and Column Presence
**ID:** TC-01
**Objective:** Confirm the Tag List page loads with correct title, controls, and columns.

**Steps:**
1. Login with valid credentials.
2. Navigate to the Tag module.
3. Verify the page title shows `Tag List`.
4. Verify the total record count label is visible.
5. Verify the `+ New Tag` button is visible and enabled.
6. Verify the `Reset Filters` button is visible.
7. Verify the table headers include `Tag Prefix`, `Tag Description`, and `Actions`.
8. Verify the table rows are visible.

**Expected Result:**
- The Tag List page loads successfully with all required UI elements and table columns visible.

### Scenario 2: Verify Filter Functionality
**ID:** TC-02
**Objective:** Confirm Tag Prefix and Tag Description filters work correctly and support partial matches.

**Steps:**
1. Login and navigate to Tag module.
2. Enter a partial value in the Tag Prefix filter.
3. Apply the filter.
4. Verify only matching rows remain.
5. Clear/reset filters.
6. Enter a partial value in the Tag Description filter.
7. Apply the filter.
8. Verify only matching rows remain.

**Expected Result:**
- Filters return matching rows for partial values.
- Case-insensitive matching is supported when applicable.
- Reset returns the full tag list.

### Scenario 3: Verify Reset Filters Functionality
**ID:** TC-03
**Objective:** Confirm reset clears filters and restores the full list.

**Steps:**
1. Login and navigate to Tag module.
2. Enter values in both Tag Prefix and Tag Description filters.
3. Apply the filters.
4. Click `Reset Filters`.
5. Verify both filter inputs are cleared.
6. Verify the full tag list is displayed again.

**Expected Result:**
- All filter inputs are cleared.
- The Tag List returns to its unfiltered state.

### Scenario 4: Verify New Tag Modal UI and Required Field Validation
**ID:** TC-04
**Objective:** Confirm the New Tag modal opens, contains expected fields, and validates required input.

**Steps:**
1. Login and navigate to Tag module.
2. Click `+ New Tag`.
3. Verify the modal title is `New Tag`.
4. Verify `Tag Prefix (*)` and `Tag Description` fields are visible.
5. Verify `Save Tag`, `Cancel`, and close icon are visible.
6. Click `Save Tag` without entering Tag Prefix.
7. Verify validation message `Tag Prefix is required` appears.
8. Verify the Tag Prefix field is highlighted as invalid.
9. Verify the modal remains open.

**Expected Result:**
- The New Tag modal opens with all required UI elements.
- Required field validation works and prevents save when Tag Prefix is blank.

### Scenario 5: Verify Optional Tag Description and Modal Dismissal
**ID:** TC-05
**Objective:** Confirm Tag Description is optional and modal dismissal does not save.

**Steps:**
1. Login and navigate to Tag module.
2. Open the New Tag modal.
3. Enter only a Tag Prefix and leave description blank.
4. Click `Cancel`.
5. Reopen the modal and verify no record was added.
6. Open the modal again, then click the close icon.
7. Verify the modal closes without saving.

**Expected Result:**
- Tag Description is optional.
- Cancel and close dismiss the modal without adding a tag.

### Scenario 6: Verify Save Tag Functionality
**ID:** TC-06
**Objective:** Confirm a valid new tag can be created and is visible in the list.

**Steps:**
1. Login and navigate to Tag module.
2. Open the New Tag modal.
3. Enter a unique Tag Prefix and optional Tag Description.
4. Click `Save Tag`.
5. Verify the modal closes.
6. Verify the new record appears in the Tag List.
7. Verify the total record count increments.

**Expected Result:**
- A new tag is added successfully and visible in the list.
- The record count updates appropriately.

### Scenario 7: Verify Delete Tag Functionality
**ID:** TC-07
**Objective:** Confirm a tag can be deleted and count updates.

**Steps:**
1. Login and navigate to Tag module.
2. Create a new unique tag if none exists for deletion.
3. Delete the prepared tag.
4. Verify the success toaster appears with `Tag deleted successfully`.
5. Verify the record is removed from the table.
6. Verify the total records count decrements.

**Expected Result:**
- The selected tag is deleted successfully.
- The success notification appears.
- The count updates correctly.

### Scenario 8: Verify Data Persistence
**ID:** TC-08
**Objective:** Confirm newly created tags persist after page refresh and navigation.

**Steps:**
1. Login and navigate to Tag module.
2. Create a new unique tag.
3. Refresh the page.
4. Verify the new tag still appears.
5. Navigate away from Tag module and return.
6. Verify the new tag still appears in the list.

**Expected Result:**
- New tags persist after refresh and navigation away from the Tag module.

## Execution Notes
- Execute tests in both Chromium and Firefox projects.
- Use unique prefix values for create/delete tests to avoid collisions.
- Keep each test independent so they can run in any order.
- Clean up created tags when possible to avoid stale test data.
