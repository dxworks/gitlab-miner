export class Export {
    noOfMembers?: number;
    noOfMergeRequests?: number;
    noOfOpenMergeRequests?: number;
    noOfClosedMergeRequests?: number;
    noOfLockedMergeRequests?: number;
    noOfMergedMergeRequests?: number;

    avgTimeUntilMergingAMergeRequestH?: number;
    avgTimeUntilMergingAMergeRequestD?: number;
    avgNoOfCommitsPerMergeRequest?: number;
    avgNoOfCommentsPerMergeRequest?: number;
    avgNoOfMergeRequestsPerDay?: number;
    avgNoOfMergeRequestsPerWeek?: number;
    avgNoOfMergedMergeRequestsPerDay?: number;
    avgNoOfMergedMergeRequestsPerWeek?: number;
    avgTimeUntilFirstInteractionD?: number;
    avgTimeUntilFirstInteractionH?: number;
    avgNoOfUnresolvedDiscussionsPerMergeRequest?: number;
    avgNoOfConflictsPerMergeRequest?: number;
    avgIssueResolveTimeD?: number;
    avgIssueResolveTimeH?: number;

    noOfIssues?: number;
    noOfClosedIssues?: number;
    noOfLockedIssues?: number;
    noOfOpenIssues?: number;
    noOfCriticalSeverityIssues?: number;
    noOfHighSeverityIssues?: number;
    noOfMediumSeverityIssues?: number;
    noOfLowSeverityIssues?: number;
    noOfUnknownSeverityIssues?: number;
}