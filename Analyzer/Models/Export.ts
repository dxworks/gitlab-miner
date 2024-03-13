export class Export { 
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
}