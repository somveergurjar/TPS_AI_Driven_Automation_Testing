import { test } from '@playwright/test';
import { ClientModuleHelpers } from './client_module/setup';

test('measure DOM update latency after filter typing', async ({ page }) => {
  const helpers = new ClientModuleHelpers(page);
  await helpers.login();
  await helpers.navigateToClientModule();

  const count = await helpers.getRecordCount();
  console.log('total record count:', count);

  const rows = page.locator('table tbody tr');
  const beforeHtml = await rows.first().innerText().catch(() => '(none)');
  console.log('first row before filter:', beforeHtml.slice(0, 80));

  const field = page.locator('th:has-text("CLIENT NAME") input, th:has-text("CLIENT NAME") [role="combobox"]').first();
  const start = Date.now();
  await field.fill('a');

  let changedAt = -1;
  let lastHtml = beforeHtml;
  for (let i = 0; i < 80; i++) {
    const html = await rows.first().innerText().catch(() => '(none)');
    if (html !== beforeHtml) { changedAt = Date.now() - start; lastHtml = html; break; }
    await page.waitForTimeout(25);
  }
  console.log('first row changed after (ms):', changedAt);
  console.log('new first row:', lastHtml.slice(0, 80));
});
