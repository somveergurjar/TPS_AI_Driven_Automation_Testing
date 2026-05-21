/**
 * RandomHelper — generates unique test data values.
 * All values include a timestamp to guarantee uniqueness across parallel runs.
 */
export class RandomHelper {
  static documentName(prefix = 'Test Doc'): string {
    return `${prefix} ${Date.now()}`;
  }

  static supplierDocId(prefix = 'SUP'): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static tpsId(prefix = 'TPS'): string {
    return `${prefix}-${Date.now()}`;
  }

  static tagPrefix(prefix = 'AUTOTAG'): string {
    return `${prefix}-${Date.now()}`;
  }

  static tagDescription(prefix = 'AutoDesc'): string {
    return `${prefix} ${new Date().toISOString()}`;
  }

  static manufacturerName(prefix = 'AutoMfg'): string {
    return `${prefix}-${Date.now()}`;
  }

  static supplierName(prefix = 'AutoSupplier'): string {
    return `${prefix}-${Date.now()}`;
  }

  static longString(length = 1000): string {
    return 'A'.repeat(length);
  }

  static randomKeyword(): string {
    const keywords = ['test', 'sample', 'demo', 'example', 'draft'];
    return keywords[Math.floor(Math.random() * keywords.length)];
  }

  static pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
