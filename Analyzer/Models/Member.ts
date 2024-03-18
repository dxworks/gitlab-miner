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
    noOfOthersMergeRequestsCommentedOn: number = 0;
    noOfMergedMergeRequests: number = 0;
    noOfAuthoredIssues: number = 0;
    noOfAllIssuesAuthored: number = 0;
    noOfClosedIssuesAuthored: number = 0;
    noOfLockedIssuesAuthored: number = 0;
    noOfOpenedIssuesAuthored: number = 0;
    noOfCriticalIssuesAuthored: number = 0;
    noOfHighIssuesAuthored: number = 0;
    noOfMediumIssuesAuthored: number = 0;
    noOfLowIssuesAuthored: number = 0;
    noOfUnknownIssuesAuthored: number = 0;
    noOfClosedWithoutMergeMergeRequests: number = 0;
    avgNoOfNotesPerAuthoredMergeRequest: number = 0;
    avgNoOfDiscussionsPerAuthoredMergeRequest: number = 0;
    avgNoOfFilesChangedPerAuthoredMergeRequest: number = 0;
    avgNoOfChangesPerAuthoredMergeRequest: number = 0;
    avgNoOfAdditionsPerAuthoredMergeRequest: number = 0;
    avgNoOfDeletionsPerAuthoredMergeRequest: number = 0;
    commentedOnOthersMergeRequestsProc: number = 0;
    avgNoOfNotesOnOthersMergeRequest: number = 0;
    commentedOnOwnMergeRequestsProc: number = 0;
    avgNoOfNotesOnAuthoredMergeRequest: number = 0;
    
    // setName(name: string): void {
    //     this.name = name;
    // }

    // setUsername(username: string): void {
    //     this.username = username;
    // }

    // setPublicEmail(publicEmail: string): void {
    //     this.publicEmail = publicEmail;
    // }

    // getName(name: string): string | undefined {
    //     return this.name = name;
    // }

    // getUsername(): string | undefined {
    //     return this.username;
    // }

    // getPublicEmail(): string | undefined {
    //     return this.publicEmail;
    // } 
}