export class Export {
    noOfMembers?: number;
    noOfMergeRequests?: number;
    noOfOpenMergeRequests?: number;
    noOfClosedMergeRequests?: number;
    noOfMergedMergeRequests?: number;
    avgTimeUntilMergingAMergeRequestH?: number;
    avgTimeUntilMergingAMergeRequestD?: number;
    avgNoOfCommitsPerMergeRequest?: number;
    avgNoOfCommentsPerMergeRequest?: number;
    avgNoOfMergeRequestsPerDay?: number;
    avgNoOfMergeRequestsPerWeek?: number;
    avgNoOfMergedMergeRequestsPerDay?: number;
    avgNoOfMergedMergeRequestsPerWeek?: number;
    avgTimeUntilFirstInteractionD?: number;
    avgTimeUntilFirstInteractionH?: number;
    avgNoOfUnresolvedDiscussionsPerMergeRequest?: number;
    avgNoOfConflictsPerMergeRequest?: number;
    noOfIssues?: number;
    noOfAllIssues?: number;
    noOfClosedIssues?: number;
    noOfLockedIssues?: number;
    noOfOpenedIssues?: number;
    noOfCriticalSeverityIssues?: number;
    noOfHighSeverityIssues?: number;
    noOfMediumSeverityIssues?: number;
    noOfLowSeverityIssues?: number;
    noOfUnknownSeverityIssues?: number;
    avgIssueResolveTimeD?: number;
    avgIssueResolveTimeH?: number;

    public setMergeRequests(nr: number): void {
        this.noOfMergeRequests = nr;
    }

    public getMergeRequests(nr: number): number | undefined {
        return this.noOfMergeRequests;
    }

    public setOpen(nr: number): void {
        this.noOfOpenMergeRequests = nr;
    }

    public getOpen(nr: number): number | undefined {
        return this.noOfOpenMergeRequests;
    }

    public setClosed(nr: number): void {
        this.noOfClosedMergeRequests = nr;
    }

    public getClosed(nr: number): number | undefined {
        return this.noOfClosedMergeRequests;
    }

    public setMerged(nr: number): void {
        this.noOfMergedMergeRequests = nr;
    }

    public getMerged(nr: number): number | undefined {
        return this.noOfMergedMergeRequests;
    }

    public setAvgTimeUntilMergingAMergeRequestH(nr: number): void {
        this.avgTimeUntilMergingAMergeRequestH = nr;
    }

    public getAvgNoUntilMergingAMergeRequest(nr: number): number | undefined {
        return this.avgTimeUntilMergingAMergeRequestH;
    }

    public setAvgTimeUntilMergingAMergeRequestD(nr: number): void {
        this.avgTimeUntilMergingAMergeRequestD = nr;
    }

    public getAvgTimeUntilMergingAMergeRequestD(nr: number): number | undefined {
        return this.avgTimeUntilMergingAMergeRequestD;
    }

    public setAvgNoOfCommitsPerMergeRequest(nr: number): void {
        this.avgNoOfCommitsPerMergeRequest = nr;
    }

    public getAvgNoOfCommitsPerMergeRequest(nr: number): number | undefined {
        return this.avgNoOfCommitsPerMergeRequest;
    }

    public setAvgNoOfCommentsPerMergeRequest(nr: number): void {
        this.avgNoOfCommentsPerMergeRequest = nr;
    }

    public getAvgNoOfCommentsPerMergeRequest(nr: number): number | undefined {
        return this.avgNoOfCommentsPerMergeRequest;
    }

    public setAvgNoOfMergeRequestsPerDay(nr: number): void {
        this.avgNoOfMergeRequestsPerDay = nr;
    }

    public getAvgNoOfMergeRequestsPerDay(nr: number): number | undefined {
        return this.avgNoOfMergeRequestsPerDay;
    }

    public setAvgNoOfMergeRequestsPerWeek(nr: number): void {
        this.avgNoOfMergeRequestsPerWeek = nr;
    }

    public getAvgNoOfMergeRequestsPerWeek(nr: number): number | undefined {
        return this.avgNoOfMergeRequestsPerWeek;
    }

    public setAvgNoOfMergedMergeRequestsPerDay(nr: number): void {
        this.avgNoOfMergedMergeRequestsPerDay = nr;
    }

    public getAvgNoOfMergedMergeRequestsPerDay(nr: number): number | undefined {
        return this.avgNoOfMergedMergeRequestsPerDay;
    }

    public setAvgNoOfMergedMergeRequestsPerWeek(nr: number): void {
        this.avgNoOfMergedMergeRequestsPerWeek = nr;
    }

    public getAvgNoOfMergedMergeRequestsPerWeek(nr: number): number | undefined {
        return this.avgNoOfMergedMergeRequestsPerWeek;
    }

    public setAvgTimeUntilFirstInteractionD(nr: number): void {
        this.avgTimeUntilFirstInteractionD = nr;
    }

    public getAvgTimeUntilFirstInteractionD(nr: number): number | undefined {
        return this.avgTimeUntilFirstInteractionD;
    }
    public setAvgTimeUntilFirstInteractionH(nr: number): void {
        this.avgTimeUntilFirstInteractionH = nr;
    }

    public getAvgTimeUntilFirstInteractionH(nr: number): number | undefined {
        return this.avgTimeUntilFirstInteractionH;
    }
    public setAvgNoOfUnresolvedDiscussionsPerMergeRequest(nr: number): void {
        this.avgNoOfUnresolvedDiscussionsPerMergeRequest = nr;
    }

    public getAvgNoOfUnresolvedDiscussionsPerMergeRequest(nr: number): number | undefined {
        return this.avgNoOfUnresolvedDiscussionsPerMergeRequest;
    }

    public setAvgNoOfConflictsPerMergeRequest(nr: number): void {
        this.avgNoOfConflictsPerMergeRequest = nr;
    }

    public getAvgNoOfConflictsPerMergeRequest(nr: number): number | undefined {
        return this.avgNoOfConflictsPerMergeRequest;
    }

    public setNoOfIssues(nr: number): void {
        this.noOfIssues = nr;
    }

    public getNoOfIssues(nr: number): number | undefined {
        return this.noOfIssues;
    }

    public setCritical(nr: number): void {
        this.noOfCriticalSeverityIssues = nr;
    }

    public getCritical(nr: number): number | undefined {
        return this.noOfCriticalSeverityIssues;
    }

    public setHigh(nr: number): void {
        this.noOfHighSeverityIssues = nr;
    }

    public getHigh(nr: number): number | undefined {
        return this.noOfHighSeverityIssues;
    }

    public setMedium(nr: number): void {
        this.noOfMediumSeverityIssues = nr;
    }

    public getMedium(nr: number): number | undefined {
        return this.noOfMediumSeverityIssues;
    }

    public setLow(nr: number): void {
        this.noOfLowSeverityIssues = nr;
    }

    public getLow(nr: number): number | undefined {
        return this.noOfLowSeverityIssues;
    }

    public setUnknown(nr: number): void {
        this.noOfUnknownSeverityIssues = nr;
    }

    public getUnknown(nr: number): number | undefined {
        return this.noOfUnknownSeverityIssues;
    }

    public setNoOfMembers(nr: number): void {
        this.noOfMembers = nr;
    }

    public getNoOfMembers(nr: number): number | undefined {
        return this.noOfMembers;
    }

    public setAvgIssueResolveTimeD(nr: number): void {
        this.avgIssueResolveTimeD = nr;
    }

    public getAvgIssueResolveTimeD(nr: number): number | undefined {
        return this.avgIssueResolveTimeD;
    }

    public setAvgIssueResolveTimeH(nr: number): void {
        this.avgIssueResolveTimeH = nr;
    }

    public getAvgIssueResolveTimeH(nr: number): number | undefined {
        return this.avgIssueResolveTimeH;
    }

    public setAllIssues(nr: number): void {
        this.noOfAllIssues = nr;
    }

    public getAllIssues(nr: number): number | undefined {
        return this.noOfAllIssues;
    }

    public setClosedIssues(nr: number): void {
        this.noOfClosedIssues = nr;
    }

    public getClosedIssues(nr: number): number | undefined {
        return this.noOfClosedIssues;
    }

    public setLockedIssues(nr: number): void {
        this.noOfLockedIssues = nr;
    }

    public getLockedIssues(nr: number): number | undefined {
        return this.noOfLockedIssues;
    }

    public setOpenedIssues(nr: number): void {
        this.noOfOpenedIssues = nr;
    }

    public getOpenedIssues(nr: number): number | undefined {
        return this.noOfOpenedIssues;
    }
}