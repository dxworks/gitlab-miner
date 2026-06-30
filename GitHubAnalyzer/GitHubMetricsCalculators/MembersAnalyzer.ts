import { Issue } from "../GitHubModels/Issue";
import { PullRequest } from "../GitHubModels/PullRequest";
import { Member } from "../GitHubModels/Member";
import fs from "fs/promises";

const folderPath = "results/members";

export class MembersAnalyzer {
    public async analyzeMembers(
        membersMap: Map<string, Member>,
        pullRequestsMap: Map<string, PullRequest>,
        issuesMap: Map<string, Issue>
    ): Promise<void> {
        for (const [_, member] of membersMap) {
            let totalCommentsCount: number = 0;
            let totalReviewsCount: number = 0;
            let totalFilesChanged: number = 0;
            let totalCommits: number = 0;
            let totalAdditions: number = 0;
            let totalDeletions: number = 0;
            let noOfOthersPRsWhereMemberCommented: number = 0;
            let noOfCommentsOnOthersPRs: number = 0;
            let noOfAuthoredPRsWhereMemberCommented: number = 0;
            let noOfCommentsOnAuthoredPRs: number = 0;

            for (const [_, pullRequest] of pullRequestsMap) {
                if (pullRequest.createdBy?.login === member.username) {
                    member.noOfAuthoredPullRequests =
                        (member.noOfAuthoredPullRequests ?? 0) + 1;

                    if (pullRequest.state?.toLowerCase() === "closed") {
                        member.noOfClosedWithoutMergePullRequests =
                            (member.noOfClosedWithoutMergePullRequests ?? 0) + 1;
                    }

                    totalCommentsCount += pullRequest.comments?.length ?? 0;
                    totalReviewsCount += pullRequest.reviews?.length ?? 0;

                    const stats = this.calculatePullRequestStatistics(
                        pullRequest,
                        totalFilesChanged,
                        totalCommits,
                        totalAdditions,
                        totalDeletions
                    );
                    totalFilesChanged = stats.totalFilesChanged;
                    totalCommits = stats.totalCommits;
                    totalAdditions = stats.totalAdditions;
                    totalDeletions = stats.totalDeletions;

                    const discussionStats = this.calculateInteractionStatistics(
                        pullRequest,
                        member,
                        noOfCommentsOnAuthoredPRs,
                        noOfAuthoredPRsWhereMemberCommented
                    );
                    noOfCommentsOnAuthoredPRs = discussionStats.firstToIncrement;
                    noOfAuthoredPRsWhereMemberCommented =
                        discussionStats.secondToIncrement;
                    member.noOfAuthoredPRsWhereMemberCommented =
                        noOfAuthoredPRsWhereMemberCommented;
                } else {
                    member.noOfOthersPullRequests =
                        (member.noOfOthersPullRequests ?? 0) + 1;

                    const discussionStats = this.calculateInteractionStatistics(
                        pullRequest,
                        member,
                        noOfCommentsOnOthersPRs,
                        noOfOthersPRsWhereMemberCommented
                    );
                    noOfCommentsOnOthersPRs = discussionStats.firstToIncrement;
                    noOfOthersPRsWhereMemberCommented =
                        discussionStats.secondToIncrement;
                    member.noOfOthersPRsWhereMemberCommented =
                        noOfOthersPRsWhereMemberCommented;
                }

                if (pullRequest.mergedBy?.login === member.username) {
                    member.noOfMergedPullRequests =
                        (member.noOfMergedPullRequests ?? 0) + 1;
                }
            }

            member.totalCommentsCount = totalCommentsCount;
            member.totalReviewsCount = totalReviewsCount;
            member.totalFilesChanged = totalFilesChanged;
            member.totalCommits = totalCommits;
            member.totalAdditions = totalAdditions;
            member.totalDeletions = totalDeletions;

            if ((member.noOfAuthoredPullRequests ?? 0) > 0) {
                member.avgNoOfReviewsPerAuthoredPullRequest =
                    totalReviewsCount / (member.noOfAuthoredPullRequests ?? 1);
                member.avgNoOfFilesChangedPerAuthoredPullRequest =
                    totalFilesChanged / (member.noOfAuthoredPullRequests ?? 1);
                member.avgNoOfCommitsPerAuthoredPullRequest =
                    totalCommits / (member.noOfAuthoredPullRequests ?? 1);
                member.avgNoOfAdditionsPerAuthoredPullRequest =
                    totalAdditions / (member.noOfAuthoredPullRequests ?? 1);
                member.avgNoOfDeletionsPerAuthoredPullRequest =
                    totalDeletions / (member.noOfAuthoredPullRequests ?? 1);
            }

            if (noOfAuthoredPRsWhereMemberCommented > 0) {
                member.avgNoOfCommentsOnAuthoredPullRequest =
                    noOfCommentsOnAuthoredPRs / noOfAuthoredPRsWhereMemberCommented;
                member.commentedOnOwnPullRequestsProc =
                    noOfAuthoredPRsWhereMemberCommented /
                    (member.noOfAuthoredPullRequests ?? 1);
            }
            if (noOfOthersPRsWhereMemberCommented > 0) {
                member.avgNoOfCommentsOnOthersPullRequest =
                    noOfCommentsOnOthersPRs / noOfOthersPRsWhereMemberCommented;
                member.commentedOnOthersPullRequestsProc =
                    noOfOthersPRsWhereMemberCommented /
                    (member.noOfOthersPullRequests ?? 1);
            }

            for (const [_, issue] of issuesMap) {
                if (issue.createdBy?.login === member.username) {
                    member.noOfAuthoredIssues = (member.noOfAuthoredIssues ?? 0) + 1;
                    this.classifyIssue(issue, member);
                }
            }
        }

        const membersArray: Member[] = Array.from(membersMap.values());
        const toExport: Member[] = membersArray.map((m: Member) => {
            m.pullRequests = [];
            m.issues = [];
            return m;
        });
        await this.writeMembersToJson(toExport);
        await this.writeMembersSummaryToJson(toExport);

        let count: number = 0;
        for (const [_, member] of membersMap) {
            count++;
            //await this.writeGeneralStats(member, count);
            //await this.writeAuthoredIssuesState(member, count);
            //await this.writeAuthoredIssuesSeverity(member, count);
        }
    }

    private calculatePullRequestStatistics(
        pullRequest: PullRequest,
        totalFilesChanged: number,
        totalCommits: number,
        totalAdditions: number,
        totalDeletions: number
    ) {
        if (pullRequest.commits) {
            totalCommits += pullRequest.commits.length;
            for (const commit of pullRequest.commits) {
                totalFilesChanged += commit.changedFiles ?? 0;
            }
        }

        if ((pullRequest as any).diffStatsSummary) {
            const stats = (pullRequest as any).diffStatsSummary;
            totalAdditions += stats.additions ?? 0;
            totalDeletions += stats.deletions ?? 0;
        }

        return {
            totalFilesChanged,
            totalCommits,
            totalAdditions,
            totalDeletions,
        };
    }

    private calculateInteractionStatistics(
        pullRequest: PullRequest,
        member: Member,
        firstToIncrement: number,
        secondToIncrement: number
    ) {
        let commented = false;

        if (pullRequest.comments) {
            for (const comment of pullRequest.comments) {
                if (comment.author?.login === member.username) {
                    firstToIncrement++;
                    commented = true;
                }
            }
        }

        if (pullRequest.reviews) {
            for (const review of pullRequest.reviews) {
                if (review.user?.login === member.username) {
                    firstToIncrement++;
                    commented = true;
                }
            }
        }

        if (commented) {
            secondToIncrement++;
        }

        return {
            firstToIncrement,
            secondToIncrement,
        };
    }

    private classifyIssue(issue: Issue, member: Member) {
        switch (issue.state?.toLowerCase()) {
            case "closed":
                member.noOfClosedIssuesAuthored =
                    (member.noOfClosedIssuesAuthored ?? 0) + 1;
                break;
            case "open":
                member.noOfOpenedIssuesAuthored =
                    (member.noOfOpenedIssuesAuthored ?? 0) + 1;
                break;
            case "locked":
                member.noOfLockedIssuesAuthored =
                    (member.noOfLockedIssuesAuthored ?? 0) + 1;
                break;
        }

        const severityLabel = issue.labels
            ?.map((label) => label.name?.toLowerCase())
            .find((name) => name?.includes("severity"));

        if (severityLabel) {
            if (severityLabel.includes("critical"))
                member.noOfCriticalIssuesAuthored =
                    (member.noOfCriticalIssuesAuthored ?? 0) + 1;
            else if (severityLabel.includes("high"))
                member.noOfHighIssuesAuthored =
                    (member.noOfHighIssuesAuthored ?? 0) + 1;
            else if (severityLabel.includes("medium"))
                member.noOfMediumIssuesAuthored =
                    (member.noOfMediumIssuesAuthored ?? 0) + 1;
            else if (severityLabel.includes("low"))
                member.noOfLowIssuesAuthored =
                    (member.noOfLowIssuesAuthored ?? 0) + 1;
            else
                member.noOfUnknownIssuesAuthored =
                    (member.noOfUnknownIssuesAuthored ?? 0) + 1;
        } else {
            member.noOfUnknownIssuesAuthored =
                (member.noOfUnknownIssuesAuthored ?? 0) + 1;
        }
    }

    private async writeMembersToJson(membersArray: Member[]): Promise<void> {
        await fs.writeFile(
            `${folderPath}/0_MembersModel.json`,
            JSON.stringify(membersArray, null, 2)
        );
    }

    private async writeMembersSummaryToJson(membersArray: Member[]): Promise<void> {
        const summary = membersArray.map(({ username, name, url, avatarUrl, email }) => ({
            username,
            name,
            url,
            avatarUrl,
            email,
        }));

        await fs.writeFile(
            `${folderPath}/0_MembersSummary.json`,
            JSON.stringify(summary, null, 2)
        );
    }

    private async writeGeneralStats(member: Member, count: number): Promise<void> {
        const values: any = {
            headers: ["Member - Pull Requests Report"],
            values: {
                "Authored Pull Requests": [member.noOfAuthoredPullRequests],
                "Merged Pull Requests": [member.noOfMergedPullRequests],
                "Closed Without Merge PRs": [member.noOfClosedWithoutMergePullRequests],
                "Authored PRs Commented On": [
                    member.noOfAuthoredPRsWhereMemberCommented,
                ],
                "Others PRs Commented On": [member.noOfOthersPRsWhereMemberCommented],
            },
        };
        await fs.writeFile(
            `${folderPath}/${count}_PRsGeneralReport.json`,
            JSON.stringify(values, null, 2)
        );
    }

    private async writeAuthoredIssuesState(
        member: Member,
        count: number
    ): Promise<void> {
        const values: any = {
            values: {
                "Opened Issues": member.noOfOpenedIssuesAuthored,
                "Closed Issues": member.noOfClosedIssuesAuthored,
                "Locked Issues": member.noOfLockedIssuesAuthored,
            },
        };
        await fs.writeFile(
            `${folderPath}/${count}_AuthoredIssuesState.json`,
            JSON.stringify(values, null, 2)
        );
    }

    private async writeAuthoredIssuesSeverity(
        member: Member,
        count: number
    ): Promise<void> {
        const values: any = {
            headers: ["Authored Issues - Severity Report"],
            values: {
                "Critical Severity Issues": [member.noOfCriticalIssuesAuthored],
                "High Severity Issues": [member.noOfHighIssuesAuthored],
                "Medium Severity Issues": [member.noOfMediumIssuesAuthored],
                "Low Severity Issues": [member.noOfLowIssuesAuthored],
                "Unknown Severity Issues": [member.noOfUnknownIssuesAuthored],
            },
        };
        await fs.writeFile(
            `${folderPath}/${count}_AuthoredIssuesSeverity.json`,
            JSON.stringify(values, null, 2)
        );
    }
}
