USer Story : Tag Module 

application url : 
https://dev.liveaccess.ai/login

test credential : 
Email Address-somveergurjar.megaminds@gmail.com
password : Qwert@1234




Acceptance Criteria – Tag Module

AC-1: Verify Tag List Page UI and Column Presence

Given the user navigates to the Tag module
Then the system should display the Tag List page

And the following elements should be visible:

Page title: Tag List
Total records count (e.g., "4 records")
"+ New Tag" button
"Reset Filters" button

And the data table should contain the following columns:

Tag Prefix
Tag Description
Actions (Delete icon)

And all UI elements should be properly aligned and accessible

AC-2: Verify Dynamic Total Records Count

Given the user is on the Tag List page
Then the system should display total number of records dynamically

When a new tag is added
Then the total record count should increase accordingly

When a tag is deleted
Then the total record count should decrease accordingly

And the displayed count should always match the actual number of records in the table

AC-3: Verify Tag Prefix Filter Functionality

Given the user enters a value in the Tag Prefix filter field
When the user applies the filter
Then the system should display only matching records

And the filtering should be:

Case-insensitive (if applicable)
Partial match supported
AC-4: Verify Tag Description Filter Functionality

Given the user enters a value in the Tag Description filter field
When the user applies the filter
Then the system should display only matching records

And the filtering should support partial and relevant matches

AC-5: Verify Reset Filters Functionality

Given the user has applied filters on Tag Prefix and/or Tag Description
When the user clicks on "Reset Filters" button
Then all filter inputs should be cleared

And the system should display the complete unfiltered Tag List

AC-6: Verify "+ New Tag" Button Functionality

Given the user is on the Tag List page
Then the "+ New Tag" button should be visible and enabled

When the user clicks on "+ New Tag"
Then a pop-up modal titled "New Tag" should be displayed

AC-7: Verify New Tag Modal UI and Field Presence

Given the user opens the New Tag modal
Then the following fields should be visible:

Tag Prefix (*) (Text Field)
Tag Description (Optional Text Field)

And the modal should contain:

Save Tag button
Cancel button
Close (X) icon

And mandatory fields should be marked with "*"

AC-8: Validate Mandatory Field - Tag Prefix

Given the user is in the New Tag modal
When the user clicks "Save Tag" without entering Tag Prefix
Then the system should display validation message:

"Tag Prefix is required"

And the field should:

Be highlighted with red border
Show inline validation message

And the record should NOT be saved

AC-9: Verify Tag Description Field Behavior

Given the user enters value in Tag Description
Then the system should accept any valid text input

And the field should be optional

And the system should allow saving the record without Tag Description

AC-10: Verify Save Tag Functionality

Given the user enters valid data in Tag Prefix and optional Tag Description
When the user clicks on "Save Tag"
Then the system should save the new tag successfully

And the modal should close

And the newly added record should be visible in the Tag List

And total record count should be updated

AC-11: Verify Cancel and Close Functionality

Given the user opens the New Tag modal
When the user clicks on "Cancel" button
Then the modal should be closed without saving data

When the user clicks on "X" (close icon)
Then the modal should be closed without saving data

AC-12: Verify Delete Tag Functionality

Given the user is on the Tag List page
When the user clicks on delete icon for a record
Then the selected tag should be deleted successfully

And the system should display a toaster message:

"Tag deleted successfully"

And the record should be removed from the list

And the total record count should be updated

AC-13: Verify Data Persistence in Tag List

Given the user adds a new tag
Then the record should persist in the list after:

Page refresh
Navigation away and back


Technical Notes:

- Use Playwright for test automation
- Test across Chrome, Firefox 
- Ensure all laptop responsiveness flow
- Validate all form validation messages
- Test navigation flow and back button behavior

Definition of Done:

- All acceptance criteria have test cases
- Manual exploratory testing completed
- Automated test scripts created and passing
- Test results documented
- Bugs logged for any failures