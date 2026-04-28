const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://dev.liveaccess.ai/login');
  await page.fill('input[type=email]', 'somveergurjar.megaminds@gmail.com');
  await page.fill('input[type=password]', 'Qwert@123');
  await page.click('button:has-text("Continue to Verification")');
  await page.waitForURL('**/dashboard**', { timeout: 60000 });
  await page.goto('https://dev.liveaccess.ai/equipment');
  await page.click('button:has-text("New Equipment")');
  await page.waitForLoadState('networkidle');
  const inputs = await page.$$eval('input', els => els.map((el, i) => ({ index: i, placeholder: el.placeholder, ariaLabel: el.getAttribute('aria-label'), type: el.type, value: el.value, outer: el.outerHTML.slice(0, 180) })));
  console.log('INPUTS', JSON.stringify(inputs, null, 2));
  const selects = await page.$$eval('select', els => els.map((el, i) => ({ index: i, value: el.value, outer: el.outerHTML.slice(0, 180) })));
  console.log('SELECTS', JSON.stringify(selects, null, 2));
  await browser.close();
})();
