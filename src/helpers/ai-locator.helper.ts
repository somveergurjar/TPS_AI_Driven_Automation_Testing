import { Page, Locator } from '@playwright/test';

/**
 * AiLocatorHelper — self-healing locator strategy.
 *
 * Tries a prioritized list of selectors in order and returns the first one
 * that resolves to a visible element. This makes tests resilient to minor
 * DOM changes (class renames, attribute changes, markup restructuring).
 *
 * Usage:
 *   const btn = await AiLocatorHelper.find(page, [
 *     'button[data-testid="save"]',          // most specific — preferred
 *     'button:has-text("Save Document")',     // text-based fallback
 *     'button[type="submit"]',               // last resort
 *   ]);
 */
export class AiLocatorHelper {
  /**
   * Returns the first locator that is visible on the page.
   * Throws if none of the candidates resolve.
   */
  static async find(page: Page, candidates: string[], timeout = 5000): Promise<Locator> {
    for (const selector of candidates) {
      const loc = page.locator(selector).first();
      const visible = await loc.isVisible().catch(() => false);
      if (visible) return loc;
    }

    // Second pass with short waits (element may be loading)
    for (const selector of candidates) {
      try {
        const loc = page.locator(selector).first();
        await loc.waitFor({ state: 'visible', timeout });
        return loc;
      } catch {
        // try next candidate
      }
    }

    throw new Error(
      `AiLocatorHelper: none of the candidate selectors resolved to a visible element.\n` +
      `Tried:\n${candidates.map((s) => `  - ${s}`).join('\n')}`
    );
  }

  /**
   * Finds an element and clicks it using the self-healing strategy.
   */
  static async click(page: Page, candidates: string[]) {
    const el = await this.find(page, candidates);
    await el.click();
  }

  /**
   * Finds an element and fills it using the self-healing strategy.
   */
  static async fill(page: Page, candidates: string[], value: string) {
    const el = await this.find(page, candidates);
    await el.fill(value);
  }

  /**
   * Returns true if any candidate selector is visible — useful for
   * conditional logic without throwing.
   */
  static async isAnyVisible(page: Page, candidates: string[]): Promise<boolean> {
    for (const selector of candidates) {
      const visible = await page.locator(selector).first().isVisible().catch(() => false);
      if (visible) return true;
    }
    return false;
  }
}
