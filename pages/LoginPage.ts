import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLocators } from '../locators/loginLocators';
import { ENV } from '../config/env';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('/login');
  }

  async login(email = ENV.credentials.email, password = ENV.credentials.password) {
    await this.page.context().clearCookies();
    await this.navigate();
    await this.page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await this.fill(LoginLocators.emailInput, email);
    await this.fill(LoginLocators.passwordInput, password);
    await this.click(LoginLocators.loginButton);

    // Wait for redirect away from /login
    await this.page.waitForURL(
      (url) => !url.href.includes('/login'),
      { timeout: ENV.timeouts.navigation },
    ).catch(() => {});

    await this.waitForNetworkIdle();
  }

  async isLoginErrorVisible(): Promise<boolean> {
    return this.isVisible(LoginLocators.errorMessage);
  }
}
