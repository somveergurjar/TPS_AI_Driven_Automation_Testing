# Global Search Module

---

**User Story :**
I want to search across all platform data (documents, revisions, equipment, projects, and suppliers) using natural language through the Global Search module,
So that I can get AI-generated answers instantly, manage my search history, control AI streaming, and ensure that each client user only sees the content they are authorized to access.

---

**Objective**

The Global Search module will allow authorized users to:

- Search all platform data using natural language queries
- Receive AI-generated prose responses based on indexed document chunks
- View past queries in a persistent Query History sidebar
- Stop an in-progress AI response at any time using the Stop button
- Delete specific query history items without affecting others
- Continue a conversation with follow-up questions in the same thread
- Start a fresh search session using the New Search button
- Submit queries in multiple languages and receive responses in the same language
- Verify that newly uploaded documents appear in search results after re-indexing
- Ensure client users only see search results from their assigned document revisions

---

**Functional Overview**

The Global Search module contains:

1. Page Load & UI Structure
2. Query Submission & AI Response
3. Stop Button (Halt AI Streaming)
4. Query History Management (Save / View / Delete)
5. Conversation Threading & Turn Counter
6. New Search / Conversation Reset
7. Multilingual Query Support
8. Reindex & Chunk Relevance
9. Session Consistency
10. PDF Content Accuracy
11. Revision-Based Access Control (Client-wise)

---

## Acceptance Criteria

---

**AC-01: Global Search Page Load**

Given the admin opens the Global Search module
When the page loads successfully
Then the system shall navigate to a URL containing `/global-search`

And the following elements shall be visible:

- Page heading: "Global Search"
- Left sidebar with "QUERY HISTORY" panel
- Follow-up input field at the bottom of the page
- "Ask" button next to the input
- "+ New Search" button at the top

And the page shall not display any crash, blank screen, or raw JavaScript errors

---

**AC-02: Query History Panel Display**

Given the user is on the Global Search page
Then the left sidebar shall display the Query History panel
And previously submitted queries shall be listed in that panel

---

**AC-03: Follow-up Input Field Behavior**

Given the user is on the Global Search page
Then the follow-up input field shall be:

- Visible at the bottom of the page
- Enabled and editable
- Accepting keyboard input without restriction

---

**AC-04: No Broken UI Elements**

Given the user is on the Global Search page
Then the system shall not display:

- Broken or missing images
- Raw text such as "undefined" or "[object Object]"
- Overlapping or misaligned UI components

---

**AC-05: Sidebar Navigation to Global Search**

Given the user is on any page within the application
When the user clicks "Global Search" in the sidebar navigation
Then the browser shall navigate to the Global Search page
And the page title "Global Search" shall be visible

---

**AC-06: Query Submission Returns AI Response**

Given the user types a natural language query in the follow-up input
When the user clicks the "Ask" button
Then the system shall display an AI-generated response card in the chat area

And the response shall:

- Be non-empty text
- Appear within the main chat area
- Contain domain-relevant information related to the query

---

**AC-07: AI Disclaimer on Every Response**

Given the user receives any AI-generated response
Then the text "AI-generated content may be incorrect" shall be visible below the response
And this disclaimer shall appear on every single AI response without exception

---

**AC-08: References Section on Response Card**

Given the user receives an AI-generated response
Then a "References" section shall be present in the response card
And clicking the References toggle shall expand or collapse the section without any crash

---

**AC-09: No Relevant Results Message**

Given the user submits a query with a completely non-existent or unrelated term
When the AI processes the query
Then the system shall display: "No relevant results found"
And the page shall not crash or show a blank screen

---

**AC-10: Query Bubble in Chat**

Given the user submits a query
Then the submitted query text shall appear as a message bubble or chip in the conversation chat area

---

**AC-11: Empty Message Does Not Crash the Page**

Given the user leaves the follow-up input empty
When the user clicks the "Ask" button
Then the system shall not crash
And no "Unhandled" or "500 Internal Server Error" message shall appear in the UI

---

**AC-12: Response Does Not Contain Errors or Raw Data**

Given the user receives an AI response
Then the response shall NOT contain:

- TypeError, SyntaxError, ReferenceError, 500 Internal Server Error
- Raw values: null, undefined, [object Object]
- Raw JSON starting with `{` or `[`

---

**AC-13: Response Length is Reasonable**

Given the user receives an AI response
Then the response shall be:

- Longer than 20 characters (not a one-word answer)
- Shorter than 50,000 characters (not a raw data dump)

---

**AC-14: Stop Button Appears During AI Streaming**

Given the user has submitted a query
When the AI starts generating and streaming a response
Then a red "Stop" button shall appear in the input area within 10 seconds of submission
And the Stop button shall be visible and clickable while the AI is still generating

---

**AC-15: Stop Button Halts AI Generation**

Given the Stop button is visible during AI streaming
When the user clicks the Stop button
Then the AI response generation shall stop immediately
And the Stop button shall disappear from the input area

---

**AC-16: UI Remains Functional After Stopping**

Given the user has clicked the Stop button to halt a response
Then the follow-up input shall remain visible and enabled
And the user shall be able to submit a new query without any crash
And no "Unhandled" or "500" errors shall appear in the UI

Note: The Stop button only appears while the AI is actively streaming. It disappears once the response is complete or stopped.

---

**AC-17: Query is Saved to History After Sending**

Given the user submits a query on the Global Search page
When the AI response is returned
Then the query shall appear in the Query History panel on the left sidebar
And the query shall persist after a page refresh

---

**AC-18: Clicking a History Item Loads That Conversation**

Given the user has previous queries in the Query History sidebar
When the user clicks on any history item
Then the conversation for that query shall load in the main chat area
And the follow-up input shall remain visible and enabled

---

**AC-19: Hover on History Item Reveals Three-Dot Menu**

Given the user has a query in the left sidebar Query History
When the user hovers the mouse over a history item
Then a three-dot (⋮) menu icon shall become visible on that item

---

**AC-20: Delete Option in Three-Dot Menu**

Given the three-dot menu is visible on a history item
When the user clicks the three-dot menu icon
Then a "Delete" option shall appear in the resulting dropdown or context menu

---

**AC-21: Delete Removes Only the Selected History Item**

Given the user clicks "Delete" on a specific history item
When deletion is confirmed
Then only that specific history item shall be removed from the sidebar

And the following shall remain unaffected:

- All other pre-existing history items
- The current conversation in the main chat area

Note: Delete consumes AI tokens since the history item was created by a real query. Only delete items intentionally created for testing. Never delete pre-existing production history items.

---

**AC-22: Turn Counter is Visible**

Given the user is in an active conversation on the Global Search page
Then a turn counter (e.g., "3 turns in conversation") shall be visible on the page

---

**AC-23: Turn Counter Increments After Each Message**

Given the user has an active conversation with a known turn count
When the user sends a new message and receives a response
Then the turn counter shall increase by exactly 1

---

**AC-24: Follow-up Question Builds on Prior Context**

Given the user has sent a first query and received a response
When the user sends a follow-up question (e.g., "can you give more details?")
Then the AI shall return a non-empty contextual response
And the turn counter shall show at least 2 turns

---

**AC-25: New Search Button Resets the Conversation**

Given the user has an active conversation with one or more turns
When the user clicks the "+ New Search" button
Then the current conversation shall be cleared from the chat area
And the turn counter shall reset to 0 or 1
And the follow-up input shall be visible and ready for a new query

---

**AC-26: New Search Does Not Delete Existing History**

Given the user clicks "+ New Search" to start a fresh conversation
Then the new session shall appear as a separate entry in the Query History sidebar
And all previous conversation entries shall remain visible in the sidebar

---

**AC-27: English Query Returns English Response**

Given the user submits a query in English (e.g., "List all documents available in the system")
When the AI responds
Then the response shall be in English
And shall contain common English words such as: the, and, is, are, of, in, for

---

**AC-28: French Query Returns French Response**

Given the user submits a query in French (e.g., "Listez tous les documents disponibles dans le système")
When the AI responds
Then the response shall contain French language markers such as:

- le, la, les, de, du, des, et, est, dans, pour

---

**AC-29: German Query Returns German Response**

Given the user submits a query in German (e.g., "Listen Sie alle verfügbaren Dokumente im System auf")
When the AI responds
Then the response shall contain German language markers such as:

- die, der, das, und, ist, sind, in, für, von

---

**AC-30: Newly Created Document Appears in Search After Indexing**

Given an administrator creates a new document and uploads a revision PDF
When approximately 2 minutes have elapsed for re-indexing
And the administrator searches for the document by name or TPS ID
Then the AI response shall reference the newly created document
And the document shall be discoverable through the search

---

**AC-31: Response Contains Domain-Relevant Terms**

Given the administrator submits a domain-specific query (e.g., "Give me details about documents and their revisions")
When the AI response is returned
Then the response shall be a prose answer of more than 50 characters
And shall contain at least one keyword from:

- document, revision, tps, supplier, equipment, project, client

---

**AC-32: Same Query in Two Sessions Returns Consistent Content**

Given two users are both logged in and on the Global Search page
When both submit the identical query at approximately the same time
Then both responses shall be non-empty
And both responses shall contain at least 2 overlapping domain keywords
And neither response shall be an error or blank screen

---

**AC-33: PDF Content is Returned Accurately**

Given a PDF file has been uploaded as a document revision
When the user queries specific content from that PDF
Then the AI response shall reference content from the PDF
And shall contain relevant keywords matching the PDF data
And shall not fabricate data that is not present in the PDF

---

**AC-34: Admin Sees All Revisions in Search Results**

Given the administrator has created a document with 3 revisions
When the administrator searches for that document in Global Search
Then the AI response shall reference content from the document's revisions
And the response shall not be empty

---

**AC-35: Client Sees Only Their Assigned Revision**

Given a client has been assigned access to a specific revision of a document
When the client searches for that document in Global Search
Then the AI response shall reflect content only from their assigned revision

And the response shall NOT expose content from:

- Revisions the client has not been assigned
- Other clients' authorized revisions

---

**AC-36: Cross-Client Isolation is Enforced**

Given Client 1 is assigned Revision 2 and Client 2 is assigned Revision 3
When Client 1 submits a query targeting content from Revision 3
Then the AI response shall NOT return content from Revision 3
And the system shall only return information within Client 1's authorized revision scope

---

**AC-37: Client Access Assignment in Admin Panel**

Given the administrator is in the Clients/Projects management section
When the administrator assigns a client to a specific document revision
Then the client shall gain access to that revision's content in Global Search
And the assignment shall take effect without requiring a manual reindex

---

## User Story 12 – Inconsistent Response Output for Similar Queries (Regression)

**User Story :**
I want to verify that the Global Search AI returns semantically consistent responses when the same or similar queries are submitted across different sessions and conversation threads,
So that I can detect regressions in the chunk retrieval pipeline, embedding stability, or LLM prompt consistency before they reach production.

**Objective**

This regression scenario covers:

- Same query submitted twice returning fundamentally different domain content
- Semantically similar (paraphrased) queries returning inconsistent responses
- Follow-up queries across two conversation threads returning contradictory content
- Equipment or document queries randomly switching domain topics across runs

**Root Cause Analysis Areas:**

- Vector search chunk retrieval pipeline instability
- Embedding model output variance for identical inputs
- LLM prompt inconsistency or context window issues
- Reindex side effects affecting the search index state

---

**AC-38: Same Query Submitted Twice Returns Consistent Domain Content**

Given the administrator submits the same query twice in two separate fresh conversations
When both AI responses are returned
Then both responses shall be non-empty
And both responses shall contain at least 2 overlapping domain keywords from:

- document, revision, supplier, tps, equipment, project

And the overall domain topic shall remain the same across both responses
And neither response shall return a blank screen, error, or "NO_RELEVANT_RESULTS"

Note: Word-for-word identical responses are not required since AI language is non-deterministic, but the domain content and topic must remain consistent

---

**AC-39: Semantically Similar Queries Return Consistent Domain Content**

Given the administrator submits three paraphrased versions of the same intent in three separate fresh conversations:

- Variant 1: "show me all documents in the system"
- Variant 2: "list all documents available"
- Variant 3: "what documents exist in this platform?"

When all three AI responses are returned
Then all three responses shall be non-empty
And all three responses shall contain at least one overlapping domain keyword: document, revision, supplier, tps
And none of the responses shall return "NO_RELEVANT_RESULTS" for a valid domain query
And the responses shall not contradict each other on core facts

---

**AC-40: Minor Query Wording Change Does Not Produce Completely Different Output**

Given the administrator submits two queries that differ only in phrasing:

- Query A: "tell me about document revisions"
- Query B: "describe the document revisions"

When both AI responses are returned
Then both responses shall address the topic of document revisions
And both responses shall contain at least one keyword from: revision, document, version, upload, file
And neither response shall switch to a completely unrelated domain topic

---

**AC-41: Equipment Query Output is Stable Across Two Runs**

Given the administrator submits the exact same equipment query twice in two separate fresh conversations
When both AI responses are returned
Then both responses shall contain at least one keyword from: equipment, tps, manufacturer, supplier, spare
And the domain topic shall remain equipment-related in both responses
And the number of overlapping domain keywords between both responses shall be at least 2

---

**AC-42: Follow-up Query Output is Consistent Across Two Conversation Threads**

Given the administrator starts two separate conversation threads with the same initial query
When the administrator sends the same follow-up question in both threads
Then both follow-up responses shall be non-empty
And both shall remain on the same domain topic
And both shall contain at least 1 overlapping keyword
And the responses shall not contradict each other on factual content

---

## Technical Notes

- Use **Playwright** for test automation
- Test on **Chromium** (primary)
- All AI-response tests require an extended timeout of **150 seconds** due to streaming latency
- Do **NOT** use `waitForLoadState('networkidle')` for AI-response waits — SSE streaming keeps the network busy; use `waitForTimeout(2000)` after query submission then poll for content
- The disclaimer `"AI-generated content may be incorrect"` is the only reliable signal that a real AI response has fully rendered

---

## Definition of Done

- All acceptance criteria have corresponding automated test cases
- Manual exploratory testing completed on the Global Search page
- Automated test scripts are created, reviewed, and passing in headed Chromium
- All bugs discovered during testing are logged with steps to reproduce
- This user story document is kept in sync with `Global_Search_Module_TestCases.md`

---

*Document maintained by QA Automation | Last Updated: 2026-06-18*
