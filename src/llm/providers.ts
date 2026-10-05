export interface LlmRequest {
  prompt: string;
}

export interface LlmResponse {
  text: string;
  simulated: boolean;
  provider: string;
}

export interface LlmProvider {
  readonly id: string;
  generate(input: LlmRequest): Promise<LlmResponse>;
}

export class MockProvider implements LlmProvider {
  readonly id = "mock";

  async generate(): Promise<LlmResponse> {
    return {
      text: "The built-in games do not call a live model. This mock reply exists so optional provider wiring can be tested.",
      simulated: true,
      provider: this.id,
    };
  }
}

export class ProxyProvider implements LlmProvider {
  readonly id: string;
  private readonly proxyUrl: string;

  constructor(proxyUrl: string, providerId: string) {
    this.proxyUrl = proxyUrl;
    this.id = providerId;
  }

  async generate(input: LlmRequest): Promise<LlmResponse> {
    const response = await fetch(this.proxyUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider: this.id, prompt: input.prompt }),
    });
    if (!response.ok) {
      throw new Error(`LLM proxy returned ${response.status}`);
    }
    const body = (await response.json()) as { text?: string };
    return { text: body.text ?? "", simulated: false, provider: this.id };
  }
}

export function createLlmProvider(): LlmProvider {
  const requested = import.meta.env.VITE_LLM_PROVIDER || "mock";
  if (requested === "mock") return new MockProvider();
  const proxyUrl = import.meta.env.VITE_LLM_PROXY_URL;
  if (!proxyUrl) return new MockProvider();
  return new ProxyProvider(proxyUrl, requested);
}
