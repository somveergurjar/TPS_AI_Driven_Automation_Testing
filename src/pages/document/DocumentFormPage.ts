import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { DocumentFormLocators as L } from '../../locators/document/document-form.locators';
import { ENV } from '../../config/env.config';
import { DocumentFormData, RevisionUploadData } from '../../types';

export class DocumentFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  async switchToIdentificationTab() {
    await this.click(L.tabs.identification);
    await this.waitForTimeout(300);
  }

  async switchToRevisionsTab() {
    await this.click(L.tabs.revisions);
    await this.waitForTimeout(400);
  }

  // ─── Identification tab ────────────────────────────────────────────────────

  async fillDocumentName(name: string) {
    const input = await this.resolveDocumentNameInput();
    await input.fill(name);
  }

  async selectDocumentType() {
    const input = this.page.locator(L.identification.documentTypeInput).first();
    await input.click();
    await this.waitForTimeout(400);
    const option = this.page.locator(L.identification.dropdownOption).first();
    if (await option.count() > 0) {
      await option.click();
      await this.waitForTimeout(300);
    }
  }

  async selectSupplier() {
    const input = this.page.locator(L.identification.supplierInput).first();
    await input.click();
    await this.waitForTimeout(400);
    const option = this.page.locator(L.identification.dropdownOption).first();
    if (await option.count() > 0) {
      await option.click();
      await this.waitForTimeout(300);
    }
  }

  async fillForm(data: DocumentFormData) {
    if (data.documentName)  await this.fillDocumentName(data.documentName);
    if (data.documentType)  await this.selectDocumentType();
    if (data.supplier)      await this.selectSupplier();
    if (data.supplierDocId) await this.fill(L.identification.supplierDocIdInput, data.supplierDocId);
  }

  async fillAllMandatoryFields(data: DocumentFormData) {
    await this.fillDocumentName(data.documentName);
    await this.selectDocumentType();
    await this.selectSupplier();
  }

  // ─── Revisions tab ────────────────────────────────────────────────────────

  async uploadRevisionFile(data: RevisionUploadData) {
    const fileInput = this.page.locator(L.revisions.fileInput).first();
    if (await fileInput.count() === 0) return false;
    await fileInput.setInputFiles(data.filePath);
    await this.waitForTimeout(400);
    return true;
  }

  async clickUploadRevision() {
    const btn = this.page.locator(L.revisions.uploadRevisionButton).first();
    if (await btn.count() > 0 && await btn.isEnabled()) {
      await btn.click();
      await this.waitForTimeout(1200);
    }
  }

  async getRevisionRowCount(): Promise<number> {
    return this.page.locator(L.revisions.revisionRows).count();
  }

  async isUploadRevisionButtonEnabled(): Promise<boolean> {
    const btn = this.page.locator(L.revisions.uploadRevisionButton).first();
    if (await btn.count() === 0) return false;
    return btn.isEnabled();
  }

  async isUploadRevisionButtonDisabled(): Promise<boolean> {
    const btn = this.page.locator(L.revisions.uploadRevisionButton).first();
    if (await btn.count() === 0) return false;
    return btn.isDisabled();
  }

  // ─── Form actions ──────────────────────────────────────────────────────────

  async save() {
    await this.click(L.saveButton);
    await this.waitForTimeout(500);
  }

  async cancel() {
    await this.click(L.cancelButton);
    await this.waitForNetworkIdle();
  }

  // ─── Validation errors ─────────────────────────────────────────────────────

  async isDocumentNameErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.documentName);
  }

  async isDocumentTypeErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.documentType);
  }

  async isSupplierErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.supplier);
  }

  async isNoRevisionErrorVisible(): Promise<boolean> {
    return this.isVisible(L.revisions.noRevisionError);
  }

  async assertDocumentNameError() {
    await this.assertVisible(L.errors.documentName);
  }

  async assertDocumentTypeError() {
    await this.assertVisible(L.errors.documentType);
  }

  async assertSupplierError() {
    await this.assertVisible(L.errors.supplier);
  }

  async assertAllMandatoryErrors() {
    await this.assertDocumentNameError();
    await this.assertDocumentTypeError();
    await this.assertSupplierError();
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async resolveDocumentNameInput() {
    for (const sel of [
      'input[name="documentName"]',
      'input[id*="documentName"]',
      'input[placeholder*="Document Name" i]',
    ]) {
      const loc = this.page.locator(sel).first();
      if (await loc.count() > 0 && await loc.isEnabled()) return loc;
    }
    return this.page.locator(L.identification.documentNameInput).first();
  }
}
