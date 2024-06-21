import fs from "fs/promises";
import {MergeRequest} from "./Models/MergeRequest";
import {Member} from "./Models/Member";
import {Issue} from "./Models/Issue";
import {MergeRequestsAnalyzer} from "./MetricsCalculators/MergeRequestsAnalyzer";
import {Export} from "./Models/Export";
import {IssuesAnalyzer} from "./MetricsCalculators/IssuesAnalyzer";
import {MembersAnalyzer} from "./MetricsCalculators/MembersAnalyzer";
import {TeamAnalyzer} from "./MetricsCalculators/TeamAnalyzer";

const folderPath = 'results';

export class Linker {
    mergeRequestAnalyzer: MergeRequestsAnalyzer = new MergeRequestsAnalyzer();
    issuesAnalyzer: IssuesAnalyzer = new IssuesAnalyzer();
    membersAnalyzer: MembersAnalyzer = new MembersAnalyzer();
    teamAnalyzer: TeamAnalyzer = new TeamAnalyzer();

    async parseFile(filename: string) {
        const data: string = await fs.readFile(filename, 'utf8');
        const jsonData = JSON.parse(data);

        let mergeRequestsMap: Map<String, MergeRequest> = new Map<String, MergeRequest>();
        let membersMap: Map<String, Member> = new Map<String, Member>();
        let issuesMap: Map<String, Issue> = new Map<String, Issue>();

        let teamGraphParameters = jsonData.teamGraphParameters;

        for (let mergeRequestData of jsonData.mergeRequests) {
            let mergeRequest: MergeRequest = {
                iid: mergeRequestData.iid,
                approvalsLeft: mergeRequestData.approvalsLeft,
                approvalsRequired: mergeRequestData.approvalsRequired,
                approved: mergeRequestData.approved,
                approvedBy: mergeRequestData.approvedBy,
                assignees: [],
                author: mergeRequestData.author,
                autoMergeEnabled: mergeRequestData.autoMergeEnabled,
                commenters: [],
                commitCount: mergeRequestData.commitCount,
                committers: [],
                conflicts: mergeRequestData.conflicts,
                createdAt: mergeRequestData.createdAt,
                description: mergeRequestData.description,
                diffStatsSummary: {
                    changes: mergeRequestData.diffStatsSummary.changes,
                    fileCount: mergeRequestData.diffStatsSummary.fileCount,
                    additions: mergeRequestData.diffStatsSummary.additions,
                    deletions: mergeRequestData.diffStatsSummary.deletions,
                },
                divergedFromTargetBranch: mergeRequestData.divergedFromTargetBranch,
                downvotes: mergeRequestData.downvotes,
                draft: mergeRequestData.draft,
                humanTimeEstimate: mergeRequestData.humanTimeEstimate,
                humanTotalTimeSpent: mergeRequestData.humanTotalTimeSpent,
                labels: mergeRequestData.labels,
                mergeError: mergeRequestData.mergeError,
                mergeOngoing: mergeRequestData.mergeOngoing,
                mergeStatusEnum: mergeRequestData.mergeStatusEnum,
                mergeUser: mergeRequestData.mergeUser,
                mergeable: mergeRequestData.mergeable,
                mergeableDiscussionsState: mergeRequestData.mergeableDiscussionsState,
                mergedAt: mergeRequestData.mergedAt,
                participants: [],
                preparedAt: mergeRequestData.preparedAt,
                reviewers: [],
                sourceBranch: mergeRequestData.sourceBranch,
                state: mergeRequestData.state,
                taskCompletionStatus: {
                    completedCount: mergeRequestData.completedCount,
                    count: mergeRequestData.count,
                },
                targetBranch: mergeRequestData.targetBranch,
                timeEstimate: mergeRequestData.timeEstimate,
                title: mergeRequestData.title,
                totalTimeSpent: mergeRequestData.totalTimeSpent,
                updatedAt: mergeRequestData.updatedAt,
                upvotes: mergeRequestData.upvotes,
                userDiscussionsCount: mergeRequestData.userDiscussionsCount,
                userNotesCount: mergeRequestData.userNotesCount,
                commits: mergeRequestData.commits,
                discussions: mergeRequestData.discussions,
            };
            mergeRequestsMap.set(mergeRequestData.iid, mergeRequest);
        }

        for (let memberData of jsonData.projectMembers) {
            let member: Member = {
                name: memberData.name,
                username: memberData.username,
                createdAt: memberData.createdAt,
                publicEmail: memberData.publicEmail,
                commitEmail: memberData.commitEmail,
                bot: memberData.bot,
                groupCount: memberData.groupCount,
                jobTitle: memberData.jobTitle,
                lastActivityOn: memberData.lastActivityOn,
                organization: memberData.organization,
                state: memberData.state,
                mergeRequests: [],
                issues: [],

                noOfAuthoredMergeRequests: 0,
                noOfOthersMergeRequests: 0,
                noOfAuthoredMergeRequestsWhereMemberCommented: 0,
                noOfOthersMergeRequestsWhereMemberCommented: 0,
                noOfMergedMergeRequests: 0,
                noOfClosedWithoutMergeMergeRequests: 0,
                noOfAuthoredIssues: 0,
                noOfClosedIssuesAuthored: 0,
                noOfLockedIssuesAuthored: 0,
                noOfOpenedIssuesAuthored: 0,
                noOfCriticalIssuesAuthored: 0,
                noOfHighIssuesAuthored: 0,
                noOfMediumIssuesAuthored: 0,
                noOfLowIssuesAuthored: 0,
                noOfUnknownIssuesAuthored: 0,
                avgNoOfDiscussionsPerAuthoredMergeRequest: 0,
                avgNoOfFilesChangedPerAuthoredMergeRequest: 0,
                avgNoOfChangesPerAuthoredMergeRequest: 0,
                avgNoOfAdditionsPerAuthoredMergeRequest: 0,
                avgNoOfDeletionsPerAuthoredMergeRequest: 0,
                avgNoOfNotesOnOthersMergeRequest: 0,
                commentedOnOthersMergeRequestsProc: 0,
                avgNoOfNotesOnAuthoredMergeRequest: 0,
                commentedOnOwnMergeRequestsProc: 0,

                totalNotesCount: 0,
                totalDiscussionsCount: 0,
                totalFilesChanged: 0,
                totalChanges: 0,
                totalAdditions: 0,
                totalDeletions: 0,
            };
            membersMap.set(memberData.username, member);
        }

        for (let issueData of jsonData.issues) {
            let issue: Issue = {
                iid: issueData.iid,
                assignees: [],
                author: issueData.author,
                blocked: issueData.blocked,
                blockedByCount: issueData.blockedByCount,
                blockingCount: issueData.blockingCount,
                closedAsDuplicateOf: issueData.closedAsDuplicateOf,
                closedAt: issueData.closedAt,
                commenters: [],
                createdAt: issueData.createdAt,
                description: issueData.description,
                downvotes: issueData.downvotes,
                dueDate: issueData.dueDate,
                hasEpic: issueData.hasEpic,
                healthStatus: issueData.healthStatus,
                humanTimeEstimate: issueData.humanTimeEstimate,
                humanTotalTimeSpent: issueData.humanTotalTimeSpent,
                iteration: issueData.iteration,
                labels: issueData.labels,
                mergeRequestsCount: issueData.mergeRequestsCount,
                moved: issueData.moved,
                movedTo: issueData.movedTo,
                participants: [],
                severity: issueData.severity,
                state: issueData.state,
                taskCompletionStatus: {
                    completedCount: issueData.completedCount,
                    count: issueData.count,
                },
                timeEstimate: issueData.timeEstimate,
                title: issueData.title,
                totalTimeSpent: issueData.totalTimeSpent,
                updatedAt: issueData.updatedAt,
                upvotes: issueData.upvotes,
                userNotesCount: issueData.userNotesCount,
                weight: issueData.weight,
                relatedMergeRequests: [],
                discussions: issueData.discussions,
            };
            issuesMap.set(issueData.iid, issue);
        }

        //MERGE REQUESTS
        for (let mergeRequestData of jsonData.mergeRequests) {
            let mergeRequest: MergeRequest | undefined = mergeRequestsMap.get(mergeRequestData.iid);
            if (!mergeRequest) {
                continue;
            }

            for (let assignee of mergeRequestData.assignees) {
                let member: Member | undefined = membersMap.get(assignee.username);
                if (member) {
                    mergeRequest.assignees?.push(member);
                    member.mergeRequests?.push(mergeRequest);
                }
            }

            for (let commenter of mergeRequestData.commenters) {
                let member: Member | undefined = membersMap.get(commenter.username);
                if (member) {
                    mergeRequest.commenters?.push(member);
                }
            }

            for (let committer of mergeRequestData.committers) {
                let member: Member | undefined = membersMap.get(committer.username);
                if (member) {
                    mergeRequest.committers?.push(member);
                }
            }
            for (let participant of mergeRequestData.participants) {
                let member: Member | undefined = membersMap.get(participant.username);
                if (member) {
                    mergeRequest.participants?.push(member);
                }
            }

            for (let reviewer of mergeRequestData.reviewers) {
                let member: Member | undefined = membersMap.get(reviewer.username);
                if (member) {
                    mergeRequest.reviewers?.push(member);
                }
            }
        }

        //ISSUES
        for (let issueData of jsonData.issues) {
            let issue: Issue | undefined = issuesMap.get(issueData.iid);
            if (!issue) {
                continue;
            }

            for (let assignee of issueData.assignees) {
                let member: Member | undefined = membersMap.get(assignee.username);
                if (member) {
                    issue.assignees?.push(member);
                    member.issues?.push(issue);
                }
            }

            for (let commenter of issueData.commenters) {
                let member: Member | undefined  = membersMap.get(commenter.username);
                if (member) {
                    issue.commenters?.push(member);
                }
            }

            for (let participant of issueData.participants) {
                let member: Member | undefined  = membersMap.get(participant.username);
                if (member) {
                    issue.participants?.push(member);
                }
            }
        }

        const exportData: Export = new Export();
        exportData.noOfMergeRequests = mergeRequestsMap.size;
        exportData.noOfIssues = issuesMap.size;
        exportData.noOfMembers = membersMap.size;

        this.mergeRequestAnalyzer.analyzeMergeRequests(exportData, mergeRequestsMap);
        this.issuesAnalyzer.analyzeIssues(exportData, issuesMap);
        this.membersAnalyzer.analyzeMembers(membersMap, mergeRequestsMap, issuesMap);
        this.teamAnalyzer.analyzeTeam(membersMap, mergeRequestsMap, issuesMap, teamGraphParameters);

        this.writeProjectMetricsToJsonFile(exportData);
        this.writeMergeRequestsTypes(exportData);
        this.writeIssuesTypes(exportData);
        this.writeIssuesSeverity(exportData);
    }

    private async writeProjectMetricsToJsonFile(exportData: Export) {
        fs.writeFile(`${folderPath}/ProjectMetrics.json`, JSON.stringify(exportData, null, 2));
    }

    private async writeMergeRequestsTypes(exportData: Export) {
         let values: any = {
             values: {
                 "Open Merge Requests": exportData.noOfOpenMergeRequests,
                 "Closed Merge Requests": exportData.noOfClosedMergeRequests,
                 "Merged Merge Requests": exportData.noOfMergedMergeRequests,
             }
        };
        fs.writeFile(`${folderPath}/MergeRequestsState.json`, JSON.stringify(values, null, 2));
    }

    private async writeIssuesTypes(exportData: Export) {
        let values: any = {
            values: {
                "Open Issues": exportData.noOfOpenIssues,
                "Closed Issues": exportData.noOfClosedIssues,
                "Locked Issues": exportData.noOfLockedIssues,
            }
        };
        fs.writeFile(`${folderPath}/IssuesState.json`, JSON.stringify(values, null, 2));
    }

    private async writeIssuesSeverity(exportData: Export) {
        let values: any = {
            headers: ["Issues - Severity Report"],
            values: {
                "Critical Severity Issues": [exportData.noOfCriticalSeverityIssues],
                "High Severity Issues": [exportData.noOfHighSeverityIssues],
                "Medium Severity Issues": [exportData.noOfMediumSeverityIssues],
                "Low Severity Issues": [exportData.noOfLowSeverityIssues],
                "Unknown Severity Issues": [exportData.noOfUnknownSeverityIssues],
            }
        };
        fs.writeFile(`${folderPath}/IssuesSeverity.json`, JSON.stringify(values, null, 2));
    }
}