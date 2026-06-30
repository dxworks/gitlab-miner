import * as esbuild from "esbuild";
import vm from "vm";
import {ProjectContext} from "./ProjectContext";

export type TsQueryResult =
    | { ok: true; result: any; stdout?: string }
    | { ok: false; error: string; details?: any };

export interface TsQueryEngineOptions {
    timeoutMs?: number;
    maxResultBytes?: number;
}

/**
 * Compiles a TS query script to JS and executes it against a provided context.
 *
 * Script contract:
 *   export function run(ctx: ProjectContext): any
 */
export class TsQueryEngine {
    private timeoutMs: number;
    private maxResultBytes: number;

    constructor(opts: TsQueryEngineOptions = {}) {
        this.timeoutMs = opts.timeoutMs ?? 3000;
        this.maxResultBytes = opts.maxResultBytes ?? 1_000_000;
    }

    async runTsQuery(scriptTs: string, ctx: ProjectContext): Promise<TsQueryResult> {
        try {
            const compiled = await esbuild.transform(scriptTs, {
                loader: "ts",
                format: "cjs",
                target: "es2020",
                sourcemap: false,
            });

            const sandbox: any = {
                module: { exports: {} },
                exports: {},
            };
            vm.createContext(sandbox);

            const wrappedCode = `"use strict";\n${compiled.code}`;

            const vmScript = new vm.Script(wrappedCode, {
                filename: "ts_query.js",
            });

            vmScript.runInContext(sandbox, { timeout: this.timeoutMs });

            const exported =
                sandbox.module?.exports && Object.keys(sandbox.module.exports).length
                    ? sandbox.module.exports
                    : sandbox.exports;

            const runFn = exported?.run;
            if (typeof runFn !== "function") {
                return {
                    ok: false,
                    error:
                        "Query script must export a function `run(ctx)` (e.g., `export function run(ctx: ProjectContext) { ... }`).",
                    details: { exportedKeys: exported ? Object.keys(exported) : [] },
                };
            }

            const result = runFn(ctx);

            const json = JSON.stringify(result);
            if (json.length > this.maxResultBytes) {
                return {
                    ok: false,
                    error: `Result too large (${json.length} bytes). Reduce output (e.g., top-N summaries instead of full lists).`,
                    details: { bytes: json.length, maxBytes: this.maxResultBytes },
                };
            }

            return { ok: true, result: JSON.parse(json) };
        } catch (err: any) {
            return {
                ok: false,
                error: err?.message ?? String(err),
                details: err,
            };
        }
    }
}
