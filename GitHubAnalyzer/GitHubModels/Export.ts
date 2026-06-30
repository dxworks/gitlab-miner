export class Export {
    noOfMembers: number | undefined;

    noOfMergeRequests: number | undefined;
    noOfOpenMergeRequests: number | undefined;
    noOfClosedMergeRequests: number | undefined;
    noOfLockedMergeRequests: number | undefined;
    noOfMergedMergeRequests: number | undefined;

    avgTimeUntilMergingAMergeRequestH: number | undefined;
    avgTimeUntilMergingAMergeRequestD: number | undefined;
    avgNoOfCommitsPerMergeRequest: number | undefined;
    avgNoOfCommentsPerMergeRequest: number | undefined;
    avgNoOfMergeRequestsPerDay: number | undefined;
    avgNoOfMergeRequestsPerWeek: number | undefined;
    avgNoOfMergedMergeRequestsPerDay: number | undefined;
    avgNoOfMergedMergeRequestsPerWeek: number | undefined;
    avgTimeUntilFirstInteractionD: number | undefined;
    avgTimeUntilFirstInteractionH: number | undefined;
    avgNoOfUnresolvedDiscussionsPerMergeRequest: number | undefined;
    avgNoOfConflictsPerMergeRequest: number | undefined;

    noOfPullRequests: number | undefined;
    noOfOpenPullRequests: number | undefined;
    noOfClosedPullRequests: number | undefined;
    noOfMergedPullRequests: number | undefined;

    avgTimeUntilMergingAPullRequestH: number | undefined;
    avgTimeUntilMergingAPullRequestD: number | undefined;
    avgNoOfCommitsPerPullRequest: number | undefined;
    avgNoOfCommentsPerPullRequest: number | undefined;
    avgNoOfPullRequestsPerDay: number | undefined;
    avgNoOfPullRequestsPerWeek: number | undefined;
    avgNoOfMergedPullRequestsPerDay: number | undefined;
    avgNoOfMergedPullRequestsPerWeek: number | undefined;
    avgTimeUntilFirstInteractionPullRequestD: number | undefined;
    avgTimeUntilFirstInteractionPullRequestH: number | undefined;

    avgIssueResolveTimeD: number | undefined;
    avgIssueResolveTimeH: number | undefined;

    noOfIssues: number | undefined;
    noOfClosedIssues: number | undefined;
    noOfLockedIssues: number | undefined;
    noOfOpenIssues: number | undefined;
    noOfCriticalSeverityIssues: number | undefined;
    noOfHighSeverityIssues: number | undefined;
    noOfMediumSeverityIssues: number | undefined;
    noOfLowSeverityIssues: number | undefined;
    noOfUnknownSeverityIssues: number | undefined;

    noOfTeamNodes: number | undefined;
    noOfTeamLinks: number | undefined;

    averagePRComplexity?: number;
    averagePRComplexityNormalized?: number;
}
