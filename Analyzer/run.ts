import * as fs from 'fs/promises';
import { MergeRequest } from './Models/MergeRequest';
import { Member } from './Models/Member';
import { Export } from './Models/Export';
import {Issue} from "./Models/Issue";

export class MainClass {

    public differenceInDays(date1: Date, date2: Date): number {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const timeDifference = Math.abs(date2.getTime() - date1.getTime());
        //return Math.floor(timeDifference / millisecondsPerDay);
        return timeDifference / millisecondsPerDay;
    }

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
                noOfMergedMergeRequests: 0,
                noOfClosedWithoutMergeMergeRequests: 0,
                noOfAuthoredIssues: 0,
                noOfAllIssuesAuthored: 0,
                noOfClosedIssuesAuthored: 0,
                noOfLockedIssuesAuthored: 0,
                noOfOpenedIssuesAuthored: 0,
                noOfCriticalIssuesAuthored: 0,
                noOfHighIssuesAuthored: 0,
                noOfMediumIssuesAuthored: 0,
                noOfLowIssuesAuthored: 0,
                noOfUnknownIssuesAuthored: 0,
                avgNoOfNotesPerAuthoredMergeRequest: 0,
                avgNoOfDiscussionsPerAuthoredMergeRequest: 0,
                avgNoOfFilesChangedPerAuthoredMergeRequest: 0,
                avgNoOfChangesPerAuthoredMergeRequest: 0,
                avgNoOfAdditionsPerAuthoredMergeRequest: 0,
                avgNoOfDeletionsPerAuthoredMergeRequest: 0,
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

        // // Visualize mergeRequestsMap
        // console.log('Merge Requests Map:');
        // mergeRequestsMap.forEach((mergeRequest) => {
        //     console.log(mergeRequest.iid);
        //     console.log('Associated Assignees:', mergeRequest.assignees?.length);
        //     console.log('Associated Commenters:', mergeRequest.commenters?.length);
        //     console.log('Associated Committers:', mergeRequest.committers?.length);
        //     console.log('Associated Participants:', mergeRequest.participants?.length);
        //     console.log('Associated Reviewers:', mergeRequest.reviewers?.length);
        //     // mergeRequest.assignees?.forEach(member => {
        //     //     console.log(member.username);
        //     // });
        //     console.log('------------------');
        // });
        //
        // // Visualize membersMap
        // console.log('Members Map:');
        // membersMap.forEach((member) => {
        //     console.log(member.username);
        //     console.log('Associated Merge Requests:', member.mergeRequests?.length);
        //     console.log('Associated Issues:', member.issues?.length);
        //     // member.mergeRequests?.forEach(mergeRequest => {
        //     //     console.log(mergeRequest.iid);
        //     // });
        //     console.log('------------------');
        // });
        //
        // // Visualize IssuesMap
        // console.log('Issues Map:');
        // issuesMap.forEach((issue) => {
        //     console.log(issue.iid);
        //     console.log('Associated Assignees:', issue.assignees?.length);
        //     console.log('Associated Commenters:', issue.commenters?.length);
        //     console.log('Associated Participants:', issue.participants?.length);
        //     // mergeRequest.assignees?.forEach(member => {
        //     //     console.log(member.username);
        //     // });
        //     console.log('------------------');
        // });

        const exportData: Export = new Export();
        exportData.setMergeRequests(mergeRequestsMap.size);
        exportData.setNoOfIssues(issuesMap.size);
        exportData.setNoOfMembers(membersMap.size);

        let openCount: number = 0;
        let closedCount: number = 0;
        let mergedCount: number = 0;
        let totalLifetimeH: number = 0;
        let totalLifetimeD: number = 0;
        let commitCountSum: number = 0;
        let commentsSum: number = 0;
        let firstMergeRequestCreationData: Date | undefined;
        let lastMergeRequestCreationData: Date | undefined;
        let daysDifference: number = 0;
        let weeksDifference: number = 0;
        let createdAtTimestamp: number | undefined;
        let firstDiscussionTimestamp: number | undefined;
        let totalFirstInteractionLifetimeH: number = 0;
        let totalFirstInteractionLifetimeD: number = 0;
        let interactionCount: number = 0;
        let createdAtRaw: Date | undefined;
        let firstDiscussionRaw: Date | undefined;
        let noOfMergeRequestsWithDiscussions: number = 0;
        let unresolvedDiscussionsReport: number = 0;
        let withConflictsCount: number = 0;
        let shouldEqualMRClosed: number = 0;

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

                    //Average time until merging a merge request
                    if (mergeRequest.createdAt !== undefined && mergeRequest.mergedAt !== undefined && mergeRequest.mergedAt !== null && mergeRequest.createdAt !== null) {
                        let createdAtTimestamp = new Date(mergeRequest.createdAt).getTime();
                        let mergedAtTimestamp = new Date(mergeRequest.mergedAt).getTime();

                        let lifetimeH = mergedAtTimestamp - createdAtTimestamp;
                        let lifetimeD = this.differenceInDays(new Date(mergeRequest.createdAt), new Date(mergeRequest.mergedAt));
                        totalLifetimeH += lifetimeH;
                        totalLifetimeD += lifetimeD;

                        //First and last merge request creation date to calculate the average number of merge requests per day and per week
                        if (firstMergeRequestCreationData === undefined) {
                            firstMergeRequestCreationData = new Date(mergeRequest.createdAt);
                        }
                        lastMergeRequestCreationData = new Date(mergeRequest.createdAt);

                        shouldEqualMRClosed++;
                    }

                    break;
                default:
                    break;
            }

            commitCountSum += mergeRequest.commitCount ? mergeRequest.commitCount : 0;
            commentsSum += mergeRequest.userNotesCount ? mergeRequest.userNotesCount : 0;

            let createdAt = mergeRequest.createdAt;
            if (createdAt !== undefined) {
                createdAtRaw = new Date(createdAt);
                createdAtTimestamp = new Date(createdAt).getTime();
            }

            let firstDiscussionCreatedAt = mergeRequest.discussions?.at(0)?.createdAt;
            if (firstDiscussionCreatedAt !== undefined) {
                firstDiscussionRaw = new Date(firstDiscussionCreatedAt);
                firstDiscussionTimestamp = new Date(firstDiscussionCreatedAt).getTime();

                interactionCount++;
            }

            //Average time until first interaction
            if (firstDiscussionRaw !== undefined && createdAtRaw !== undefined) {
                let lifetime = this.differenceInDays(createdAtRaw, firstDiscussionRaw);
                totalFirstInteractionLifetimeD += lifetime;
            }
            if (firstDiscussionTimestamp !== undefined && createdAtTimestamp !== undefined) {
                let lifetime = firstDiscussionTimestamp - createdAtTimestamp;
                totalFirstInteractionLifetimeH += lifetime;
            }

            //Average number of unresolved discussions
            if (mergeRequest.discussions !== undefined) {
                let unresolvedDiscussions = 0;
                for (let discussion of mergeRequest.discussions) {
                    if (discussion.resolved === false) {
                        unresolvedDiscussions++;
                    }
                }
                if (unresolvedDiscussions > 0) {
                    unresolvedDiscussionsReport += unresolvedDiscussions / mergeRequest.discussions.length;
                }
                noOfMergeRequestsWithDiscussions++;
            }

            //Average number of conflicts per merge request
            if (mergeRequest.conflicts === true) {
                withConflictsCount++;
            }
        }

        exportData.setOpen(openCount);
        exportData.setClosed(closedCount);
        exportData.setMerged(mergedCount);

        const avgLifeHours: number = (totalLifetimeH / mergedCount) / (3600 * 1000);
        exportData.setAvgTimeUntilMergingAMergeRequestH(avgLifeHours);

        const avgLifeDays: number = (totalLifetimeD / mergedCount);
        exportData.setAvgTimeUntilMergingAMergeRequestD(avgLifeDays);

        const avgCommits: number = commitCountSum / (mergeRequestsMap.size);
        exportData.setAvgNoOfCommitsPerMergeRequest(avgCommits);

        const avgComments: number = commentsSum / (mergeRequestsMap.size);
        exportData.setAvgNoOfCommentsPerMergeRequest(avgComments);

        const avgFirstInteractionD: number = totalFirstInteractionLifetimeD / interactionCount;
        exportData.setAvgTimeUntilFirstInteractionD(avgFirstInteractionD);
        const avgFirstInteractionH: number = (totalFirstInteractionLifetimeH / interactionCount) / (3600 * 1000);
        exportData.setAvgTimeUntilFirstInteractionH(avgFirstInteractionH);

        const avgConflictsPerMergeRequest: number = withConflictsCount / openCount;
        exportData.setAvgNoOfConflictsPerMergeRequest(avgConflictsPerMergeRequest);

        if (firstMergeRequestCreationData !== undefined && lastMergeRequestCreationData !== undefined) {
            daysDifference = this.differenceInDays(firstMergeRequestCreationData, lastMergeRequestCreationData);
            weeksDifference = daysDifference / 7;
        }

        exportData.setAvgNoOfMergeRequestsPerDay(mergeRequestsMap.size / daysDifference);
        exportData.setAvgNoOfMergeRequestsPerWeek(mergeRequestsMap.size / weeksDifference);
        exportData.setAvgNoOfMergedMergeRequestsPerDay(mergedCount / daysDifference);
        exportData.setAvgNoOfMergedMergeRequestsPerWeek(mergedCount / weeksDifference);
        exportData.setAvgNoOfUnresolvedDiscussionsPerMergeRequest(unresolvedDiscussionsReport / noOfMergeRequestsWithDiscussions);

        //console.log(exportData);

        for (let [_, member] of membersMap) {
            let totalNotesCount: number = 0;
            let totalDiscussionsCount: number = 0;
            let totalFilesChanged: number = 0;
            let totalChanges: number = 0;
            let totalAdditions: number = 0;
            let totalDeletions: number = 0;

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

            for (let [_, issue] of issuesMap) {
                if (issue.author === member.username) {
                    member.noOfAuthoredIssues++;

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
        }

        let noOfCriticalIssuesAuthored: number = 0;
        let noOfHighIssuesAuthored: number = 0;
        let noOfMediumIssuesAuthored: number = 0;
        let noOfLowIssuesAuthored: number = 0;
        let noOfUnknownIssuesAuthored: number = 0;
        let totalIssuesLifetimeH: number = 0;
        let totalIssuesLifetimeD: number = 0;
        let noOfAllIssues: number = 0;
        let noOfClosedIssues: number = 0;
        let noOfLockedIssues: number = 0;
        let noOfOpenedIssues: number = 0;
        let shouldEqualIClosed = 0;
        for (let [_, issue] of issuesMap) {
            switch (issue.state) {
                case 'all':
                    noOfAllIssues++;
                    break;
                case 'closed':
                    noOfClosedIssues++;
                    break;
                case 'locked':
                    noOfLockedIssues++;
                    break;
                case 'opened':
                    noOfOpenedIssues++;
                    break;
                default:
                    break;
            }
            switch (issue.severity) {
                case 'CRITICAL':
                    noOfCriticalIssuesAuthored++;
                    break;
                case 'HIGH':
                    noOfHighIssuesAuthored++;
                    break;
                case 'LOW':
                    noOfLowIssuesAuthored++;
                    break;
                case 'MEDIUM':
                    noOfMediumIssuesAuthored++;
                    break;
                case 'UNKNOWN':
                    noOfUnknownIssuesAuthored++;
                    break;
                default:
                    break;
            }

            if (issue.createdAt !== undefined && issue.closedAt !== undefined && issue.closedAt !== null && issue.createdAt !== null) {
                let createdAt = issue.createdAt;
                let createdAtRaw = new Date(createdAt);
                let createdAtTimestamp = new Date(createdAt).getTime();

                let closedAt = issue.closedAt;
                let closedAtRaw = new Date(closedAt);
                let closedAtTimestamp = new Date(closedAt).getTime();

                let lifetimeH = closedAtTimestamp - createdAtTimestamp;
                let lifetimeD = this.differenceInDays(closedAtRaw, createdAtRaw);
                console.log('Lifetime in days:', issue.iid, lifetimeD);
                totalIssuesLifetimeH += lifetimeH;
                totalIssuesLifetimeD += lifetimeD;

                shouldEqualIClosed++;
            }
        }

        console.log('Should equal MR closed:', shouldEqualMRClosed);
        console.log('Should equal I closed:', shouldEqualIClosed);
        exportData.setAllIssues(noOfAllIssues);
        exportData.setClosedIssues(noOfClosedIssues);
        exportData.setLockedIssues(noOfLockedIssues);
        exportData.setOpenedIssues(noOfOpenedIssues);
        exportData.setCritical(noOfCriticalIssuesAuthored);
        exportData.setHigh(noOfHighIssuesAuthored);
        exportData.setMedium(noOfMediumIssuesAuthored);
        exportData.setLow(noOfLowIssuesAuthored);
        exportData.setUnknown(noOfUnknownIssuesAuthored);
        exportData.setAvgIssueResolveTimeD(totalIssuesLifetimeD / noOfClosedIssues);
        exportData.setAvgIssueResolveTimeH((totalIssuesLifetimeH / noOfClosedIssues) / (3600 * 1000));

        // Visualize membersMap
        console.log('Members Map:');
        membersMap.forEach((member) => {
            console.log(member.username);
            console.log('Associated(assigned to) Merge Requests:', member.mergeRequests?.length);
            console.log('Associated(assigned to) Issues:', member.issues?.length);
            console.log('#No of Authored Issues:', member.noOfAuthoredIssues);
            console.log('#No of All Issues Authored:', member.noOfAllIssuesAuthored);
            console.log('#No of Closed Issues Authored:', member.noOfClosedIssuesAuthored);
            console.log('#No of Locked Issues Authored:', member.noOfLockedIssuesAuthored);
            console.log('#No of Opened Issues Authored:', member.noOfOpenedIssuesAuthored);
            console.log('#No of Critical Severity Issues Authored:', member.noOfCriticalIssuesAuthored);
            console.log('#No of High Severity Issues Authored:', member.noOfHighIssuesAuthored);
            console.log('#No of Medium Severity Issues Authored:', member.noOfMediumIssuesAuthored);
            console.log('#No of Low Severity Issues Authored:', member.noOfLowIssuesAuthored);
            console.log('#No of Unknown Severity Issues Authored:', member.noOfUnknownIssuesAuthored);
            console.log('#No of Authored Merge Requests:', member.noOfAuthoredMergeRequests);
            console.log('#No of Merged Merge Requests:', member.noOfMergedMergeRequests);
            console.log('#No of Closed Without Merge Merge Requests:', member.noOfClosedWithoutMergeMergeRequests);
            console.log('Avg no of Notes per Authored MR:', member.avgNoOfNotesPerAuthoredMergeRequest);
            console.log('Avg no of Discussions per Authored MR:', member.avgNoOfDiscussionsPerAuthoredMergeRequest);
            console.log('Avg no of Files Changed per Authored MR:', member.avgNoOfFilesChangedPerAuthoredMergeRequest);
            console.log('Avg no of Changes per Authored MR:', member.avgNoOfChangesPerAuthoredMergeRequest);
            console.log('Avg no of Additions per Authored MR:', member.avgNoOfAdditionsPerAuthoredMergeRequest);
            console.log('Avg no of Deletions per Authored MR:', member.avgNoOfDeletionsPerAuthoredMergeRequest);
            console.log('------------------');
        });

        console.log(exportData);
    }
}