import OpenAI from "openai";
import { ProjectContext } from "./ProjectContext";
import { TsQueryEngine } from "./TsQueryEngine";
import {LLMProvider} from "./Providers/LLMProvider";

type FunctionCallItem = {
    type: "function_call";
    call_id: string;
    name: string;
    arguments: string;
};

function isFunctionCallItem(item: unknown): item is FunctionCallItem {
    const it = item as any;
    return (
        !!it &&
        it.type === "function_call" &&
        typeof it.call_id === "string" &&
        typeof it.name === "string" &&
        typeof it.arguments === "string"
    );
}

type FunctionCallOutputItem = {
    type: "function_call_output";
    call_id: string;
    output: string;
};

export interface ToolCallDetail {
    callId: string;
    toolName: string;
    purpose: string;
    ok: boolean;
    resultBytes: number;
    error?: string;
}

function extractPurposeFromScript(script: string): string {
    const firstLine = script.split("\n")[0]?.trim() ?? "";
    const m = firstLine.match(/^\/\/\s*PURPOSE\s*:\s*(.+)\s*$/i);
    if (m && m[1]) return m[1].trim();
    return "Unlabeled query";
}

export class Agent {
    private provider: LLMProvider;
    private engine: TsQueryEngine;
    private model: string;

    constructor(args: {
        engine: TsQueryEngine;
        provider: LLMProvider;
        model?: string;
    }) {
        this.provider = args.provider;
        this.engine = args.engine;
        this.model = args.model ?? "gpt-4.1";
    }

    async analyze(args: {
        ctx: ProjectContext;
        systemInstructions: string;
        userQuestion: string;
        maxTurns?: number;
    }): Promise<{
        report: string;
        toolCallsTotal: number;
        toolCallsFailed: number;
        toolCallDetails: ToolCallDetail[];
    }> {
        const maxTurns = args.maxTurns ?? 12;

        let toolCallsTotal = 0;
        let toolCallsFailed = 0;
        const toolCallDetails: ToolCallDetail[] = [];

        let input: Array<any> = [
            {
                role: "user",
                content: args.userQuestion,
            },
        ];

        const tools: Array<any> = [
            {
                type: "function",
                name: "run_ts_query",
                description:
                    "Run a TypeScript query over the provided ProjectContext. Use to compute evidence. Keep outputs small (aggregates, top-N, summaries).",
                parameters: {
                    type: "object",
                    properties: {
                        script: {
                            type: "string",
                            description:
                                "TypeScript script exporting `run(ctx: ProjectContext)` and returning JSON-serializable output. First line should be: // PURPOSE: ...",
                        },
                    },
                    required: ["script"],
                    additionalProperties: false,
                },
                strict: true,
            },
        ];

        for (let turn = 1; turn <= maxTurns; turn++) {
            const response = await this.provider.createResponse({
                model: this.model,
                systemInstructions: args.systemInstructions,
                tools,
                input
            });

            const outputItems = response.outputItems ?? [];
            input = input.concat(outputItems);

            const calls: FunctionCallItem[] = outputItems.filter(isFunctionCallItem);
            toolCallsTotal += calls.length;

            if (calls.length === 0) {
                const finalText = response.outputText ?? "";
                return {
                    report: String(finalText).trim(),
                    toolCallsTotal,
                    toolCallsFailed,
                    toolCallDetails,
                };
            }

            for (const call of calls) {
                if (call.name !== "run_ts_query") {
                    toolCallsFailed += 1;

                    toolCallDetails.push({
                        callId: call.call_id,
                        toolName: call.name,
                        purpose: "Unknown tool",
                        ok: false,
                        resultBytes: 0,
                        error: `Unknown tool requested: ${call.name}`,
                    });

                    const unknownToolOutput: FunctionCallOutputItem = {
                        type: "function_call_output",
                        call_id: call.call_id,
                        output: JSON.stringify({
                            ok: false,
                            error: `Unknown tool requested: ${call.name}`,
                        }),
                    };
                    input.push(unknownToolOutput);
                    continue;
                }

                let script = "";
                try {
                    const parsed = JSON.parse(call.arguments);
                    script = parsed?.script;
                } catch {
                    toolCallsFailed += 1;

                    toolCallDetails.push({
                        callId: call.call_id,
                        toolName: call.name,
                        purpose: "Bad arguments JSON",
                        ok: false,
                        resultBytes: 0,
                        error:
                            "Invalid JSON arguments. Expected { script: string } for run_ts_query.",
                    });

                    const badArgsOutput: FunctionCallOutputItem = {
                        type: "function_call_output",
                        call_id: call.call_id,
                        output: JSON.stringify({
                            ok: false,
                            error:
                                "Invalid JSON arguments for run_ts_query. Expected { script: string }.",
                        }),
                    };
                    input.push(badArgsOutput);
                    continue;
                }

                if (typeof script !== "string" || script.trim().length === 0) {
                    toolCallsFailed += 1;

                    toolCallDetails.push({
                        callId: call.call_id,
                        toolName: call.name,
                        purpose: "Missing script",
                        ok: false,
                        resultBytes: 0,
                        error: "Missing or empty 'script' field.",
                    });

                    const missingScriptOutput: FunctionCallOutputItem = {
                        type: "function_call_output",
                        call_id: call.call_id,
                        output: JSON.stringify({
                            ok: false,
                            error:
                                "Missing or empty 'script' field for run_ts_query. Provide a non-empty TypeScript script string.",
                        }),
                    };
                    input.push(missingScriptOutput);
                    continue;
                }

                const purpose = extractPurposeFromScript(script);

                const res = await this.engine.runTsQuery(script, args.ctx);

                if (!res.ok) toolCallsFailed += 1;

                const outputJson = JSON.stringify(res);
                const resultBytes = Buffer.byteLength(outputJson, "utf8");

                toolCallDetails.push({
                    callId: call.call_id,
                    toolName: call.name,
                    purpose,
                    ok: res.ok,
                    resultBytes,
                    error: res.ok ? undefined : res.error,
                });

                const toolOutput: FunctionCallOutputItem = {
                    type: "function_call_output",
                    call_id: call.call_id,
                    output: outputJson,
                };
                input.push(toolOutput);
            }
        }

        return {
            report: `Stopped after maxTurns=${maxTurns} without a final answer. Consider increasing maxTurns or tightening the prompt.`,
            toolCallsTotal,
            toolCallsFailed,
            toolCallDetails,
        };
    }
}