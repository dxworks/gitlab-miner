# TS Custom Agent Script Contract

A query script MUST be valid TypeScript and MUST export:
```ts
export function run(ctx: ProjectContext): any
```

## Rules

- The script must return JSON-serializable output only.
- The script must NOT use:
    - network
    - filesystem
    - environment variables
    - imports
- All results must be derived only from the provided `ctx` object.
- Team graph edge weight is stored in:
    - `link.value` (NOT `weight`)
- Prefer small, focused scripts that answer one analytical need at a time.
- Scripts must be deterministic (no randomness).
- Do not rely on current time; if time information is needed, use ctx.meta.generatedAtISO.


## Purpose

These scripts are used by an AI agent to compute evidence over the in-memory GitHub project context. The agent will then interpret the results in natural language.

**Any script that does not follow this contract is invalid.**
