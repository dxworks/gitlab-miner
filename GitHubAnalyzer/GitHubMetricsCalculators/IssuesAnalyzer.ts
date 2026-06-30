import { Export } from "../GitHubModels/Export";
import { Issue } from "../GitHubModels/Issue";
import fs from "fs/promises";

export class IssuesAnalyzer {
    noOfClosedIssues: number | undefined = 0;
    noOfOpenIssues: number | undefined = 0;
    noOfLockedIssues: number | undefined = 0;
    noOfCriticalIssues: number | undefined = 0;
    noOfHighIssues: number | undefined = 0;
    noOfMediumIssues: number | undefined = 0;
    noOfLowIssues: number | undefined = 0;
    noOfUnknownIssues: number | undefined = 0;
    totalIssuesLifetimeH: number | undefined = 0;
    totalIssuesLifetimeD: number | undefined = 0;

    public async analyzeIssues(exportData: Export, issuesMap: Map<string, Issue>): Promise<void> {
        for (const [_, issue] of issuesMap) {
            switch (issue.state) {
                case "CLOSED":
                    this.noOfClosedIssues!++;
                    break;
                case "OPEN":
                    this.noOfOpenIssues!++;
                    break;
                default:
                    break;
            }

            const severityLabel = issue.labels
                ?.map((label) => label.name?.toLowerCase())
                .find((name) => name?.includes("severity"));

            if (severityLabel) {
                if (severityLabel.includes("critical")) this.noOfCriticalIssues!++;
                else if (severityLabel.includes("high")) this.noOfHighIssues!++;
                else if (severityLabel.includes("medium")) this.noOfMediumIssues!++;
                else if (severityLabel.includes("low")) this.noOfLowIssues!++;
                else this.noOfUnknownIssues!++;
            } else {
                this.noOfUnknownIssues!++;
            }

            this.calculateLifetimeStatistics(issue);
        }

        exportData.noOfClosedIssues = this.noOfClosedIssues;
        exportData.noOfLockedIssues = this.noOfLockedIssues;
        exportData.noOfOpenIssues = this.noOfOpenIssues;
        exportData.noOfCriticalSeverityIssues = this.noOfCriticalIssues;
        exportData.noOfHighSeverityIssues = this.noOfHighIssues;
        exportData.noOfMediumSeverityIssues = this.noOfMediumIssues;
        exportData.noOfLowSeverityIssues = this.noOfLowIssues;
        exportData.noOfUnknownSeverityIssues = this.noOfUnknownIssues;

        exportData.avgIssueResolveTimeD =
            this.noOfClosedIssues && this.noOfClosedIssues > 0
                ? this.totalIssuesLifetimeD! / this.noOfClosedIssues
                : 0;
        exportData.avgIssueResolveTimeH =
            this.noOfClosedIssues && this.noOfClosedIssues > 0
                ? (this.totalIssuesLifetimeH! / this.noOfClosedIssues) / (3600 * 1000)
                : 0;

        const issuesArray = Array.from(issuesMap.values());
        await this.writeIssuesToJsonFile(issuesArray);
    }

    private calculateLifetimeStatistics(issue: Issue): void {
        if (issue.createdAt && issue.closedAt) {
            const createdAt = new Date(issue.createdAt);
            const closedAt = new Date(issue.closedAt);

            const createdAtTimestamp = createdAt.getTime();
            const closedAtTimestamp = closedAt.getTime();

            const lifetimeH = closedAtTimestamp - createdAtTimestamp;
            const lifetimeD = this.differenceInDays(closedAt, createdAt);

            this.totalIssuesLifetimeH! += lifetimeH;
            this.totalIssuesLifetimeD! += lifetimeD;
        }
    }

    private differenceInDays(date1: Date, date2: Date): number {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diff = Math.abs(date2.getTime() - date1.getTime());
        return diff / msPerDay;
    }

    private async writeIssuesToJsonFile(issues: Issue[]): Promise<void> {
        await fs.writeFile(
            `results/IssuesModel.json`,
            JSON.stringify(issues, null, 2)
        );
    }
}
