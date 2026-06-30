import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider } from "./LLMProvider";

export class AnthropicProvider implements LLMProvider {

    private client: Anthropic;

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }

    async createResponse(args: {
        systemInstructions: string;
        tools: any[];
        input: any[];
        model: string;
    }) {

        const messages = args.input.map(item => {

            if (item.type === "function_call_output") {
                return {
                    role: "user",
                    content: [
                        {
                            type: "tool_result",
                            tool_use_id: item.call_id,
                            content: item.output
                        }
                    ]
                };
            }

            if (item.type === "function_call") {
                return {
                    role: "assistant",
                    content: [
                        {
                            type: "tool_use",
                            id: item.call_id,
                            name: item.name,
                            input: JSON.parse(item.arguments)
                        }
                    ]
                };
            }

            return {
                role: item.role ?? "user",
                content: item.content ?? ""
            };
        });

        const anthropicTools = (args.tools ?? []).map(tool => ({
            name: tool.name,
            description: tool.description,
            input_schema: tool.parameters
        }));

        const response = await this.client.messages.create({
            model: args.model,
            system: args.systemInstructions,
            messages,
            tools: anthropicTools,
            max_tokens: 4096
        });

        const outputItems: any[] = [];
        let outputText = "";

        for (const block of response.content) {

            if (block.type === "text") {
                outputText += block.text;
            }

            if (block.type === "tool_use") {
                outputItems.push({
                    type: "function_call",
                    call_id: block.id,
                    name: block.name,
                    arguments: JSON.stringify(block.input)
                });
            }
        }

        return {
            outputItems,
            outputText
        };
    }
}