Project Module – System Revision Detail Page (Overview & Areas Tabs)


User Story:
I want to open a specific System Revision from inside a Project's Systems section and see its key revision details and its Primary P&ID Drawing status at a glance,
So that I can quickly confirm the revision's stage, ownership, and drawing approval status, and jump into the project-wide Approval Register when I need to review or act on the drawing's approval.


Objective:
The System Revision Detail page (opened from a System's revision list) will allow authorized users to:
Open a specific revision of a System and land on its Overview tab by default
View the revision's core metadata: System No./Rev, System Status, Project Stage, Revision Created Under, Created By, Last Updated, Change Notes
View the revision's Primary P&ID Drawing summary: Drawing No./Rev, Drawing Status, TPS Approval, Client Approval
Jump directly from the Primary P&ID Drawing panel into the project's Approval Register via "View in Approval Register"
View, add, edit, and delete the physical Areas defined under a System Revision, via the "Areas" sub-tab
Add one or more Sub-Locations under a given Area
Navigate to the revision's other sub-tabs (Equipment, Deleted Equipment, Spare Parts, Documents, Drawings) — covered in follow-up user stories


Functional Overview:
Entry path: Project Module → open/maximize a project → Systems section → a System lists its revisions → clicking a revision opens the System Revision Detail page.
The System Revision Detail page contains:
A sub-tab bar: Overview, Areas, Equipment, Deleted Equipment, Spare Parts, Documents, Drawings — with Overview active by default
A left-hand "System Revision" panel showing the revision's metadata
A right-hand "Primary P&ID Drawing" panel showing the linked drawing's identity, status, and approval state, plus a "View in Approval Register" button
The "View in Approval Register" button navigates to the project's Approvals tab (Approval Register), the same destination documented in Project_Module_Drawings_Approvals_UserStory.md (AC-82, AC-151–AC-161)

The Areas tab contains:
A "Revision Areas" section header with a count badge showing the total number of areas (e.g., "0 Areas", "1 Areas")
A "+ Add Area" button in the top-right corner
A data table with columns (rendered in upper-case headers): AREA CODE, LOCATION, SKID/MODULE, SKID SEQ, SUB-LOCATION, DESCRIPTION, ACTIONS
An empty-state message "No areas defined for this revision." when no areas exist
An "Add Area" pop-up with mandatory Area Code and Location fields and an optional Description field
Per-row Actions: a "+" icon to add a Sub-Location under that area, an edit (pencil) icon, and a delete (trash) icon
An "Add New Sub-Location" pop-up with mandatory Name, Skid/Module, and Skid Seq fields


Acceptance Criteria:


--- Section: Navigation to System Revision Detail Page ---

AC-01: Open a System Revision from the Systems Section
Given the user has opened/maximized a project and is viewing its Systems section
When the user clicks on a specific revision listed under a System
Then the system must navigate to that revision's System Revision Detail page (not an inline preview)

AC-02: Sub-Tab Bar Displayed
Given the System Revision Detail page has loaded
When the user views the tab bar
Then it must display: Overview, Areas, Equipment, Deleted Equipment, Spare Parts, Documents, Drawings — with Overview active by default

AC-03: Overview Tab Layout
Given the Overview tab is active
When the user views the page
Then it must display a "System Revision" panel on the left and a "Primary P&ID Drawing" panel on the right


--- Section: System Revision Panel ---

AC-04: System Revision Panel – Field Display
Given the Overview tab is active
When the user views the "System Revision" panel
Then it must display the following fields populated with the revision's saved values: System No. / Rev, System Status, Project Stage, Revision Created Under, Created By, Last Updated, Change Notes

AC-05: System No. / Rev Format
Given the System Revision panel is displayed
When the user views "System No. / Rev"
Then it must render as "{System No.} / {Revision}" (e.g., "2607-04-P01 / R00")

AC-06: System Status Rendered as Badge
Given the System Revision panel is displayed
When the user views "System Status"
Then the value must render as a color-coded status badge (e.g., Draft), with badge colors consistent with equivalent statuses shown elsewhere in the Project Module

AC-07: Project Stage Field
Given the System Revision panel is displayed
When the user views "Project Stage"
Then it must display the project stage this revision currently sits under (e.g., Draft)

AC-08: Revision Created Under Field
Given the System Revision panel is displayed
When the user views "Revision Created Under"
Then it must display the stage/context the revision was created under (e.g., Draft)

AC-09: Created By Field
Given the System Revision panel is displayed
When the user views "Created By"
Then it must display the username of the user who created the revision (e.g., "SG_USER'S")

AC-10: Last Updated Timestamp Format
Given the System Revision panel is displayed
When the user views "Last Updated"
Then it must display the date and time the revision was last updated, including timezone (e.g., "07/17/2026, 16:14 (GMT + 8 HOUR)")

AC-11: Change Notes Field
Given the System Revision panel is displayed
When the user views "Change Notes"
Then it must display any change notes recorded for this revision, or an appropriate empty state if none were entered


--- Section: Primary P&ID Drawing Panel ---

AC-12: Primary P&ID Drawing Panel – Field Display
Given the Overview tab is active
When the user views the "Primary P&ID Drawing" panel
Then it must display: Drawing No. / Rev, Drawing Status, TPS Approval, Client Approval, and a "View in Approval Register" button

AC-13: Drawing No. / Rev Format
Given the Primary P&ID Drawing panel is displayed
When the user views "Drawing No. / Rev"
Then it must render as "{Drawing No.} / {Revision}" (e.g., "2607-04-P01 / R00")

AC-14: Drawing Status Rendered as Badge
Given the Primary P&ID Drawing panel is displayed
When the user views "Drawing Status"
Then the value must render as a color-coded status badge (e.g., Draft), consistent with the Drawing Status badge values defined in Project_Module_Drawings_Approvals_UserStory.md

AC-15: TPS Approval Rendered as Badge
Given the Primary P&ID Drawing panel is displayed
When the user views "TPS Approval"
Then the value must render as a color-coded status badge using the same supported values as the Drawings grid (N/A, Awaiting, Approved), e.g., "Approved"

AC-16: Client Approval Rendered as Badge
Given the Primary P&ID Drawing panel is displayed
When the user views "Client Approval"
Then the value must render as a color-coded status badge using the same supported values as the Drawings grid (N/A, Pending TPS, Awaiting, Approved, Rejected), e.g., "Awaiting"

AC-17: Primary P&ID Drawing Reflects the System's Linked P&ID
Given a System Revision has a Primary P&ID Drawing associated with it
When the user views the Primary P&ID Drawing panel
Then the displayed Drawing No./Rev, Drawing Status, TPS Approval, and Client Approval must match that drawing's actual current record (the same drawing as shown in the project's Drawings grid)

AC-18: "View in Approval Register" Button Displayed
Given the Primary P&ID Drawing panel is displayed
When the user views the bottom of the panel
Then a "View in Approval Register" button must be visible

AC-19: "View in Approval Register" Navigation
Given the user is on a System Revision's Overview tab
When the user clicks "View in Approval Register"
Then the system must navigate to that project's Approvals tab (Approval Register), per the destination and behavior defined in Project_Module_Drawings_Approvals_UserStory.md (AC-82, AC-151–AC-161)

AC-20: Approval Register Opens Filtered/Scrolled to the Relevant Drawing — Open Item
Given the user clicks "View in Approval Register" from a specific System Revision's Primary P&ID Drawing panel
When the Approval Register loads
Then whether the register auto-filters or scrolls to highlight that specific drawing (versus showing the default unfiltered view) is pending confirmation from the reference material


--- Section: Areas Tab – Display ---

AC-01: Access the Areas Tab
Given the user is on a System Revision's detail page
When the user clicks the "Areas" sub-tab
Then the system must display the "Revision Areas" panel, with Areas now the active/highlighted sub-tab

AC-02: Revision Areas Header Shows Total Count
Given the Areas tab is displayed
When the user views the section header
Then it must show "Revision Areas" alongside a badge with the total number of areas defined for the revision (e.g., "0 Areas", "1 Areas")

AC-03: Areas Table – Columns
Given the Areas tab is displayed
When the user views the table
Then it must show columns, in this order, rendered in upper case: AREA CODE, LOCATION, SKID/MODULE, SKID SEQ, SUB-LOCATION, DESCRIPTION, ACTIONS

AC-04: Areas Table – Empty State
Given no areas have been defined for the revision
When the user views the Areas table
Then it must display the message "No areas defined for this revision." in place of any rows

AC-05: Area Code Displayed as Clickable Link
Given one or more areas exist for the revision
When the user views the AREA CODE column
Then each value must render as a clickable link (e.g., "A23")

AC-06: Description Column Truncates Long Text
Given an area has a long Description value
When the user views the DESCRIPTION column
Then the text must be visually truncated (e.g., with an ellipsis) within the cell


--- Section: Add Area ---

AC-07: Open Add Area Modal
Given the user is on the Areas tab
When the user clicks "+ Add Area"
Then the "Add Area" pop-up must open with fields: Area Code (mandatory), Location (mandatory), Description (optional), and "Cancel"/"Add Area" actions

AC-08: Area Code Field Mandatory Validation
Given the "Add Area" pop-up is open
When the user clicks "Add Area" with the Area Code field left blank
Then the Area Code field must be outlined in red and display "Code is required."

AC-09: Location Field Mandatory Validation
Given the "Add Area" pop-up is open
When the user clicks "Add Area" with the Location field left blank
Then the Location field must be outlined in red and display "Location is required."

AC-10: Description Field is Optional
Given the "Add Area" pop-up is open with Area Code and Location filled in
When the user submits with the Description field left blank
Then the area must be created successfully without any validation error

AC-11: Submission Blocked Until Mandatory Validation Resolved
Given the Area Code and/or Location field is left blank
When the user clicks "Add Area"
Then the modal must not close and no area record must be created

AC-12: Cancel Button Closes Modal Without Saving
Given the user has entered values into the "Add Area" pop-up
When the user clicks "Cancel"
Then the modal must close and no area record must be created

AC-13: Successful Area Creation
Given Area Code and Location are filled in (Description optional)
When the user clicks "Add Area"
Then the modal must close, the new area must appear as a new row in the Revision Areas table, and the area count badge must increment by one


--- Section: Area Row Actions ---

AC-14: Actions Column Icons
Given one or more areas exist in the table
When the user views the ACTIONS column for a row
Then it must show three icons: "+" (Add Sub-Location), edit (pencil), and delete (trash)

AC-15: Edit an Existing Area
Given an area row is displayed
When the user clicks the edit (pencil) icon
Then an edit form (pre-populated with that area's Area Code, Location, and Description) must open, allowing the user to update and save the area's details, subject to the same mandatory validation as Add Area (AC-08–AC-09)

AC-16: Delete an Area
Given an area row is displayed
When the user clicks the delete (trash) icon
Then the system must remove that area from the Revision Areas table and decrement the area count badge by one — whether a confirmation prompt is shown before deletion is pending confirmation from the reference material

AC-17: Deleting an Area Removes Its Sub-Locations — Open Item
Given an area has one or more Sub-Locations defined under it
When the user deletes that area
Then whether its Sub-Locations are deleted along with it, or deletion is blocked/warned against, is pending confirmation from the reference material


--- Section: Add Sub-Location ---

AC-18: Open Add New Sub-Location Modal
Given an area row is displayed in the Areas table
When the user clicks the "+" icon in that row's ACTIONS column
Then the "Add New Sub-Location" pop-up must open with fields: Name (mandatory), Skid/Module (mandatory), Skid Seq (mandatory), and "Cancel"/"Save" actions

AC-19: Name Field Mandatory Validation
Given the "Add New Sub-Location" pop-up is open
When the user clicks "Save" with the Name field left blank
Then submission must be blocked, since Name is a mandatory field

AC-20: Skid/Module Field Mandatory Validation
Given the "Add New Sub-Location" pop-up is open
When the user clicks "Save" with the Skid/Module field left blank
Then submission must be blocked, since Skid/Module is a mandatory field

AC-21: Skid Seq Field Mandatory Validation
Given the "Add New Sub-Location" pop-up is open
When the user clicks "Save" with the Skid Seq field left blank
Then submission must be blocked, since Skid Seq is a mandatory field

AC-22: Cancel Button Closes Sub-Location Modal Without Saving
Given the user has entered values into the "Add New Sub-Location" pop-up
When the user clicks "Cancel"
Then the modal must close and no sub-location record must be created

AC-23: Successful Sub-Location Creation
Given Name, Skid/Module, and Skid Seq are all filled in
When the user clicks "Save"
Then the modal must close and the new sub-location's values must appear against the parent area's row in the SKID/MODULE, SKID SEQ, and SUB-LOCATION columns

AC-24: Multiple Sub-Locations Under One Area — Open Item
Given an area already has a sub-location defined
When the user adds another sub-location to the same area via the "+" icon
Then how multiple sub-locations under a single area are displayed within the single-row table layout (e.g., stacked values, expandable row, or separate rows) is pending confirmation from the reference material


Note:
This user story documents the Overview and Areas tabs of the System Revision Detail page. The remaining sub-tabs (Equipment, Deleted Equipment, Spare Parts, Documents, Drawings) will be documented in follow-up passes as each screen is shared.
The entry flow (Project Module → maximize project → Systems section → "+ Add System" → revisions under a system → click a revision) is described from user narration; the exact UI of the System list / "+ Create New Revision" screen is not yet captured and may be documented separately.
The "View in Approval Register" button on this page is understood to lead to the same project-level Approval Register documented in Project_Module_Drawings_Approvals_UserStory.md — whether it lands on the unfiltered register or one pre-scoped to this drawing is an open item (AC-20).
The Areas tab (Areas Tab section, AC-01–AC-24) is confirmed from live application screenshots: the "Revision Areas" panel with count badge, the AREA CODE/LOCATION/SKID-MODULE/SKID SEQ/SUB-LOCATION/DESCRIPTION/ACTIONS table, the "Add Area" modal (Area Code and Location mandatory, Description optional, with inline red-outline validation), row-level Actions (+ / edit / delete), and the "Add New Sub-Location" modal (Name, Skid/Module, Skid Seq all mandatory). Open items: whether delete shows a confirmation prompt and cascades to sub-locations (AC-16–AC-17), and how multiple sub-locations under one area render in the table (AC-24).
Note: AC numbering restarts at AC-01 for each tab section (Overview tab ACs and Areas tab ACs are numbered independently) at the user's request.
