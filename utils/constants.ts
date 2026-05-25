/**
 * Shared constants used across the test suite.
 * Values that vary by environment belong in config/env.ts, not here.
 */

export const TIMEOUTS = {
  navigation: 30_000,
  element:    15_000,
  action:     10_000,
  poll:       10_000,
} as const;

export const POLL_INTERVALS = {
  fast:   [300, 300, 500] as number[],
  normal: [500, 500, 1000, 1000, 2000] as number[],
} as const;

export const FIXTURE_FILES = {
  calibrationCertificate: 'calibration-certificate-rev1.pdf',
} as const;

export const MODULE_PATHS = {
  document:  '/document',
  tag:       '/tag',
  equipment: '/equipment',
  dashboard: '/dashboard',
} as const;
