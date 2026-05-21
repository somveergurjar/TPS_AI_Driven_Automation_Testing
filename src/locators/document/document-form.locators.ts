export const DocumentFormLocators = {
  // Tabs
  tabs: {
    identification: 'button:has-text("Identification")',
    revisions:      'button:has-text("Revisions")',
  },

  // Identification fields
  identification: {
    tpsIdInput:       'input[disabled]',
    documentNameInput:'input[type="text"]:not([disabled]):not([placeholder="SELECT OR TYPE TO ADD NEW..."]):not([placeholder="TYPE TO SEARCH OR ADD NEW..."]):not([placeholder="e.g. USER-MAN-V2"])',
    documentTypeInput:'input[placeholder="SELECT OR TYPE TO ADD NEW..."]',
    supplierInput:    'input[placeholder="TYPE TO SEARCH OR ADD NEW..."]',
    supplierDocIdInput:'input[placeholder="e.g. USER-MAN-V2"]',
    dropdownContainer:'div.absolute.z-50',
    dropdownOption:   'div.absolute.z-50 > div',
  },

  // Identification validation errors
  errors: {
    documentName: 'p.text-xs.text-red-500:has-text("Document name is required")',
    documentType: 'p.text-xs.text-red-500:has-text("Document type is required")',
    supplier:     'p.text-xs.text-red-500:has-text("Supplier is required")',
    anyError:     'p.text-xs.text-red-500, .text-red-500',
  },

  // Revisions tab
  revisions: {
    fileInput:           'input[type="file"]',
    chooseFilesButton:   'button:has-text("Choose files"), label:has-text("Choose files")',
    uploadRevisionButton:'button:has-text("Upload Revision")',
    revisionGrid:        'table',
    revisionRows:        'table tbody tr',
    nextRevisionLabel:   'text=/Rev\\s*1|Revision\\s*1/i',
    noRevisionError:     'text=/at least one revision|upload a file before saving/i',
  },

  // Form actions
  saveButton:   'button:has-text("Save Document")',
  cancelButton: 'button:has-text("Cancel")',
} as const;
