const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Login
  await page.goto('https://dev.liveaccess.ai/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'somveergurjar.megaminds@gmail.com');
  await page.fill('input[type="password"]', 'Qwert@123');
  await page.click('button:has-text("Continue to Verification")');
  await page.waitForTimeout(4000);

  console.log('URL after login:', page.url());

  // Navigate to document module
  await page.goto('https://dev.liveaccess.ai/document', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  console.log('URL on document page:', page.url());

  // Click New Document
  await page.click('button:has-text("New Document")');
  await page.waitForTimeout(3000);

  console.log('URL after New Document click:', page.url());

  // Find all inputs and their attributes
  const inputs = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    return Array.from(inputs).map(inp => ({
      type: inp.type,
      name: inp.name,
      id: inp.id,
      placeholder: inp.placeholder,
      disabled: inp.disabled,
      value: inp.value,
      className: inp.className.substring(0, 150)
    }));
  });

  console.log('\n=== ALL INPUTS ===');
  console.log(JSON.stringify(inputs, null, 2));

  // Find all selects
  const selects = await page.evaluate(() => {
    const selects = document.querySelectorAll('select');
    return Array.from(selects).map(sel => ({
      name: sel.name,
      id: sel.id,
      className: sel.className.substring(0, 100),
      options: Array.from(sel.options).slice(0, 5).map(o => o.text)
    }));
  });

  console.log('\n=== ALL SELECTS ===');
  console.log(JSON.stringify(selects, null, 2));

  // Find buttons
  const buttons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    return Array.from(buttons).map(btn => ({
      text: btn.textContent?.trim(),
      type: btn.type,
      className: btn.className.substring(0, 100)
    })).filter(b => b.text && b.text.length < 50);
  });

  console.log('\n=== ALL BUTTONS ===');
  console.log(JSON.stringify(buttons, null, 2));

  // Get comboboxes
  const comboboxes = await page.evaluate(() => {
    const cbs = document.querySelectorAll('[role="combobox"]');
    return Array.from(cbs).map(cb => ({
      tagName: cb.tagName,
      ariaLabel: cb.getAttribute('aria-label'),
      placeholder: cb.getAttribute('placeholder'),
      className: cb.className.substring(0, 150),
      text: cb.textContent?.trim()?.substring(0, 50)
    }));
  });

  console.log('\n=== ALL COMBOBOXES ===');
  console.log(JSON.stringify(comboboxes, null, 2));

  // Get labels and associated fields
  const labels = await page.evaluate(() => {
    const labels = document.querySelectorAll('label');
    return Array.from(labels).map(lbl => ({
      text: lbl.textContent?.trim(),
      forAttr: lbl.htmlFor,
      className: lbl.className.substring(0, 50)
    }));
  });

  console.log('\n=== ALL LABELS ===');
  console.log(JSON.stringify(labels, null, 2));

  // Get validation error text visible on the page after clicking save
  // First, try clicking a save button
  const saveButtons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    return Array.from(buttons).map(b => b.textContent?.trim()).filter(t => t && t.length < 30);
  });
  console.log('\n=== SAVE BUTTON CANDIDATES ===');
  console.log(saveButtons);

  await browser.close();
})();
