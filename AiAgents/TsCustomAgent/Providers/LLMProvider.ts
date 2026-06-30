export interface LLMProvider {
    createResponse(args: {
        systemInstructions: string;
        tools: any[];
        input: any[];
        model: string;
    }): Promise<{
        outputItems: any[];
        outputText: string;
    }>;
}