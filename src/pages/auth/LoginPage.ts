import { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { LoginLocators } from '../../locators/auth/login.locators';
import { ENV } from '../../config/env.config';
import { Credentials } from '../../types';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('/login');
  }

  async login(credentials: Credentials = ENV.credentials) {
    await this.page.context().clearCookies();
    await this.navigate();
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.fill(LoginLocators.emailInput, credentials.email);
    await this.fill(LoginLocators.passwordInput, credentials.password);
    await this.click(LoginLocators.loginButton);

    // Wait for redirect away from login
    await this.page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: ENV.timeouts.navigation,
    }).catch(() => {});

    await this.waitForNetworkIdle();
  }

  async isLoginErrorVisible(): Promise<boolean> {
    return this.isVisible(LoginLocators.errorMessage);
  }
}
