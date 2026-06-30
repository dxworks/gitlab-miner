import OpenAI from "openai";
import { LLMProvider } from "./LLMProvider";

export class OpenAIProvider implements LLMProvider {

    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async createResponse(args: {
        systemInstructions: string;
        tools: any[];
        input: any[];
        model: string;
    }) {

        const response = await this.client.responses.create({
            model: args.model,
            instructions: args.systemInstructions,
            tools: args.tools,
            input: args.input,
        });

        return {
            outputItems: response.output ?? [],
            outputText: (response as any).output_text ?? ""
        };
    }
}