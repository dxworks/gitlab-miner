import * as fs from 'fs/promises';
import { MergeRequest } from './Models/MergeRequest';
import { Member } from './Models/Member';
import { Export } from './Models/Export';
import {Issue} from "./Models/Issue";
import {Label} from "./Models/Label";
import {Discussion} from "./Models/Discussion";

export class MainClass {

    async readFile(filename: string) {
        const data = await fs.readFile(filename, 'utf8');
        const jsonData = JSON.parse(data);

        let mergeRequestsMap = new Map<String, MergeRequest>();
        let membersMap = new Map<String, Member>();
        let issuesMap = new Map<String, Issue>();

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
                    changes: mergeRequestData.changes,
                    fileCount: mergeRequestData.fileCount,
                    additions: mergeRequestData.additions,
                    deletions: mergeRequestData.deletions,
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
                movedTo:issueData.movedTo,
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
            let mergeRequest = mergeRequestsMap.get(mergeRequestData.iid);
            if (!mergeRequest) {
                continue;
            }

            for (let assignee of mergeRequestData.assignees) {
                let member = membersMap.get(assignee.username);
                if (member) {
                    mergeRequest.assignees?.push(member);
                    member.mergeRequests?.push(mergeRequest);
                }
            }

            for (let commenter of mergeRequestData.commenters) {
                let member = membersMap.get(commenter.username);
                if (member) {
                    mergeRequest.commenters?.push(member);
                }
            }

            for (let committer of mergeRequestData.committers) {
                let member = membersMap.get(committer.username);
                if (member) {
                    mergeRequest.committers?.push(member);
                }
            }
            for (let participant of mergeRequestData.participants) {
                let member = membersMap.get(participant.username);
                if (member) {
                    mergeRequest.participants?.push(member);
                }
            }

            for (let reviewer of mergeRequestData.reviewers) {
                let member = membersMap.get(reviewer.username);
                if (member) {
                    mergeRequest.reviewers?.push(member);
                }
            }
        }

        //ISSUES
        for (let issueData of jsonData.issues) {
            let issue = issuesMap.get(issueData.iid);
            if (!issue) {
                continue;
            }

            for (let assignee of issueData.assignees) {
                let member = membersMap.get(assignee.username);
                if (member) {
                    issue.assignees?.push(member);
                    member.issues?.push(issue);
                }
            }

            for (let commenter of issueData.commenters) {
                let member = membersMap.get(commenter.username);
                if (member) {
                    issue.commenters?.push(member);
                }
            }

            for (let participant of issueData.participants) {
                let member = membersMap.get(participant.username);
                if (member) {
                    issue.participants?.push(member);
                }
            }
        }

        // Visualize mergeRequestsMap
        console.log('Merge Requests Map:');
        mergeRequestsMap.forEach((mergeRequest) => {
            console.log(mergeRequest.iid);
            console.log('Associated Assignees:', mergeRequest.assignees?.length);
            console.log('Associated Commenters:', mergeRequest.commenters?.length);
            console.log('Associated Committers:', mergeRequest.committers?.length);
            console.log('Associated Participants:', mergeRequest.participants?.length);
            console.log('Associated Reviewers:', mergeRequest.reviewers?.length);
            // mergeRequest.assignees?.forEach(member => {
            //     console.log(member.username);
            // });
            console.log('------------------');
        });

        // Visualize membersMap
        console.log('Members Map:');
        membersMap.forEach((member) => {
            console.log(member.username);
            console.log('Associated Merge Requests:', member.mergeRequests?.length);
            console.log('Associated Issues:', member.issues?.length);
            // member.mergeRequests?.forEach(mergeRequest => {
            //     console.log(mergeRequest.iid);
            // });
            console.log('------------------');
        });

        // Visualize IssuesMap
        console.log('Issues Map:');
        issuesMap.forEach((issue) => {
            console.log(issue.iid);
            console.log('Associated Assignees:', issue.assignees?.length);
            console.log('Associated Commenters:', issue.commenters?.length);
            console.log('Associated Participants:', issue.participants?.length);
            // mergeRequest.assignees?.forEach(member => {
            //     console.log(member.username);
            // });
            console.log('------------------');
        });

        const exportData = new Export();
        let openCount = 0;
        let closedCount = 0;
        let mergedCount = 0;
        let totalLifetime = 0;

        for (let [_, mergeRequest] of mergeRequestsMap) {
            switch (mergeRequest.state) {
                case 'opened':
                    openCount++;
                    break;
                case 'closed':
                    closedCount++;
                    break;
                case 'merged':
                    mergedCount++;

                    if (mergeRequest.createdAt !== undefined && mergeRequest.mergedAt !== undefined) {
                        let createdAtTimestamp = new Date(mergeRequest.createdAt).getTime();
                        let mergedAtTimestamp = new Date(mergeRequest.mergedAt).getTime();
                        let lifetime = mergedAtTimestamp - createdAtTimestamp;
                        totalLifetime += lifetime;
                    }

                    break;
                default:
                    break;
            }
        }

        exportData.setOpen(openCount);
        exportData.setClosed(closedCount);
        exportData.setMerged(mergedCount);

        const avgTime: number = (totalLifetime/mergedCount)/(3600 * 1000);
        exportData.setAvgNoUntilMergingAMergeRequest(avgTime);

        console.log(exportData);
        console.log(membersMap.size);
        console.log(mergeRequestsMap.size);
        console.log(issuesMap.size);
    }
}