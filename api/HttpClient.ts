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

  async verifyEverySitemapPageIsRealPage(expectedStatus: number) {
    const sitemapText = await this.response.text();
    const pageUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    expect(pageUrls.length, 'Number of pages found in the sitemap').toBeGreaterThan(0);

    for (const pageUrl of pageUrls) {
      const pageResponse = await this.request.get(pageUrl);
      expect.soft(pageResponse.status(), `Status of ${pageUrl}`).toBe(expectedStatus);

      const pageHtml = await pageResponse.text();
      const canonicalTag = pageHtml.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0];
      const canonicalUrl = canonicalTag?.match(/href="([^"]*)"/)?.[1];
      expect.soft(canonicalUrl, `Canonical URL of ${pageUrl}`).toBe(pageUrl);
    }
  }
}
