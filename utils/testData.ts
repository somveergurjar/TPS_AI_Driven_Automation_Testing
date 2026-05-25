/**
 * Test data generators — all values include a timestamp so they are
 * unique across parallel workers without any shared state.
 */

export class TestDataGenerator {
  // ─── Document module ─────────────────────────────────────────────────────────

  static documentName(prefix = 'Test Doc'): string {
    return `${prefix}_${Date.now()}`;
  }

  static supplierDocId(prefix = 'SUP'): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  static tpsId(prefix = 'TPS'): string {
    return `${prefix}-${Date.now()}`;
  }

  // ─── Tag module ───────────────────────────────────────────────────────────────

  static tagPrefix(prefix = 'AUTOTAG'): string {
    return `${prefix}-${Date.now()}`;
  }

  static tagDescription(prefix = 'AutoDesc'): string {
    return `${prefix} ${new Date().toISOString()}`;
  }

  // ─── Equipment module ─────────────────────────────────────────────────────────

  static manufacturerName(prefix = 'AutoMfg'): string {
    return `${prefix}-${Date.now()}`;
  }

  static supplierName(prefix = 'AutoSupplier'): string {
    return `${prefix}-${Date.now()}`;
  }

  // ─── Generic ─────────────────────────────────────────────────────────────────

  /** Returns a string of `length` repeated 'A' characters. */
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

// ─── Static document test data ────────────────────────────────────────────────

export const DocumentTestData = {
  valid: {
    documentName:  'Calibration Certificate Rev1',
    supplierDocId: 'DOC-CAL-001',
    remarks:       'Automated test document — valid data',
  },
  mandatoryOnly: {
    documentName: 'Minimal Valid Document',
  },
  specialChars: {
    documentName: 'Doc !@#$%^&*()_+-=',
  },
} as const;

// ─── Static tag test data ─────────────────────────────────────────────────────

export const TagTestData = {
  valid: {
    prefix:      'FIC',
    description: 'Flow Indicator Controller',
  },
} as const;
