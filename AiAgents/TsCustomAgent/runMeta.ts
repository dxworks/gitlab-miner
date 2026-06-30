import { ProjectContext } from "./ProjectContext";
import { ToolCallDetail } from "./Agent";

export interface MethodCRunMeta {
    method: "C";
    model: string;
    generatedAtISO: string;
    contextSummary: {
        pullRequests: number;
        issues: number;
        members: number;
        teamNodes: number;
        teamLinks: number;
        approxContextBytes: number;
    };
    toolCalls: {
        total: number;
        failed: number;
    };
    toolCallTranscript: Array<{
        toolName: string;
        purpose: string;
        ok: boolean;
        resultBytes: number;
        error?: string;
    }>;
}

export function summarizeContext(
    ctx: ProjectContext
): MethodCRunMeta["contextSummary"] {
    const approxContextBytes =
        (ctx.pullRequests?.length ?? 0) * 2000 +
        (ctx.issues?.length ?? 0) * 1000 +
        (ctx.members?.length ?? 0) * 500;
    return {
        pullRequests: ctx.pullRequests?.length ?? 0,
        issues: ctx.issues?.length ?? 0,
        members: ctx.members?.length ?? 0,
        teamNodes: ctx.teamGraph?.nodes?.length ?? 0,
        teamLinks: ctx.teamGraph?.links?.length ?? 0,
        approxContextBytes,
    };
}

export function buildTranscript(details: ToolCallDetail[]): MethodCRunMeta["toolCallTranscript"] {
    return details.map((d) => ({
        toolName: d.toolName,
        purpose: d.purpose,
        ok: d.ok,
        resultBytes: d.resultBytes,
        error: d.error,
    }));
}