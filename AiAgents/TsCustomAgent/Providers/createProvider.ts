import { LLMProvider } from "./LLMProvider";
import { OpenAIProvider } from "./OpenAIProvider";
import { AnthropicProvider } from "./AnthropicProvider";

export function createProvider(providerName: string): LLMProvider {

    switch (providerName.toLowerCase()) {

        case "anthropic":
            return new AnthropicProvider();

        case "openai":
        default:
            return new OpenAIProvider();
    }
}