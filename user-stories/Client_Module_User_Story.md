

                                      Clients Module 


User Story
As an authorized user, I want to manage client records through the Client Module so that I can create, view, search, filter, update, export, and delete client information along with their associated project details efficiently.
Module Overview
The Client Module provides functionality to:
View all client records in a listing page
Search and filter client information
Reset applied filters
Export client data into CSV format
Create new client records
View and update existing client information
Maintain client address details
View active projects associated with a client
Delete client 
Client Listing :
The Client Listing screen displays all available clients in a tabular format.
Column Name
Description
Client Name
Displays the client name
Country
Displays client country
Type
Displays client type
Category
Displays assigned category
Product
Displays mapped product
Last Login (GMT +8 Hours)
Displays latest client login time
Status
Displays current client status
Active Projects
Displays total active projects linked with the client
Actions
Allows client deletion


Filter & Search Functionality
All headers support dropdown-based filtering.
Searchable Filters Users can filter records using:
Client Name
Country
Type
Category
Product
Status
Filter Behaviour
All dropdowns support searchable selection.
Matching records are displayed based on applied filters.
If no records match the applied filters, the following message is displayed:
“No client match found in your filters.”

Reset Filter Functionality
Reset Filters Button : A Reset Filters button is available at the top-right corner.
Behaviour
Clears all applied filters
Reloads complete client listing data




Export CSV Functionality
Export CSV Button : An Export CSV button is available on the listing page.
Behaviour
Exports available client records into CSV format
Includes all applicable listing details
Active Projects Functionality
The Active Projects column displays the number of active projects linked to a client.
Behaviour
Project count is dynamically fetched from the Project Module
Only active projects are displayed in the count
View & Edit Client Functionality
Open Client in Edit Mode
When the user clicks on any client record from the client listing page:
The selected client details page opens in Edit Mode
Existing client information is prefilled automatically
User can modify available fields
Updated information can be saved successfully
Delete Client Functionality
A delete icon is available under the Actions column.
Behaviour
When the delete icon is clicked:
A confirmation popup is displayed with:
Yes
Cancel


Actions
User Action
Result
Yes
Client record is deleted successfully
Cancel
Delete action is cancelled


Create New Client Functionality
+ New Client Button : A + New Client button is available on the listing page.
Behaviour
Opens the Create New Client page
The client form contains two tabs:
Basic Information
Address
Tab 1 – Basic Information
Available Fields
Field Name
Field Type
Mandatory
Client Name
Textbox
Yes
Status
Dropdown
Yes
Type
Dropdown
No
Category
Searchable Dropdown
No
Product
Searchable Dropdown
No






Default Values
Status is set to Active by default during client creation.
Validation Rules 
Client Name Validation
If Client Name is blank during save: “Client Name is required.”
Status Validation
If Status is not selected: “Status is required.”
Tab 2 – Address
Available Fields
Field Name
Field Type
Address Line 1
Textbox
Address Line 2
Textbox
City
Textbox
State / Region
Textbox
Postal Code
Textbox
Country
Dropdown


Country Dropdown Options Currently available countries:
China
Denmark
France
Germany
Italy
Sweden
Singapore
United Kingdom
USA
Vietnam
Save Client Functionality
Save Client Button
A Save Client button is available at the bottom-right corner.
Behaviour
Saves newly created client details
Saves updated client information in edit mode
Successfully saved clients are displayed in the client listing page
Business Rules
Client Name and Status are mandatory fields.
Status should remain Active by default during client creation.
All filters should support searchable dropdown functionality.
Reset Filters should remove all applied filters.
Export CSV should export available client listing data.
Active Projects should display only active linked projects.
Delete action should always display confirmation popup.
Clicking a client from the listing should open the record in Edit Mode.
Updated client information should be saved successfully.
Newly created clients should immediately appear in the client listing.
Acceptance Criteria
AC-01 – View Client List
Given the user navigates to the Client Module,
 When the page loads,
 Then the system should display all available client records in listing format.
AC-02 – Search & Filter Clients
Given the client listing page is displayed,
 When the user applies filters from dropdown selections,
 Then the system should display matching client records.
AC-03 – No Matching Records
Given filters are applied,
 When no matching client records are found,
 Then the system should display the message: “No client match found in your filters.”
AC-04 – Reset Filters
Given filters are applied on the listing page,
 When the user clicks on Reset Filters,
 Then all applied filters should be cleared and complete data should be displayed.
AC-05 – Export Client Data
Given the client listing page is displayed,
 When the user clicks on Export CSV,
 Then the system should export client data in CSV format successfully.
AC-06 – Create New Client
Given the user clicks on + New Client,
 When the user enters mandatory details and clicks Save Client,
 Then the new client should be created successfully and displayed in the client listing.
AC-07 – Mandatory Field Validation
Given the Create Client page is opened,
 When mandatory fields are left blank and user clicks Save Client,
 Then the system should display validation messages for required fields.
AC-08 – Default Status Value
Given the Create Client screen is opened,
 When the page loads,
 Then the Status field should be set to Active by default.
AC-09 – Edit Existing Client
Given the client listing page is displayed,
 When the user clicks on a specific client record,
 Then the selected client should open in Edit Mode with prefilled details.
AC-10 – Update Client Details
Given the client is opened in Edit Mode,
 When the user updates information and clicks Save Client,
 Then the updated client information should be saved successfully.



AC-11 – Delete Client
Given the client listing page is displayed,
 When the user clicks on the delete icon and confirms deletion,
 Then the selected client should be deleted successfully.
AC-12 – Cancel Delete Action
Given the delete confirmation popup is displayed,
 When the user clicks Cancel,
 Then the client record should not be deleted.
AC-13 – View Active Projects
Given the client listing page is displayed,
 When client records are loaded,
 Then the Active Projects column should display the count of active projects linked to each client.




# Steps to be follow 

1.Create the functional test cases 
2.Covers the all edge cases 
3.Peforme the negative test cases 
4.Add the assesation/validation then passed the test cases only 
