const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto('https://dev.liveaccess.ai/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"]', 'somveergurjar.megaminds@gmail.com');
    await page.fill('input[type="password"]', 'Qwert@123');
    await page.click('button:has-text("Continue to Verification")');
    await page.waitForLoadState('networkidle');
    await page.goto('https://dev.liveaccess.ai/tags', { waitUntil: 'networkidle' });
    await page.waitForSelector('button:has-text("New Tag")', { timeout: 60000 });
    await page.click('button:has-text("New Tag")');
    await page.waitForSelector('input[placeholder="e.g. FIC"]', { timeout: 30000 });
    await page.click('button:has-text("Save Tag")');
    await page.waitForTimeout(5000);
    const validationNodes = await page.$$eval('*', els =>
      Array.from(els)
        .filter(el => el.textContent && /\b(Tag Prefix|Tag prefix|required|is required|invalid)\b/i.test(el.textContent))
        .map(el => ({tag: el.tagName, class: el.className, ariaLabel: el.getAttribute('aria-label'), role: el.getAttribute('role'), text: el.textContent.trim().slice(0,300)}))
    );
    console.log('Validation-related nodes count:', validationNodes.length);
    console.dir(validationNodes, { depth: null });
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
