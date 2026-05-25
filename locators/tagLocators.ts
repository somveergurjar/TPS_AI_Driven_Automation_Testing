/** Selectors for the Tag module. */
export const TagLocators = {
  // Page
  pageHeader:        'h1:has-text("Tag List")',
  totalRecordsCount: 'text=/\\d+ records?/i',

  // Toolbar
  newTagButton:       'button:has-text("New Tag")',
  resetFiltersButton: 'button:has-text("Reset Filters")',

  // Table
  table:     'table',
  tableRows: 'table tbody tr',

  // Column headers
  headers: {
    prefix:      'th:has-text("TAG PREFIX")',
    description: 'th:has-text("TAG DESCRIPTION")',
    actions:     'th:has-text("ACTIONS")',
  },

  // Column filters
  filters: {
    prefix:      'th:has-text("TAG PREFIX") input[placeholder="Filter..."]',
    description: 'th:has-text("TAG DESCRIPTION") input[placeholder="Filter..."]',
  },

  // New Tag modal
  modal: {
    container:        'h2:has-text("New Tag")',
    prefixInput:      'input[placeholder="e.g. FIC"]',
    descriptionInput: 'input[placeholder*="description"]',
    saveButton:       'button:has-text("Save Tag")',
    cancelButton:     'button:has-text("Cancel")',
    closeButton:      '.flex.items-center.justify-between.px-6 > .p-1\\.5',
  },

  // Validation
  validation: {
    prefixRequired: 'text=/Tag Prefix.*required/i',
  },

  // Row actions
  actions: {
    delete: 'button:has(svg.lucide-trash2)',
  },

  // Delete modal
  deleteModal: {
    container:  'text=/Delete Tag/i',
    bodyText:   'p:has-text("Are you sure")',
    confirmBtn: 'button:has-text("Delete")',
    cancelBtn:  'button:has-text("Cancel")',
  },

  // Empty state
  noResults: 'text=/No tags found matching your filters/i',

  // Toasts
  toastSuccess: 'text=/deleted successfully/i',
  toastSave:    'text=/saved successfully/i',
} as const;
