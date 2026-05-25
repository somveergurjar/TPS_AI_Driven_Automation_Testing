/** Selectors for the Login page. */
export const LoginLocators = {
  emailInput:    'input[type="email"]',
  passwordInput: 'input[type="password"]',
  loginButton:   'button:has-text("Continue to Verification")',
  errorMessage:  '[class*="error"], [role="alert"]',
} as const;
