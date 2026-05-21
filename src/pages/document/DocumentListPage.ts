import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { DocumentListLocators as L } from '../../locators/document/document-list.locators';
import { ENV } from '../../config/env.config';
import { FilterOptions } from '../../types';

export class DocumentListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate() {
    await this.goto('/document');
    await this.waitForGrid();
  }

  async waitForGrid() {
    await this.waitForVisible(L.table);
    await this.waitForDOMReady();
  }

  // ─── Toolbar ───────────────────────────────────────────────────────────────

  async clickNewDocument() {
    await this.click(L.newDocumentButton);
    await this.waitForNetworkIdle();
  }

  async clickResetFilters() {
    await this.click(L.resetFiltersButton);
    await this.waitForNetworkIdle();
  }

  // ─── Filters ───────────────────────────────────────────────────────────────

  async applyTextFilter(selector: string, value: string) {
    const input = this.page.locator(selector).first();
    await input.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await input.fill(value);
    await this.waitForTimeout(600);
  }

  async applyDropdownFilter(selector: string, value: string) {
    await this.selectOption(selector, value);
    await this.waitForTimeout(600);
  }

  async applyFilters(options: FilterOptions) {
    if (options.tpsId)        await this.applyTextFilter(L.filters.tpsId, options.tpsId);
    if (options.supplierDocId)await this.applyTextFilter(L.filters.supplierDocId, options.supplierDocId);
    if (options.documentName) await this.applyTextFilter(L.filters.documentName, options.documentName);
    if (options.documentType) await this.applyDropdownFilter(L.filters.documentType, options.documentType);
    if (options.supplier)     await this.applyDropdownFilter(L.filters.supplier, options.supplier);
    if (options.revisions)    await this.applyTextFilter(L.filters.revisions, options.revisions);
    if (options.remarks)      await this.applyTextFilter(L.filters.remarks, options.remarks);
  }

  async resetFilters() {
    const textFilters = [L.filters.tpsId, L.filters.supplierDocId, L.filters.documentName, L.filters.revisions, L.filters.remarks];
    for (const sel of textFilters) {
      const el = this.page.locator(sel).first();
      if (await el.count() > 0) await el.fill('');
    }
    const resetBtn = this.page.locator(L.resetFiltersButton);
    if (await resetBtn.count() > 0) await resetBtn.click();
    await this.waitForNetworkIdle();
  }

  // ─── Grid data ─────────────────────────────────────────────────────────────

  async getRowCount(): Promise<number> {
    return this.page.locator(L.tableRows).count();
  }

  async getTotalRecordCount(): Promise<number> {
    const text = await this.page.locator(L.totalRecordsCount).first().innerText().catch(() => '0');
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : await this.getRowCount();
  }

  async getRowByTpsId(tpsId: string) {
    await this.applyTextFilter(L.filters.tpsId, tpsId);
    return this.page.locator(`table tbody tr:has-text("${tpsId}")`).first();
  }

  async isNoResultsVisible(): Promise<boolean> {
    return this.isVisible(L.noResults);
  }

  // ─── Header assertions ─────────────────────────────────────────────────────

  async assertAllHeadersVisible() {
    for (const [name, selector] of Object.entries(L.headers)) {
      await this.assertVisible(selector, `Column header "${name}" should be visible`);
    }
  }

  // ─── Row actions ───────────────────────────────────────────────────────────

  async clickDownloadForRow(row: ReturnType<Page['locator']>) {
    await this.click(row.locator(L.actions.download).first());
  }

  async clickDeleteForRow(row: ReturnType<Page['locator']>) {
    await this.click(row.locator(L.actions.delete).first());
    await this.waitForVisible(L.deleteModal.container);
    await this.click(L.deleteModal.confirmBtn);
    await this.waitForHidden(L.deleteModal.container);
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertNewDocumentButtonVisible() {
    await this.assertVisible(L.newDocumentButton);
    await this.assertEnabled(L.newDocumentButton);
  }

  async assertTableVisible() {
    await this.assertVisible(L.table);
  }
}
