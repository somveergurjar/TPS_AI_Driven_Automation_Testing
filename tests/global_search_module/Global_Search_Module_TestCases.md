# Global Search Module Test Cases

> **Spec Files Location:** `tests/global_search_module/`
> **How to Run All:** `npx playwright test tests/global_search_module/ --project=chromium --headed --workers=1`
> **How to Run by ID:** `npx playwright test tests/global_search_module/ --grep "TC_GS_001" --project=chromium --headed`

---

# 1. Page Load & UI Structure

**Spec File:** `global-search-page-load.spec.ts`

# TC_GS_001 - Verify Global Search Page Loads Successfully
Steps
Login to the application as Admin
Navigate to Global Search from the sidebar
Observe page loading behavior
Expected Result
Global Search page should load without error
URL should contain `/global-search`
Page should not show any crash or blank screen

# TC_GS_002 - Verify Page Title "Global Search" is Visible
Steps
Login to the application as Admin
Navigate to Global Search
Observe the page heading
Expected Result
Heading `h1` with text "Global Search" should be visible on the page

# TC_GS_003 - Verify "+ New Search" Button is Visible and Clickable
Steps
Login to the application as Admin
Navigate to Global Search
Locate the New Search button
Expected Result
"+ New Search" button should be visible
Button should be enabled and clickable

# TC_GS_004 - Verify Query History Panel is Visible in the Left Sidebar
Steps
Login to the application as Admin
Navigate to Global Search
Observe the left sidebar
Expected Result
Query History panel/label should be visible in the left sidebar
Previously submitted queries should appear in the list

# TC_GS_005 - Verify Follow-up Input and Ask Button are Visible
Steps
Login to the application as Admin
Navigate to Global Search
Look at the bottom of the page
Expected Result
Follow-up input field should be visible and enabled
"Ask" button should be visible next to the input

# TC_GS_006 - Verify Follow-up Input Has Correct Placeholder Text
Steps
Login to the application as Admin
Navigate to Global Search
Read the placeholder text of the follow-up input
Expected Result
Placeholder text should contain words like "follow" or "ask"

# TC_GS_007 - Verify Conversation Turn Counter is Visible
Steps
Login to the application as Admin
Navigate to Global Search (existing conversation)
Observe the turn counter
Expected Result
A counter like "X turns in conversation" should be visible

# TC_GS_008 - Verify No Broken UI Elements on Global Search Page
Steps
Login to the application as Admin
Navigate to Global Search
Inspect all UI components visually
Expected Result
No broken images should appear (no empty src or broken alt)
No raw "undefined" or "[object Object]" text should be visible in the UI

# TC_GS_009 - Verify Follow-up Input Accepts Keyboard Input
Steps
Login to the application as Admin
Navigate to Global Search
Click the follow-up input and type a message
Expected Result
Typed text should appear in the input field
Input should not be read-only or disabled

# TC_GS_010 - Verify Navigating from Dashboard to Global Search via Sidebar Works
Steps
Login to the application as Admin
Navigate to Dashboard
Click "Global Search" in the sidebar navigation
Expected Result
Page should navigate to Global Search
URL should contain `/global-search`
Page title should be visible

---

# 2. Query Interaction & Controls

**Spec File:** `global-search-query.spec.ts`

# TC_GS_011 - Verify Sending a Message Returns a Response Card
Steps
Login to the application as Admin
Navigate to Global Search
Type a query in the follow-up input (e.g., "give me details of all documents")
Click the Ask button
Wait for the AI response
Expected Result
A response card should appear in the chat area
Response text should be non-empty

# TC_GS_012 - Verify Query Bubble Appears in Chat After Sending
Steps
Login to the application as Admin
Navigate to Global Search
Send a short query (e.g., "dcs")
Expected Result
The query text ("dcs") should appear as a bubble/chip in the conversation chat area

# TC_GS_013 - Verify "No Relevant Results Found" Message for Unmatched Queries
Steps
Login to the application as Admin
Navigate to Global Search
Send a query with a completely non-existent term (e.g., "xyzzy_nonexistent_item_99887766")
Expected Result
A "No relevant results found" message should appear
Page should not crash or show a blank screen

# TC_GS_014 - Verify AI Disclaimer is Shown on Every Response
Steps
Login to the application as Admin
Navigate to Global Search
Send any query that returns an AI response
Expected Result
Text "AI-generated content may be incorrect" must be visible in the response area for every AI answer

# TC_GS_015 - Verify References Section is Present and Collapsible
Steps
Login to the application as Admin
Navigate to Global Search
Send a query that returns a document-related response
Expected Result
A "References" section should be visible in the response card
Clicking the toggle should expand or collapse the section without any crash

# TC_GS_016 - Verify Turn Counter Increments After Each Message
Steps
Login to the application as Admin
Navigate to Global Search
Note the current turn count
Send a message and wait for the response
Check the turn counter again
Expected Result
Turn counter should increase by 1 after each message sent

# TC_GS_017 - Verify Query is Saved to Query History After Sending
Steps
Login to the application as Admin
Navigate to Global Search
Send a unique query (e.g., "auto_1234567890")
Wait for the response
Check the left sidebar Query History
Expected Result
The sent query (or its fragment) should appear in the Query History list

# TC_GS_018 - Verify Clicking a History Item Loads That Conversation
Steps
Login to the application as Admin
Navigate to Global Search
Send at least one message
Click a query item in the left sidebar history
Expected Result
The conversation for that query should load in the main area
Follow-up input should remain visible and enabled
URL should remain on `/global-search`

# TC_GS_019 - Verify "+ New Search" Resets the Conversation
Steps
Login to the application as Admin
Navigate to Global Search
Send at least one message and note the turn count
Click "+ New Search"
Expected Result
Conversation should reset
Turn counter should go back to 0 or 1
Follow-up input should be visible and ready for a new query

# TC_GS_020 - Verify Follow-up Question Builds on Prior Context
Steps
Login to the application as Admin
Navigate to Global Search
Send a first query (e.g., "give me details of all documents")
Wait for the response
Send a follow-up query (e.g., "can you give more details?")
Wait for the second response
Expected Result
Second response should not be empty
Turn counter should show at least 2 turns

# TC_GS_021 - Verify Empty Message Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Leave the input empty
Click the Ask button
Expected Result
Page should not crash
No "Unhandled" or "500" errors should appear in the UI

# TC_GS_022 - Verify Multiple Sequential Queries Work Without Page Reload
Steps
Login to the application as Admin
Navigate to Global Search
Send first query and wait for response
Send second query and wait for response
Expected Result
Both responses should appear successfully
Follow-up input should remain visible after both queries
URL should still be `/global-search`

# TC_GS_023 - Verify Stop Button Appears and Halts AI Streaming
Steps
Login to the application as Admin
Navigate to Global Search
Click "+ New Search" to start a fresh conversation
Type a query in the follow-up input
Click Ask
Immediately watch for the red Stop button to appear (within 10 seconds)
Click the Stop button
Expected Result
Stop button (red, with "Stop" text) must appear while the AI is actively streaming a response
Clicking Stop must halt the AI generation immediately
Stop button must disappear after clicking
Follow-up input must remain visible and enabled (UI does not crash)
Page must not show any Unhandled or 500 errors
Note: This test must catch the Stop button while the AI is still streaming — do not wait for the full response before clicking Stop

# TC_GS_024 - Verify History Item Delete via Three-Dot Menu
Steps
Login to the application as Admin
Navigate to Global Search
Note down all existing query history items (these must NOT be deleted)
Click "+ New Search" and send a unique identifiable query (e.g., "del_test_1234567890 list documents")
Wait for the full AI response to complete (so the item is saved to server-side history)
Locate the new unique query in the left sidebar history
Hover the mouse over the new query item
Observe the three-dot (ellipsis ⋮) menu button that appears on hover
Click the three-dot button
Click the "Delete" option that appears in the dropdown menu
Wait for the item to be removed
Expected Result
Three-dot menu must appear on hover over the history item
Delete option must appear after clicking the three-dot button
The newly created query must be removed from the history list after clicking Delete
All pre-existing history items must remain untouched
Important Notes
This test creates a real AI query and consumes tokens — run deliberately, not on every automated CI cycle
Never delete any pre-existing history items; only the new item created in this test is a valid deletion target
If a confirmation dialog appears before final deletion, handle it by clicking Confirm/OK

---

# 3. Response Accuracy & Content Validation

**Spec File:** `global-search-accuracy.spec.ts`

# TC_GS_ACC_001 - Verify Document Query Response Contains Document-Related Keywords
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "give me details of all documents"
Wait for the AI response
Expected Result
Response must contain at least one of the keywords: document, doc, file, revision, supplier, tps

# TC_GS_ACC_002 - Verify Equipment Query Response Contains Equipment-Related Keywords
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "list the available equipment records"
Wait for the AI response
Expected Result
Response must contain at least one of the keywords: equipment, tps, manufacturer, supplier, spare, id

# TC_GS_ACC_003 - Verify Response Does Not Contain JavaScript Errors or Null Values
Steps
Login to the application as Admin
Navigate to Global Search
Send a document-related query
Wait for the AI response
Expected Result
Response must NOT contain: TypeError, SyntaxError, ReferenceError, Uncaught
Response must NOT contain: null, undefined, [object Object], 500 Internal Server Error

# TC_GS_ACC_004 - Verify Response Text Length is Reasonable
Steps
Login to the application as Admin
Navigate to Global Search
Send a document-related query
Wait for the AI response
Expected Result
Response length must be greater than 20 characters (not a one-word answer)
Response length must be less than 50,000 characters (not a raw HTML dump)

# TC_GS_ACC_005 - Verify Revision Query Response Mentions Revisions or Documents
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "show me revision details for documents"
Wait for the AI response
Expected Result
Response must contain at least one of the keywords: revision, rev, version, document, upload, file

# TC_GS_ACC_006 - Verify Query for a Specific TPS Document ID Returns Its Details
Steps
Login to the application as Admin
Navigate to the Document module and find a real TPS ID from the first record in the table
Navigate to Global Search
Send query: "Give me the details for <TPS_ID>"
Wait for the AI response
Expected Result
Response should reference the document by TPS ID, or contain keywords: document, supplier, revision

# TC_GS_ACC_007 - Verify Non-Existent Query Returns Graceful Message
Steps
Login to the application as Admin
Navigate to Global Search
Send query for a completely non-existent item
Wait for the AI response
Expected Result
Some response must appear (not a blank screen)
Response must NOT contain: TypeError, SyntaxError, 500, Uncaught

# TC_GS_ACC_008 - Verify Project Query Returns Project-Related Content
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "what projects are in the system?"
Wait for the AI response
Expected Result
Response must contain at least one of the keywords: project, client, equipment, document, system, available

# TC_GS_ACC_009 - Verify Response Does Not Leak Raw API Payload or JSON
Steps
Login to the application as Admin
Navigate to Global Search
Send a document-related query
Wait for the AI response
Expected Result
Response must NOT start with a raw `{` (JSON object)
Response must NOT contain: "statusCode":, "error": true

---

# 4. End-to-End Flows

**Spec File:** `global-search-e2e.spec.ts`

# TC_GS_E2E_001 - Full Flow: Navigate, Search Document, Verify Response, Check History
Steps
Login to the application as Admin
Navigate to Document module and note the TPS ID of the first document
Navigate to Global Search
Verify page structure: title, subtitle, query history panel, search input are all visible
Send query: "Give me the details for <TPS_ID>" (or general document query if no TPS ID found)
Wait for the AI response
Verify response is non-empty and contains document-related keywords
Verify the query appears in the Query History panel
Send a second query: "List all equipment records"
Verify the second response is also non-empty
Verify the page is still on `/global-search` after two queries
Expected Result
Page loads correctly with all UI elements
AI returns a non-empty, relevant response for both queries
Query History is updated after each submission
Page remains stable throughout the full flow

# TC_GS_E2E_002 - Search for a Recently Created Document and Verify It Is Returned
Steps
Login to the application as Admin
Navigate to Document module
Click New Document and fill in a unique document name (e.g., GS_E2E_DOC_<timestamp>)
Select a Document Type and Supplier
Upload a revision PDF file
Save the document
Note the TPS ID assigned to the new document
Navigate to Global Search
Send query: "Give me the details for <TPS_ID>"
Wait for the AI response
Clean up: go back to Document module and delete the test document
Expected Result
AI response should reference the newly created document (by TPS ID, document name, or related keywords like document, revision, supplier)
Document should be searchable in Global Search after creation and upload
Note: There may be an indexing delay; the search verifies the document was indexed by the AI system

---

# 5. Advanced Verification

**Spec File:** `global-search-advanced.spec.ts`
**Note:** All tests in this category use an extended timeout of 150 seconds due to AI response latency.

# TC_GS_ADV_001 - Verify Chunk Relevance: Response Contains Domain-Specific Terms
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "Give me details about documents and their revisions in the system"
Wait up to 75 seconds for the AI response
Expected Result
Response must be a prose answer of more than 50 characters
Response must contain at least one domain keyword: document, revision, tps, supplier, equipment, project, client
Response must not be raw JSON, an error, or "NO_RELEVANT_RESULTS"
Note: This verifies that chunk size settings are appropriate for producing relevant results

# TC_GS_ADV_002 - Verify Reindex Freshness: New Document Appears in Search Within 2 Minutes
Steps
Login to the application as Admin
Navigate to Document module
Create a new document with a unique name (e.g., ADV_ReIndex_<timestamp>)
Select Category, Document Type, and Supplier
Upload a revision PDF
Save the document
Wait 2 minutes for re-indexing
Navigate to Global Search
Send query: "Tell me about ADV_ReIndex_<timestamp>"
Wait for the AI response
Expected Result
Response should reference the newly created document
Document should appear in Global Search results within 2 minutes of creation

# TC_GS_ADV_003 - Verify Same Query in Two Parallel Sessions Returns Consistent Content
Steps
Login to the application as Admin in Session 1
Open a second browser context and login as Admin in Session 2
Send the same query in both sessions simultaneously: "show me revision details for documents"
Wait for the AI response in both sessions
Compare both responses
Expected Result
Both responses should be non-empty
Both responses should contain similar domain keywords (at least 2 overlapping keywords)
Neither response should be an error or blank

# TC_GS_ADV_004 - Verify English Query Returns an English-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in English: "List all documents available in the system"
Wait for the AI response
Expected Result
Response should be in English
Response should contain common English words: the, and, is, are, of, in, for
Response should not be empty or in a foreign language only

# TC_GS_ADV_005 - Verify French Query Returns a French-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in French: "Listez tous les documents disponibles dans le système"
Wait for the AI response
Expected Result
Response should contain French language markers: le, la, les, de, du, des, et, est, sont, dans, pour
Response should not be empty

# TC_GS_ADV_006 - Verify German Query Returns a German-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in German: "Listen Sie alle verfügbaren Dokumente im System auf"
Wait for the AI response
Expected Result
Response should contain German language markers: die, der, das, und, ist, sind, in, für, von, alle
Response should not be empty

# TC_GS_ADV_007 - Verify PDF Accuracy: Known PDF Content is Returned Accurately
Steps
Login to the application as Admin
Upload the test PDF (calibration-certificate-rev1.pdf) as a document revision (if not already uploaded)
Navigate to Global Search
Send query: "What are the calibration details in the uploaded certificate?"
Wait for the AI response
Expected Result
Response should reference calibration-related content from the PDF
Response should contain keywords: calibration, certificate, revision, or similar terms from the PDF
Response must not be empty

# TC_GS_ADV_008 - Verify Admin Sees All Revisions in Search Results
Steps
Login to the application as Admin
Navigate to Global Search
Send a query that targets a document with multiple revisions
Wait for the AI response
Expected Result
Admin should receive a response referencing content from the document's revisions
Response must not be empty

# TC_GS_ADV_009 - Verify Client Sees Only Their Assigned Revision Content
Steps
Login to the application as a Client user (demo@gmail.com)
Navigate to Global Search
Send a query targeting a document with multiple revisions
Wait for the AI response
Expected Result
Client should only see content from the revision(s) they have been assigned access to
Client should not see content from revisions they are not authorized for

# TC_GS_ADV_010 - Verify Response is Not Raw JSON or Error Stack
Steps
Login to the application as Admin
Navigate to Global Search
Send a document-related query
Wait for the AI response
Expected Result
Response must not start with `{` or `[` (raw JSON)
Response must not contain stack trace patterns: at Object., Error:, TypeError

# TC_GS_ADV_011 - Verify Response Length is Within Reasonable Bounds
Steps
Login to the application as Admin
Navigate to Global Search
Send a document-related query
Wait for the AI response
Expected Result
Response length must be at least 50 characters (not a one-word answer)
Response length must be no more than 5,000 characters (not a raw data dump)

# TC_GS_ADV_012 - Verify AI Disclaimer Appears on Every Response
Steps
Login to the application as Admin
Navigate to Global Search
Send a query that generates a real AI response
Wait for the AI response
Expected Result
The text "AI-generated content may be incorrect" must be visible on the page for every response returned by the AI

---

# 7. Inconsistent Response Output – Regression Tests

**Spec File:** `global-search-advanced.spec.ts`
**Note:** These are regression tests that verify the AI does not return wildly different results for the same or semantically similar queries. All tests use an extended timeout of 150 seconds.

**Why This Matters:**
The Global Search uses vector-based chunk retrieval + LLM generation. If the same query returns completely different domain content on repeated runs, it indicates a problem in the chunk retrieval pipeline, embedding instability, or LLM prompt inconsistency. These tests catch such regressions early.

# TC_GS_ADV_013 - Verify Same Query Submitted Twice Returns Semantically Consistent Output
Steps
Login to the application as Admin
Navigate to Global Search
Click "+ New Search" to start a fresh conversation
Send query: "give me details of all documents" and wait for the full AI response
Note the domain keywords present in Response 1 (e.g., document, revision, supplier, tps)
Click "+ New Search" again to start another fresh conversation
Send the exact same query: "give me details of all documents" and wait for the full AI response
Note the domain keywords present in Response 2
Compare both responses
Expected Result
Both Response 1 and Response 2 must be non-empty
Both responses must contain at least 2 overlapping domain keywords from: document, revision, supplier, tps, equipment
Neither response should be a blank screen, error, or "NO_RELEVANT_RESULTS"
The overall topic and domain area of both responses must be the same (both about documents, not switching to equipment or projects)
Note: Word-for-word identical responses are not required — AI language is non-deterministic — but the domain content and topic must remain consistent

# TC_GS_ADV_014 - Verify Semantically Similar Queries Return Consistent Domain Content
Steps
Login to the application as Admin
Navigate to Global Search
Click "+ New Search" and send Query Variant 1: "show me all documents in the system" — wait for response
Note the domain keywords in Response 1
Click "+ New Search" and send Query Variant 2: "list all documents available" — wait for response
Note the domain keywords in Response 2
Click "+ New Search" and send Query Variant 3: "what documents exist in this platform?" — wait for response
Note the domain keywords in Response 3
Compare all three responses
Expected Result
All three responses must be non-empty
All three responses must contain at least one overlapping domain keyword: document, revision, supplier, tps
None of the responses should return "NO_RELEVANT_RESULTS" for a valid document-related query
The domain area (documents) must be consistent across all three responses
The responses must not contradict each other on core facts (e.g., one saying "no documents exist" while another lists documents)

# TC_GS_ADV_015 - Verify Minor Query Wording Change Does Not Cause Completely Different Output
Steps
Login to the application as Admin
Navigate to Global Search
Click "+ New Search" and send: "tell me about document revisions" — wait for response
Note the response content and topic
Click "+ New Search" and send: "describe the document revisions" — wait for response
Note the response content and topic
Expected Result
Both responses must address the topic of document revisions
Both responses must be non-empty prose (not raw JSON or error messages)
Both responses must contain at least one keyword from: revision, document, version, upload, file
The responses must not switch topics (e.g., one talking about revisions and the other about completely unrelated data)

# TC_GS_ADV_016 - Verify Response Stability for Equipment-Related Queries Across Two Runs
Steps
Login to the application as Admin
Navigate to Global Search
Click "+ New Search" and send: "list all equipment records available" — wait for response
Record equipment-related keywords from Response 1
Click "+ New Search" and send the exact same query again — wait for response
Record equipment-related keywords from Response 2
Expected Result
Both responses must contain at least one keyword from: equipment, tps, manufacturer, supplier, spare
Response topic must remain consistent (both about equipment)
Neither response should return "NO_RELEVANT_RESULTS" for a valid equipment query
The number of overlapping domain keywords between Response 1 and Response 2 must be at least 2

# TC_GS_ADV_017 - Verify Follow-up Query Output Is Consistent Across Two Conversation Threads
Steps
Login to the application as Admin
Navigate to Global Search
Start Thread 1: Click "+ New Search", send "give me details of all documents", wait for response, then send follow-up: "can you give more details?"
Record keywords from the follow-up response in Thread 1
Start Thread 2: Click "+ New Search", send "give me details of all documents", wait for response, then send follow-up: "can you give more details?"
Record keywords from the follow-up response in Thread 2
Compare both follow-up responses
Expected Result
Both follow-up responses must be non-empty
Both must continue on the topic of documents (not switch domain)
Both must contain at least 1 overlapping keyword from: document, revision, supplier, equipment
The responses must not contradict each other on factual content

---

# 6. Revision-Based Access Control

**Spec File:** `global-search-revision-access.spec.ts`
**Pre-requisites (set in .env):**
- CLIENT1_EMAIL, CLIENT1_PASSWORD, CLIENT1_REVISION=2
- CLIENT2_EMAIL, CLIENT2_PASSWORD, CLIENT2_REVISION=3

# TC_GS_RAC_SETUP - Admin Creates Document with 3 Revisions and Assigns Client Access
Steps
Login to the application as Admin
Navigate to Document module
Create a new document (e.g., GS_RevAccess_<timestamp>)
Select Category, Document Type, and Supplier
Go to the Revisions tab
Upload Revision 1 (PDF file) and click Upload Revision
Upload Revision 2 (PDF file) and click Upload Revision
Upload Revision 3 (PDF file) and click Upload Revision
Save the document and note the TPS ID
Go to Clients/Projects management section
Assign Client 1 access to Revision 2 of this document
Assign Client 2 access to Revision 3 of this document
Expected Result
Document with 3 revisions is created successfully
Client 1 is granted access to Revision 2 only
Client 2 is granted access to Revision 3 only
TPS ID is captured for use in subsequent test phases

# TC_GS_RAC_002 - Client 1 Searches and Sees Only Their Assigned Revision Content
Steps
Login to the application as Client 1 (CLIENT1_EMAIL / CLIENT1_PASSWORD)
Navigate to Global Search
Send query targeting the document created in TC_GS_RAC_SETUP by TPS ID
Wait for the AI response
Expected Result
Response should contain content from Revision 2 (Client 1's assigned revision)
Response should not contain content exclusively from Revision 3 (Client 2's revision)
Response must not be empty

# TC_GS_RAC_003 - Client 2 Searches and Sees Only Their Assigned Revision Content
Steps
Login to the application as Client 2 (CLIENT2_EMAIL / CLIENT2_PASSWORD)
Navigate to Global Search
Send query targeting the document created in TC_GS_RAC_SETUP by TPS ID
Wait for the AI response
Expected Result
Response should contain content from Revision 3 (Client 2's assigned revision)
Response should not contain content exclusively from Revision 2 (Client 1's revision)
Response must not be empty

# TC_GS_RAC_004 - Cross-Client Isolation: Client 1 Cannot See Client 2's Content
Steps
Login as Client 1 (CLIENT1_EMAIL / CLIENT1_PASSWORD)
Navigate to Global Search
Send a query specifically about Revision 3 content of the test document
Wait for the AI response
Expected Result
Response must NOT reference content unique to Revision 3
Client 1 should only receive information from their authorized revision (Revision 2)

# TC_GS_RAC_CLEANUP - Admin Cleans Up Test Documents Created During Setup
Steps
Login to the application as Admin
Navigate to Document module
Filter by the test document name (GS_RevAccess_<timestamp>)
Select the test document and click Delete
Confirm deletion
Expected Result
All documents created during TC_GS_RAC_SETUP are removed
No orphaned test data remains in the system

---

# 8. Multi-Language Validation

**Spec File:** `global-search-multilang.spec.ts`
**Note:** All tests use an extended timeout of 150 seconds due to AI response latency. Security tests do not require an AI response — they verify the page remains stable.

## 8.1 Language & Translation

# TC_GS_ML_001 - Verify Arabic Query Returns a Non-Empty Prose Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Arabic: "ما هي المستندات المتاحة في النظام؟"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty (prose or no-results message)
Arabic language markers or domain keywords (document, revision, tps) should be present
No Unhandled / 500 errors should appear

# TC_GS_ML_002 - Verify Spanish Query Returns a Spanish-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Spanish: "¿Qué documentos están disponibles en el sistema?"
Wait for the AI response
Expected Result
Response must be non-empty prose (not raw JSON or error)
Response must contain at least 1 Spanish language marker: el, la, los, las, de, en, que, es, son, disponibles, sistema, documento
Page must not crash or show server errors

# TC_GS_ML_003 - Verify Danish Query Returns a Danish-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Danish: "Hvilke dokumenter er tilgængelige i systemet?"
Wait for the AI response
Expected Result
Response must be non-empty prose
Response must contain at least 1 Danish marker: de, der, det, og, er, til, tilgængelige, systemet, dokumenter
Page must not crash

# TC_GS_ML_004 - Verify Hindi Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Hindi (Devanagari): "सिस्टम में कौन से दस्तावेज़ उपलब्ध हैं?"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty
No server errors should appear in the UI

# TC_GS_ML_005 - Verify Chinese (Simplified) Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Chinese: "系统中有哪些可用的文件？"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty (prose or no-results)
No server or rendering errors should appear

# TC_GS_ML_006 - Verify Japanese Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Japanese: "システムで利用可能なドキュメントは何ですか？"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty
No Unhandled or 500 errors should appear

# TC_GS_ML_007 - Verify Korean Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Korean: "시스템에서 사용 가능한 문서는 무엇입니까?"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty (prose or no-results)
No server errors should appear

# TC_GS_ML_008 - Verify Italian Query Returns an Italian-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Italian: "Quali documenti sono disponibili nel sistema?"
Wait for the AI response
Expected Result
Response must be non-empty prose
Response must contain at least 1 Italian marker: il, la, i, le, di, del, nel, che, è, sono, disponibili, sistema, documenti
Page must not crash

# TC_GS_ML_009 - Verify Vietnamese Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Vietnamese: "Những tài liệu nào có sẵn trong hệ thống?"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty (prose or no-results)
No server errors should appear

# TC_GS_ML_010 - Verify Swedish Query Returns a Swedish-Language Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Swedish: "Vilka dokument finns tillgängliga i systemet?"
Wait for the AI response
Expected Result
Response must be non-empty prose
Response must contain at least 1 Swedish marker: de, det, och, är, tillgängliga, systemet, dokument, vilka, finns
Page must not crash

# TC_GS_ML_011 - Verify Unsupported Language Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Swahili (unsupported): "Ni nyaraka zipi zinapatikana katika mfumo?"
Observe the page behavior
Expected Result
Page must not crash
URL must remain /global-search
No Unhandled / 500 errors should appear
Either a response or a no-results message should appear gracefully

# TC_GS_ML_012 - Verify Mixed-Language Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send a mixed English + Hindi query: "Show me all documents दस्तावेज़ available in the system"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty
Domain keywords (document, revision, supplier, tps) should appear in the response

# TC_GS_ML_013 - Verify Transliterated Hindi Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send a Hinglish (Hindi written in English) query: "system mein kaun se documents available hain?"
Wait for the AI response
Expected Result
Page must not crash
Response must be non-empty prose or graceful no-results message
No Unhandled or 500 errors should appear

# TC_GS_ML_014 - Verify Cross-Language Consistency: EN / FR / DE Queries Return Equivalent Domain Content
Steps
Login to the application as Admin
Navigate to Global Search
Send query in English: "List all documents available in the system" — wait for response and note domain keywords
Click "+ New Search"
Send query in French: "Listez tous les documents disponibles dans le système" — wait for response and note domain keywords
Click "+ New Search"
Send query in German: "Listen Sie alle verfügbaren Dokumente im System auf" — wait for response and note domain keywords
Compare domain keyword overlap across all three responses
Expected Result
All three responses must be non-empty prose
At least 1 domain keyword must overlap between at least 2 of the 3 responses (keywords: document, revision, supplier, tps, equipment)
No response should return "NO_RELEVANT_RESULTS" for a valid document query
Page must not crash after any of the three queries

# TC_GS_ML_015 - Verify RTL Arabic Query Does Not Break Page Layout
Steps
Login to the application as Admin
Navigate to Global Search
Send Arabic query: "أظهر لي جميع المستندات في النظام"
Observe the page layout
Expected Result
Page layout must remain intact (header, sidebar, input visible)
Follow-up input must still be accessible and visible
URL must remain /global-search
No broken layout, overlapping elements, or invisible content should occur
No Unhandled or 500 errors should appear

---

## 8.2 Input Validation

# TC_GS_ML_016 - Verify Single-Character Query Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Type a single character "a" in the search input and submit
Observe the page
Expected Result
Page must not crash
URL must remain /global-search
No Unhandled / 500 errors should appear

# TC_GS_ML_017 - Verify Special-Character-Only Query Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "@#$%&*!^~`|\\"
Wait and observe the page
Expected Result
Page must not crash
URL must remain /global-search
No server errors should appear
Either a response or graceful no-results should appear

# TC_GS_ML_018 - Verify Emoji Query Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "📄 🔍 📊 documents 🗂️"
Observe the page
Expected Result
Page must not crash
Emojis must be handled gracefully (displayed or ignored)
No Unhandled or 500 errors should appear

# TC_GS_ML_019 - Verify Numeric-Only Query Returns a Graceful Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "12345"
Observe the page
Expected Result
Page must not crash
Either a response card or a graceful no-results message should appear
No Unhandled or 500 errors should appear

# TC_GS_ML_020 - Verify Alphanumeric Query Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "TPS001 document rev2"
Wait for the AI response
Expected Result
Response must be non-empty
Page must not crash
No server errors should appear

# TC_GS_ML_021 - Verify Very Long Query (500+ Characters) Is Handled Without Errors
Steps
Login to the application as Admin
Navigate to Global Search
Submit a query of 500+ characters (e.g., "list all documents " repeated 28 times)
Observe the page behavior
Expected Result
Page must not crash
URL must remain /global-search
No Unhandled / 500 errors should appear
Either a response or graceful no-results should appear

# TC_GS_ML_022 - Verify Whitespace-Only Query Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Enter only spaces in the input field and click Ask
Observe the page
Expected Result
Page must not crash
URL must remain /global-search
No Unhandled / 500 errors should appear

# TC_GS_ML_023 - Verify Query with Accent Marks Returns a Non-Empty Response
Steps
Login to the application as Admin
Navigate to Global Search
Send query with accent marks: "liste des documents révision et données système"
Wait for the AI response
Expected Result
Accent characters must be handled correctly (not garbled or stripped)
Response must be non-empty prose or graceful no-results
Page must not crash

# TC_GS_ML_024 - Verify Non-Latin Script (Japanese) Input Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Send query in Japanese mixed script: "ドキュメントの一覧を表示してください"
Observe the page
Expected Result
Japanese characters must not corrupt the input or page rendering
Page must not crash
URL must remain /global-search
No Unhandled or 500 errors should appear

---

## 8.3 Search Accuracy

# TC_GS_ML_025 - Verify Typo Tolerance Returns Domain-Relevant Content
Steps
Login to the application as Admin
Navigate to Global Search
Send a query with intentional misspellings: "show me all documnet revison detials"
Wait for the AI response
Expected Result
Response must be non-empty
If not "NO_RELEVANT_RESULTS", response must contain at least 1 domain keyword: document, revision, tps, supplier, equipment
Page must not crash

# TC_GS_ML_026 - Verify Case-Insensitive Search Returns Consistent Domain Content
Steps
Login to the application as Admin
Navigate to Global Search
Send query in ALL CAPS: "LIST ALL DOCUMENTS IN THE SYSTEM" — wait for response and note domain keywords
Click "+ New Search"
Send the same query in lowercase: "list all documents in the system" — wait for response and note domain keywords
Compare both responses
Expected Result
Both responses must be non-empty
Both responses must share at least 1 overlapping domain keyword: document, revision, supplier, tps, equipment
Page must not crash after either query

# TC_GS_ML_027 - Verify Singular vs Plural Forms Return Consistent Domain Content
Steps
Login to the application as Admin
Navigate to Global Search
Send singular form: "show me the document revision" — wait for response
Click "+ New Search"
Send plural form: "show me all documents revisions" — wait for response
Compare both responses
Expected Result
Both responses must be non-empty
Both responses must share at least 1 overlapping domain keyword: document, revision, tps, supplier
Page must not crash

# TC_GS_ML_028 - Verify Abbreviation and Acronym Search Returns Relevant Results
Steps
Login to the application as Admin
Navigate to Global Search
Send query using abbreviations/acronyms: "show me TPS doc rev details"
Wait for the AI response
Expected Result
Response must be non-empty
Response must contain at least 1 term: tps, document, doc, revision, rev
Page must not crash

---

## 8.4 Performance

# TC_GS_ML_029 - Verify Consecutive Multilingual Searches Do Not Degrade Performance
Steps
Login to the application as Admin
Navigate to Global Search
Submit 5 queries sequentially in different languages (English, French, German, Spanish, Arabic) without page reload
Record response time for each language
Verify page stability after all queries
Expected Result
Each query must complete within 90 seconds
Follow-up input must remain visible and enabled after all queries
URL must remain /global-search throughout
Page must not crash or show degraded behavior
No Unhandled or 500 errors should appear

---

## 8.5 Security

# TC_GS_ML_030 - Verify SQL Injection Payload Does Not Crash or Expose Data
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "' OR '1'='1'; DROP TABLE documents; --"
Observe the page response
Expected Result
Page must not crash
URL must remain /global-search
No raw DB error messages (e.g., "table dropped", "syntax error near", ORA-xxxxx, pg-error) should appear
No server errors should appear in the UI

# TC_GS_ML_031 - Verify XSS Payload Is Not Executed and Does Not Crash the Page
Steps
Login to the application as Admin
Navigate to Global Search
Send query containing XSS: "<script>alert(1)</script><img src=x onerror='alert(1)'/>"
Observe the page — no alert dialog should appear
Expected Result
The injected script must NOT execute (no alert popup should appear)
Page must not crash
URL must remain /global-search
Input must be rendered as plain text or sanitized — not as live HTML

# TC_GS_ML_032 - Verify Script Injection Payload Is Sanitized and Does Not Crash
Steps
Login to the application as Admin
Navigate to Global Search
Send query: "javascript:alert(1)\"><svg/onload=alert(1)>"
Observe the page
Expected Result
No dangerous elements (svg[onload], img[onerror]) must be rendered on the page
Page must not crash
URL must remain /global-search

# TC_GS_ML_033 - Verify Special Character Abuse Does Not Cause Server Errors
Steps
Login to the application as Admin
Navigate to Global Search
Send query containing path traversal and null bytes: "../../etc/passwd\x00null<>'\";& |`${}[]()\\"
Observe the page
Expected Result
Page must not crash
No server-side error messages (nginx, apache, stack trace, 500 Internal Server Error) must appear
URL must remain /global-search

---

# How to Add a New Test Case

Follow these steps when adding a new test case to this module:

**Step 1 — Add the entry to this file**
Copy the template below, fill all fields, and paste it under the appropriate section:

```
# TC_GS_XXX - <Short Descriptive Title>
Steps
<Step 1>
<Step 2>
<Step 3>
Expected Result
<Expected outcome 1>
<Expected outcome 2>
```

**Step 2 — Add the implementation to the correct spec file**

| Category | File |
|---|---|
| Page Load & UI Structure | `global-search-page-load.spec.ts` |
| Query Interaction & Controls | `global-search-query.spec.ts` |
| Response Accuracy | `global-search-accuracy.spec.ts` |
| End-to-End Flows | `global-search-e2e.spec.ts` |
| Advanced Verification | `global-search-advanced.spec.ts` |
| Revision Access Control | `global-search-revision-access.spec.ts` |
| Multi-Language Validation | `global-search-multilang.spec.ts` |

**Step 3 — Use this Playwright script template:**
```typescript
// TC_GS_XXX
test('TC_GS_XXX – <Title>', async ({ page }) => {
  test.setTimeout(60_000); // use 150_000 for AI-heavy tests

  // Pre-condition
  await helper.startNewSearch();
  await helper.waitForPageReady();

  // Action
  await helper.sendMessage('<your query>');
  const response = await helper.waitForResponse();

  // Assertion
  expect(response.trim().length).toBeGreaterThan(0);
});
```

**Step 4 — Run the new test in headed mode to confirm it passes:**
```bash
npx playwright test tests/global_search_module/ --grep "TC_GS_XXX" --project=chromium --headed
```

---

*Document maintained by QA Automation | Last Updated: 2026-06-24*
