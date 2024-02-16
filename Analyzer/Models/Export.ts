export class Export { 
    noOfOpenMergeRequests?: number;
    noOfClosedMergeRequests?: number;
    noOfMergedMergeRequests?: number;
    avgNoUntilMergingAMergeRequest?: number;

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

    public setAvgNoUntilMergingAMergeRequest(nr: number): void {
        this.avgNoUntilMergingAMergeRequest = nr;
    }

    public getAvgNoUntilMergingAMergeRequest(nr: number): number | undefined {
        return this.avgNoUntilMergingAMergeRequest;
    }
}