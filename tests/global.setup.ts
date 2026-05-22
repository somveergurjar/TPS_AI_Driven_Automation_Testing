import { test as base } from '@playwright/test';
import * as fs   from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'failed test cases screenshot');

// Ensure folder exists at module load time
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

/**
 * Global afterEach hook — runs for every test in every spec file.
 * When a test fails, captures a full-page screenshot and saves it to
 * "failed test cases screenshot/<TC-Name>.png"
 */
base.afterEach(async ({ page }, testInfo) => {
  // Only act on failures or timeouts
  if (testInfo.status === 'passed' || testInfo.status === 'skipped') return;

  // Build a safe filename from the test title  e.g.
  //   "TC_DOC_001 – Verify Document Page Loads Successfully.png"
  const safeName = testInfo.title
    .replace(/[\\/:*?"<>|]/g, '-')   // remove illegal chars
    .replace(/\s+/g, '_')            // spaces → underscores
    .replace(/-{2,}/g, '-')          // collapse double dashes
    .substring(0, 180);              // keep paths short on Windows

  const filePath = path.join(SCREENSHOT_DIR, `${safeName}.png`);

  try {
    await page.screenshot({ path: filePath, fullPage: true });
    await testInfo.attach('failure-screenshot', {
      path: filePath,
      contentType: 'image/png',
    });
    console.log(`\n📸  Saved → failed test cases screenshot/${safeName}.png`);
  } catch {
    // Page may be closed already — silently skip
  }
});
