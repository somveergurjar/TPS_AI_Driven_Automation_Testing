import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DocumentFormLocators as L } from '../locators/documentLocators';
import { DocumentListLocators } from '../locators/documentLocators';
import { ENV } from '../config/env';

export class DocumentFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Tabs ─────────────────────────────────────────────────────────────────────

  async switchToIdentificationTab() {
    await this.click(L.tabs.identification);
  }

  async switchToRevisionsTab() {
    await this.click(L.tabs.revisions);
    await this.page.locator(L.revisions.fileInput).waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  }

  async switchToEquipmentTab() {
    await this.click(L.tabs.equipment);
  }

  async switchToSparePartsTab() {
    await this.click(L.tabs.spareParts);
  }

  // ─── Identification fields ─────────────────────────────────────────────────────

  async fillDocumentName(name: string) {
    const input = await this.resolveDocumentNameInput();
    await input.fill(name);
  }

  async selectDocumentType() {
    await this.page.locator(L.identification.documentTypeInput).first().click();
    const option = this.page.locator(L.identification.dropdownOption).first();
    await option.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await option.count() > 0) await option.click();
  }

  async selectSupplier() {
    await this.page.locator(L.identification.supplierInput).first().click();
    const option = this.page.locator(L.identification.dropdownOption).first();
    await option.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await option.count() > 0) await option.click();
  }

  async fillSupplierDocId(value: string) {
    await this.fill(L.identification.supplierDocIdInput, value);
  }

  async fillAllMandatoryFields(docName: string) {
    await this.fillDocumentName(docName);
    await this.selectDocumentType();
    await this.selectSupplier();
  }

  // ─── Revisions tab ────────────────────────────────────────────────────────────

  async uploadRevision(filePath: string): Promise<boolean> {
    const fileInput = this.page.locator(L.revisions.fileInput).first();
    if (await fileInput.count() === 0) return false;
    await fileInput.setInputFiles(filePath);
    const uploadBtn = this.page.locator(L.revisions.uploadRevisionButton).first();
    await uploadBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await uploadBtn.count() > 0 && await uploadBtn.isEnabled()) {
      await uploadBtn.click();
      await expect
        .poll(() => this.page.locator(L.revisions.revisionRows).count(), { timeout: 8000 })
        .toBeGreaterThanOrEqual(1);
    }
    return true;
  }

  async getRevisionRowCount(): Promise<number> {
    return this.page.locator(L.revisions.revisionRows).count();
  }

  async isUploadRevisionButtonEnabled(): Promise<boolean> {
    const btn = this.page.locator(L.revisions.uploadRevisionButton).first();
    return btn.count().then(c => c === 0 ? false : btn.isEnabled());
  }

  // ─── Linking tabs ─────────────────────────────────────────────────────────────

  async linkFirstAvailableItem() {
    const card = this.page.locator(L.availableItemCard).first();
    if (await card.count() > 0) {
      await card.click({ timeout: 5000 }).catch(() => {});
    }
  }

  // ─── Form actions ─────────────────────────────────────────────────────────────

  async save() {
    await this.click(L.saveButton);
    await this.page.locator(DocumentListLocators.toastSuccess).waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async cancel() {
    await this.click(L.cancelButton);
    await this.waitForNetworkIdle();
  }

  // ─── Validation errors ────────────────────────────────────────────────────────

  async isDocumentNameErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.documentName);
  }

  async isDocumentTypeErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.documentType);
  }

  async isSupplierErrorVisible(): Promise<boolean> {
    return this.isVisible(L.errors.supplier);
  }

  async assertDocumentNameError() {
    await this.assertVisible(L.errors.documentName, '"Document name is required" error must appear');
  }

  async assertDocumentTypeError() {
    await this.assertVisible(L.errors.documentType, '"Document type is required" error must appear');
  }

  async assertSupplierError() {
    await this.assertVisible(L.errors.supplier, '"Supplier is required" error must appear');
  }

  async assertAllMandatoryErrors() {
    await this.assertDocumentNameError();
    await this.assertDocumentTypeError();
    await this.assertSupplierError();
  }

  // ─── Private ─────────────────────────────────────────────────────────────────

  private async resolveDocumentNameInput() {
    for (const sel of [
      'input[name="documentName"]',
      'input[id*="documentName"]',
      'input[placeholder*="Document Name" i]',
    ]) {
      const loc = this.page.locator(sel).first();
      if (await loc.count() > 0 && await loc.isEnabled()) return loc;
    }
    // Fallback: first editable input that is not a known dropdown trigger
    return this.page.locator(L.identification.documentNameInput).first();
  }
}
