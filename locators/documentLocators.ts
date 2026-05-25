/**
 * All selectors for the Document module.
 * Split into list-page and form-page namespaces so callers only
 * import what they need.
 */

// ─── Document List page ────────────────────────────────────────────────────────

export const DocumentListLocators = {
  pageHeader:        'h1:has-text("Document List")',
  totalRecordsCount: 'text=/\\d+ records?/i',

  // Toolbar
  newDocumentButton:  'button:has-text("New Document")',
  resetFiltersButton: 'button:has-text("Reset Filters")',

  // Table
  table:     'table',
  tableRows: 'table tbody tr',

  // Column headers
  headers: {
    tpsId:           'th:has-text("TPS ID")',
    supplierDocId:   'th:has-text("SUPPLIER DOC ID")',
    documentName:    'th:has-text("DOCUMENT NAME")',
    documentType:    'th:has-text("DOCUMENT TYPE")',
    supplier:        'th:has-text("SUPPLIER"):not(:has-text("DOC"))',
    revisions:       'th:has-text("REVISIONS")',
    linkedEquipment: 'th:has-text("LINKED EQUIPMENT")',
    linkedSpares:    'th:has-text("LINKED SPARES")',
    remarks:         'th:has-text("REMARKS")',
    actions:         'th:has-text("ACTIONS")',
  },

  // Column filters
  filters: {
    tpsId:        'th:has-text("TPS ID") input[placeholder="Filter..."]',
    supplierDocId:'th:has-text("SUPPLIER DOC ID") input[placeholder="Filter..."]',
    documentName: 'th:has-text("DOCUMENT NAME") input[placeholder="Filter..."]',
    documentType: 'th:has-text("DOCUMENT TYPE") select',
    supplier:     'th:has-text("SUPPLIER"):not(:has-text("DOC")) select',
    revisions:    'th:has-text("REVISIONS") input[placeholder="Filter..."]',
    remarks:      'th:has-text("REMARKS") input[placeholder="Filter..."]',
  },

  // Row actions
  actions: {
    download: 'button:has(svg.lucide-download)',
    delete:   'button:has(svg.lucide-trash2)',
  },

  // Delete modal
  deleteModal: {
    container:  'text=/Delete Document/i',
    confirmBtn: 'button:has-text("Delete")',
    cancelBtn:  'button:has-text("Cancel")',
  },

  // Pagination
  pagination: {
    next:     'button:has-text("Next")',
    previous: 'button:has-text("Previous")',
  },

  // Empty state
  noResults:  'div:has(span:has-text("No documents found matching your filters"))',
  emptyState: 'div:has(span:has-text("No documents available"))',

  // Toasts
  toastSuccess: 'text=/successfully/i',
  toastError:   'text=/error/i',
} as const;

// ─── Document Form page ─────────────────────────────────────────────────────────

export const DocumentFormLocators = {
  // Tabs — scoped to main to avoid sidebar collision
  tabs: {
    identification: 'main button:has-text("Identification")',
    revisions:      'main button:has-text("Revisions")',
    equipment:      'main button:has-text("Equipment Linking")',
    spareParts:     'main button:has-text("Spare Parts Linking")',
  },

  // Identification fields
  identification: {
    tpsIdInput:        'input[disabled]',
    documentNameInput: (
      'input:not([disabled]):not([readonly])' +
      ':not([placeholder="SELECT OR TYPE TO ADD NEW..."])' +
      ':not([placeholder="TYPE TO SEARCH OR ADD NEW..."])'
    ),
    documentTypeInput: 'input[placeholder="SELECT OR TYPE TO ADD NEW..."]',
    supplierInput:     'input[placeholder="TYPE TO SEARCH OR ADD NEW..."]',
    supplierDocIdInput:'input[placeholder="e.g. USER-MAN-V2"]',
    dropdownOption:    'div.absolute.z-50 > div',
  },

  // Validation errors
  errors: {
    documentName: 'p.text-xs.text-red-500:has-text("Document name is required")',
    documentType: 'p.text-xs.text-red-500:has-text("Document type is required")',
    supplier:     'p.text-xs.text-red-500:has-text("Supplier is required")',
  },

  // Revisions tab
  revisions: {
    fileInput:           'input[type="file"]',
    uploadRevisionButton:'button:has-text("Upload Revision")',
    revisionRows:        'table tbody tr',
    noRevisionError:     'text=/at least one revision|upload a file before saving/i',
  },

  // Linking tabs — items rendered as cursor-pointer div cards
  availableItemCard: 'main [class*="cursor-pointer"]:has(p)',

  // Form actions
  saveButton:   'button:has-text("Save Document")',
  cancelButton: 'button:has-text("Cancel")',
} as const;
