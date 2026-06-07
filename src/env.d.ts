/// <reference types="astro/client" />

interface TurnstileApi {
  render(target: string | HTMLElement, options: Record<string, unknown>): string;
  getResponse(widgetId: string): string;
  reset(widgetId: string): void;
}

interface Window {
  turnstile?: TurnstileApi;
}
