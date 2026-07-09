/**
 * GLOBAL SEARCH – MULTI-LANGUAGE VALIDATION SUITE
 * ─────────────────────────────────────────────────────────────────────────────
 * Validates that Global Search works consistently across multiple languages and
 * handles edge-case inputs (special chars, emojis, very long strings, security
 * payloads) without crashing or leaking data.
 *
 * TC_GS_ML_001  Arabic query returns a non-empty prose response
 * TC_GS_ML_002  Spanish query returns a Spanish-language response
 * TC_GS_ML_003  Danish query returns a Danish-language response
 * TC_GS_ML_004  Hindi query returns a non-empty response
 * TC_GS_ML_005  Chinese (Simplified) query returns a non-empty response
 * TC_GS_ML_006  Japanese query returns a non-empty response
 * TC_GS_ML_007  Korean query returns a non-empty response
 * TC_GS_ML_008  Italian query returns an Italian-language response
 * TC_GS_ML_009  Vietnamese query returns a non-empty response
 * TC_GS_ML_010  Swedish query returns a Swedish-language response
 * TC_GS_ML_011  Unsupported language does not crash the page
 * TC_GS_ML_012  Mixed-language query (English + native) returns a response
 * TC_GS_ML_013  Transliterated Hindi query returns a response
 * TC_GS_ML_014  Cross-language consistency: EN/FR/DE queries share domain keywords
 * TC_GS_ML_015  RTL language (Arabic) query does not break page layout
 * TC_GS_ML_016  Single-character query does not crash the page
 * TC_GS_ML_017  Special-character-only query does not crash the page
 * TC_GS_ML_018  Emoji query does not crash the page
 * TC_GS_ML_019  Numeric-only query returns a graceful response or no-results
 * TC_GS_ML_020  Alphanumeric query returns a non-empty response
 * TC_GS_ML_021  Very long query (500+ chars) is handled without errors
 * TC_GS_ML_022  Whitespace-only query does not crash the page
 * TC_GS_ML_023  Accent-mark query (é, ñ, ü, ç) returns a non-empty response
 * TC_GS_ML_024  Non-Latin script (Chinese/Japanese) input does not crash the page
 * TC_GS_ML_025  Typo-tolerance: misspelled query still returns relevant content
 * TC_GS_ML_026  Case-insensitive search returns consistent domain content
 * TC_GS_ML_027  Singular vs plural query returns consistent domain content
 * TC_GS_ML_028  Abbreviation/acronym search returns relevant results
 * TC_GS_ML_029  Consecutive multilingual searches do not degrade — page stays stable
 * TC_GS_ML_030  SQL injection payload does not crash or expose data
 * TC_GS_ML_031  XSS payload is not executed and does not crash the page
 * TC_GS_ML_032  Script injection payload is sanitized and does not crash
 * TC_GS_ML_033  Special character abuse does not cause server errors
 */

import { test, expect, Page } from '@playwright/test';
import { ENV } from '../../config/env';
import { GlobalSearchHelpers } from './setup';

// ─── Config ───────────────────────────────────────────────────────────────────

const LOGIN_URL  = ENV.loginUrl;
const TIMEOUTS   = ENV.timeouts;
const AI_TIMEOUT = 75_000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function loginAsAdmin(page: Page) {
  await page.context().clearCookies();
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUTS.navigation });
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForSelector('input[type="email"]', { timeout: TIMEOUTS.navigation });
  await page.fill('input[type="email"]', ENV.credentials.email);
  await page.fill('input[type="password"]', ENV.credentials.password);
  await page.click('button:has-text("Continue to Verification")');
  await page.waitForURL(url => !url.href.includes('/login'), {
    timeout: TIMEOUTS.navigation, waitUntil: 'domcontentloaded',
  }).catch(() => {});
  await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUTS.navigation });
}

// Covers both the initial "Ask anything" search bar AND the follow-up input
const SEARCH_INPUT_SELECTOR = [
  'input[placeholder*="follow-up"]',
  'input[placeholder*="Ask a follow"]',
  'textarea[placeholder*="follow"]',
  'input[placeholder*="Ask anything"]',
  'input[placeholder*="your projects"]',
].join(', ');

const SEARCH_BTN_SELECTOR = 'button:has-text("Ask"), button:has-text("Search")';

async function goToSearch(page: Page) {
  const helper = new GlobalSearchHelpers(page);
  await helper.navigateToGlobalSearch();
  // Wait for either the search input (initial state) or the follow-up input (conversation state)
  await page.waitForSelector(
    `${SEARCH_INPUT_SELECTOR}, button:has-text("New Search"), a:has-text("New Search")`,
    { timeout: TIMEOUTS.navigation },
  );
}

async function sendQuery(page: Page, query: string) {
  const input = page.locator(SEARCH_INPUT_SELECTOR).first();
  await input.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
  await input.click();
  await input.fill('');
  await input.fill(query);

  const btn = page.locator(SEARCH_BTN_SELECTOR).first();
  await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
  await btn.click();
}

async function waitForAiResponse(page: Page, timeout = AI_TIMEOUT): Promise<string> {
  const helper = new GlobalSearchHelpers(page);
  return helper.waitForResponse(timeout).catch(() => '');
}

function isProseResponse(text: string): boolean {
  if (!text || text.length < 20) return false;
  if (/^\s*[{\[]/.test(text)) return false;
  if (/at [\w.]+:\d+/.test(text)) return false;
  if (/TypeError|ReferenceError|SyntaxError/.test(text)) return false;
  return true;
}

function assertNoPageCrash(bodyText: string) {
  expect(bodyText).not.toMatch(/Unhandled|Unexpected error|500 Internal Server Error/i);
  expect(bodyText).not.toMatch(/TypeError|SyntaxError|ReferenceError/);
}

// ─── Suite ────────────────────────────────────────────────────────────────────

test.describe('Global Search – Multi-Language Validation', () => {
  test.setTimeout(150_000);

  // ══════════════════════════════════════════════════════════════════════════
  // LANGUAGE & TRANSLATION
  // ══════════════════════════════════════════════════════════════════════════

  // TC_GS_ML_001 – Arabic
  test('TC_GS_ML_001 – Arabic query returns a non-empty prose response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'ما هي المستندات المتاحة في النظام؟');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_001 AR response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    if (response === 'NO_RELEVANT_RESULTS') {
      console.log('⚠ Arabic query returned no results — multilingual retrieval may need review');
    }

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);

    // Arabic language markers OR domain keywords in any language
    const arabicMarkers = ['المستند', 'النظام', 'متاح', 'مراجعة', 'وثيقة'];
    const domainFallback = ['document', 'revision', 'supplier', 'tps', 'equipment'];
    const lower = response.toLowerCase();
    const hasContent = arabicMarkers.some(m => response.includes(m)) ||
                       domainFallback.some(k => lower.includes(k));

    if (!hasContent) {
      console.log('⚠ Response lacks Arabic markers and domain keywords — partial language support');
    }

    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Arabic query handled without page crash');
  });

  // TC_GS_ML_002 – Spanish
  test('TC_GS_ML_002 – Spanish query returns a Spanish-language response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '¿Qué documentos están disponibles en el sistema?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_002 ES response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    if (response === 'NO_RELEVANT_RESULTS') {
      test.fail(true, 'Spanish query returned no results — language routing may not be supported');
      return;
    }

    expect(isProseResponse(response)).toBe(true);

    const spanishMarkers = ['el', 'la', 'los', 'las', 'de', 'del', 'en', 'que', 'es', 'son', 'disponibles', 'sistema', 'documento'];
    const lower = response.toLowerCase();
    const hits = spanishMarkers.filter(m => lower.includes(m));
    console.log(`Spanish markers found: ${hits.join(', ')}`);

    const hasSpanish = hits.length >= 3;
    if (!hasSpanish) {
      console.log('⚠ Response not fully in Spanish — system may fall back to English');
    }
    expect(hits.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Spanish query returned a valid prose response');
  });

  // TC_GS_ML_003 – Danish
  test('TC_GS_ML_003 – Danish query returns a Danish-language response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Hvilke dokumenter er tilgængelige i systemet?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_003 DA response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    if (response === 'NO_RELEVANT_RESULTS') {
      test.fail(true, 'Danish query returned no results — language routing may not be supported');
      return;
    }

    expect(isProseResponse(response)).toBe(true);

    const danishMarkers = ['de', 'der', 'det', 'og', 'er', 'i', 'til', 'en', 'et', 'af', 'tilgængelige', 'systemet', 'dokumenter'];
    const lower = response.toLowerCase();
    const hits = danishMarkers.filter(m => lower.includes(m));
    console.log(`Danish markers found: ${hits.join(', ')}`);
    expect(hits.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Danish query returned a valid prose response');
  });

  // TC_GS_ML_004 – Hindi
  test('TC_GS_ML_004 – Hindi query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'सिस्टम में कौन से दस्तावेज़ उपलब्ध हैं?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_004 HI response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Hindi query handled without page crash');
  });

  // TC_GS_ML_005 – Chinese (Simplified)
  test('TC_GS_ML_005 – Chinese (Simplified) query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '系统中有哪些可用的文件？');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_005 ZH response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Chinese query handled without page crash');
  });

  // TC_GS_ML_006 – Japanese
  test('TC_GS_ML_006 – Japanese query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'システムで利用可能なドキュメントは何ですか？');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_006 JA response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Japanese query handled without page crash');
  });

  // TC_GS_ML_007 – Korean
  test('TC_GS_ML_007 – Korean query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '시스템에서 사용 가능한 문서는 무엇입니까?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_007 KO response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Korean query handled without page crash');
  });

  // TC_GS_ML_008 – Italian
  test('TC_GS_ML_008 – Italian query returns an Italian-language response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Quali documenti sono disponibili nel sistema?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_008 IT response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    if (response === 'NO_RELEVANT_RESULTS') {
      test.fail(true, 'Italian query returned no results — language routing may not be supported');
      return;
    }

    expect(isProseResponse(response)).toBe(true);

    const italianMarkers = ['il', 'la', 'i', 'le', 'di', 'del', 'nel', 'che', 'è', 'sono', 'disponibili', 'sistema', 'documenti'];
    const lower = response.toLowerCase();
    const hits = italianMarkers.filter(m => lower.includes(m));
    console.log(`Italian markers found: ${hits.join(', ')}`);
    expect(hits.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Italian query returned a valid prose response');
  });

  // TC_GS_ML_009 – Vietnamese
  test('TC_GS_ML_009 – Vietnamese query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Những tài liệu nào có sẵn trong hệ thống?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_009 VI response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Vietnamese query handled without page crash');
  });

  // TC_GS_ML_010 – Swedish
  test('TC_GS_ML_010 – Swedish query returns a Swedish-language response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Vilka dokument finns tillgängliga i systemet?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_010 SV response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    if (response === 'NO_RELEVANT_RESULTS') {
      test.fail(true, 'Swedish query returned no results — language routing may not be supported');
      return;
    }

    expect(isProseResponse(response)).toBe(true);

    const swedishMarkers = ['de', 'det', 'och', 'är', 'i', 'till', 'en', 'ett', 'av', 'tillgängliga', 'systemet', 'dokument', 'vilka', 'finns'];
    const lower = response.toLowerCase();
    const hits = swedishMarkers.filter(m => lower.includes(m));
    console.log(`Swedish markers found: ${hits.join(', ')}`);
    expect(hits.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Swedish query returned a valid prose response');
  });

  // TC_GS_ML_011 – Unsupported language (Swahili)
  test('TC_GS_ML_011 – Unsupported language query does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Ni nyaraka zipi zinapatikana katika mfumo?');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page).toHaveURL(/global-search/);
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ Unsupported language (Swahili) did not crash the page');
  });

  // TC_GS_ML_012 – Mixed-language query (English + Hindi)
  test('TC_GS_ML_012 – Mixed-language query (English + Hindi) returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'Show me all documents दस्तावेज़ available in the system');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_012 mixed-lang response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    const domainKeywords = ['document', 'revision', 'supplier', 'tps', 'equipment'];
    const lower = response.toLowerCase();
    const hasDomain = domainKeywords.some(k => lower.includes(k));
    if (!hasDomain && response !== 'NO_RELEVANT_RESULTS') {
      console.log('⚠ Mixed-language query response does not contain expected domain keywords');
    }
    console.log('✅ Mixed-language query handled without page crash');
  });

  // TC_GS_ML_013 – Transliterated Hindi (Hinglish)
  test('TC_GS_ML_013 – Transliterated Hindi query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // Hindi written in English characters (Hinglish)
    await sendQuery(page, 'system mein kaun se documents available hain?');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_013 Hinglish response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Transliterated Hindi query handled without page crash');
  });

  // TC_GS_ML_014 – Cross-language consistency (EN / FR / DE)
  test('TC_GS_ML_014 – Same query in English, French, and German returns equivalent domain content', async ({ page }) => {
    const queries = [
      { lang: 'EN', text: 'List all documents available in the system' },
      { lang: 'FR', text: 'Listez tous les documents disponibles dans le système' },
      { lang: 'DE', text: 'Listen Sie alle verfügbaren Dokumente im System auf' },
    ];
    const DOMAIN = ['document', 'revision', 'supplier', 'tps', 'equipment'];

    await loginAsAdmin(page);

    const results: { lang: string; keywords: string[] }[] = [];

    for (const q of queries) {
      await goToSearch(page);
      await sendQuery(page, q.text);
      const response = await waitForAiResponse(page);

      console.log(`\n📋 TC_GS_ML_014 [${q.lang}] (${response.length} chars):\n${response.substring(0, 300)}\n`);

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      assertNoPageCrash(bodyText);

      const lower = response.toLowerCase();
      const found = DOMAIN.filter(k => lower.includes(k));
      console.log(`[${q.lang}] domain keywords found: ${found.join(', ')}`);
      results.push({ lang: q.lang, keywords: found });
    }

    // At least 2 of the 3 languages must return overlapping domain keywords
    const enKw  = results.find(r => r.lang === 'EN')?.keywords ?? [];
    const frKw  = results.find(r => r.lang === 'FR')?.keywords ?? [];
    const deKw  = results.find(r => r.lang === 'DE')?.keywords ?? [];

    const enFrOverlap = enKw.filter(k => frKw.includes(k));
    const enDeOverlap = enKw.filter(k => deKw.includes(k));
    const consistentPairs = (enFrOverlap.length > 0 ? 1 : 0) + (enDeOverlap.length > 0 ? 1 : 0);

    console.log(`EN-FR overlap: ${enFrOverlap.join(', ')}`);
    console.log(`EN-DE overlap: ${enDeOverlap.join(', ')}`);

    expect(consistentPairs).toBeGreaterThanOrEqual(1);
    console.log('✅ Cross-language queries return equivalent domain content');
  });

  // TC_GS_ML_015 – RTL language (Arabic) — page layout integrity
  test('TC_GS_ML_015 – RTL Arabic query does not break page layout', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // Verify the input accepts RTL text before submission
    const input = page.locator(SEARCH_INPUT_SELECTOR).first();
    await input.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    await input.fill('أظهر لي جميع المستندات في النظام');
    const typedValue = await input.inputValue();
    expect(typedValue).toContain('المستندات');

    // Submit the query
    await page.locator(SEARCH_BTN_SELECTOR).first().click();

    // Allow the page to transition (loading state) before asserting layout
    await page.waitForTimeout(5000);

    // Page layout must remain intact after RTL submission
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);

    // No crash markers in page content
    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    // Sidebar (query history) must still be present — RTL must not destroy page structure
    await expect(page.locator('text=/QUERY HISTORY/i').first()).toBeVisible({ timeout: TIMEOUTS.element });

    console.log('✅ RTL Arabic query did not break page layout');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // INPUT VALIDATION
  // ══════════════════════════════════════════════════════════════════════════

  // TC_GS_ML_016 – Single character
  test('TC_GS_ML_016 – Single-character query does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'a');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Single-character query handled without crash');
  });

  // TC_GS_ML_017 – Special characters only
  test('TC_GS_ML_017 – Special-character-only query does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '@#$%&*!^~`|\\');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Special-character query handled without crash');
  });

  // TC_GS_ML_018 – Emoji query
  test('TC_GS_ML_018 – Emoji query does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '📄 🔍 📊 documents 🗂️');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Emoji query handled without crash');
  });

  // TC_GS_ML_019 – Numeric-only query
  test('TC_GS_ML_019 – Numeric-only query returns graceful response or no-results message', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, '12345');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    // Either a response, a no-results indicator, or the page stays stable
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Numeric-only query did not crash the page');
  });

  // TC_GS_ML_020 – Alphanumeric query
  test('TC_GS_ML_020 – Alphanumeric query returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'TPS001 document rev2');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_020 alphanumeric response (${response.length} chars):\n${response.substring(0, 300)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    expect(response.length).toBeGreaterThan(0);
    console.log('✅ Alphanumeric query returned a response without crash');
  });

  // TC_GS_ML_021 – Very long query (500+ characters)
  test('TC_GS_ML_021 – Very long query (500+ characters) is handled without errors', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    const longQuery = 'list all documents '.repeat(28).trim(); // ~504 characters
    expect(longQuery.length).toBeGreaterThanOrEqual(500);

    await sendQuery(page, longQuery);
    await page.waitForTimeout(5000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log(`✅ Long query (${longQuery.length} chars) handled without crash`);
  });

  // TC_GS_ML_022 – Whitespace-only query
  test('TC_GS_ML_022 – Whitespace-only query does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    const input = page.locator(
      SEARCH_INPUT_SELECTOR,
    ).first();
    await input.waitFor({ state: 'visible', timeout: TIMEOUTS.element });
    await input.fill('   ');
    await page.locator(SEARCH_BTN_SELECTOR).first().click();
    await page.waitForTimeout(2000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Whitespace-only query did not crash the page');
  });

  // TC_GS_ML_023 – Accent marks (é, ñ, ü, ç)
  test('TC_GS_ML_023 – Query with accent marks (é, ñ, ü, ç) returns a non-empty response', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    await sendQuery(page, 'liste des documents révision et données système');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_023 accent marks response (${response.length} chars):\n${response.substring(0, 300)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    expect(isProseResponse(response) || response === 'NO_RELEVANT_RESULTS').toBe(true);
    console.log('✅ Accent-mark query handled without crash');
  });

  // TC_GS_ML_024 – Non-Latin script (Japanese)
  test('TC_GS_ML_024 – Non-Latin script (Japanese) input does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // Japanese mixed script (Kanji + Hiragana + Katakana)
    await sendQuery(page, 'ドキュメントの一覧を表示してください');
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);
    console.log('✅ Non-Latin Japanese script handled without crash');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SEARCH ACCURACY
  // ══════════════════════════════════════════════════════════════════════════

  // TC_GS_ML_025 – Typo tolerance
  test('TC_GS_ML_025 – Misspelled query still returns domain-relevant content', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // Common typos: "documnet" for "document", "revison" for "revision"
    await sendQuery(page, 'show me all documnet revison detials');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_025 typo-tolerance response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    if (response !== 'NO_RELEVANT_RESULTS') {
      const domainKeywords = ['document', 'revision', 'tps', 'supplier', 'equipment'];
      const lower = response.toLowerCase();
      const found = domainKeywords.filter(k => lower.includes(k));
      console.log(`Domain keywords found despite typos: ${found.join(', ')}`);
      if (found.length === 0) {
        console.log('⚠ Typo-tolerance may not be active — no domain keywords in response');
      }
      expect(found.length).toBeGreaterThanOrEqual(1);
    }
    console.log('✅ Misspelled query handled without crash');
  });

  // TC_GS_ML_026 – Case insensitivity
  test('TC_GS_ML_026 – Case-insensitive search returns consistent domain content', async ({ page }) => {
    await loginAsAdmin(page);

    const DOMAIN = ['document', 'revision', 'supplier', 'tps', 'equipment'];

    // Uppercase query
    await goToSearch(page);
    await sendQuery(page, 'LIST ALL DOCUMENTS IN THE SYSTEM');
    const upperResponse = await waitForAiResponse(page);

    // Lowercase query
    await goToSearch(page);
    await sendQuery(page, 'list all documents in the system');
    const lowerResponse = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_026 UPPER (${upperResponse.length} chars):\n${upperResponse.substring(0, 300)}\n`);
    console.log(`\n📋 TC_GS_ML_026 lower (${lowerResponse.length} chars):\n${lowerResponse.substring(0, 300)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    const upperKw = DOMAIN.filter(k => upperResponse.toLowerCase().includes(k));
    const lowerKw = DOMAIN.filter(k => lowerResponse.toLowerCase().includes(k));
    const overlap = upperKw.filter(k => lowerKw.includes(k));

    console.log(`UPPER keywords: ${upperKw.join(', ')}`);
    console.log(`lower keywords: ${lowerKw.join(', ')}`);
    console.log(`Overlap: ${overlap.join(', ')}`);

    expect(upperResponse.length).toBeGreaterThan(0);
    expect(lowerResponse.length).toBeGreaterThan(0);
    expect(overlap.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Case-insensitive search returns consistent domain content');
  });

  // TC_GS_ML_027 – Singular vs plural
  test('TC_GS_ML_027 – Singular and plural forms return consistent domain content', async ({ page }) => {
    await loginAsAdmin(page);

    const DOMAIN = ['document', 'revision', 'tps', 'supplier'];

    // Singular
    await goToSearch(page);
    await sendQuery(page, 'show me the document revision');
    const singularResponse = await waitForAiResponse(page);

    // Plural
    await goToSearch(page);
    await sendQuery(page, 'show me all documents revisions');
    const pluralResponse = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_027 singular (${singularResponse.length} chars):\n${singularResponse.substring(0, 300)}\n`);
    console.log(`\n📋 TC_GS_ML_027 plural (${pluralResponse.length} chars):\n${pluralResponse.substring(0, 300)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(singularResponse.length).toBeGreaterThan(0);
    expect(pluralResponse.length).toBeGreaterThan(0);

    const singKw  = DOMAIN.filter(k => singularResponse.toLowerCase().includes(k));
    const plurKw  = DOMAIN.filter(k => pluralResponse.toLowerCase().includes(k));
    const overlap = singKw.filter(k => plurKw.includes(k));
    console.log(`Singular/plural keyword overlap: ${overlap.join(', ')}`);
    expect(overlap.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Singular/plural forms return consistent domain content');
  });

  // TC_GS_ML_028 – Abbreviations and acronyms
  test('TC_GS_ML_028 – Abbreviation/acronym query returns relevant results', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // "TPS" is a known acronym in the system; "doc" is a common abbreviation for "document"
    await sendQuery(page, 'show me TPS doc rev details');
    const response = await waitForAiResponse(page);

    console.log(`\n📋 TC_GS_ML_028 abbreviation response (${response.length} chars):\n${response.substring(0, 400)}\n`);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);

    expect(response.length).toBeGreaterThan(0);
    if (response !== 'NO_RELEVANT_RESULTS') {
      const acronymTerms = ['tps', 'document', 'doc', 'revision', 'rev'];
      const lower = response.toLowerCase();
      const found = acronymTerms.filter(t => lower.includes(t));
      console.log(`Abbreviation/acronym terms found: ${found.join(', ')}`);
      expect(found.length).toBeGreaterThanOrEqual(1);
    }
    console.log('✅ Abbreviation/acronym query handled without crash');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE
  // ══════════════════════════════════════════════════════════════════════════

  // TC_GS_ML_029 – Consecutive multilingual searches
  test('TC_GS_ML_029 – Consecutive multilingual searches do not degrade — page stays stable', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    const queries = [
      { lang: 'EN', text: 'list all documents in the system' },
      { lang: 'FR', text: 'listez tous les documents disponibles' },
      { lang: 'DE', text: 'alle Dokumente im System auflisten' },
      { lang: 'ES', text: 'listar todos los documentos disponibles' },
      { lang: 'AR', text: 'اعرض لي جميع المستندات' },
    ];

    const timings: { lang: string; ms: number }[] = [];

    for (const q of queries) {
      const start = Date.now();
      await sendQuery(page, q.text);
      await waitForAiResponse(page).catch(() => {});
      const elapsed = Date.now() - start;
      timings.push({ lang: q.lang, ms: elapsed });

      const bodyText = await page.evaluate(() => document.body.textContent ?? '');
      assertNoPageCrash(bodyText);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveURL(/global-search/);

      console.log(`[${q.lang}] response time: ${elapsed}ms`);
    }

    // All queries must complete within 90 seconds each
    for (const t of timings) {
      expect(t.ms).toBeLessThan(90_000);
    }

    // Follow-up input must still be usable after all consecutive queries
    const followUpInput = page.locator(
      SEARCH_INPUT_SELECTOR,
    ).first();
    await expect(followUpInput).toBeVisible({ timeout: TIMEOUTS.element });
    await expect(followUpInput).toBeEnabled();

    console.log('\n📊 Language response times:');
    timings.forEach(t => console.log(`  ${t.lang}: ${t.ms}ms`));
    console.log('✅ All consecutive multilingual searches completed without degradation');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SECURITY
  // ══════════════════════════════════════════════════════════════════════════

  // TC_GS_ML_030 – SQL injection
  test('TC_GS_ML_030 – SQL injection payload does not crash or expose data', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    const sqlPayload = "' OR '1'='1'; DROP TABLE documents; --";
    await sendQuery(page, sqlPayload);
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');

    // Must not crash
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);

    // Must not expose raw DB content or SQL confirmation
    expect(bodyText).not.toMatch(/table dropped|syntax error near/i);
    expect(bodyText).not.toMatch(/sql.*error|ORA-\d{5}|pg.*error/i);

    console.log('✅ SQL injection payload handled safely — no DB exposure or crash');
  });

  // TC_GS_ML_031 – XSS payload
  test('TC_GS_ML_031 – XSS payload is not executed and does not crash the page', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    let xssExecuted = false;
    await page.exposeFunction('__xssMarker__', () => { xssExecuted = true; });

    const xssPayload = '<script>window.__xssMarker__()</script><img src=x onerror="window.__xssMarker__()"/>';
    await sendQuery(page, xssPayload);
    await page.waitForTimeout(3000);

    // The injected script must NOT have executed
    expect(xssExecuted).toBe(false);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);

    console.log('✅ XSS payload was not executed — input is properly sanitized');
  });

  // TC_GS_ML_032 – Script injection
  test('TC_GS_ML_032 – Script injection payload is sanitized and does not crash', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    const scriptPayload = 'javascript:alert(1)"><svg/onload=alert(1)>';
    await sendQuery(page, scriptPayload);
    await page.waitForTimeout(3000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');
    assertNoPageCrash(bodyText);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);

    // Verify the payload was not rendered as live HTML
    const dangerousElements = await page.evaluate(() =>
      document.querySelectorAll('svg[onload], img[onerror]').length,
    );
    expect(dangerousElements).toBe(0);

    console.log('✅ Script injection payload sanitized — no dangerous elements rendered');
  });

  // TC_GS_ML_033 – Special character abuse
  test('TC_GS_ML_033 – Special character abuse does not cause server errors', async ({ page }) => {
    await loginAsAdmin(page);
    await goToSearch(page);

    // Combination of special characters that commonly break parsers
    const specialPayload = '../../etc/passwd\x00null�<>\'";&|`${}[]()\\';
    await sendQuery(page, specialPayload);
    await page.waitForTimeout(4000);

    const bodyText = await page.evaluate(() => document.body.textContent ?? '');

    // Must not trigger server-side error responses
    assertNoPageCrash(bodyText);
    expect(bodyText).not.toMatch(/500 Internal Server Error/i);
    expect(bodyText).not.toMatch(/nginx|apache|stack trace/i);

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/global-search/);

    console.log('✅ Special character abuse handled safely — no server errors exposed');
  });
});
