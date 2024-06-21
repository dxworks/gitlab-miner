import {Export} from "../Models/Export";
import {MergeRequest} from "../Models/MergeRequest";

export class MergeRequestsAnalyzer {
    openCount: number = 0;
    closedCount: number = 0;
    lockedCount: number = 0;
    mergedCount: number = 0;
    totalLifetimeH: number = 0;
    totalLifetimeD: number = 0;
    firstMergeRequestCreationData: Date | undefined;
    lastMergeRequestCreationData: Date | undefined;
    commitCountSum: number = 0;
    commentsSum: number = 0;
    noOfMergeRequestsWithDiscussions: number = 0;
    unresolvedDiscussionsReport: number = 0;
    withConflictsCount: number = 0;
    interactionCount: number = 0;
    totalFirstInteractionLifetimeH: number = 0;
    totalFirstInteractionLifetimeD: number = 0;
    daysDifference: number = 0;
    weeksDifference: number = 0;

    public analyzeMergeRequests(exportData: Export, mergeRequestsMap: Map<String, MergeRequest>) {

        for (let [_, mergeRequest] of mergeRequestsMap) {
            switch (mergeRequest.state) {
                case 'opened':
                    this.openCount++;
                    break;
                case 'closed':
                    this.closedCount++;
                    break;
                case 'locked':
                    this.lockedCount++;
                    break;
                case 'merged':
                    this.mergedCount++;
                    this.calculateLifetimeStatistics(mergeRequest);

                    break;
                default:
                    break;
            }

            this.commitCountSum += mergeRequest.commitCount ? mergeRequest.commitCount : 0;
            this.commentsSum += mergeRequest.userNotesCount ? mergeRequest.userNotesCount : 0;

            this.calculateAverageTimeUntilFirstInteraction(mergeRequest)
            this.calculateAverageNumberOfUnresolvedDiscussions(mergeRequest);
            this.calculateNoWithConflicts(mergeRequest);
        }

        exportData.noOfOpenMergeRequests = this.openCount;
        exportData.noOfClosedMergeRequests = this.closedCount;
        exportData.noOfLockedMergeRequests = this.lockedCount;
        exportData.noOfMergedMergeRequests = this.mergedCount;
        exportData.avgTimeUntilMergingAMergeRequestH = (this.totalLifetimeH / this.mergedCount) / (3600 * 1000);
        exportData.avgTimeUntilMergingAMergeRequestD = (this.totalLifetimeD / this.mergedCount);
        exportData.avgNoOfCommitsPerMergeRequest = (this.commitCountSum / (mergeRequestsMap.size));
        exportData.avgNoOfCommentsPerMergeRequest = (this.commentsSum / (mergeRequestsMap.size));
        exportData.avgTimeUntilFirstInteractionD = (this.totalFirstInteractionLifetimeD / this.interactionCount);
        exportData.avgTimeUntilFirstInteractionH = (this.totalFirstInteractionLifetimeH / this.interactionCount) / (3600 * 1000);
        exportData.avgNoOfConflictsPerMergeRequest = (this.withConflictsCount / this.openCount);
        exportData.avgNoOfMergeRequestsPerDay = (mergeRequestsMap.size / this.daysDifference);
        exportData.avgNoOfMergeRequestsPerWeek = (mergeRequestsMap.size / this.weeksDifference);
        exportData.avgNoOfMergedMergeRequestsPerDay = (this.mergedCount / this.daysDifference);
        exportData.avgNoOfMergedMergeRequestsPerWeek = (this.mergedCount / this.weeksDifference);
        exportData.avgNoOfUnresolvedDiscussionsPerMergeRequest = (this.unresolvedDiscussionsReport / this.noOfMergeRequestsWithDiscussions);
    }

    private calculateLifetimeStatistics(mergeRequest: MergeRequest) {
        if (mergeRequest.createdAt !== undefined && mergeRequest.mergedAt !== undefined && mergeRequest.mergedAt !== null && mergeRequest.createdAt !== null) {
            let createdAtTimestamp: number  = new Date(mergeRequest.createdAt).getTime();
            let mergedAtTimestamp: number  = new Date(mergeRequest.mergedAt).getTime();

            let lifetimeH: number  = mergedAtTimestamp - createdAtTimestamp;
            let lifetimeD: number  = this.differenceInDays(new Date(mergeRequest.createdAt), new Date(mergeRequest.mergedAt));

            this.totalLifetimeH += lifetimeH;
            this.totalLifetimeD += lifetimeD;

            if (this.firstMergeRequestCreationData === undefined) {
                this.firstMergeRequestCreationData = new Date(mergeRequest.createdAt);
            }
            this.lastMergeRequestCreationData = new Date(mergeRequest.createdAt);

            if (this.firstMergeRequestCreationData !== undefined && this.lastMergeRequestCreationData !== undefined) {
                this.daysDifference = this.differenceInDays(this.firstMergeRequestCreationData, this.lastMergeRequestCreationData);
                this.weeksDifference = this.daysDifference / 7;
            }
        }
    }

    private calculateAverageNumberOfUnresolvedDiscussions (mergeRequest: MergeRequest) {
        if (mergeRequest.discussions !== undefined) {
            let unresolvedDiscussions: number  = 0;
            for (let discussion of mergeRequest.discussions) {
                if (discussion.resolved === false) {
                    unresolvedDiscussions++;
                }
            }
            if (unresolvedDiscussions > 0) {
                this.unresolvedDiscussionsReport += unresolvedDiscussions / mergeRequest.discussions.length;
            }
            this.noOfMergeRequestsWithDiscussions++;
        }
    }

    private calculateNoWithConflicts(mergeRequest: MergeRequest) {
        if (mergeRequest.conflicts === true) {
            this.withConflictsCount++;
        }
    }

    private calculateAverageTimeUntilFirstInteraction(mergeRequest: MergeRequest) {
        let createdAt: string | undefined = mergeRequest.createdAt;
        let createdAtRaw: Date | undefined;
        let createdAtTimestamp: number | undefined;
        let firstAuthoredDiscussionRaw: Date | undefined;
        let firstAuthoredDiscussionTimestamp: number | undefined;

        if (createdAt !== undefined) {
            createdAtRaw = new Date(createdAt);
            createdAtTimestamp = new Date(createdAt).getTime();
        }

        let firstDiscussionCreatedAt: string | undefined = mergeRequest.discussions?.at(0)?.createdAt;
        if (firstDiscussionCreatedAt !== undefined) {
            firstAuthoredDiscussionRaw = new Date(firstDiscussionCreatedAt);
            firstAuthoredDiscussionTimestamp = new Date(firstDiscussionCreatedAt).getTime();

            this.interactionCount++;
        }

        if (firstAuthoredDiscussionRaw !== undefined && createdAtRaw !== undefined) {
            let lifetime: number  = this.differenceInDays(createdAtRaw, firstAuthoredDiscussionRaw);
            this.totalFirstInteractionLifetimeD += lifetime;
        }
        if (firstAuthoredDiscussionTimestamp !== undefined && createdAtTimestamp !== undefined) {
            let lifetime: number  = firstAuthoredDiscussionTimestamp - createdAtTimestamp;
            this.totalFirstInteractionLifetimeH += lifetime;
        }
    }

    private differenceInDays(date1: Date, date2: Date): number {
        const millisecondsPerDay: number = 1000 * 60 * 60 * 24;
        const timeDifference: number  = Math.abs(date2.getTime() - date1.getTime());
        return timeDifference / millisecondsPerDay;
    }
}