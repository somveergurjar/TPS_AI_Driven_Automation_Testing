/**
 * REVISION-BASED ACCESS CONTROL – Global Search
 * ─────────────────────────────────────────────
 * Scenario:
 *   A document has 3 revisions (Rev 1, Rev 2, Rev 3).
 *   Client 1  → has access to Rev 2 only.
 *   Client 2  → has access to Rev 3 only.
 *
 *   When Client 1 searches, the AI response MUST reference Rev 2 content.
 *   When Client 2 searches, the AI response MUST reference Rev 3 content.
 *   Neither client should see revision content beyond their permission.
 *
 * Pre-requisites (configure in .env):
 *   CLIENT1_EMAIL      = <email of client-1 user>
 *   CLIENT1_PASSWORD   = <password of client-1 user>
 *   CLIENT1_REVISION   = 2   (which revision client 1 can access)
 *   CLIENT2_EMAIL      = <email of client-2 user>
 *   CLIENT2_PASSWORD   = <password of client-2 user>
 *   CLIENT2_REVISION   = 3   (which revision client 2 can access)
 *
 * The admin (TEST_EMAIL / TEST_PASSWORD) is used to set up the test document.
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import path from 'path';
import { ENV } from '../../config/env';

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE          = ENV.baseUrl;
const LOGIN_URL     = ENV.loginUrl;
const DOC_URL       = ENV.urls.document;
const SEARCH_URL    = ENV.urls.globalSearch;
const TIMEOUTS      = ENV.timeouts;
const AI_TIMEOUT    = 60_000;

const FIXTURE_PDF   = path.resolve(__dirname, '../../test-data/calibration-certificate-rev1.pdf');

// Unique document name so searches are unambiguous
const DOC_NAME      = `GS_RevAccess_${Date.now()}`;

// Shared state written during admin setup, read during client tests
let capturedTpsId   = '';

// ─── Selectors ───────────────────────────────────────────────────────────────

const S = {
  email:          'input[type="email"]',
  password:       'input[type="password"]',
  loginBtn:       'button:has-text("Continue to Verification")',
  newDocBtn:      'button:has-text("New Document")',
  saveDocBtn:     'button:has-text("Save Document")',
  revisionsTab:   'button:has-text("Revisions")',
  fileInput:      'input[type="file"]',
  uploadRevBtn:   'button:has-text("Upload Revision")',
  categorySelect: 'select',
  docTypeInput:   'input[placeholder="SELECT OR TYPE TO ADD NEW..."]',
  supplierInput:  'input[placeholder="TYPE TO SEARCH OR ADD NEW..."]',
  dropdown:       'div.absolute.z-50',
  tpsIdCell:      'table tbody tr td:first-child',
  docNameFilter:  'th:has-text("DOCUMENT NAME") input[placeholder="Filter..."]',
  toastSuccess:   'text=/successfully/i',
  deleteIcon:     'button:has(svg.lucide-trash2)',
  deleteModal:    'div:has-text("Delete Document")',
  deleteConfirm:  'button:has-text("Delete")',
  // Client role sees a centered search bar; admin sees a chat follow-up input at the bottom
  followUpInput:  [
    'input[placeholder*="follow-up"]',
    'input[placeholder*="Ask a follow"]',
    'textarea[placeholder*="follow"]',
    'input[placeholder*="Ask anything"]',
    'input[placeholder*="your projects"]',
  ].join(', '),
  askBtn:         'button:has-text("Ask"), button:has-text("Search")',
  responseItems:  'main ul li, main ol li, main p, [class*="prose"]',
  noResults:      'text=/No relevant results found/i',
  aiDisclaimer:   'text=/AI-generated content may be incorrect/i',
  loadingSpinner: '[class*="animate-spin"], svg.animate-spin',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function loginAs(page: Page, email: string, password: string) {
  await page.context().clearCookies();
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForSelector(S.email, { timeout: TIMEOUTS.navigation });
  await page.fill(S.email, email);
  await page.fill(S.password, password);
  await page.click(S.loginBtn);
  await page.waitForURL(url => !url.href.includes('/login'), {
    timeout: TIMEOUTS.navigation, waitUntil: 'domcontentloaded',
  }).catch(() => {});
  await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.navigation });
}

async function selectFirstDropdown(page: Page, inputSel: string) {
  const inp = page.locator(inputSel).first();
  if ((await inp.count()) === 0) return;
  await inp.click();
  await page.waitForTimeout(400);
  const opt = page.locator(`${S.dropdown} > div`).first();
  if ((await opt.count()) > 0) await opt.click();
  await page.waitForTimeout(300);
}

// Select first real option from a native <select> (skips index 0 which is the placeholder)
async function selectFirstNativeOption(page: Page, selectIndex: number) {
  const selects = page.locator('select');
  if ((await selects.count()) <= selectIndex) return;
  const sel = selects.nth(selectIndex);
  if ((await sel.isDisabled())) return;
  await sel.selectOption({ index: 1 });
  await page.waitForTimeout(400);
}

async function uploadRevision(page: Page, filePath: string): Promise<boolean> {
  const fi = page.locator(S.fileInput).first();
  if ((await fi.count()) === 0) return false;
  await fi.setInputFiles(filePath);
  await page.waitForTimeout(500);
  const btn = page.locator(S.uploadRevBtn).first();
  if ((await btn.count()) > 0 && await btn.isEnabled()) {
    await btn.click();
    await page.waitForTimeout(1200);
    return true;
  }
  return false;
}

// Known static UI strings to strip when reading AI response
const STATIC_UI_STRINGS = [
  'AI-powered search across documents',
  'Query History',
  'Ask anything about your projects, equipment, or documents',
  'Global Search',
  'Search history...',
  'global search docs',
  'Dashboard',
  'Projects',
  'Audit Log',
];

async function sendSearchQuery(page: Page, query: string) {
  const inp = page.locator(S.followUpInput).first();
  await inp.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
  await inp.click();
  await inp.fill('');
  await inp.fill(query);

  const btn = page.locator(S.askBtn).first();
  if ((await btn.count()) > 0) {
    await btn.click();
  } else {
    await inp.press('Enter');
  }

  // Give the request time to start before we poll for the response
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

function stripStaticContent(raw: string): string {
  let out = raw;
  for (const s of STATIC_UI_STRINGS) {
    out = out.replace(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

async function waitForAiResponse(page: Page): Promise<string> {
  // Wait for any loading spinner to finish
  const spinner = page.locator(S.loadingSpinner).first();
  if ((await spinner.count()) > 0) {
    await spinner.waitFor({ state: 'hidden', timeout: AI_TIMEOUT }).catch(() => {});
  }

  // Poll until meaningful content (beyond static boilerplate) appears in the page
  await expect.poll(async () => {
    if ((await page.locator(S.noResults).count()) > 0) return 'no-results';

    const bodyText = (await page.evaluate(() => document.body.innerText)) ?? '';
    const stripped = stripStaticContent(bodyText);
    return stripped.length > 30 ? stripped : '';
  }, { timeout: AI_TIMEOUT, intervals: [2000, 3000, 5000] }).not.toBe('');

  if ((await page.locator(S.noResults).count()) > 0) return 'NO_RELEVANT_RESULTS';

  const bodyText = (await page.evaluate(() => document.body.innerText)) ?? '';
  return stripStaticContent(bodyText);
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Global Search – Revision-Based Access Control', () => {

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 1 – Admin creates document with 3 revisions
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('Phase 1 – Admin Setup: Create document with 3 revisions', () => {

    test('TC_GS_RAC_SETUP – Admin creates document and uploads Rev 1, Rev 2, Rev 3', async ({ page }) => {
      await loginAs(page, ENV.credentials.email, ENV.credentials.password);

      // Navigate to Document module
      await page.goto(DOC_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      // Open New Document form
      const newDocBtn = page.locator(S.newDocBtn).first();
      await expect(newDocBtn).toBeVisible({ timeout: TIMEOUTS.element });
      await newDocBtn.click();
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      // ── Fill Identification tab ──────────────────────────────────────────
      // Document Name
      const nameInputs = page.locator(
        'input[type="text"]:not([disabled]):not([placeholder="SELECT OR TYPE TO ADD NEW..."]):not([placeholder="TYPE TO SEARCH OR ADD NEW..."])',
      );
      const nameInput = nameInputs.first();
      await nameInput.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
      await nameInput.fill(DOC_NAME);

      // Category (native <select> — must be selected before Document Type unlocks)
      // The form has: CATEGORY (index 0) then DOCUMENT TYPE (index 1) as native selects
      await selectFirstNativeOption(page, 0);
      console.log('✅ Category selected');

      // Document Type — becomes available as an autocomplete input after Category is chosen
      await selectFirstDropdown(page, S.docTypeInput);
      // Fallback: if Document Type is still a native <select>, pick its first option
      const docTypeInput = page.locator(S.docTypeInput).first();
      if ((await docTypeInput.count()) === 0) {
        await selectFirstNativeOption(page, 1);
      }
      console.log('✅ Document Type selected');

      // Supplier
      await selectFirstDropdown(page, S.supplierInput);

      // ── Navigate to Revisions tab ────────────────────────────────────────
      const revTab = page.locator(S.revisionsTab).first();
      await revTab.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
      await revTab.click();
      await page.waitForTimeout(600);

      // ── Upload Rev 1 ─────────────────────────────────────────────────────
      console.log('Uploading Rev 1...');
      const rev1Ok = await uploadRevision(page, FIXTURE_PDF);
      expect(rev1Ok).toBe(true);

      // ── Upload Rev 2 ─────────────────────────────────────────────────────
      console.log('Uploading Rev 2...');
      const rev2Ok = await uploadRevision(page, FIXTURE_PDF);
      expect(rev2Ok).toBe(true);

      // ── Upload Rev 3 ─────────────────────────────────────────────────────
      console.log('Uploading Rev 3...');
      const rev3Ok = await uploadRevision(page, FIXTURE_PDF);
      expect(rev3Ok).toBe(true);

      // Verify 3 revision rows in the grid
      const rows = page.locator('table tbody tr');
      await expect.poll(() => rows.count(), { timeout: 10000 }).toBeGreaterThanOrEqual(3);
      const revCount = await rows.count();
      console.log(`✅ Revision rows visible: ${revCount}`);
      expect(revCount).toBeGreaterThanOrEqual(3);

      // ── Save Document ────────────────────────────────────────────────────
      const saveBtn = page.locator(S.saveDocBtn).first();
      await saveBtn.click();
      await page.locator(S.toastSuccess).waitFor({ state: 'visible', timeout: 15000 });
      console.log('✅ Document saved successfully');

      // ── Capture TPS ID from the document list ────────────────────────────
      await page.goto(DOC_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      const nameFilter = page.locator(S.docNameFilter).first();
      if ((await nameFilter.count()) > 0) {
        await nameFilter.fill(DOC_NAME);
        await page.waitForTimeout(800);
      }

      const matchRow = page.locator(`table tbody tr:has-text("${DOC_NAME}")`).first();
      await matchRow.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
      capturedTpsId = ((await matchRow.locator('td').first().textContent()) ?? '').trim();

      console.log(`✅ Document TPS ID captured: ${capturedTpsId}`);
      expect(capturedTpsId).not.toBe('');

      // ── NOTE ─────────────────────────────────────────────────────────────
      // At this point the admin must assign:
      //   Client 1 → Rev 2 access
      //   Client 2 → Rev 3 access
      // via the Clients/Projects management section.
      // This test only validates the SEARCH ISOLATION after access is configured.
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 2 – Client 1 searches (should see Rev 2 only)
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('Phase 2 – Client 1: Global Search returns Rev 2 only', () => {

    test.beforeEach(() => {
      if (!ENV.client1.email || !ENV.client1.password) {
        test.skip(true, '⚠ CLIENT1_EMAIL / CLIENT1_PASSWORD not configured in .env — skipping');
      }
      if (!capturedTpsId) {
        test.skip(true, '⚠ Admin setup did not run (capturedTpsId is empty) — run Phase 1 first');
      }
    });

    // TC_GS_RAC_001
    test('TC_GS_RAC_001 – Client 1 search returns response (not empty)', async ({ page }) => {
      await loginAs(page, ENV.client1.email, ENV.client1.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Give me details of document ${capturedTpsId}`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 1 response:\n${response}\n`);
      expect(response).not.toBe('');
    });

    // TC_GS_RAC_002
    test('TC_GS_RAC_002 – Client 1 response references Rev 2 (their accessible revision)', async ({ page }) => {
      await loginAs(page, ENV.client1.email, ENV.client1.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `What is the latest revision of document ${capturedTpsId}?`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 1 revision response:\n${response}\n`);

      if (response === 'NO_RELEVANT_RESULTS') {
        test.fail(true, `Client 1 got no results — the document may not be indexed or access is not configured`);
        return;
      }

      const lower = response.toLowerCase();
      const client1Rev = ENV.client1.accessibleRevision; // 2

      // ✅ Should contain Rev 2 reference
      const hasRev2 = lower.includes(`rev ${client1Rev}`) ||
                      lower.includes(`rev${client1Rev}`) ||
                      lower.includes(`revision ${client1Rev}`) ||
                      lower.includes(`revision${client1Rev}`);

      // ❌ Should NOT contain Rev 3 reference (Client 2's revision)
      const hasRev3 = lower.includes('rev 3') || lower.includes('rev3') ||
                      lower.includes('revision 3') || lower.includes('revision3');

      console.log(`✅ Contains Rev ${client1Rev}: ${hasRev2}`);
      console.log(`❌ Contains Rev 3 (should be false): ${hasRev3}`);

      expect(hasRev2).toBe(true);
      expect(hasRev3).toBe(false);
    });

    // TC_GS_RAC_003
    test('TC_GS_RAC_003 – Client 1 cannot see Rev 3 content in search results', async ({ page }) => {
      await loginAs(page, ENV.client1.email, ENV.client1.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Show me all revisions of ${capturedTpsId}`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 1 all-revisions response:\n${response}\n`);

      if (response === 'NO_RELEVANT_RESULTS') return;

      const lower = response.toLowerCase();

      // Rev 3 must NOT appear for Client 1
      const mentionsRev3 = lower.includes('rev 3') || lower.includes('rev3') ||
                           lower.includes('revision 3') || lower.includes('revision3');

      expect(mentionsRev3).toBe(false);
      console.log('✅ Rev 3 is NOT exposed to Client 1 — access control is working');
    });

    // TC_GS_RAC_004
    test('TC_GS_RAC_004 – AI disclaimer is shown on Client 1 response', async ({ page }) => {
      await loginAs(page, ENV.client1.email, ENV.client1.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Details of ${capturedTpsId}`);
      await waitForAiResponse(page);

      await expect(page.locator(S.aiDisclaimer).first()).toBeVisible({ timeout: TIMEOUTS.element });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 3 – Client 2 searches (should see Rev 3 only)
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('Phase 3 – Client 2: Global Search returns Rev 3 only', () => {

    test.beforeEach(() => {
      if (!ENV.client2.email || !ENV.client2.password) {
        test.skip(true, '⚠ CLIENT2_EMAIL / CLIENT2_PASSWORD not configured in .env — skipping');
      }
      if (!capturedTpsId) {
        test.skip(true, '⚠ Admin setup did not run — run Phase 1 first');
      }
    });

    // TC_GS_RAC_005
    test('TC_GS_RAC_005 – Client 2 search returns response (not empty)', async ({ page }) => {
      await loginAs(page, ENV.client2.email, ENV.client2.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Give me details of document ${capturedTpsId}`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 2 response:\n${response}\n`);
      expect(response).not.toBe('');
    });

    // TC_GS_RAC_006
    test('TC_GS_RAC_006 – Client 2 response references Rev 3 (their accessible revision)', async ({ page }) => {
      await loginAs(page, ENV.client2.email, ENV.client2.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `What is the latest revision of document ${capturedTpsId}?`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 2 revision response:\n${response}\n`);

      if (response === 'NO_RELEVANT_RESULTS') {
        test.fail(true, `Client 2 got no results — the document may not be indexed or access is not configured`);
        return;
      }

      const lower = response.toLowerCase();
      const client2Rev = ENV.client2.accessibleRevision; // 3

      // ✅ Should contain Rev 3 reference
      const hasRev3 = lower.includes(`rev ${client2Rev}`) ||
                      lower.includes(`rev${client2Rev}`) ||
                      lower.includes(`revision ${client2Rev}`) ||
                      lower.includes(`revision${client2Rev}`);

      // ❌ Should NOT contain Rev 2 reference (Client 1's revision)
      const hasRev2 = lower.includes('rev 2') || lower.includes('rev2') ||
                      lower.includes('revision 2') || lower.includes('revision2');

      console.log(`✅ Contains Rev ${client2Rev}: ${hasRev3}`);
      console.log(`❌ Contains Rev 2 (should be false): ${hasRev2}`);

      expect(hasRev3).toBe(true);
      expect(hasRev2).toBe(false);
    });

    // TC_GS_RAC_007
    test('TC_GS_RAC_007 – Client 2 cannot see Rev 2 content in search results', async ({ page }) => {
      await loginAs(page, ENV.client2.email, ENV.client2.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Show me all revisions of ${capturedTpsId}`);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 Client 2 all-revisions response:\n${response}\n`);

      if (response === 'NO_RELEVANT_RESULTS') return;

      const lower = response.toLowerCase();

      // Rev 2 must NOT appear for Client 2
      const mentionsRev2 = lower.includes('rev 2') || lower.includes('rev2') ||
                           lower.includes('revision 2') || lower.includes('revision2');

      expect(mentionsRev2).toBe(false);
      console.log('✅ Rev 2 is NOT exposed to Client 2 — access control is working');
    });

    // TC_GS_RAC_008
    test('TC_GS_RAC_008 – AI disclaimer is shown on Client 2 response', async ({ page }) => {
      await loginAs(page, ENV.client2.email, ENV.client2.password);
      await page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      await sendSearchQuery(page, `Details of ${capturedTpsId}`);
      await waitForAiResponse(page);

      await expect(page.locator(S.aiDisclaimer).first()).toBeVisible({ timeout: TIMEOUTS.element });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 4 – Cross-client isolation (critical security check)
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('Phase 4 – Cross-Client Isolation (Security)', () => {

    test('TC_GS_RAC_009 – Client 1 and Client 2 get DIFFERENT responses for same query', async ({ browser }) => {
      if (!ENV.client1.email || !ENV.client2.email || !capturedTpsId) {
        test.skip(true, 'Client credentials or TPS ID not configured');
        return;
      }

      const query = `Give me the revision details of document ${capturedTpsId}`;

      // Client 1 response — isolated context
      const ctx1  = await browser.newContext();
      const page1 = await ctx1.newPage();
      await loginAs(page1, ENV.client1.email, ENV.client1.password);
      await page1.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page1.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});
      await sendSearchQuery(page1, query);
      const response1 = await waitForAiResponse(page1);
      await ctx1.close();

      // Client 2 response — isolated context
      const ctx2  = await browser.newContext();
      const page2 = await ctx2.newPage();
      await loginAs(page2, ENV.client2.email, ENV.client2.password);
      await page2.goto(SEARCH_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page2.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});
      await sendSearchQuery(page2, query);
      const response2 = await waitForAiResponse(page2);
      await ctx2.close();

      console.log(`\n📋 Client 1 response:\n${response1}\n`);
      console.log(`\n📋 Client 2 response:\n${response2}\n`);

      // The two responses must differ — proving revision isolation
      // (same query to same doc but different revision access → different answers)
      const lower1 = response1.toLowerCase();
      const lower2 = response2.toLowerCase();

      const client1SeeRev2 = lower1.includes('rev 2') || lower1.includes('rev2') || lower1.includes('revision 2');
      const client2SeeRev3 = lower2.includes('rev 3') || lower2.includes('rev3') || lower2.includes('revision 3');
      const client1NoRev3  = !lower1.includes('rev 3') && !lower1.includes('rev3');
      const client2NoRev2  = !lower2.includes('rev 2') && !lower2.includes('rev2');

      console.log(`\n🔍 Isolation checks:`);
      console.log(`   Client 1 sees Rev 2:      ${client1SeeRev2}`);
      console.log(`   Client 1 hides Rev 3:     ${client1NoRev3}`);
      console.log(`   Client 2 sees Rev 3:      ${client2SeeRev3}`);
      console.log(`   Client 2 hides Rev 2:     ${client2NoRev2}`);

      expect(client1SeeRev2).toBe(true);
      expect(client1NoRev3).toBe(true);
      expect(client2SeeRev3).toBe(true);
      expect(client2NoRev2).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // CLEANUP – Admin deletes the test document
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('Phase 5 – Admin Cleanup', () => {

    test('TC_GS_RAC_CLEANUP – Admin deletes the test document', async ({ page }) => {
      if (!capturedTpsId) { test.skip(true, 'No document to clean up'); return; }

      await loginAs(page, ENV.credentials.email, ENV.credentials.password);
      await page.goto(DOC_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
      await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.navigation }).catch(() => {});

      try {
        const filter = page.locator(S.docNameFilter).first();
        if ((await filter.count()) > 0) {
          await filter.fill(DOC_NAME);
          await page.waitForTimeout(800);
        }

        const row = page.locator(`table tbody tr:has-text("${DOC_NAME}")`).first();
        await row.waitFor({ state: 'visible', timeout: TIMEOUTS.element });

        const delBtn = row.locator(S.deleteIcon).first();
        await delBtn.click();

        const modal = page.locator(S.deleteModal).first();
        await modal.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
        await page.locator(S.deleteConfirm).click();
        await page.locator(S.toastSuccess).waitFor({ state: 'visible', timeout: TIMEOUTS.action });

        console.log(`✅ Cleanup: document "${DOC_NAME}" deleted`);
      } catch {
        console.log('⚠ Cleanup: document not found or already deleted');
      }
    });
  });
});
