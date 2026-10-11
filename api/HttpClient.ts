import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';

export class HttpClient {
  readonly request: APIRequestContext;
  private lastResponse?: APIResponse;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async requestPage(path: string) {
    this.lastResponse = await this.request.get(path);
  }

  private get response(): APIResponse {
    if (!this.lastResponse) {
      throw new Error('No request was sent yet. Call requestPage first.');
    }
    return this.lastResponse;
  }

  async verifyStatus(expectedStatus: number) {
    expect(this.response.status(), `Status of ${this.response.url()}`).toBe(expectedStatus);
  }

  async verifyTextContains(expectedText: string) {
    expect(await this.response.text()).toContain(expectedText);
  }

  async verifyHeaderContains(headerName: string, expectedValue: string) {
    const headerValue = this.response.headers()[headerName.toLowerCase()];
    expect(headerValue, `Header "${headerName}" of ${this.response.url()}`).toContain(
      expectedValue,
    );
  }
}
