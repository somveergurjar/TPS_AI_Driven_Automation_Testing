import * as path from 'path';
import * as fs   from 'fs';

/**
 * FileHelper — resolves paths and reads test data files.
 */
export class FileHelper {
  /** Resolves a filename relative to the root-level fixtures/ folder. */
  static resolveFixture(fileName: string): string {
    return path.resolve(process.cwd(), 'fixtures', fileName);
  }

  /** Resolves a filename relative to the root-level test-data/ folder. */
  static resolveTestData(fileName: string): string {
    return path.resolve(process.cwd(), 'test-data', fileName);
  }

  static readJson<T>(filePath: string): T {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  static readTestData<T>(fileName: string): T {
    return this.readJson<T>(this.resolveTestData(fileName));
  }

  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static ensureDir(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * RetryHelper — retries an async operation with configurable attempts and delay.
 */
export class RetryHelper {
  static async retry<T>(
    fn: () => Promise<T>,
    options: { attempts?: number; delayMs?: number; label?: string } = {},
  ): Promise<T> {
    const { attempts = 3, delayMs = 500, label = 'operation' } = options;
    let lastError: unknown;
    for (let i = 1; i <= attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (i < attempts) {
          await new Promise(r => setTimeout(r, delayMs));
        }
      }
    }
    throw new Error(`${label} failed after ${attempts} attempts: ${String(lastError)}`);
  }
}

/**
 * DateHelper — date formatting utilities for test data.
 */
export class DateHelper {
  static isoTimestamp(): string {
    return new Date().toISOString();
  }

  static dateSlug(): string {
    return new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  }
}
