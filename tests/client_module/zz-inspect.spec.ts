import { test } from '@playwright/test';
import { ClientModuleHelpers } from './setup';

test('inspect edit form DOM', async ({ page }) => {
  page.on('console', (msg) => console.log('[console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  const helpers = new ClientModuleHelpers(page);
  await helpers.login();
  await helpers.navigateToClientModule();
  const clientName = await helpers.createClient('INSPECT');

  await helpers.applyFilter('th:has-text("CLIENT NAME") input, th:has-text("CLIENT NAME") [role="combobox"]', clientName);
  const row = page.locator(`table tbody tr:has-text("${clientName}")`).first();
  await row.waitFor({ state: 'visible', timeout: 10000 });
  await helpers.openEditForm(row);

  console.log('URL after opening edit form:', page.url());

  const clientsNav = page.locator('a:has-text("Clients"), button:has-text("Clients")').first();
  console.log('Clicking Clients nav button...');
  await clientsNav.click({ timeout: 10000 });
  await page.waitForTimeout(2000);
  console.log('URL after clicking Clients nav:', page.url());

  const newClientVisible = await page.locator('button:has-text("New Client")').isVisible().catch(() => false);
  console.log('New Client button visible after nav click:', newClientVisible);

  if (!newClientVisible) {
    console.log('Trying browser back button...');
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch((e) => console.log('goBack error:', e.message));
    await page.waitForTimeout(2000);
    console.log('URL after goBack:', page.url());
    const visible2 = await page.locator('button:has-text("New Client")').isVisible().catch(() => false);
    console.log('New Client button visible after goBack:', visible2);
  }

  await helpers.deleteClientByName(clientName).catch((e) => console.log('cleanup delete failed:', e.message));
});
