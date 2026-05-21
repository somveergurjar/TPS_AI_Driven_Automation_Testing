import * as path from 'path';
import * as fs from 'fs';

export class FileHelper {
  static resolveFixture(fileName: string): string {
    return path.resolve(process.cwd(), 'tests', 'fixtures', fileName);
  }

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
