export class Export {
    noOfMembers?: number;
    noOfMergeRequests?: number;
    noOfOpenMergeRequests?: number;
    noOfClosedMergeRequests?: number;
    noOfLockedMergeRequests?: number;
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
    avgIssueResolveTimeD?: number;
    avgIssueResolveTimeH?: number;

    noOfIssues?: number;
    noOfClosedIssues?: number;
    noOfLockedIssues?: number;
    noOfOpenIssues?: number;
    noOfCriticalSeverityIssues?: number;
    noOfHighSeverityIssues?: number;
    noOfMediumSeverityIssues?: number;
    noOfLowSeverityIssues?: number;
    noOfUnknownSeverityIssues?: number;

    public setMergeRequests(nr: number): void {
        this.noOfMergeRequests = nr;
    }

    public setOpen(nr: number): void {
        this.noOfOpenMergeRequests = nr;
    }

    public setClosed(nr: number): void {
        this.noOfClosedMergeRequests = nr;
    }

    public setLocked(nr: number): void {
        this.noOfLockedMergeRequests = nr;
    }

    public setMerged(nr: number): void {
        this.noOfMergedMergeRequests = nr;
    }

    public setAvgTimeUntilMergingAMergeRequestH(nr: number): void {
        this.avgTimeUntilMergingAMergeRequestH = nr;
    }


    public setAvgTimeUntilMergingAMergeRequestD(nr: number): void {
        this.avgTimeUntilMergingAMergeRequestD = nr;
    }

    public setAvgNoOfCommitsPerMergeRequest(nr: number): void {
        this.avgNoOfCommitsPerMergeRequest = nr;
    }

    public setAvgNoOfCommentsPerMergeRequest(nr: number): void {
        this.avgNoOfCommentsPerMergeRequest = nr;
    }

    public setAvgNoOfMergeRequestsPerDay(nr: number): void {
        this.avgNoOfMergeRequestsPerDay = nr;
    }

    public setAvgNoOfMergeRequestsPerWeek(nr: number): void {
        this.avgNoOfMergeRequestsPerWeek = nr;
    }

    public setAvgNoOfMergedMergeRequestsPerDay(nr: number): void {
        this.avgNoOfMergedMergeRequestsPerDay = nr;
    }

    public setAvgNoOfMergedMergeRequestsPerWeek(nr: number): void {
        this.avgNoOfMergedMergeRequestsPerWeek = nr;
    }

    public setAvgTimeUntilFirstInteractionD(nr: number): void {
        this.avgTimeUntilFirstInteractionD = nr;
    }

    public setAvgTimeUntilFirstInteractionH(nr: number): void {
        this.avgTimeUntilFirstInteractionH = nr;
    }

    public setAvgNoOfUnresolvedDiscussionsPerMergeRequest(nr: number): void {
        this.avgNoOfUnresolvedDiscussionsPerMergeRequest = nr;
    }

    public setAvgNoOfConflictsPerMergeRequest(nr: number): void {
        this.avgNoOfConflictsPerMergeRequest = nr;
    }

    public setNoOfIssues(nr: number): void {
        this.noOfIssues = nr;
    }

    public setCritical(nr: number): void {
        this.noOfCriticalSeverityIssues = nr;
    }

    public setHigh(nr: number): void {
        this.noOfHighSeverityIssues = nr;
    }

    public setMedium(nr: number): void {
        this.noOfMediumSeverityIssues = nr;
    }

    public setLow(nr: number): void {
        this.noOfLowSeverityIssues = nr;
    }

    public setUnknown(nr: number): void {
        this.noOfUnknownSeverityIssues = nr;
    }

    public setNoOfMembers(nr: number): void {
        this.noOfMembers = nr;
    }

    public setAvgIssueResolveTimeD(nr: number): void {
        this.avgIssueResolveTimeD = nr;
    }

    public setAvgIssueResolveTimeH(nr: number): void {
        this.avgIssueResolveTimeH = nr;
    }

    public setClosedIssues(nr: number): void {
        this.noOfClosedIssues = nr;
    }

    public setLockedIssues(nr: number): void {
        this.noOfLockedIssues = nr;
    }

    public setOpenedIssues(nr: number): void {
        this.noOfOpenIssues = nr;
    }
}