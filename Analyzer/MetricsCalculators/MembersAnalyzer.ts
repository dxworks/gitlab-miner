import {Issue} from "../Models/Issue";
import {MergeRequest} from "../Models/MergeRequest";
import {Member} from "../Models/Member";
import fs from "fs/promises";

const folderPath = 'results/members';

export class MembersAnalyzer {

    public analyzeMembers(membersMap: Map<String, Member>, mergeRequestsMap: Map<String, MergeRequest>, issuesMap: Map<String, Issue>) {
        for (let [_, member] of membersMap) {
            let totalNotesCount: number = 0;
            let totalDiscussionsCount: number = 0;
            let totalFilesChanged: number = 0;
            let totalChanges: number = 0;
            let totalAdditions: number = 0;
            let totalDeletions: number = 0;
            let noOfOthersMergeRequestsWhereMemberCommented: number = 0;
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
                    member.noOfAuthoredMergeRequestsWhereMemberCommented = noOfAuthoredMergeRequestsWhereMemberCommented;
                }
                else {
                    member.noOfOthersMergeRequests++;

                    let discussionsResults = this.calculateDiscussionRelatedStatistics(mergeRequest, member, noOfNotesOnOthersMergeRequest, noOfOthersMergeRequestsWhereMemberCommented);
                    noOfNotesOnOthersMergeRequest = discussionsResults.firstToIncrement;
                    noOfOthersMergeRequestsWhereMemberCommented = discussionsResults.secondToIncrement;
                    member.noOfOthersMergeRequestsWhereMemberCommented = noOfOthersMergeRequestsWhereMemberCommented;
                }

                if (mergeRequest.mergeUser === member.username) {
                    member.noOfMergedMergeRequests++;
                }
            }

            member.totalNotesCount = totalNotesCount;
            member.totalDiscussionsCount = totalDiscussionsCount;
            member.totalFilesChanged = totalFilesChanged;
            member.totalChanges = totalChanges;
            member.totalAdditions = totalAdditions;
            member.totalDeletions = totalDeletions;

            if (member.noOfAuthoredMergeRequests !== 0) {
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
            if (noOfOthersMergeRequestsWhereMemberCommented !== 0) {
                member.avgNoOfNotesOnOthersMergeRequest = noOfNotesOnOthersMergeRequest / noOfOthersMergeRequestsWhereMemberCommented;
                member.commentedOnOthersMergeRequestsProc = noOfOthersMergeRequestsWhereMemberCommented / member.noOfOthersMergeRequests;
            }

            for (let [_, issue] of issuesMap) {
                if (issue.author === member.username) {
                    member.noOfAuthoredIssues++;
                    this.classifyIssue(issue, member);
                }
            }
        }

        const membersArray: Member[] = Array.from(membersMap.values());
        const toExportMembersArray: Member[] = membersArray.map((member: Member) => {
            member.mergeRequests = [];
            member.issues = [];
            return member;
        });
        this.writeMapToJsonFile(toExportMembersArray);

        let count: number = 0;

        for (let [_, member] of membersMap) {
            count++;
            this.writeGeneralStatisticsToJsonFile(member, count);
            this.authoredIssuesTypes(member, count);
            this.authoredIssuesSeverity(member, count);
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

    private async writeMapToJsonFile(membersArray: Member[]) {
        fs.writeFile(`${folderPath}/MembersModel.json`, JSON.stringify(membersArray, null, 2));
    }

    private async writeGeneralStatisticsToJsonFile  (member: Member, count: number) {
        let values: any = {
            headers: ["Member - Merge Requests Report"],
            values: {
                "Authored Merge Requests": [member.noOfAuthoredMergeRequests],
                "Merged Merge Request": [member.noOfMergedMergeRequests],
                "Closed Without Merge MRs": [member.noOfClosedWithoutMergeMergeRequests],
                "Authored MRs Commented On": [member.noOfAuthoredMergeRequestsWhereMemberCommented],
                "Others MRs Commented On": [member.noOfOthersMergeRequestsWhereMemberCommented],
            }
        };
        fs.writeFile(`${folderPath}/${count}_MRsGeneralReport.json`, JSON.stringify(values, null, 2));
    }

    private async authoredIssuesTypes (member: Member, count: number) {
        let values: any = {
            values: {
                "Opened Issues": member.noOfOpenedIssuesAuthored,
                "Closed Issues": member.noOfClosedIssuesAuthored,
                "Locked Issues": member.noOfLockedIssuesAuthored,
            }
        };
        fs.writeFile(`${folderPath}/${count}_AuthoredIssuesState.json`, JSON.stringify(values, null, 2));
    }

    private async authoredIssuesSeverity (member: Member, count: number) {
        let values: any = {
            headers: ["Authored Issues - Severity Report"],
            values: {
                "Critical Severity Issues": [member.noOfCriticalIssuesAuthored],
                "High Severity Issues": [member.noOfHighIssuesAuthored],
                "Medium Severity Issues": [member.noOfMediumIssuesAuthored],
                "Low Severity Issues": [member.noOfLowIssuesAuthored],
                "Unknown Severity Issues": [member.noOfUnknownIssuesAuthored],
            }
        };
        fs.writeFile(`${folderPath}/${count}_AuthoredIssuesSeverity.json`, JSON.stringify(values, null, 2));
    }
}