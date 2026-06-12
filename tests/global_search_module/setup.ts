import { expect, Page } from '@playwright/test';
import { ENV } from '../../config/env';

export const TEST_CONFIG = {
  baseUrl:         ENV.baseUrl,
  loginUrl:        ENV.loginUrl,
  globalSearchUrl: ENV.urls.globalSearch,
  credentials:     ENV.credentials,
  timeouts: {
    ...ENV.timeouts,
    aiResponse: 60_000,
  },
};

// ---------------------------------------------------------------------------
// Selectors — matched to the actual Global Search chat UI
// ---------------------------------------------------------------------------
export const SELECTORS = {
  // Auth
  emailInput:    'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton:   'button:has-text("Continue to Verification")',

  // Page header
  pageTitle:        'h1:has-text("Global Search")',
  turnCounter:      'text=/\\d+ turn(s)? in conversation/i',

  // Top-right action
  newSearchButton:  'button:has-text("New Search"), a:has-text("New Search")',

  // Query history (left sidebar)
  queryHistoryLabel: 'text=/QUERY HISTORY/i',
  queryHistoryItems: '[class*="history"] p, [class*="history"] span, [class*="history"] div[class*="cursor"], aside p, aside span[class*="truncate"]',

  // Chat conversation area
  queryBubble:       '[class*="bubble"], [class*="query-chip"], [class*="rounded-full"]:has-text, [class*="rounded-lg"] span',

  // Response card
  responseCard:           '[class*="card"], [class*="response"], [class*="answer"], main li, main p',
  noResultsMessage:       'text=/No relevant results found/i',
  aiDisclaimerMessage:    'text=/AI-generated content may be incorrect/i',
  referencesSection:      'text=/References/i',
  referencesSectionToggle:'button:has-text("References"), div:has-text("References:")',

  // Follow-up input (bottom of page)
  followUpInput:    'input[placeholder*="follow-up"], input[placeholder*="Ask a follow"], textarea[placeholder*="follow"]',
  askButton:        'button:has-text("Ask")',

  // Generic response content
  responseContent:  'main ul li, main ol li, main p, [class*="prose"], [class*="markdown"]',

  // Loading / streaming
  loadingIndicator: '[class*="loading"], [class*="spinner"], [class*="animate-spin"], svg.animate-spin',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export class GlobalSearchHelpers {
  constructor(private page: Page) {}

  async login() {
    await this.page.context().clearCookies();
    await this.page.goto(TEST_CONFIG.loginUrl, {
      waitUntil: 'domcontentloaded',
      timeout:   TEST_CONFIG.timeouts.navigation,
    });
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await this.page.waitForSelector(SELECTORS.emailInput, { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.fill(SELECTORS.emailInput, TEST_CONFIG.credentials.email);
    await this.page.fill(SELECTORS.passwordInput, TEST_CONFIG.credentials.password);
    await this.page.click(SELECTORS.loginButton);
    await this.page.waitForURL(url => !url.href.includes('/login'), {
      timeout:   TEST_CONFIG.timeouts.navigation,
      waitUntil: 'domcontentloaded',
    }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
  }

  async navigateToGlobalSearch() {
    if (!this.page.url().includes('/global-search')) {
      await this.page.goto(TEST_CONFIG.globalSearchUrl, {
        waitUntil: 'domcontentloaded',
        timeout:   TEST_CONFIG.timeouts.navigation,
      });
      await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.timeouts.navigation }).catch(() => {});
    }
  }

  async waitForPageReady() {
    // Either the follow-up input or the New Search button must be present
    await this.page.waitForSelector(
      `${SELECTORS.followUpInput}, ${SELECTORS.newSearchButton}`,
      { timeout: TEST_CONFIG.timeouts.navigation },
    );
  }

  /**
   * Starts a brand-new conversation using the "+ New Search" button.
   * Waits until the URL changes or the conversation resets.
   */
  async startNewSearch() {
    const btn = this.page.locator(SELECTORS.newSearchButton).first();
    await btn.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
    await btn.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: TEST_CONFIG.timeouts.navigation });
    await this.page.waitForTimeout(500);
  }

  /**
   * Sends a message via the follow-up / main input at the bottom of the chat.
   */
  async sendMessage(query: string) {
    const input = this.page.locator(SELECTORS.followUpInput).first();
    await input.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
    await input.click();
    await input.fill('');
    await input.fill(query);

    const askBtn = this.page.locator(SELECTORS.askButton).first();
    await askBtn.waitFor({ state: 'visible', timeout: TEST_CONFIG.timeouts.element });
    await askBtn.click();
  }

  /**
   * Waits for the AI response to finish streaming/loading.
   * Returns the full text content of the latest response card.
   */
  async waitForResponse(timeout = TEST_CONFIG.timeouts.aiResponse): Promise<string> {
    // Wait for any spinner to disappear
    const spinner = this.page.locator(SELECTORS.loadingIndicator).first();
    if ((await spinner.count()) > 0) {
      await spinner.waitFor({ state: 'hidden', timeout }).catch(() => {});
    }

    // Wait until at least one list item or paragraph appears in the response area
    await expect.poll(
      async () => {
        const noResults = await this.page.locator(SELECTORS.noResultsMessage).count();
        if (noResults > 0) return 'no-results';

        const items = this.page.locator(SELECTORS.responseContent);
        const count = await items.count();
        let totalText = '';
        for (let i = 0; i < Math.min(count, 10); i++) {
          totalText += (await items.nth(i).textContent().catch(() => '')) ?? '';
        }
        return totalText.trim().length > 5 ? totalText.trim() : '';
      },
      { timeout, intervals: [1000, 2000, 3000, 5000] },
    ).not.toBe('');

    // Collect full response text
    const noResultsVisible = (await this.page.locator(SELECTORS.noResultsMessage).count()) > 0;
    if (noResultsVisible) return 'NO_RELEVANT_RESULTS';

    const items = this.page.locator(SELECTORS.responseContent);
    const count = await items.count();
    let text = '';
    for (let i = 0; i < count; i++) {
      text += (await items.nth(i).textContent().catch(() => '')) + '\n';
    }
    return text.trim();
  }

  /**
   * Reads the current turn counter, e.g. "3 turns in conversation" → 3
   */
  async getTurnCount(): Promise<number> {
    const el = this.page.locator(SELECTORS.turnCounter).first();
    if ((await el.count()) === 0) return 0;
    const text = await el.textContent().catch(() => '0');
    const match = (text ?? '').match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getQueryHistoryTexts(): Promise<string[]> {
    await this.page.waitForTimeout(400);
    const items = this.page.locator(SELECTORS.queryHistoryItems);
    const count = await items.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await items.nth(i).textContent().catch(() => ''))?.trim() ?? '';
      if (t.length > 0) texts.push(t);
    }
    return [...new Set(texts)]; // deduplicate
  }
}

export class TestQueries {
  static readonly documents  = 'give me details of all documents';
  static readonly equipment  = 'list the available equipment records';
  static readonly revisions  = 'show me revision details for documents';
  static readonly projects   = 'what projects are in the system?';
  static readonly nonexistent = 'xyzzy_nonexistent_item_99887766';
  static readonly dcs        = 'dcs';
  static readonly followUp   = 'can you give more details?';
}
