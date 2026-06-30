import { PullRequest } from "./PullRequest";
import { Issue } from "./Issue";

export class Member {
    username: string | undefined;
    name: string | undefined;
    url: string | undefined;
    avatarUrl: string | undefined;
    email: string | undefined;
    pullRequests: PullRequest[] | undefined;
    issues: Issue[] | undefined;

    noOfAuthoredPullRequests: number | undefined;
    noOfOthersPullRequests: number | undefined;
    noOfAuthoredPRsWhereMemberCommented: number | undefined;
    noOfOthersPRsWhereMemberCommented: number | undefined;
    noOfMergedPullRequests: number | undefined;
    noOfClosedWithoutMergePullRequests: number | undefined;

    noOfAuthoredIssues: number | undefined;
    noOfClosedIssuesAuthored: number | undefined;
    noOfOpenedIssuesAuthored: number | undefined;
    noOfLockedIssuesAuthored: number | undefined;
    noOfCriticalIssuesAuthored: number | undefined;
    noOfHighIssuesAuthored: number | undefined;
    noOfMediumIssuesAuthored: number | undefined;
    noOfLowIssuesAuthored: number | undefined;
    noOfUnknownIssuesAuthored: number | undefined;

    totalCommentsCount: number | undefined;
    totalReviewsCount: number | undefined;
    totalFilesChanged: number | undefined;
    totalCommits: number | undefined;
    totalAdditions: number | undefined;
    totalDeletions: number | undefined;

    avgNoOfReviewsPerAuthoredPullRequest: number | undefined;
    avgNoOfFilesChangedPerAuthoredPullRequest: number | undefined;
    avgNoOfCommitsPerAuthoredPullRequest: number | undefined;
    avgNoOfAdditionsPerAuthoredPullRequest: number | undefined;
    avgNoOfDeletionsPerAuthoredPullRequest: number | undefined;

    avgNoOfCommentsOnOthersPullRequest: number | undefined;
    commentedOnOthersPullRequestsProc: number | undefined;
    avgNoOfCommentsOnAuthoredPullRequest: number | undefined;
    commentedOnOwnPullRequestsProc: number | undefined;
}
