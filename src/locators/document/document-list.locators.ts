export const DocumentListLocators = {
  // Page header
  pageHeader:        'h1:has-text("Document List")',
  totalRecordsCount: 'text=/\\d+ records?/i',

  // Toolbar
  newDocumentButton:   'button:has-text("New Document")',
  resetFiltersButton:  'button:has-text("Reset Filters")',

  // Table
  table:     'table',
  tableBody: 'table tbody',
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
    edit:     'button:has(svg.lucide-edit), button:has(svg.lucide-pencil)',
  },

  // Delete confirmation modal
  deleteModal: {
    container:  'text=/Delete Document/i',
    confirmBtn: 'button:has-text("Delete")',
    cancelBtn:  'button:has-text("Cancel")',
  },

  // Pagination
  pagination: {
    next:     'button:has-text("Next")',
    previous: 'button:has-text("Previous")',
    page:     'button[data-page]',
  },

  // Empty / no results
  noResults:  'div:has(span:has-text("No documents found matching your filters"))',
  emptyState: 'div:has(span:has-text("No documents available"))',

  // Toasts
  toastSuccess: 'text=/successfully/i',
  toastError:   '[class*="toast"][class*="error"], text=/error/i',
} as const;
