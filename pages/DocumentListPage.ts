import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DocumentListLocators as L } from '../locators/documentLocators';
import { ENV } from '../config/env';

export class DocumentListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async navigate() {
    await this.goto('/document');
    await this.waitForGrid();
  }

  async waitForGrid() {
    await this.waitForVisible(L.table);
    await this.waitForDOMReady();
  }

  // ─── Toolbar ─────────────────────────────────────────────────────────────────

  async clickNewDocument() {
    await this.click(L.newDocumentButton);
    await this.waitForNetworkIdle();
  }

  async clickResetFilters() {
    const btn = this.page.locator(L.resetFiltersButton);
    if (await btn.count() > 0) await btn.click();
    await this.waitForNetworkIdle();
  }

  // ─── Filters ─────────────────────────────────────────────────────────────────

  async applyFilter(selector: string, value: string) {
    const input = this.page.locator(selector).first();
    await input.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await input.fill(value);
    await this.waitForDOMReady();
  }

  async resetFilters() {
    const textFilters = [
      L.filters.tpsId, L.filters.supplierDocId, L.filters.documentName,
      L.filters.revisions, L.filters.remarks,
    ];
    for (const sel of textFilters) {
      const el = this.page.locator(sel).first();
      if (await el.count() > 0) await el.fill('');
    }
    await this.clickResetFilters();
  }

  async applyNameFilter(name: string) {
    await this.applyFilter(L.filters.documentName, name);
  }

  // ─── Grid data ────────────────────────────────────────────────────────────────

  async getVisibleRowCount(): Promise<number> {
    return this.page.locator(L.tableRows).count();
  }

  async getTotalRecordCount(): Promise<number> {
    const text = await this.page.locator(L.totalRecordsCount).first().innerText().catch(() => '0');
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : await this.getVisibleRowCount();
  }

  async getRowByText(text: string) {
    return this.page.locator(`table tbody tr:has-text("${text}")`).first();
  }

  async waitForRowCount(count: number, timeout = 10000) {
    await expect
      .poll(() => this.getVisibleRowCount(), { timeout })
      .toBeGreaterThanOrEqual(count);
  }

  // ─── Column headers ───────────────────────────────────────────────────────────

  async assertAllHeadersVisible() {
    for (const [name, selector] of Object.entries(L.headers)) {
      await this.assertVisible(selector, `Column header "${name}" should be visible`);
    }
  }

  // ─── Row actions ─────────────────────────────────────────────────────────────

  async clickDownloadForRow(row: ReturnType<Page['locator']>) {
    await this.click(row.locator(L.actions.download).first());
  }

  async deleteDocument(docName: string): Promise<void> {
    await this.applyNameFilter(docName);
    const row = this.page.locator(`table tbody tr:has-text("${docName}")`).first();
    await row.waitFor({ state: 'visible', timeout: ENV.timeouts.element });
    await this.click(row.locator(L.actions.delete).first());
    await this.waitForVisible(L.deleteModal.container);
    await this.click(L.deleteModal.confirmBtn);
    await this.page.locator(L.toastSuccess).waitFor({ state: 'visible', timeout: ENV.timeouts.action });
  }

  // ─── Assertions ───────────────────────────────────────────────────────────────

  async assertTableVisible() {
    await this.assertVisible(L.table);
  }

  async assertNewDocumentButtonVisible() {
    await this.assertVisible(L.newDocumentButton);
    await this.assertEnabled(L.newDocumentButton);
  }

  async assertNoResults() {
    const hasMessage = await this.isVisible(L.noResults);
    const hasZeroRows = (await this.getVisibleRowCount()) === 0;
    if (!hasMessage && !hasZeroRows) {
      throw new Error('Expected empty state but rows or no-results message was not found');
    }
  }
}
