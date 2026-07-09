import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export default async function globalTeardown() {
  const resultsDir = path.resolve(__dirname, 'allure-results');
  const reportDir  = path.resolve(__dirname, 'allure-report');

  if (!fs.existsSync(resultsDir)) {
    console.log('\n[Allure] No allure-results directory found — skipping report generation.');
    return;
  }

  try {
    console.log('\n[Allure] Generating HTML report...');
    execSync(`npx allure generate "${resultsDir}" --output "${reportDir}"`, {
      stdio: 'inherit',
      cwd: __dirname,
    });
    console.log(`[Allure] Report ready → ${reportDir}${path.sep}index.html\n`);
  } catch (err) {
    console.warn('[Allure] Report generation failed (non-fatal):', (err as Error).message);
  }
}
