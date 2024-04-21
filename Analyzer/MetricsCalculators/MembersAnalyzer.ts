import {Issue} from "../Models/Issue";
import {MergeRequest} from "../Models/MergeRequest";
import {Member} from "../Models/Member";

export class MembersAnalyzer {
    public analyzeMembers(membersMap: Map<String, Member>, mergeRequestsMap: Map<String, MergeRequest>, issuesMap: Map<String, Issue>) {
        for (let [_, member] of membersMap) {
            let totalNotesCount: number = 0;
            let totalDiscussionsCount: number = 0;
            let totalFilesChanged: number = 0;
            let totalChanges: number = 0;
            let totalAdditions: number = 0;
            let totalDeletions: number = 0;
            let noOfMergeRequestsWhereMemberCommented: number = 0;
            let noOfNotesOnOthersMergeRequest: number = 0;
            let noOfAuthoredMergeRequestsWhereMemberCommented: number = 0;
            let noOfNotesOnAuthoredMergeRequest: number = 0;

            for (let [_, mergeRequest] of mergeRequestsMap) {
                if (mergeRequest.author === member.username) {
                    member.noOfAuthoredMergeRequests++;

                    if (mergeRequest.state === 'closed') {
                        member.noOfClosedWithoutMergeMergeRequests++;
                    }

                    if (mergeRequest.userNotesCount !== undefined) {
                        totalNotesCount += mergeRequest.userNotesCount;
                    }

                    if (mergeRequest.userDiscussionsCount !== undefined) {
                        totalDiscussionsCount += mergeRequest.userDiscussionsCount;
                    }

                    let mergeRequestResults = this.calculateMergeRequestStatistics(mergeRequest, totalFilesChanged, totalChanges, totalAdditions, totalDeletions);
                    totalFilesChanged = mergeRequestResults.totalFilesChanged;
                    totalChanges = mergeRequestResults.totalChanges;
                    totalAdditions = mergeRequestResults.totalAdditions;
                    totalDeletions = mergeRequestResults.totalDeletions;

                    let discussionsResults = this.calculateDiscussionRelatedStatistics(mergeRequest, member, noOfNotesOnAuthoredMergeRequest, noOfAuthoredMergeRequestsWhereMemberCommented);
                    noOfNotesOnAuthoredMergeRequest = discussionsResults.firstToIncrement;
                    noOfAuthoredMergeRequestsWhereMemberCommented = discussionsResults.secondToIncrement;
                }
                else {
                    member.noOfOthersMergeRequestsCommentedOn++;

                    let discussionsResults = this.calculateDiscussionRelatedStatistics(mergeRequest, member, noOfNotesOnOthersMergeRequest, noOfMergeRequestsWhereMemberCommented);
                    noOfNotesOnOthersMergeRequest = discussionsResults.firstToIncrement;
                    noOfMergeRequestsWhereMemberCommented = discussionsResults.secondToIncrement;
                }

                if (mergeRequest.mergeUser === member.username) {
                    member.noOfMergedMergeRequests++;
                }
            }

            if (member.noOfAuthoredMergeRequests !== 0) {
                member.avgNoOfNotesPerAuthoredMergeRequest = totalNotesCount / member.noOfAuthoredMergeRequests;
                member.avgNoOfDiscussionsPerAuthoredMergeRequest = totalDiscussionsCount / member.noOfAuthoredMergeRequests;
                member.avgNoOfFilesChangedPerAuthoredMergeRequest = totalFilesChanged / member.noOfAuthoredMergeRequests;
                member.avgNoOfChangesPerAuthoredMergeRequest = totalChanges / member.noOfAuthoredMergeRequests;
                member.avgNoOfAdditionsPerAuthoredMergeRequest = totalAdditions / member.noOfAuthoredMergeRequests;
                member.avgNoOfDeletionsPerAuthoredMergeRequest = totalDeletions / member.noOfAuthoredMergeRequests;
            }
            if (noOfAuthoredMergeRequestsWhereMemberCommented !== 0) {
                member.avgNoOfNotesOnAuthoredMergeRequest = noOfNotesOnAuthoredMergeRequest / noOfAuthoredMergeRequestsWhereMemberCommented;
                member.commentedOnOwnMergeRequestsProc = noOfAuthoredMergeRequestsWhereMemberCommented / member.noOfAuthoredMergeRequests;
            }
            if (noOfMergeRequestsWhereMemberCommented !== 0) {
                member.avgNoOfNotesOnOthersMergeRequest = noOfNotesOnOthersMergeRequest / noOfMergeRequestsWhereMemberCommented;
                member.commentedOnOthersMergeRequestsProc = noOfMergeRequestsWhereMemberCommented / member.noOfOthersMergeRequestsCommentedOn;
            }

            for (let [_, issue] of issuesMap) {
                if (issue.author === member.username) {
                    member.noOfAuthoredIssues++;
                    this.classifyIssue(issue, member);
                }
            }
        }
    }

    private calculateMergeRequestStatistics(mergeRequest: MergeRequest, totalFilesChanged: number, totalChanges: number, totalAdditions: number, totalDeletions: number) {
        if (mergeRequest.diffStatsSummary !== undefined) {
            if (mergeRequest.diffStatsSummary.fileCount !== undefined) {
                totalFilesChanged += mergeRequest.diffStatsSummary.fileCount;
            }
            if (mergeRequest.diffStatsSummary.changes !== undefined) {
                totalChanges += mergeRequest.diffStatsSummary.changes;
            }
            if (mergeRequest.diffStatsSummary.additions !== undefined) {
                totalAdditions += mergeRequest.diffStatsSummary.additions;
            }
            if (mergeRequest.diffStatsSummary.deletions !== undefined) {
                totalDeletions += mergeRequest.diffStatsSummary.deletions;
            }
        }

        return {
            totalFilesChanged,
            totalChanges,
            totalAdditions,
            totalDeletions
        }
    }

    private calculateDiscussionRelatedStatistics(mergeRequest: MergeRequest, member: Member, firstToIncrement: number, secondToIncrement: number) {
        if (mergeRequest.discussions !== undefined) {
            let commented: boolean = false;
            for (let discussion of mergeRequest.discussions) {
                if (discussion.notes !== undefined) {
                    for (let note of discussion.notes) {
                        if (note.author === member.username) {
                            firstToIncrement++;
                            commented = true;
                        }
                    }
                }
            }
            if (commented) {
                secondToIncrement++;
            }
        }

        return {
            firstToIncrement,
            secondToIncrement
        }
    }

    private classifyIssue(issue: Issue, member: Member) {
        switch (issue.state) {
            case 'all':
                member.noOfAllIssuesAuthored++;
                break;
            case 'closed':
                member.noOfClosedIssuesAuthored++;
                break;
            case 'locked':
                member.noOfLockedIssuesAuthored++;
                break;
            case 'opened':
                member.noOfOpenedIssuesAuthored++;
                break;
            default:
                break;
        }

        switch (issue.severity) {
            case 'CRITICAL':
                member.noOfCriticalIssuesAuthored++;
                break;
            case 'HIGH':
                member.noOfHighIssuesAuthored++;
                break;
            case 'LOW':
                member.noOfLowIssuesAuthored++;
                break;
            case 'MEDIUM':
                member.noOfMediumIssuesAuthored++;
                break;
            case 'UNKNOWN':
                member.noOfUnknownIssuesAuthored++;
                break;
            default:
                break;
        }
    }
}