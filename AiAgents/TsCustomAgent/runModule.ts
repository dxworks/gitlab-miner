import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { streamObject } from "stream-json/streamers/StreamObject";
import { TsQueryEngine } from "./TsQueryEngine";
import { ProjectContext } from "./ProjectContext";
import { Agent } from "./Agent";
import {
    buildSystemInstructions,
    loadQueryExamples,
    loadScriptContract,
} from "./Prompts";
import { buildUserPrompt } from "./UserPrompt";
import {
    MethodCRunMeta,
    summarizeContext,
    buildTranscript,
} from "./runMeta";
import { createProvider } from "./Providers/createProvider";

function getArg(flag: string): string | undefined {
    const idx = process.argv.indexOf(flag);
    if (idx >= 0 && idx + 1 < process.argv.length) return process.argv[idx + 1];
    return undefined;
}

function readLargeJsonFile(filepath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const result: Record<string, any> = {};

        const pipeline = chain([
            fsSync.createReadStream(filepath),
            parser(),
            streamObject(),
        ]);

        pipeline.on("data", ({ key, value }: { key: string; value: any }) => {
            result[key] = value;
        });

        pipeline.on("end", () => resolve(result));
        pipeline.on("error", (err: Error) => reject(err));
    });
}

async function main() {
    const ctxPath = getArg("--ctx") ?? "results/MethodC_Context.json";
    const outPath = getArg("--out") ?? "results/Method_C/MethodC_Report.md";
    const metaPath = getArg("--meta") ?? "results/Method_C/MethodC_RunMeta.json";
    const model = getArg("--model") ?? "gpt-5.5";
    const providerName = getArg("--provider") ?? "openai";

    const ctx = await readLargeJsonFile(path.resolve(ctxPath)) as ProjectContext;
    const provider = createProvider(providerName);

    const questionsText = await fs.readFile(
        path.resolve("AiAgents/TsCustomAgent/ResearchQuestions.md"),
        "utf8"
    );

    const scriptContract = await loadScriptContract();
    const queryExamples = await loadQueryExamples();

    const systemInstructions = buildSystemInstructions({
        scriptContract,
        queryExamples,
    });

    const userQuestion = buildUserPrompt({ questionsText });

    const engine = new TsQueryEngine({ timeoutMs: 5000, maxResultBytes: 800_000 });
    const agent = new Agent({
        engine,
        provider,
        model
    });

    const {
        report,
        toolCallsTotal,
        toolCallsFailed,
        toolCallDetails,
    } = await agent.analyze({
        ctx,
        systemInstructions,
        userQuestion,
        maxTurns: 14,
    });

    await fs.writeFile(path.resolve(outPath), report, "utf8");

    const meta: MethodCRunMeta = {
        method: "C",
        model,
        generatedAtISO: new Date().toISOString(),
        contextSummary: summarizeContext(ctx),
        toolCalls: { total: toolCallsTotal, failed: toolCallsFailed },
        toolCallTranscript: buildTranscript(toolCallDetails),
    };

    await fs.writeFile(
        path.resolve(metaPath),
        JSON.stringify(meta, null, 2),
        "utf8"
    );

    console.log(`✅ Method C report written to: ${outPath}`);
    console.log(`✅ Method C meta written to:   ${metaPath}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});