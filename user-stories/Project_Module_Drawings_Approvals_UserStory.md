Project Module – Drawings & Approvals


User Story:
I want to view, manage, and track all controlled drawings and their approval status using the Drawings and Approvals tabs inside the Project Module,
So that I can ensure every drawing linked to a project or system is properly registered, categorized, filtered, and approved by both TPS and Client before it is used.


Objective:
The Drawings & Approvals section will allow authorized users to:
View all controlled drawings registered under a project
View drawings registered under a specific system (secondary entry point, covered later)
Add a new drawing to a project
Filter and search drawings using per-column filters
Reset all applied filters back to default
Customize which columns are visible using Column Settings
Reveal internal-only fields (Origin) using the Internal Details toggle
Open a drawing's detail page, view its linked systems, upload its required file package, and manage revision-specific supporting files (including documents automatically inherited from linked systems)
Track TPS Approval and Client Approval status for every drawing, including full approval history and the ability for TPS to approve/reverse and for the Client to approve, comment, request revisions, or reject
Track and review drawing approvals across the whole project through the Approvals tab (Approval Register)


Functional Overview:
The Drawings tab contains:
Two entry points to reach a project's drawings:
1. Project Overall page → Drawings tab (current scope for this user story)
2. System detail page → Drawings tab (secondary flow, to be covered later)
"All Project Drawings" section header with description text "All controlled drawings registered under this project"
A data grid with the following default columns: Drawing No., Rev, Type, Category, Title, Scope, Linked To, Drawing Status, TPS Approval, Client Approval, Actions
A dedicated filter input under every column header
Reset Filters button to clear all applied filters
Columns button opening a "Column Settings" panel with Select All, Deselect All, Reset Default, and a checkbox per column
Internal Details toggle button that reveals/hides the Origin column (values align with Scope: PROJECT or SYSTEM)
+ Add Drawing button opening an "Add Controlled Drawing" pop-up to register a new drawing under the project, with mandatory field validation, an auto-generated Drawing No. (based on Drawing Type + Category), locked Scope/Origin/Revision defaults, an optional "Link to System" multi-select, and an "Approval Required" toggle
Actions column with a "view" (eye) icon that opens a dedicated Drawing Detail page (Overview, Linked Systems, Supporting Files, Approval Details, Revision History tabs), including a "Linked Systems" read-only reference table, a "Supporting Files" tab for revision-specific files (client markups, scanned comment sheets, approval correspondence — both manually uploaded and auto-inherited from linked systems), a "File package required" upload panel for the mandatory Issue PDF/Source File package while the drawing is Awaiting File, and an "Approval Details" tab where TPS reviews/approves and the Client records their response (Approved, Approved with Comments, Revise and Resubmit, or Rejected)
Approvals tab (Approval Register), shown alongside Overall Equipment, Documents, and Drawings, listing the approval status of every controlled drawing in the project with status filters (All, Outstanding, Approved/Active, Rejected, Superseded) and a REVIEW action into each drawing's Approval Details


Quick Summary — Happy Path Flow (Plain-English):
This is a fast, non-technical walkthrough of how one drawing moves from creation to fully approved. Use this to get oriented; use the numbered AC-xx list below when you need the exact rule for a specific screen or field.

1. Create the drawing
   Super Admin opens a project → Drawings tab → clicks "+ Add Drawing".
   Enters a Title, picks a Drawing Type (P&ID / Layout / Component GA-3D / Electrical) — Category options narrow automatically, and the Drawing No. auto-generates.
   Optionally links one or more Systems, leaves "Approval Required" ON (default), and clicks "Create Drawing".
   → New row appears in the grid. Status: AWAITING FILE. TPS Approval: N/A. Client Approval: N/A.

2. Upload the required files
   Super Admin opens the drawing and uploads its Required File Package — always an Issue PDF, plus a Source File whose format depends on Drawing Type (DWG for P&ID/Layout, STP/STEP for Component GA-3D, DWG/native for Electrical).
   → Once both required files are in, Status flips to DRAFT / PENDING INTERNAL APPROVAL.

3. TPS reviews and approves
   Super Admin/TPS Engineer opens the Approval Details tab and approves.
   → TPS Approval: Approved. Client Approval: Awaiting. (TPS can "Reverse Approval" within 24 hours if a mistake was found.)

4. Client reviews and responds
   Client Admin logs in, opens the same project, goes to Drawings → "View in Approval Register" (or opens the drawing directly) and lands on Approval Details.
   Picks one of: Approved / Approved with Comments / Revise and Resubmit / Rejected, then clicks "Record Response".
   → If Approved: Client Approval: Approved, banner shows "Drawing is now Active".
   → If Rejected: must pick Reason(s) + write Comments; the current revision is invalidated and a new revision (R01) is required to move forward.

5. Track everything centrally
   Anyone can open the project's Approvals tab (Approval Register) to see every drawing's TPS/Client status in one table, filter by All / Outstanding / Approved-Active / Rejected / Superseded, and jump straight into any drawing via "REVIEW".

Along the way (supporting, not blocking, the happy path):
Supporting Files tab holds extra revision documents (client markups, comment sheets) — uploaded manually or auto-pulled in when a system is linked. These are supplementary and don't affect the Awaiting File → Draft transition.
Linked Systems tab is a read-only record of which systems this drawing belongs to.
Grid filters, Column Settings, and the Internal Details toggle are convenience tools for finding/customizing what you see in the Drawings list — they don't change any drawing's approval state.


Acceptance Criteria:


--- Section: Tab Access ---

AC-01: Access Drawings Tab from Project Overall
Given the user is on a project's detail page (e.g., "2603-01 · VOLVO SPARE")
When the user clicks on the "Drawings" tab
Then the system must display the "All Project Drawings" section listing all controlled drawings registered under that project, with the Drawings tab now the active/highlighted tab, and the grid loading without a full page refresh


--- Section: Drawings Grid – Column Display ---

AC-02: Default Column Set Displayed
Given the Drawings tab is open
When the drawings grid loads
Then the table must display exactly these columns, in order: Drawing No., Rev, Type, Category, Title, Scope, Linked To, Drawing Status, TPS Approval, Client Approval, Actions

AC-03: Drawing No. Displayed as Clickable Link
Given the drawings grid is loaded
When the user views the Drawing No. column
Then each Drawing No. value must render as a clickable link

AC-04: Scope Rendered as Badge
Given the drawings grid is loaded
When the user views the Scope column
Then the value must render as a badge (e.g., SYSTEM, PROJECT)

AC-05: Linked To Empty State
Given a drawing has no linked system or document
When the user views its Linked To column
Then the cell must display "—"

AC-06: Linked To Multiple References
Given a drawing has one or more linked systems/documents
When the user views its Linked To column
Then the cell must display them as a comma-separated list

AC-07: Status Columns Rendered as Color-Coded Badges
Given the drawings grid is loaded
When the user views the Drawing Status, TPS Approval, or Client Approval columns
Then each value must render as a color-coded status badge, and badge colors must remain consistent across all projects and systems for the same status value

AC-08: TPS Approval Supported Values
Given the drawings grid is loaded
When the user views the TPS Approval column across all drawings
Then only these values must appear: N/A, Awaiting, Approved

AC-09: Client Approval Supported Values
Given the drawings grid is loaded
When the user views the Client Approval column across all drawings
Then only these values must appear: N/A, Pending TPS, Awaiting, Approved, Rejected (full sequence defined in the Revision Lifecycle section, AC-146–AC-150)

AC-10: TPS/Client Approval Default to N/A When Awaiting File
Given a drawing's Drawing Status is "Awaiting File"
When the user views that row
Then both TPS Approval and Client Approval must display "N/A"


--- Section: Column Filtering ---

AC-11: Filter by Drawing No.
Given the Drawings tab is open with data loaded
When the user enters a full or partial value (e.g., "2607-04-P01") into the Drawing No. filter
Then the grid must display only rows whose Drawing No. contains the entered text

AC-12: Filter by Rev
Given the Drawings tab is open with data loaded
When the user selects/enters a revision (e.g., "R00", "R04") into the Rev filter
Then the grid must display only rows matching that exact revision

AC-13: Filter by Type
Given the Drawings tab is open with data loaded
When the user selects a value (e.g., "P&ID", "Layout") into the Type filter
Then the grid must display only rows matching the selected Drawing Type

AC-14: Filter by Category
Given the Drawings tab is open with data loaded
When the user selects a value (e.g., "Process", "Utility", "Equipment") into the Category filter
Then the grid must display only rows matching the selected Category

AC-15: Filter by Title
Given the Drawings tab is open with data loaded
When the user enters full or partial text (e.g., "EXPANSION") into the Title filter
Then the grid must display only rows whose Title contains the entered text

AC-16: Filter by Scope
Given the Drawings tab is open with data loaded
When the user selects "SYSTEM" or "PROJECT" into the Scope filter
Then the grid must display only rows matching that scope

AC-17: Filter by Linked To
Given the Drawings tab is open with data loaded
When the user enters/selects a linked system or document name into the Linked To filter
Then the grid must display only rows whose Linked To value contains that reference, and rows showing "—" must be excluded unless a "blank/none" option is explicitly selected

AC-18: Filter by Drawing Status
Given the Drawings tab is open with data loaded
When the user selects a value (e.g., "Awaiting File", "Draft") into the Drawing Status filter
Then the grid must display only rows matching that status

AC-19: Filter by TPS Approval
Given the Drawings tab is open with data loaded
When the user selects a value (e.g., "Approved", "N/A") into the TPS Approval filter
Then the grid must display only rows matching that value

AC-20: Filter by Client Approval
Given the Drawings tab is open with data loaded
When the user selects a value (e.g., "Awaiting", "N/A") into the Client Approval filter
Then the grid must display only rows matching that value

AC-21: Column Filters Operate Independently
Given a filter is already applied on one column
When the user applies a filter on a different column
Then the first column's filter must remain unaffected and unchanged

AC-22: Combined Filters Narrow Results (AND Behavior)
Given the user has applied filters on two or more columns at the same time
When the grid re-renders
Then it must display only rows that satisfy all applied filters simultaneously, and applying an additional filter must further narrow the current result set rather than replace it

AC-23: No Matching Records Empty State
Given one or more filters are applied
When no drawings match the applied filter criteria
Then the grid must display an appropriate empty-state message (e.g., "No drawings match your filters")

AC-24: Clearing a Single Filter Restores Remaining Matches
Given multiple column filters are applied
When the user clears one column's filter
Then the grid must restore rows matching the remaining active filters, without affecting the other applied filters

AC-25: Reset Filters
Given one or more filters are applied on the Drawings grid
When the user clicks the "Reset Filters" button
Then all applied filters must be cleared and the grid must reload the complete, unfiltered list of project drawings, while column visibility settings remain unaffected


--- Section: Column Settings ---

AC-26: Open Column Settings Panel
Given the Drawings tab is open
When the user clicks the "Columns" button
Then a "Column Settings" panel must open, displaying a checkbox for every available column along with Select All, Deselect All, and Reset Default controls

AC-27: Toggle Individual Column Visibility
Given the Column Settings panel is open
When the user checks or unchecks a specific column's checkbox
Then that column must immediately show or hide in the grid accordingly

AC-28: Select All Columns
Given the Column Settings panel is open
When the user clicks "Select All"
Then every column checkbox must become checked and every column must be shown in the grid

AC-29: Deselect All Columns
Given the Column Settings panel is open
When the user clicks "Deselect All"
Then every column checkbox must become unchecked and every column must be hidden from the grid, except any column marked non-optional

AC-30: Reset Default Columns
Given the user has changed column visibility from its defaults
When the user clicks "Reset Default"
Then the original default column configuration must be restored

AC-31: Origin Checkbox Disabled Until Internal Details Enabled
Given Internal Details is currently off
When the user opens the Column Settings panel
Then the Origin column checkbox must appear disabled/greyed out and must not be selectable

AC-32: Column Settings Apply Immediately
Given the Column Settings panel is open
When the user changes any column's visibility
Then the change must apply to the grid immediately, without requiring a separate save action

AC-33: Column Settings Persist on Panel Close
Given the user has changed column visibility
When the user closes the panel using the "X" control
Then the last applied column configuration must be retained


--- Section: Internal Details Toggle ---

AC-34: Enable Internal Details Reveals Origin Column
Given Internal Details is currently off
When the user clicks the "Internal Details" button
Then the Origin column must become visible in the grid, positioned between Scope and Linked To

AC-35: Origin Value Matches Scope
Given the Origin column is visible
When the user views a drawing's Origin value
Then it must match that drawing's Scope value (PROJECT or SYSTEM)

AC-36: Internal Details Button Active State
Given the user has enabled Internal Details
When the user views the "Internal Details" button
Then it must visually indicate an active/enabled state

AC-37: Disable Internal Details Hides Origin Column
Given Internal Details is currently on
When the user clicks the "Internal Details" button again
Then the Origin column must be hidden and the button must return to its inactive state


--- Section: Drawing Detail Page (Opened via Actions Icon) ---

AC-38: Navigate to Drawing Detail Page via Actions Icon
Given the Drawings grid is populated with at least one drawing
When the user (e.g., Super Admin) clicks the "view" (eye) icon in the Actions column for a specific row
Then the system must navigate to a dedicated Drawing Detail page for that Drawing No. and Revision (not an inline preview)

AC-39: Drawing Detail Page Header
Given the Drawing Detail page has loaded
When the user views the header
Then it must display the Drawing No.–Revision as the page title (e.g., "2607-04-UT02-R00"), a status badge (e.g., "RESERVED / AWAITING FILE"), the drawing's Title as subtext, and a back-navigation arrow to return to the Drawings grid

AC-40: Drawing Detail Page Tabs
Given the Drawing Detail page has loaded
When the user views the tab bar
Then it must display: Overview, Linked Systems, Supporting Files, Approval Details, Revision History — with Overview active by default

AC-41: Drawing Overview Tab – Field Display
Given the Overview tab is active on the Drawing Detail page
When the user views the "Drawing Overview" panel
Then it must display the following fields populated with the drawing's saved values: Drawing No., Revision, Type, Title, Scope, Linked To, Approval Required, Origin, Created By, Project Stage, and Revision Created Under

AC-42: Linked Systems Tab – Display
Given the "Linked Systems" tab is active on the Drawing Detail page
When the user views it
Then it must display a "Linked Systems" panel with subtext "Links are managed when creating a drawing or creating a new revision" and a table listing every system linked to the drawing, with columns "SYSTEM NO." and "SYSTEM NAME"

AC-43: Linked Systems Table – Row Content
Given a drawing has one or more systems linked (selected via "Link to System" at creation, per AC-135)
When the user views the Linked Systems tab table
Then each row must display that system's System No. as a clickable link and its System Name, matching the systems selected at creation

AC-44: Linked Systems Are Read-Only on This Tab
Given the Linked Systems tab is displayed
When the user looks for add/remove/edit controls
Then none must be available on this tab — links can only be managed when creating the drawing or creating a new revision, per the panel's subtext

AC-45: Filters and Column State Preserved After Returning from Drawing Detail Page
Given the user opened a drawing's detail page from a filtered/customized grid view
When the user navigates back to the Drawings grid
Then the grid must retain the previously applied filters and column settings


--- Section: Supporting Files Tab ---

AC-46: Supporting Files Tab – Display
Given the "Supporting Files" tab is active on the Drawing Detail page
When the user views it
Then it must display a "Supporting Files" panel with subtext "Revision-specific files — client markups, scanned comment sheets, approval correspondence" and a table listing all supporting files uploaded for that revision

AC-47: Supporting Files Table – Columns
Given the Supporting Files tab is displayed
When the user views the table
Then it must show columns: File Name, Rev, Type, Uploaded By, Date, Action

AC-48: Supporting Files Table – Row Content
Given one or more supporting files have been uploaded for a revision
When the user views the table
Then each row must display the file name as a clickable link, the Revision it was uploaded under, a Type badge (e.g., "Client Markup", "Approval Correspondence"), the uploader's name, the upload date, and a download icon in the Action column

AC-49: Download a Supporting File
Given the Supporting Files table lists at least one file
When the user clicks the download icon in the Action column for a row
Then the system must download that file

AC-50: Open Upload Supporting File Modal
Given the Supporting Files tab is displayed
When the user clicks "Upload File"
Then the "Upload Supporting File" pop-up must open with an "Upload New File" section containing Select File, File Type, and Notes fields, plus "Upload File" and "Clear" actions

AC-51: Select File Field Mandatory Validation
Given the "Upload Supporting File" pop-up is open
When the user clicks "Upload File" without choosing a file
Then the system must block submission, since "Select File" is a mandatory field

AC-52: File Type Field Mandatory Validation
Given the "Upload Supporting File" pop-up is open with a file selected
When the user clicks "Upload File" without selecting a File Type (field shows placeholder "Select type...")
Then the system must block submission, since "File Type" is a mandatory field

AC-53: Notes Field is Optional
Given the "Upload Supporting File" pop-up is open with a file selected and a File Type chosen
When the user submits the upload with the Notes field left blank
Then the upload must succeed without any validation error, since Notes ("Brief description of this file...") is optional

AC-54: Clear Button Resets Upload Form
Given the user has selected a file, chosen a file type, and/or entered notes in the "Upload Supporting File" pop-up
When the user clicks "Clear"
Then all entered/selected values must be reset to their empty/default state

AC-55: Successful Supporting File Upload
Given a file is selected and a valid File Type is chosen in the "Upload Supporting File" pop-up
When the user clicks "Upload File"
Then the modal must close and the new file must appear as a new row in the Supporting Files table, with Uploaded By set to the current user and Date set to the upload date

AC-56: Linked System's Existing Revision Documents Auto-Populate Supporting Files
Given a system is linked to the drawing (via "Link to System" at creation, per AC-135, or when creating a new revision)
When that linked system already has existing revision documents
Then those documents must automatically appear as rows in the drawing's Supporting Files table, without the user needing to manually upload them

AC-57: Auto-Populated Files Are Distinguishable from Manually Uploaded Files
Given the Supporting Files table contains both files inherited from a linked system and files manually uploaded via "Upload File"
When the user views the table
Then the source of each file must be identifiable so auto-inherited documents are not confused with manually uploaded ones — the exact UI indicator (e.g., Type badge, source tag) is pending confirmation from the reference material

AC-58: Linking an Additional System Also Pulls In Its Existing Documents
Given a drawing already has at least one linked system with associated Supporting Files
When the user links an additional system to the drawing (at creation or via a new revision)
Then that additional system's existing revision documents must also be added to the drawing's Supporting Files table


--- Section: Required File Package Upload (Awaiting File → Draft) ---

AC-59: File Package Required Panel Shown While Awaiting File
Given a drawing's Drawing Status is "Awaiting File" ("Reserved / Awaiting File")
When the user views the Drawing Detail page
Then a "File package required" panel must be displayed with the message "Upload both the Issue PDF and the Source File to move this drawing to Draft."

AC-60: File Package Panel Offers Two Upload Zones
Given the "File package required" panel is displayed
When the user views it
Then it must show two separate upload zones — "ISSUE PDF" and "SOURCE FILE" — each supporting drag-and-drop or an "Upload File" button

AC-61: Issue PDF Required for All Drawing Types
Given a drawing of any Drawing Type is Awaiting File
When the user uploads a file into the "ISSUE PDF" zone
Then the system must require a PDF file, since the Issue PDF is used for viewing, approval, and client review across all Drawing Types

AC-62: Source File Format — P&ID
Given Drawing Type = "P&ID"
When the user uploads the Source File
Then the system must require a DWG file (Required File Package: PDF + DWG)

AC-63: Source File Format — Layout
Given Drawing Type = "Layout"
When the user uploads the Source File
Then the system must require a DWG file (Required File Package: PDF + DWG)

AC-64: Source File Format — Component GA / 3D
Given Drawing Type = "Component GA / 3D"
When the user uploads the Source File
Then the system must require an STP/STEP file, or another explicitly approved native file format (Required File Package: PDF + STP/STEP or other approved native file)

AC-65: Source File Format — Electrical
Given Drawing Type = "Electrical"
When the user uploads the Source File
Then the system must require a DWG file or an approved electrical native file format (Required File Package: PDF + DWG / electrical native file)

AC-66: Drawing Type (Not Category) Determines Required Source File Format
Given a drawing is being created or has its Source File uploaded
When the required Source File format is determined
Then it must be derived from the drawing's Drawing Type only; Category must have no effect on which Source File format is required and must serve only to describe what the drawing relates to (e.g., Process, Utility, Pneumatic, CIP, Electrical)

AC-67: Incorrect File Type Validation Message
Given the user attempts to upload a file of an unsupported type into either the Issue PDF or Source File zone
When the upload is submitted
Then the system must block the upload and display a clear validation message stating the incorrect file type and the expected format

AC-68: Drawing Status Remains Awaiting File Until All Required Files for That Type Are Uploaded
Given a drawing's Required File Package includes multiple files (e.g., a P&ID requiring both PDF and DWG)
When only some of the required files have been uploaded (e.g., PDF uploaded but DWG missing)
Then the Drawing Status must remain "Awaiting File" and must NOT move to "Draft"

AC-69: Uploading All Required Files Transitions Status to Draft
Given all files required by the drawing's Required File Package (per its Drawing Type) have been uploaded successfully with valid file types
When the last required file upload completes
Then the Drawing Status must transition from "Awaiting File" to "Draft" (consistent with AC-147 in the Revision Lifecycle section)


--- Section: Drawing File Package & Approval Status (Post-Upload) ---

AC-70: Status Badge Updates to "Draft / Pending Internal Approval" After Upload
Given both required files for the drawing's Required File Package have been uploaded successfully
When the user views the Drawing Detail page header
Then the status badge must display "DRAFT / PENDING INTERNAL APPROVAL"

AC-71: "Drawing File Package" Panel Replaces "File Package Required" Panel
Given a drawing has moved out of "Awaiting File" status
When the user views the Drawing Detail page
Then the "File package required" upload panel must be replaced by a "Drawing File Package" panel showing the drawing's current approval sub-status (e.g., "Draft — awaiting approval")

AC-72: Drawing File Package Panel Lists Uploaded Files
Given the "Drawing File Package" panel is displayed
When the user views it
Then it must list each uploaded file — e.g., "ISSUE PDF" with its filename, "SOURCE FILE" with its filename — each with a download icon

AC-73: Uploaded File Naming Convention
Given a file has been uploaded against a drawing revision
When the user views its filename in the Drawing File Package panel
Then the filename must follow the convention {Drawing No.}-{Revision}-{File Type Suffix}.{extension} (e.g., 2607-04-UT02-R00-PDF.pdf, 2607-04-UT02-R00-SOURCE.dwg)

AC-74: Download an Uploaded File
Given the "Drawing File Package" panel is displayed
When the user clicks the download icon next to a listed file
Then the system must download that file

AC-75: Replace File Package Button Available
Given a drawing has an uploaded file package
When the user views the "Drawing File Package" panel
Then a "Replace File Package" button must be available in the panel header

AC-76: Replace File Package Requires Both Files Together
Given the user clicks "Replace File Package"
When the replace flow is presented
Then the user must be required to upload both the Issue PDF and the Source File together to complete the replacement — a single file cannot be replaced on its own

AC-77: Replace File Package Enforces Same File Type Validation
Given the user is replacing the file package
When a replacement file does not match the required type for that slot (Issue PDF must be PDF; Source File must match the Drawing Type's required format per AC-62–AC-66)
Then the system must reject the upload and display the incorrect-file-type validation message (per AC-67)

AC-78: Approval Status Panel Displayed
Given a drawing has moved out of "Awaiting File" status
When the user views the Drawing Detail page
Then an "Approval Status" panel must be displayed showing two rows: "TPS Review" (subtext "Internal engineering approval") and "Client" (subtext describing its dependency on TPS)

AC-79: TPS Review Shows "Pending" Until Super Admin Approves
Given the drawing's TPS Approval has not yet been granted
When the user views the "TPS Review" row in the Approval Status panel
Then it must display "PENDING"

AC-80: Client Row Shows "Awaiting" and Locked Until TPS Approves
Given the drawing's TPS Approval has not yet been granted
When the user views the "Client" row in the Approval Status panel
Then it must display "AWAITING" with subtext "Locked until TPS approves", and the Client Admin must not be able to take any approval action in this state


--- Section: Approval Details Tab ---

AC-81: Approval Details Tab – Display
Given the "Approval Details" tab is active on the Drawing Detail page
When the user views it
Then it must display a "View in Approval Register" shortcut button in the top-right corner, plus two side-by-side sections: "TPS Engineering Approval" and "Client Approval"

AC-82: View in Approval Register Navigation
Given the user is on a drawing's Approval Details tab
When the user clicks "View in Approval Register"
Then the system must navigate directly to that project's Approvals tab (Approval Register)

AC-83: TPS Engineering Approval – Pending State
Given TPS has not yet approved the drawing
When the user views the "TPS Engineering Approval" panel
Then it must display Status: "Pending TPS review" with a clock icon

AC-84: TPS Engineering Approval – Approved State
Given TPS has approved the drawing
When the user views the "TPS Engineering Approval" panel
Then it must display Status: "TPS approved" (with a check icon), along with "Approved by {User}" and the approval date/time (e.g., "20 Jul 2026, 20:30 (GMT + 8 HOUR)")

AC-85: Reverse Approval Button Availability Within 24 Hours
Given TPS approved the drawing within the last 24 hours
When the user views the "TPS Engineering Approval" panel
Then a "Reverse Approval" button must be displayed with subtext "Available within 24 hours of approval only"

AC-86: Reverse Approval Button Unavailable After 24 Hours
Given more than 24 hours have passed since TPS approval
When the user views the "TPS Engineering Approval" panel
Then the "Reverse Approval" button must no longer be available

AC-87: Reverse Approval Permission
Given TPS approval was granted within the last 24 hours
When determining who may click "Reverse Approval"
Then only the Super Admin or the TPS Engineer must be permitted to reverse the approval

AC-88: Client Approval – Locked State Before TPS Approval
Given TPS has not yet approved the drawing
When the user views the "Client Approval" panel
Then it must display Status: "Locked until TPS approval" with subtext "This drawing is pending internal TPS review."

AC-89: Client Approval – Awaiting Client Response After TPS Approval
Given TPS has approved the drawing
When the user views the "Client Approval" panel
Then it must display Status: "Awaiting client response"

AC-90: "What Does Approval Mean?" Info Dropdown
Given the "Client Approval" panel is displayed
When the user clicks "What does approval mean?"
Then an informational expander must open, collapsed by default

AC-91: Approval History Table – Columns
Given the Approval Details tab is displayed
When the user views the "Approval History" section
Then it must show a table with columns: Date/Time, Event, User, Details

AC-92: Approval History – Most Recent Event First
Given multiple approval events have occurred for the revision
When the user views the Approval History table
Then rows must be listed with the most recent event at the top

AC-93: Approval History – "Record Created" Event
Given the revision was just created
When the user views the Approval History table
Then the earliest row must show Event "Record created", the creating user, and Details "Revision {Rev} created"

AC-94: Approval History – "TPS Review Started" Event
Given the drawing's required file package has been fully uploaded
When the user views the Approval History table
Then a row must show Event "TPS review started" with Details "Submitted for internal review"

AC-95: Approval History – "TPS Approved" Event
Given TPS has approved the drawing
When the user views the Approval History table
Then a row must show Event "TPS approved" with Details "Internal approval completed"

AC-96: Approval History – "Submitted to Client" Event
Given TPS approval triggers the client review stage
When the user views the Approval History table
Then a row must show Event "Submitted to client" with Details "Client approval requested"

AC-97: Approval History – "Client Approved" Event
Given the Client has recorded an "Approved" response
When the user views the Approval History table
Then a row must show Event "Client approved", the client user, and Details "Drawing is now Active"

AC-98: Client Admin Access Path to Approval Details
Given a Client Admin logs in and navigates to the Project Module → the project associated with their client account → Project Overall → Drawings tab
When they click "View in Approval Register" (or open a drawing whose Client Approval is actionable)
Then the system must present that drawing's Approval Details page showing the Client Approval section

AC-99: Client Response Options Displayed
Given a Client Admin views the Client Approval panel with Status "Awaiting client response"
When they view "Record client response"
Then four selectable options must be displayed: Approved, Approved with Comments, Revise and Resubmit, Rejected

AC-100: Selecting "Approved" Shows Attachment and Record Response
Given the Client Admin selects "Approved"
When the form updates
Then an optional "Attachment" field ("Attach client comment sheet...") and a "Record Response" button must be displayed

AC-101: Selecting "Rejected" Shows Mandatory Reason and Comments Fields
Given the Client Admin selects "Rejected"
When the form updates
Then a mandatory "Reason(s)" checkbox list (Technical correction required, Missing information, Mismatch with project scope/specification, Drawing quality/readability issue, Wrong drawing or revision, Other), a mandatory "Comments" textarea ("Describe what needs to be changed..."), and an optional "Attachment" field must be displayed

AC-102: Record Response Blocked Until Mandatory Rejection Fields Are Filled
Given "Rejected" is selected
When the Client Admin has not selected at least one Reason and has not entered Comments
Then the "Record Response" button must remain disabled/blocked

AC-103: Successful "Approved" Client Response
Given the Client Admin selects "Approved" and clicks "Record Response"
When the response is recorded
Then the Client Approval panel must update to Status "Client approved" with a "Drawing is now Active" confirmation banner, showing "Recorded by: {Client User}" and the response date

AC-104: "Approved with Comments" and "Revise and Resubmit" Fields — Open Item
Given the Client Admin selects "Approved with Comments" or "Revise and Resubmit"
When the form updates
Then the corresponding additional fields and validation must be defined — these were not captured in the shared reference screenshots and remain an open item pending confirmation


--- Section: Add Drawing – Modal & Field Validation ---

AC-105: Open Add Controlled Drawing Modal
Given the user is on the Drawings tab of a project
When the user clicks the "+ Add Drawing" button
Then the "Add Controlled Drawing" pop-up must open, titled "Add Controlled Drawing" with subtext "Creates an official controlled drawing record"

AC-106: Title Field Mandatory Validation
Given the "Add Controlled Drawing" pop-up is open
When the user clicks "Create Drawing" with the Title field left blank
Then the Title field must be outlined in red and display "Title is required."

AC-107: Drawing Type Field Mandatory Validation
Given the "Add Controlled Drawing" pop-up is open
When the user clicks "Create Drawing" with no Drawing Type selected
Then the Drawing Type field must be outlined in red and display "Drawing type is required."

AC-108: Category Field Disabled Until Drawing Type Selected
Given the "Add Controlled Drawing" pop-up is open and no Drawing Type has been selected
When the user views the Category field
Then it must remain disabled and display the placeholder "SELECT TYPE FIRST"

AC-109: Category Field Mandatory Validation
Given a Drawing Type has been selected (Category is now enabled)
When the user clicks "Create Drawing" with no Category selected
Then the Category field must be outlined in red and display "Category is required."

AC-110: Submission Blocked Until Mandatory Validation Resolved
Given one or more mandatory field validations (Title, Drawing Type, Category) are unresolved
When the user clicks "Create Drawing"
Then the modal must not close and no drawing record must be created


--- Section: Category Restricted by Drawing Type ---

AC-111: Allowed Categories for Drawing Type "P&ID"
Given the user selects Drawing Type "P&ID"
When the Category dropdown populates
Then it must offer only: Process, Utility, Pneumatic, CIP

AC-112: Allowed Categories for Drawing Type "Layout"
Given the user selects Drawing Type "Layout"
When the Category dropdown populates
Then it must offer only: General, Process, Utility, CIP, Electrical, Piping, Foundation / Openings

AC-113: Allowed Category for Drawing Type "Component GA / 3D"
Given the user selects Drawing Type "Component GA / 3D"
When the Category dropdown populates
Then it must offer only: Equipment

AC-114: Electrical Recognized as a Distinct Drawing Type
Given the user opens the Drawing Type dropdown
When the list of Drawing Types is displayed
Then "Electrical" must appear as its own main Drawing Type (not merely as a Category under Layout); its own allowed Category list is used for filtering/description only and is pending confirmation, since it was not captured in the shared reference screenshots

AC-115: Category Resets When Drawing Type Changes
Given a Category is already selected
When the user changes the Drawing Type to a different value
Then the previously selected Category must be cleared and the Category dropdown must repopulate with only the categories valid for the newly selected Drawing Type


--- Section: Auto-Generated Drawing No. ---

AC-116: Drawing No. Placeholder Before Type Selection
Given the "Add Controlled Drawing" pop-up is open and no Drawing Type has been selected
When the user views the "DRAWING NO. (AUTO-ASSIGNED)" field
Then it must show the placeholder "Select a drawing type to preview the number"

AC-117: Prefix for P&ID + Process
Given Drawing Type = "P&ID" and Category = "Process"
When the Drawing No. is generated
Then it must use prefix "P" (e.g., 2607-04-P0x)

AC-118: Prefix for P&ID + Utility
Given Drawing Type = "P&ID" and Category = "Utility"
When the Drawing No. is generated
Then it must use prefix "UT" (e.g., 2607-04-UT02)

AC-119: Prefix for P&ID + Pneumatic
Given Drawing Type = "P&ID" and Category = "Pneumatic"
When the Drawing No. is generated
Then it must use prefix "PN" (e.g., 2607-04-PN01)

AC-120: Prefix for P&ID + CIP
Given Drawing Type = "P&ID" and Category = "CIP"
When the Drawing No. is generated
Then it must use prefix "CIP" (e.g., 2607-04-CIP02)

AC-121: Prefix for Layout (Any Category)
Given Drawing Type = "Layout" with any of its allowed categories selected
When the Drawing No. is generated
Then it must use prefix "LA" (e.g., 2607-04-LA01), regardless of which allowed Category was chosen

AC-122: Prefix for Component GA / 3D
Given Drawing Type = "Component GA / 3D" and Category = "Equipment"
When the Drawing No. is generated
Then it must use prefix "GA" (e.g., 2607-04-GA02)

AC-123: Prefix for Electrical (Any Category)
Given Drawing Type = "Electrical" with any category selected
When the Drawing No. is generated
Then it must use prefix "EL" (e.g., 2607-04-EL01), regardless of which category was chosen

AC-124: Category Does Not Affect Prefix/Sequence for Non-P&ID Types
Given Drawing Type is Layout, Component GA/3D, or Electrical
When the user changes the selected Category under the same Drawing Type
Then the generated prefix and sequence must NOT change — the sequence increments solely off the Drawing Type-level prefix

AC-125: Independent Sequence Counters per P&ID Category
Given Drawing Type = "P&ID"
When drawings are created under different Categories (Process, Utility, Pneumatic, CIP)
Then each Category-driven prefix (P, UT, PN, CIP) must maintain its own independent sequence counter

AC-126: Drawing No. Field Always Read-Only
Given the Drawing No. has been auto-generated/previewed
When the user attempts to edit the "DRAWING NO. (AUTO-ASSIGNED)" field
Then the field must remain read-only/locked (shown with a lock icon) and must not be editable

AC-127: Drawing No. Re-Previews on Type/Category Change
Given a Drawing No. is already previewed for one Type/Category combination
When the user changes the Drawing Type or Category
Then the Drawing No. preview must update to reflect the newly selected combination


--- Section: Other Field Defaults ---

AC-128: Scope Default & Lock
Given the "Add Controlled Drawing" pop-up is opened from the Project Overall → Drawings tab
When the modal loads
Then Scope must default to "PROJECT" and remain read-only (locked)

AC-129: Origin Default & Lock
Given the "Add Controlled Drawing" pop-up is opened from the Project Overall → Drawings tab
When the modal loads
Then Origin must default to "PROJECT" and remain read-only (locked), matching Scope

AC-130: Revision Default & Lock
Given a new drawing is being created
When the modal loads
Then Revision must default to "R00" and remain read-only (locked)


--- Section: Link to System ---

AC-131: Searchable System List Displayed
Given the "Add Controlled Drawing" pop-up is open
When the user views the "LINK TO SYSTEM" panel
Then it must display a "Search systems…" input and a list of all systems already created under the project

AC-132: System List Item Display Format
Given the "LINK TO SYSTEM" panel is populated
When the user views a list item
Then it must display the system's code and name together (e.g., "2607-04-P01 – SYSTEM_01_CREATED")

AC-133: System Count Display
Given the "LINK TO SYSTEM" panel is populated
When the user views the bottom of the panel
Then it must display the total count of systems available in the project (e.g., "5 systems in this project")

AC-134: Linking a System is Optional
Given the "LINK TO SYSTEM" panel is displayed
When the user selects zero systems
Then the drawing must still be creatable without any system linked

AC-135: Linked Systems Reflected in Grid
Given the user selected one or more systems in the "LINK TO SYSTEM" panel
When the drawing is created
Then those systems must appear in the "Linked To" column of the drawings grid as a comma-separated list

AC-136: No System Linked Shows "—" in Grid
Given the user created a drawing without linking any system
When the user views that row's Linked To column
Then it must display "—"


--- Section: Approval Required Toggle ---

AC-137: Approval Required Default State
Given the "Add Controlled Drawing" pop-up has just opened
When the user views the "APPROVAL REQUIRED" toggle
Then it must default to ON ("Yes")

AC-138: Approval Required Enabled Behavior
Given the "APPROVAL REQUIRED" toggle is set to "Yes"
When the drawing is created
Then it must require verification/approval at both TPS level and Client level

AC-139: Approval Required Disabled Behavior
Given the "APPROVAL REQUIRED" toggle is set to "No"
When the drawing is created
Then it must not require Client-level approval; only TPS-level handling applies

AC-140: Approval Required State Persisted
Given the user set the "APPROVAL REQUIRED" toggle before creating the drawing
When the drawing record is saved
Then the selected toggle state must be saved with the drawing and must govern its subsequent approval behavior


--- Section: Successful Drawing Creation ---

AC-141: New Drawing Appears in Grid Without Refresh
Given all mandatory fields are filled and the Drawing No. has been auto-generated
When the user clicks "Create Drawing"
Then the modal must close and the new drawing must immediately appear as a new row in the "All Project Drawings" grid, without a page refresh

AC-142: New Row Reflects Entered/Generated Field Values
Given a drawing was just created
When the user views its new row in the grid
Then it must display the auto-generated Drawing No., default Revision "R00", the selected Type, the selected Category, the entered Title, Scope "PROJECT", and the linked system(s) selected (or "—" if none)

AC-143: New Drawing Defaults to "Awaiting File" Status
Given a drawing was just created
When the user views its Drawing Status
Then it must default to "Awaiting File"

AC-144: New Drawing Defaults to N/A Approvals
Given a drawing was just created
When the user views its TPS Approval and Client Approval values
Then both must default to "N/A" until the drawing reaches an approval-eligible state

AC-145: Creation Example Verification
Given the user creates a drawing titled "DEMO DWG SOM-01" with Type = P&ID, Category = Utility, linked to SYSTEM_01_CREATED and SYSTEM_02_CREATED
When the drawing is saved
Then the resulting row must read: Drawing No. 2607-04-UT02, Rev R00, Type P&ID, Category UTILITY, Scope PROJECT, Linked To "SYSTEM_01_CREATED, SYSTEM_02_CREATED", Drawing Status AWAITING FILE, TPS Approval N/A, Client Approval N/A


--- Section: Revision Lifecycle (Drawing Status / TPS Approval / Client Approval sequence) ---

AC-146: R00 Reserved, No File Uploaded
Given a drawing revision (e.g., R00) has just been created via "Create Drawing"
When no file has yet been uploaded against that revision
Then Drawing/System Status must display "Awaiting File", TPS Approval must display "N/A", Client Approval must display "N/A", and no approval action must be available to either TPS or Client
(Source: Workflow Stage = "Drawing number reserved, no file uploaded" → "R00 exists as a reserved drawing record, but no file has been uploaded yet.")

AC-147: File Uploaded, Awaiting TPS Approval
Given the revision is in "Awaiting File" status
When all files required by the drawing's Required File Package (per AC-62–AC-66) have been uploaded successfully against that revision
Then Drawing/System Status must change to "Draft" (displayed as "DRAFT / PENDING INTERNAL APPROVAL" per AC-70), TPS Approval must change to "Awaiting", and Client Approval must display "Pending TPS" — the Client Admin must not be able to take any approval action while it shows "Pending TPS"
(Source: Workflow Stage = "File uploaded, waiting for TPS approval" → "R00 has a file, but TPS has not approved it yet. Client approval has not started.")

AC-148: Issue Found Before TPS Approval — File Replaced, No New Revision
Given the revision is in "Draft" status with TPS Approval "Awaiting" and Client Approval "Pending TPS"
When an engineer deletes/replaces the file before TPS approval occurs (via "Replace File Package", per AC-75–AC-77)
Then the file must be replaceable within the same revision, with Drawing/System Status, TPS Approval, and Client Approval all remaining unchanged, and no new revision number (e.g., R01) must be generated
(Source: Workflow Stage = "Issue found before TPS approval" → "Engineer deletes/replaces the R00 file. No new revision is needed.")

AC-149: TPS Approves Drawing
Given the revision is in "Draft" status with TPS Approval "Awaiting"
When the TPS/Super Admin user approves the drawing (per AC-84 in the Approval Details tab)
Then TPS Approval must change to "Approved" and Client Approval must change to "Awaiting", releasing the revision for client review — the Client Admin must only be able to take an approval action once TPS Approval has reached "Approved"
(Source: Workflow Stage = "TPS approves drawing" → "R00 is now released for client review.")

AC-150: Client Comments/Rejects in LiveAccess
Given the revision is in "Draft" status with TPS Approval "Approved" and Client Approval "Awaiting"
When the Client comments on or rejects the drawing in LiveAccess (per AC-101 in the Approval Details tab)
Then Client Approval must change to "Rejected", the current revision must no longer be valid for approval, and the system must require a new revision (e.g., R01) to be created to address the client's comments before resubmission
(Source: Workflow Stage = "Client comments/rejects in LiveAccess" → "R00 is no longer valid for approval. Create R01 to address comments.")
Open question (from source spec, needs product clarification): can the Client reverse/undo their own rejection action, or is a new revision always mandatory once a rejection is recorded?


--- Section: Approvals Tab (Approval Register) ---

AC-151: Approval Register – Display
Given the user is on a project's detail page
When the user clicks the "Approvals" tab
Then the system must display the "Approval Register" section with subtext "Approval status for all controlled drawings in this project."

AC-152: Approval Register – Status Filter Chips
Given the Approval Register is displayed
When the user views the filter row
Then it must show five selectable chips: All, Outstanding, Approved / Active, Rejected, Superseded

AC-153: Approval Register – Default Filter
Given the Approval Register loads
When no filter chip has been explicitly selected
Then the "All" chip must be active by default, showing every controlled drawing in the project

AC-154: Approval Register – Table Columns
Given the Approval Register is displayed
When the user views the table
Then it must show columns: Drawing, Rev, Type, Scope, Title, TPS Approval, Client Approval, Actions

AC-155: Approval Register – Per-Column Filters
Given the Approval Register table is displayed
When the user views the column headers
Then each column except Actions must have its own filter input

AC-156: Approval Register – Reset Filters
Given one or more filters are applied on the Approval Register
When the user clicks "Reset Filters"
Then all applied filters must be cleared and the register must reload the complete, unfiltered list

AC-157: Approval Register – REVIEW Action Link
Given a drawing row is displayed in the Approval Register
When the user views its Actions column
Then a "REVIEW" link/button must be available for that row

AC-158: REVIEW Action Navigates to Approval Details
Given the user clicks "REVIEW" for a drawing row in the Approval Register
When the navigation completes
Then the system must open that drawing's Approval Details tab, where a Super Admin can approve the drawing

AC-159: "Outstanding" Filter Shows Drawings Pending Approval
Given drawings exist whose TPS Approval or Client Approval is not yet finalized (e.g., Awaiting, Pending TPS)
When the user selects the "Outstanding" filter chip
Then only those drawings must be displayed

AC-160: "Approved / Active" Filter Shows Fully Approved Drawings
Given a drawing has both TPS Approval = Approved and Client Approval = Approved
When the user selects the "Approved / Active" filter chip
Then that drawing must be displayed, with both its TPS Approval and Client Approval badges showing "APPROVED"

AC-161: Approval Register Reflects Live Approval Progress
Given a drawing's TPS Approval or Client Approval status changes via actions taken on its Approval Details tab
When the user views the Approval Register
Then the corresponding TPS Approval / Client Approval badges for that drawing must reflect the updated status without requiring a manual refresh


Note:
This user story currently covers drawing access via the Project Overall → Drawings tab flow only (Approach 1).
The secondary flow — accessing drawings via System → Drawings tab (Approach 2), including System listing, revisions, and "+ Create New Revision" — will be documented in a separate follow-up user story.
The Drawing Type → Category → Prefix mapping (AC-111–AC-127) and the Revision Lifecycle (AC-146–AC-150) are taken directly from the provided reference tables and are considered confirmed. "Electrical" is confirmed as its own main Drawing Type (prefix "EL") — the only remaining open item there is that its allowed Category list was not shown in the shared reference screenshots (AC-114). Separately, whether a Client can reverse a rejection remains an open question from the source spec (AC-150).
The Required File Package by Drawing Type (AC-62–AC-66) is now fully confirmed from the reference document: Issue PDF is required for all types; Source File is DWG for P&ID/Layout, STP/STEP (or other approved native file) for Component GA/3D, and DWG/electrical native file for Electrical. Drawing Type determines the required Source File format — Category is descriptive only. The only remaining open item in this area is the exact wording of the incorrect-file-type validation message (AC-67).
The post-upload Drawing File Package panel and the brief Approval Status summary panel (AC-70–AC-80) are confirmed from the live application screenshot: status badge "DRAFT / PENDING INTERNAL APPROVAL", uploaded files listed with download icons, a "Replace File Package" action that requires both files together, and a summary panel showing "TPS Review — PENDING" and "Client — AWAITING (Locked until TPS approves)".
The Linked Systems tab (AC-42–AC-44) is confirmed from the live application screenshot: a read-only table (System No., System Name) of systems linked at drawing creation or revision creation, with no add/remove controls on this tab.
The Supporting Files tab (AC-46–AC-58) is confirmed from the live application screenshot: a table (File Name, Rev, Type, Uploaded By, Date, Action) of revision-specific files (client markups, scanned comment sheets, approval correspondence), plus an "Upload Supporting File" modal where Select File and File Type are mandatory and Notes is optional. Per user confirmation, this tab also auto-inherits a linked system's existing revision documents (AC-56–AC-58) — the exact UI treatment distinguishing auto-inherited vs. manually uploaded files (AC-57) is still open. This tab and its files remain distinct from the mandatory Issue PDF/Source File "Required File Package" covered in AC-59–AC-69 — Supporting Files (whether uploaded or inherited) are supplementary and are not required to move Drawing Status out of "Awaiting File".
The full Approval Details tab (AC-81–AC-104) is confirmed from the live application screenshots, covering: the "View in Approval Register" shortcut, the TPS Engineering Approval panel (Pending → Approved, with a 24-hour-limited "Reverse Approval" action restricted to Super Admin/TPS Engineer), the Client Approval panel (Locked → Awaiting client response → recorded outcome), the full Approval History table, and the Client Admin's four-option response flow (Approved, Approved with Comments, Revise and Resubmit, Rejected). "Approved with Comments" and "Revise and Resubmit" field-level detail (AC-104) remains an open item, since only "Approved" and "Rejected" were captured in the shared screenshots.
The Approvals tab / Approval Register (AC-151–AC-161) is confirmed from the live application screenshots: project-wide register of every controlled drawing's approval status, with All/Outstanding/Approved-Active/Rejected/Superseded filter chips, per-column filters, Reset Filters, and a REVIEW action that opens the corresponding drawing's Approval Details tab. The exact criteria distinguishing "Rejected" from "Superseded" in this register were not shown and remain to be confirmed.
Once all Drawings-tab functionality (Add Drawing, filtering, column management, file upload, linked systems, supporting files, approval details, approval register) is fully documented with Acceptance Criteria, a conditional flow diagram covering the end-to-end Drawing lifecycle (creation → file upload → TPS approval/reversal → client approval/comments/revise/reject → new revision, with branching per "Approval Required" state) will be created in a follow-up pass.
