import { test, expect } from '@playwright/test';
import { SELECTORS, TEST_CONFIG, TEST_DATA, EquipmentFormHelpers } from './setup';

test.describe('Debug - Check Page Elements', () => {
  let helpers: EquipmentFormHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new EquipmentFormHelpers(page);
    await helpers.login();
  });

  test('Debug: Check what elements exist on equipment page', async ({ page }) => {
    // Go to equipment URL
    await page.goto(TEST_CONFIG.equipmentUrl);
    await page.waitForLoadState('networkidle');

    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: 'debug-equipment-page.png', fullPage: true });

    // Check for New Equipment button
    const newEquipmentButton = page.locator(SELECTORS.newEquipmentButton);
    console.log('New Equipment button visible:', await newEquipmentButton.isVisible());

    // Click new equipment if it exists
    if (await newEquipmentButton.isVisible()) {
      await newEquipmentButton.click();
      await page.waitForLoadState('networkidle');

      // Take screenshot of the form
      await page.screenshot({ path: 'debug-equipment-form.png', fullPage: true });

      // Check what input fields exist
      const inputs = await page.locator('input').count();
      console.log('Number of input fields:', inputs);

      // Check for aria-label="Auto-generated"
      const ariaLabelField = page.locator('[aria-label="Auto-generated"]');
      console.log('Aria label field exists:', await ariaLabelField.isVisible());

      // List all input fields with their attributes
      const inputFields = await page.locator('input').all();
      for (let i = 0; i < Math.min(inputFields.length, 10); i++) {
        const field = inputFields[i];
        const placeholder = await field.getAttribute('placeholder');
        const ariaLabel = await field.getAttribute('aria-label');
        const type = await field.getAttribute('type');
        console.log(`Input ${i}: type=${type}, placeholder=${placeholder}, aria-label=${ariaLabel}`);
      }

      // Check select elements
      const selects = await page.locator('select').count();
      console.log('Number of select fields:', selects);
    } else {
      console.log('New Equipment button not found');
    }
  });
});