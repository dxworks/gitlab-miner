import { Export } from "../GitHubModels/Export";
import { PullRequest } from "../GitHubModels/PullRequest";
import fs from "fs/promises";

export class PullRequestsAnalyzer {
    openCount: number | undefined = 0;
    closedCount: number | undefined = 0;
    mergedCount: number | undefined = 0;
    totalLifetimeH: number | undefined = 0;
    totalLifetimeD: number | undefined = 0;
    firstPullRequestCreationDate: Date | undefined;
    lastPullRequestCreationDate: Date | undefined;
    commitCountSum: number | undefined = 0;
    commentsSum: number | undefined = 0;
    interactionCount: number | undefined = 0;
    totalFirstInteractionLifetimeH: number | undefined = 0;
    totalFirstInteractionLifetimeD: number | undefined = 0;
    daysDifference: number | undefined = 0;
    weeksDifference: number | undefined = 0;
    totalComplexity: number = 0;
    minComplexity: number = Number.MAX_VALUE;
    maxComplexity: number = Number.MIN_VALUE;
    complexities: number[] = [];

    public async analyzePullRequests(exportData: Export, pullRequestsMap: Map<string, PullRequest>): Promise<void> {
        for (const [_, pullRequest] of pullRequestsMap) {
            switch (pullRequest.state) {
                case "OPEN":
                    this.openCount!++;
                    break;
                case "CLOSED":
                    this.closedCount!++;
                    break;
                case "MERGED":
                    this.mergedCount!++;
                    this.calculateLifetimeStatistics(pullRequest);
                    const prComplexity = this.calculatePullRequestComplexity(pullRequest);
                    this.totalComplexity += prComplexity;
                    this.complexities.push(prComplexity);
                    if (prComplexity < this.minComplexity) this.minComplexity = prComplexity;
                    if (prComplexity > this.maxComplexity) this.maxComplexity = prComplexity;
                    break;
                default:
                    break;
            }

            const commitCount = pullRequest.commits ? pullRequest.commits.length : 0;
            const commentCount = pullRequest.comments ? pullRequest.comments.length : 0;
            this.commitCountSum! += commitCount;
            this.commentsSum! += commentCount;

            this.calculateAverageTimeUntilFirstInteraction(pullRequest);
        }

        exportData.noOfOpenPullRequests = this.openCount;
        exportData.noOfClosedPullRequests = this.closedCount;
        exportData.noOfMergedPullRequests = this.mergedCount;
        exportData.avgTimeUntilMergingAPullRequestH =
            (this.totalLifetimeH! / this.mergedCount!) / (3600 * 1000);
        exportData.avgTimeUntilMergingAPullRequestD =
            this.totalLifetimeD! / this.mergedCount!;
        exportData.avgNoOfCommitsPerPullRequest =
            this.commitCountSum! / pullRequestsMap.size;
        exportData.avgNoOfCommentsPerPullRequest =
            this.commentsSum! / pullRequestsMap.size;
        exportData.avgTimeUntilFirstInteractionD =
            this.totalFirstInteractionLifetimeD! / this.interactionCount!;
        exportData.avgTimeUntilFirstInteractionH =
            (this.totalFirstInteractionLifetimeH! / this.interactionCount!) /
            (3600 * 1000);
        exportData.avgNoOfPullRequestsPerDay =
            pullRequestsMap.size / (this.daysDifference || 1);
        exportData.avgNoOfPullRequestsPerWeek =
            pullRequestsMap.size / (this.weeksDifference || 1);
        exportData.avgNoOfMergedPullRequestsPerDay =
            this.mergedCount! / (this.daysDifference || 1);
        exportData.avgNoOfMergedPullRequestsPerWeek =
            this.mergedCount! / (this.weeksDifference || 1);

        if (this.mergedCount === 0) {
            exportData.averagePRComplexity = 0;
            exportData.averagePRComplexityNormalized = 0;
        } else {
            const avg = this.totalComplexity / this.mergedCount!;
            exportData.averagePRComplexity = avg;

            const range = this.maxComplexity - this.minComplexity;

            if (range > 0 && this.complexities.length > 0) {
                const normalizedValues = this.complexities.map(c =>
                    (c - this.minComplexity) / range
                );

                const normalizedAvg =
                    normalizedValues.reduce((sum, val) => sum + val, 0) /
                    normalizedValues.length;

                exportData.averagePRComplexityNormalized = normalizedAvg;
            } else {
                exportData.averagePRComplexityNormalized = 0;
            }
        }

        const pullRequestsArray: PullRequest[] = Array.from(pullRequestsMap.values());
        await this.writePullRequestsToJsonFile(pullRequestsArray);
    }

    private calculateLifetimeStatistics(pullRequest: PullRequest): void {
        if (pullRequest.createdAt && pullRequest.mergedAt) {
            const createdAtTimestamp = new Date(pullRequest.createdAt).getTime();
            const mergedAtTimestamp = new Date(pullRequest.mergedAt).getTime();

            const lifetimeH = mergedAtTimestamp - createdAtTimestamp;
            const lifetimeD = this.differenceInDays(
                new Date(pullRequest.createdAt),
                new Date(pullRequest.mergedAt)
            );

            this.totalLifetimeH! += lifetimeH;
            this.totalLifetimeD! += lifetimeD;

            if (!this.firstPullRequestCreationDate) {
                this.firstPullRequestCreationDate = new Date(pullRequest.createdAt);
            }
            this.lastPullRequestCreationDate = new Date(pullRequest.createdAt);

            if (this.firstPullRequestCreationDate && this.lastPullRequestCreationDate) {
                this.daysDifference = this.differenceInDays(
                    this.firstPullRequestCreationDate,
                    this.lastPullRequestCreationDate
                );
                this.weeksDifference = this.daysDifference / 7;
            }
        }
    }

    private calculateAverageTimeUntilFirstInteraction(pullRequest: PullRequest): void {
        const createdAtRaw = pullRequest.createdAt
            ? new Date(pullRequest.createdAt)
            : undefined;
        const createdAtTimestamp = createdAtRaw?.getTime();

        const firstCommentDate =
            pullRequest.comments && pullRequest.comments.length > 0
                ? pullRequest.comments[0].createdAt
                : undefined;

        const firstReviewDate =
            pullRequest.reviews && pullRequest.reviews.length > 0
                ? pullRequest.reviews[0].submittedAt
                : undefined;

        const firstInteractionDateStr =
            firstCommentDate || firstReviewDate || undefined;

        if (firstInteractionDateStr && createdAtRaw && createdAtTimestamp) {
            const firstInteractionRaw = new Date(firstInteractionDateStr);
            const firstInteractionTimestamp = firstInteractionRaw.getTime();

            this.interactionCount!++;

            const lifetimeD = this.differenceInDays(createdAtRaw, firstInteractionRaw);
            this.totalFirstInteractionLifetimeD! += lifetimeD;

            const lifetimeH = firstInteractionTimestamp - createdAtTimestamp;
            this.totalFirstInteractionLifetimeH! += lifetimeH;
        }
    }

    private differenceInDays(date1: Date, date2: Date): number {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diff = Math.abs(date2.getTime() - date1.getTime());
        return diff / msPerDay;
    }

    private async writePullRequestsToJsonFile(pullRequests: PullRequest[]): Promise<void> {
        await fs.writeFile(
            `results/PullRequestsModel.json`,
            JSON.stringify(pullRequests, null, 2)
        );
    }

    private calculatePullRequestComplexity(pr: PullRequest): number {
        const commits = pr.commits ? pr.commits.length : 0;
        const changedFiles = pr.changedFiles ?? 0;
        const comments = pr.comments ? pr.comments.length : 0;
        const reviews = pr.reviews ? pr.reviews.length : 0;
        const assignees = pr.assignees ? pr.assignees.length : 0;

        let lifetimeDays = 0;
        if (pr.createdAt && pr.mergedAt) {
            const created = new Date(pr.createdAt).getTime();
            const merged = new Date(pr.mergedAt).getTime();
            lifetimeDays = (merged - created) / (1000 * 60 * 60 * 24);
        }

        const cappedLifetimeDays = Math.min(lifetimeDays, 14);

        const complexity =
            commits * 0.25 +
            cappedLifetimeDays * 0.2 +
            changedFiles * 0.2 +
            comments * 0.15 +
            reviews * 0.1 +
            assignees * 0.1;

        return complexity;
    }
}
