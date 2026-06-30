import fs from "fs";
import fsPromises from "fs/promises";
import { parser } from "stream-json";
import { streamObject } from "stream-json/streamers/StreamObject";
import { chain } from "stream-chain";
import { PullRequest } from "./GitHubModels/PullRequest";
import { Issue } from "./GitHubModels/Issue";
import { Author } from "./GitHubModels/Author";
import { Member } from "./GitHubModels/Member";
import { Export } from "./GitHubModels/Export";
import { PullRequestsAnalyzer } from "./GitHubMetricsCalculators/PullRequestsAnalyzer";
import { IssuesAnalyzer } from "./GitHubMetricsCalculators/IssuesAnalyzer";
import { MembersAnalyzer } from "./GitHubMetricsCalculators/MembersAnalyzer";
import { TeamAnalyzer } from "./GitHubMetricsCalculators/TeamAnalyzer";
import { buildProjectContext } from "../AiAgents/TsCustomAgent/ContextBuilder";

const folderPath = "results";

export class GithubLinker {
    pullRequestAnalyzer: PullRequestsAnalyzer = new PullRequestsAnalyzer();
    issuesAnalyzer: IssuesAnalyzer = new IssuesAnalyzer();
    membersAnalyzer: MembersAnalyzer = new MembersAnalyzer();
    teamAnalyzer: TeamAnalyzer = new TeamAnalyzer();

    async parseFile(filename: string): Promise<void> {
        const jsonData = await this.readLargeJsonFile(filename);

        const pullRequestsMap: Map<string, PullRequest> = new Map();
        const issuesMap: Map<string, Issue> = new Map();
        const membersMap: Map<string, Member> = new Map();

        for (const prData of jsonData.pullRequests ?? []) {
            const pullRequest: PullRequest = {
                number: prData.number,
                title: prData.title,
                body: prData.body,
                changedFiles: prData.changedFiles,
                commits: prData.commits,
                createdAt: prData.createdAt,
                updatedAt: prData.updatedAt,
                mergedAt: prData.mergedAt,
                closedAt: prData.closedAt,
                state: prData.state,
                createdBy: prData.createdBy,
                comments: prData.comments,
                assignees: prData.assignees,
                labels: prData.labels,
                mergedBy: prData.mergedBy,
                reviews: prData.reviews,
                reviewRequests: prData.reviewRequests,
            };
            pullRequestsMap.set(String(prData.number), pullRequest);
            this.collectMembersFromPullRequest(prData, membersMap);
        }

        for (const issueData of jsonData.issues ?? []) {
            const issue: Issue = {
                number: issueData.number,
                title: issueData.title,
                body: issueData.body,
                state: issueData.state,
                createdAt: issueData.createdAt,
                updatedAt: issueData.updatedAt,
                closedAt: issueData.closedAt,
                createdBy: issueData.createdBy,
                comments: issueData.comments,
                assignees: issueData.assignees,
                labels: issueData.labels,
            };
            issuesMap.set(String(issueData.number), issue);
            this.collectMembersFromIssue(issueData, membersMap);
        }

        const exportData = new Export();
        exportData.noOfPullRequests = pullRequestsMap.size;
        exportData.noOfIssues = issuesMap.size;
        exportData.noOfMembers = membersMap.size;

        await this.pullRequestAnalyzer.analyzePullRequests(exportData, pullRequestsMap);
        await this.issuesAnalyzer.analyzeIssues(exportData, issuesMap);
        await this.membersAnalyzer.analyzeMembers(membersMap, pullRequestsMap, issuesMap);
        await this.teamAnalyzer.analyzeTeam(membersMap, pullRequestsMap, issuesMap, jsonData.teamGraphParameters ?? {});

        const methodCContext = buildProjectContext({
            pullRequestsMap,
            issuesMap,
            membersMap,
            teamGraph: this.teamAnalyzer.teamInteraction,
            projectId: jsonData.repository?.nameWithOwner
        });

        await this.writeLargeJsonFile(`${folderPath}/MethodC_Context.json`, methodCContext);
        await this.writeProjectMetricsToJsonFile(exportData);
    }

    private readLargeJsonFile(filename: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const result: Record<string, any> = {};

            const pipeline = chain([
                fs.createReadStream(filename),
                parser(),
                streamObject(),
            ]);

            pipeline.on("data", ({ key, value }: { key: string; value: any }) => {
                result[key] = value;
            });

            pipeline.on("end", () => resolve(result));
            pipeline.on("error", (err: Error) => reject(err));
        });
    }

    private async writeLargeJsonFile(filepath: string, data: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filepath);
            stream.on("error", reject);
            stream.on("finish", resolve);

            stream.write("{\n");
            const keys = Object.keys(data);
            keys.forEach((key, keyIndex) => {
                const keyStr = `  ${JSON.stringify(key)}: `;
                const value = data[key];

                if (Array.isArray(value)) {
                    stream.write(keyStr + "[\n");
                    value.forEach((item, i) => {
                        const itemStr = "    " + JSON.stringify(item);
                        stream.write(itemStr + (i < value.length - 1 ? ",\n" : "\n"));
                    });
                    stream.write("  ]" + (keyIndex < keys.length - 1 ? ",\n" : "\n"));
                } else {
                    const valueStr = JSON.stringify(value);
                    stream.write(keyStr + valueStr + (keyIndex < keys.length - 1 ? ",\n" : "\n"));
                }
            });
            stream.write("}\n");
            stream.end();
        });
    }

    private collectMembersFromPullRequest(pullRequestData: any, membersMap: Map<string, Member>): void {
        const users: (Author | undefined)[] = [
            pullRequestData.createdBy,
            pullRequestData.mergedBy,
            ...(pullRequestData.assignees ?? []),
            ...(pullRequestData.comments?.map((c: any) => c.author) ?? []),
            ...(pullRequestData.reviews?.map((r: any) => r.user) ?? []),
        ];

        for (const user of users) {
            if (user?.login && !membersMap.has(user.login)) {
                membersMap.set(user.login, this.createEmptyMember(user));
            }
        }
    }

    private collectMembersFromIssue(issueData: any, membersMap: Map<string, Member>): void {
        const users: (Author | undefined)[] = [
            issueData.createdBy,
            ...(issueData.assignees ?? []),
            ...(issueData.comments?.map((c: any) => c.author) ?? []),
        ];

        for (const user of users) {
            if (user?.login && !membersMap.has(user.login)) {
                membersMap.set(user.login, this.createEmptyMember(user));
            }
        }
    }

    private createEmptyMember(user: Author): Member {
        return {
            username: user.login,
            name: user.login,
            url: user.url,
            avatarUrl: user.avatarUrl,
            email: user.email,
            pullRequests: [],
            issues: [],
            noOfAuthoredPullRequests: 0,
            noOfMergedPullRequests: 0,
            noOfClosedWithoutMergePullRequests: 0,
            noOfOthersPullRequests: 0,
            noOfAuthoredIssues: 0,
            noOfClosedIssuesAuthored: 0,
            noOfOpenedIssuesAuthored: 0,
            noOfLockedIssuesAuthored: 0,
            noOfCriticalIssuesAuthored: 0,
            noOfHighIssuesAuthored: 0,
            noOfMediumIssuesAuthored: 0,
            noOfLowIssuesAuthored: 0,
            noOfUnknownIssuesAuthored: 0,
            noOfAuthoredPRsWhereMemberCommented: undefined,
            noOfOthersPRsWhereMemberCommented: undefined,
            totalCommentsCount: undefined,
            totalReviewsCount: undefined,
            totalFilesChanged: undefined,
            totalCommits: undefined,
            totalAdditions: undefined,
            totalDeletions: undefined,
            avgNoOfReviewsPerAuthoredPullRequest: undefined,
            avgNoOfFilesChangedPerAuthoredPullRequest: undefined,
            avgNoOfCommitsPerAuthoredPullRequest: undefined,
            avgNoOfAdditionsPerAuthoredPullRequest: undefined,
            avgNoOfDeletionsPerAuthoredPullRequest: undefined,
            avgNoOfCommentsOnOthersPullRequest: undefined,
            commentedOnOthersPullRequestsProc: undefined,
            avgNoOfCommentsOnAuthoredPullRequest: undefined,
            commentedOnOwnPullRequestsProc: undefined,
        };
    }

    private async writeProjectMetricsToJsonFile(exportData: Export): Promise<void> {
        await fsPromises.writeFile(
            `${folderPath}/ProjectMetrics.json`,
            JSON.stringify(exportData, null, 2)
        );
    }
}