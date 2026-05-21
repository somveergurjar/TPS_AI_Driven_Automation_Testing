// ─── Shared type definitions across the framework ──────────────────────────────

export interface Credentials {
  email: string;
  password: string;
}

export interface DocumentFormData {
  documentName: string;
  documentType?: string;
  supplier?: string;
  supplierDocId?: string;
  remarks?: string;
}

export interface RevisionUploadData {
  filePath: string;
  expectedRevNumber?: string;
}

export interface FilterOptions {
  tpsId?: string;
  supplierDocId?: string;
  documentName?: string;
  documentType?: string;
  supplier?: string;
  revisions?: string;
  remarks?: string;
}

export interface TagData {
  prefix: string;
  description?: string;
}

export interface EquipmentData {
  manufacturer: string;
  supplier: string;
  supplierId: string;
  category?: string;
  type?: string;
  feature?: string;
  modelInfo?: string;
  status?: string;
}

export type BrowserName = 'chromium' | 'firefox' | 'webkit';
export type VideoMode = 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';
