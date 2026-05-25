import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TagLocators as L } from '../locators/tagLocators';
import { ENV } from '../config/env';

export class TagPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async navigate() {
    if (!this.page.url().includes('/tag')) {
      await this.click('button:has-text("Tag")');
      await this.waitForDOMReady();
      await this.waitForNetworkIdle();
    }
    await this.waitForVisible(L.newTagButton);
  }

  // ─── Modal ───────────────────────────────────────────────────────────────────

  async openNewTagModal() {
    await this.click(L.newTagButton);
    await this.waitForVisible(L.modal.prefixInput);
  }

  async closeModal() {
    const close = this.page.locator(L.modal.closeButton).first();
    if (await close.isVisible({ timeout: 2000 }).catch(() => false)) {
      await close.click();
    } else {
      await this.click(L.modal.cancelButton);
    }
    await this.page.locator(L.modal.container).waitFor({ state: 'hidden' }).catch(() => {});
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────────

  async createTag(prefix: string, description?: string) {
    await this.openNewTagModal();
    await this.fill(L.modal.prefixInput, prefix);
    if (description !== undefined) {
      await this.fill(L.modal.descriptionInput, description);
    }
    await this.click(L.modal.saveButton);
    await this.page.locator(L.toastSave).waitFor({ state: 'visible', timeout: ENV.timeouts.action }).catch(() => {});
    await this.page.locator(L.modal.container).waitFor({ state: 'hidden', timeout: ENV.timeouts.element }).catch(() => {});
    await this.waitForNetworkIdle();
  }

  async deleteTagByPrefix(prefix: string) {
    await this.applyPrefixFilter(prefix);
    const row = this.page.locator(`table tbody tr:has-text("${prefix}")`).first();

    try {
      await row.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      return; // tag not found — already deleted
    }

    await row.scrollIntoViewIfNeeded();
    const deleteBtn = row.locator(L.actions.delete).first();
    await deleteBtn.click({ timeout: ENV.timeouts.element }).catch(() =>
      deleteBtn.click({ force: true }),
    );

    await this.waitForVisible(L.deleteModal.container);
    await this.click(L.deleteModal.confirmBtn);
    await this.waitForVisible(L.toastSuccess);
  }

  // ─── Filters ─────────────────────────────────────────────────────────────────

  async applyPrefixFilter(value: string) {
    await this.applyFilter(L.filters.prefix, value);
  }

  async applyDescriptionFilter(value: string) {
    await this.applyFilter(L.filters.description, value);
  }

  async applyFilter(selector: string, value: string) {
    const field = this.page.locator(selector).first();
    await field.waitFor({ state: 'visible', timeout: 5000 });
    await field.fill('');
    await field.fill(value);
    await this.waitForNetworkIdle();
  }

  async resetFilters() {
    const prefixInput = this.page.locator(L.filters.prefix).first();
    if (await prefixInput.count() > 0) await prefixInput.fill('');
    const descInput = this.page.locator(L.filters.description).first();
    if (await descInput.count() > 0) await descInput.fill('');
    const resetBtn = this.page.locator(L.resetFiltersButton);
    if (await resetBtn.count() > 0) await resetBtn.click();
    await this.waitForNetworkIdle();
  }

  // ─── Grid helpers ─────────────────────────────────────────────────────────────

  async getRowCount(): Promise<number> {
    return this.page.locator(L.tableRows).count();
  }

  async getTotalRecordCount(): Promise<number> {
    const text = await this.page.locator(L.totalRecordsCount).first().innerText().catch(() => '0');
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : await this.getRowCount();
  }

  async findRowByPrefix(prefix: string) {
    return this.page.locator(`table tbody tr:has-text("${prefix}")`).first();
  }

  async waitForRowWithPrefix(prefix: string, timeout = 10000) {
    await expect
      .poll(() => this.page.locator(L.tableRows).count(), { timeout })
      .toBeGreaterThanOrEqual(1);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────────

  async assertAllHeadersVisible() {
    await this.assertVisible(L.headers.prefix,      'TAG PREFIX header should be visible');
    await this.assertVisible(L.headers.description, 'TAG DESCRIPTION header should be visible');
    await this.assertVisible(L.headers.actions,     'ACTIONS header should be visible');
  }
}
