import { PullRequest } from "../../GitHubAnalyzer/GitHubModels/PullRequest";
import { Issue } from "../../GitHubAnalyzer/GitHubModels/Issue";
import { Member } from "../../GitHubAnalyzer/GitHubModels/Member";
import { TeamInteraction } from "../../GitHubAnalyzer/GitHubMetricsCalculators/TeamAnalyzer";
import { ProjectContext } from "./ProjectContext";

export function buildProjectContext(args: {
    pullRequestsMap: Map<string, PullRequest>;
    issuesMap: Map<string, Issue>;
    membersMap: Map<string, Member>;
    teamGraph: TeamInteraction;
    projectId?: string;
}): ProjectContext {
    return {
        pullRequests: Array.from(args.pullRequestsMap.values()),
        issues: Array.from(args.issuesMap.values()),
        members: Array.from(args.membersMap.values()),
        teamGraph: args.teamGraph,
        meta: {
            projectId: args.projectId,
            generatedAtISO: new Date().toISOString(),
        },
    };
}
