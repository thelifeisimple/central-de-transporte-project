import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }
}