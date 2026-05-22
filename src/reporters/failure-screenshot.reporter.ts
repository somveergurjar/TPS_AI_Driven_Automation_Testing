import type {
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs   from 'fs';
import * as path from 'path';

const DEST_DIR      = path.resolve(process.cwd(), 'failed test cases screenshot');
const TEST_RESULTS  = path.resolve(process.cwd(), 'test-results');

/**
 * FailureScreenshotReporter
 *
 * On every failed test, collects screenshots from TWO sources:
 *   1. result.attachments  — screenshots Playwright attached via `screenshot: only-on-failure`
 *   2. test-results folder  — any .png files Playwright wrote to disk for this test
 *
 * All screenshots are copied flat into "failed test cases screenshot/<TC-Name>.png"
 */
class FailureScreenshotReporter implements Reporter {

  onBegin() {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed' || result.status === 'skipped') return;

    const safeName = this.sanitise(test.titlePath().join(' — '));

    // ── Source 1: attachments array ───────────────────────────────────────────
    const attached = result.attachments.filter(
      (a) => a.contentType === 'image/png' && (a.path || a.body),
    );

    attached.forEach((att, idx) => {
      const suffix   = attached.length > 1 ? `-${idx + 1}` : '';
      const destPath = path.join(DEST_DIR, `${safeName}${suffix}.png`);
      if (att.path && fs.existsSync(att.path)) {
        fs.copyFileSync(att.path, destPath);
        this.log(safeName + suffix);
      } else if (att.body) {
        fs.writeFileSync(destPath, att.body);
        this.log(safeName + suffix);
      }
    });

    if (attached.length > 0) return; // already handled

    // ── Source 2: scan test-results folder for this test's .png files ─────────
    if (!fs.existsSync(TEST_RESULTS)) return;

    const pngsFromDisk = this.findPngsForTest(test, result);
    pngsFromDisk.forEach((src, idx) => {
      const suffix   = pngsFromDisk.length > 1 ? `-${idx + 1}` : '';
      const destPath = path.join(DEST_DIR, `${safeName}${suffix}.png`);
      fs.copyFileSync(src, destPath);
      this.log(safeName + suffix);
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private findPngsForTest(test: TestCase, result: TestResult): string[] {
    if (!fs.existsSync(TEST_RESULTS)) return [];

    // Playwright names the output subfolder using a hash of the test path.
    // Walk all subdirectories of test-results and collect .png files whose
    // parent folder name contains a fragment of the test title.
    const titleFragment = test.title
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 20)
      .toLowerCase();

    const found: string[] = [];

    try {
      for (const entry of fs.readdirSync(TEST_RESULTS)) {
        const dirPath = path.join(TEST_RESULTS, entry);
        if (!fs.statSync(dirPath).isDirectory()) continue;
        if (!entry.toLowerCase().includes(titleFragment.substring(0, 8))) continue;

        for (const file of fs.readdirSync(dirPath)) {
          if (file.endsWith('.png')) {
            found.push(path.join(dirPath, file));
          }
        }
      }
    } catch {
      // silently skip if folder is unreadable
    }

    return found;
  }

  private sanitise(name: string): string {
    return name
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, '_')
      .replace(/-{2,}/g, '-')
      .substring(0, 180);
  }

  private log(name: string) {
    console.log(`\n📸  Saved → failed test cases screenshot/${name}.png`);
  }
}

export default FailureScreenshotReporter;
