export function buildUserPrompt(args: { questionsText: string }): string {
    return `
Analyze the project collaboration based ONLY on the provided ProjectContext.

IMPORTANT RULES:
- You MUST compute evidence using the tool run_ts_query before making claims.
- Keep tool outputs CONCISE and avoid dumping full arrays.
- Clearly separate: (A) Evidence (computed outputs) and (B) Interpretation.

PRE-FLIGHT (MANDATORY):
Before answering Q1–Q5, run TS queries that return:
- Which identifier fields are used for members and nested actors.
  (NOTE: Members typically use \`username\`, while PR/Issue nested actors use \`login\`.)
- Example keys for member/pr/issue/link objects.
- Top 5 by authored PRs, top 5 by PR comments, top 5 by PR reviews, top 5 by authored issues, etc. (computed from pullRequests, not from MembersModel).
- Counts: PRs with 0 comments; PRs with 0 reviews, etc..
YOU MUST INCLUDE THE PRE-FLIGHT RESULTS IN THE FINAL REPORT EVIDENCE SECTION.

TOOL USAGE STYLE:
- Prefer MULTIPLE SMALL QUERIES (2–6 tool calls) instead of one large script.
- Each tool call script MUST start with a single-line label:
  // PURPOSE: short description of what this query computes

Q4 OPERATIONALIZATION (METHOD C SPECIFIC):
- When analyzing PR complexity, EXPLICITLY state the metadata-based proxy used
  (e.g., changedFiles, commits count, comments, reviews) using ONLY metadata available in ctx.pullRequests.
- Then bucket PRs into LOW / MEDIUM / HIGH complexity (e.g., by quantiles).
- You MUST support the Q4 interpretation with at least one tool call output.
- You MUST state the complexity proxy formula used in the final report.

Answer the following questions in order:

${args.questionsText}

FINAL OUTPUT REQUIREMENTS:
- Provide one consolidated report.
- Include an "Overall collaboration assessment: LOW / MEDIUM / HIGH".
- Include a "Potential Strengths" section.
- Include "Confidence score: 0.0–1.0".
`.trim();
}