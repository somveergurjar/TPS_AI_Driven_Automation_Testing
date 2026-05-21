import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../../config/env.config';

/**
 * BasePage — every Page Object extends this.
 * Contains reusable low-level browser interactions so individual
 * page objects stay focused on business logic, not Playwright mechanics.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // ─── Navigation ────────────────────────────────────────────────────────────

  async goto(path = '') {
    await this.page.goto(`${ENV.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: ENV.timeouts.navigation,
    });
    await this.waitForNetworkIdle();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle', {
      timeout: ENV.timeouts.navigation,
    }).catch(() => {});
  }

  async waitForDOMReady() {
    await this.page.waitForLoadState('domcontentloaded', {
      timeout: ENV.timeouts.navigation,
    });
  }

  // ─── Element interactions ───────────────────────────────────────────────────

  async click(selector: string | Locator) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await el.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await el.click({ timeout: ENV.timeouts.action });
  }

  async fill(selector: string | Locator, value: string) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await el.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await el.fill(value);
  }

  async selectOption(selector: string | Locator, value: string) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await el.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await el.selectOption(value);
  }

  async getText(selector: string | Locator): Promise<string> {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    return (await el.textContent()) ?? '';
  }

  async isVisible(selector: string | Locator): Promise<boolean> {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    return el.isVisible().catch(() => false);
  }

  async isEnabled(selector: string | Locator): Promise<boolean> {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    return el.isEnabled().catch(() => false);
  }

  async waitForVisible(selector: string, timeout = ENV.timeouts.element) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForHidden(selector: string, timeout = ENV.timeouts.element) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertVisible(selector: string | Locator, message?: string) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(el, message).toBeVisible({ timeout: ENV.timeouts.element });
  }

  async assertHidden(selector: string | Locator, message?: string) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(el, message).toBeHidden({ timeout: ENV.timeouts.element });
  }

  async assertText(selector: string | Locator, text: string) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(el).toContainText(text, { timeout: ENV.timeouts.element });
  }

  async assertEnabled(selector: string | Locator) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(el).toBeEnabled({ timeout: ENV.timeouts.element });
  }

  async assertDisabled(selector: string | Locator) {
    const el = typeof selector === 'string' ? this.page.locator(selector).first() : selector;
    await expect(el).toBeDisabled({ timeout: ENV.timeouts.element });
  }

  // ─── Screenshot ─────────────────────────────────────────────────────────────

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  // ─── Scroll ─────────────────────────────────────────────────────────────────

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.waitForTimeout(500);
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.waitForTimeout(300);
  }
}
