import {PullRequest} from "../../GitHubAnalyzer/GitHubModels/PullRequest";
import {Issue} from "../../GitHubAnalyzer/GitHubModels/Issue";
import {Member} from "../../GitHubAnalyzer/GitHubModels/Member";
import {TeamInteraction} from "../../GitHubAnalyzer/GitHubMetricsCalculators/TeamAnalyzer";

export interface ProjectContext {
    pullRequests: PullRequest[];
    issues: Issue[];
    members: Member[];
    teamGraph: TeamInteraction;

    meta: {
        projectId?: string;
        generatedAtISO: string;
    };
}
