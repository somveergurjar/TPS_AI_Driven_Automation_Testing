import { Locator } from '@playwright/test';

/**
 * Waits until a locator's text content stops changing, instead of sleeping a
 * guessed duration. Used after actions that trigger a client-side re-render
 * (e.g. typing into a table filter) where there is no network request to
 * await — confirmed live: this app filters client-side, with no matching API
 * call firing when a filter value changes.
 */
export async function waitForTableStable(
  table: Locator,
  opts: { pollMs?: number; stableMs?: number; timeoutMs?: number } = {}
): Promise<void> {
  const pollMs = opts.pollMs ?? 50;
  const stableMs = opts.stableMs ?? 150;
  const timeoutMs = opts.timeoutMs ?? 5000;

  const start = Date.now();
  let last = await table.innerText().catch(() => '');
  let lastChange = Date.now();

  while (Date.now() - start < timeoutMs) {
    await table.page().waitForTimeout(pollMs);
    const current = await table.innerText().catch(() => '');
    if (current !== last) {
      last = current;
      lastChange = Date.now();
    } else if (Date.now() - lastChange >= stableMs) {
      return;
    }
  }
}
