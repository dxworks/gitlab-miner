import { MergeRequest } from "./MergeRequest";
import {Issue} from "./Issue";

export class Member {
    name?: string;
    username?: string;
    createdAt?: string;
    publicEmail?: string;
    commitEmail?: string;
    bot?: boolean;
    groupCount?: number;
    jobTitle?: string;
    lastActivityOn?: string;
    organization?: string;
    state?: string;
    mergeRequests?: MergeRequest[];
    issues?: Issue[];

    noOfAuthoredMergeRequests: number = 0;
    noOfMergedMergeRequests: number = 0;
    noOfClosedWithoutMergeMergeRequests: number = 0;
    noOfOthersMergeRequests: number = 0;
    noOfAuthoredMergeRequestsWhereMemberCommented: number = 0;
    noOfOthersMergeRequestsWhereMemberCommented: number = 0;
    noOfAuthoredIssues: number = 0;

    noOfClosedIssuesAuthored: number = 0;
    noOfLockedIssuesAuthored: number = 0;
    noOfOpenedIssuesAuthored: number = 0;
    noOfCriticalIssuesAuthored: number = 0;
    noOfHighIssuesAuthored: number = 0;
    noOfMediumIssuesAuthored: number = 0;
    noOfLowIssuesAuthored: number = 0;
    noOfUnknownIssuesAuthored: number = 0;

    //avgNoOfNotesPerAuthoredMergeRequest: number = 0;
    avgNoOfDiscussionsPerAuthoredMergeRequest: number = 0;
    avgNoOfFilesChangedPerAuthoredMergeRequest: number = 0;
    avgNoOfChangesPerAuthoredMergeRequest: number = 0;
    avgNoOfAdditionsPerAuthoredMergeRequest: number = 0;
    avgNoOfDeletionsPerAuthoredMergeRequest: number = 0;
    avgNoOfNotesOnOthersMergeRequest: number = 0;
    avgNoOfNotesOnAuthoredMergeRequest: number = 0;

    commentedOnOwnMergeRequestsProc: number = 0;
    commentedOnOthersMergeRequestsProc: number = 0;

    totalNotesCount: number = 0;
    totalDiscussionsCount: number = 0;
    totalFilesChanged: number = 0;
    totalChanges: number = 0;
    totalAdditions: number = 0;
    totalDeletions: number = 0;
}