import {Export} from "../Models/Export";
import {Issue} from "../Models/Issue";

export class IssuesAnalyzer {
    noOfAllIssues: number = 0;
    noOfClosedIssues: number = 0;
    noOfLockedIssues: number = 0;
    noOfOpenedIssues: number = 0;
    noOfCriticalIssues: number = 0;
    noOfHighIssues: number = 0;
    noOfMediumIssues: number = 0;
    noOfLowIssues: number = 0;
    noOfUnknownIssues: number = 0;
    totalIssuesLifetimeH: number = 0;
    totalIssuesLifetimeD: number = 0;

    public analyzeIssues(exportData: Export, issuesMap: Map<String, Issue>) {

        for (let [_, issue] of issuesMap) {
            switch (issue.state) {
                case 'all':
                    this.noOfAllIssues++;
                    break;
                case 'closed':
                    this.noOfClosedIssues++;
                    break;
                case 'locked':
                    this.noOfLockedIssues++;
                    break;
                case 'opened':
                    this.noOfOpenedIssues++;
                    break;
                default:
                    break;
            }

            switch (issue.severity) {
                case 'CRITICAL':
                    this.noOfCriticalIssues++;
                    break;
                case 'HIGH':
                    this.noOfHighIssues++;
                    break;
                case 'LOW':
                    this.noOfLowIssues++;
                    break;
                case 'MEDIUM':
                    this.noOfMediumIssues++;
                    break;
                case 'UNKNOWN':
                    this.noOfUnknownIssues++;
                    break;
                default:
                    break;
            }

            this.calculateLifetimeStatistics(issue);
        }

        exportData.noOfClosedIssues = this.noOfClosedIssues;
        exportData.noOfLockedIssues = this.noOfLockedIssues;
        exportData.noOfOpenIssues = this.noOfOpenedIssues;
        exportData.noOfCriticalSeverityIssues = this.noOfCriticalIssues;
        exportData.noOfHighSeverityIssues = this.noOfHighIssues;
        exportData.noOfMediumSeverityIssues = this.noOfMediumIssues;
        exportData.noOfLowSeverityIssues = this.noOfLowIssues;
        exportData.noOfUnknownSeverityIssues = this.noOfUnknownIssues;
        exportData.avgIssueResolveTimeD = (this.totalIssuesLifetimeD / this.noOfClosedIssues);
        exportData.avgIssueResolveTimeH = (this.totalIssuesLifetimeH / this.noOfClosedIssues) / (3600 * 1000);
    }

    private calculateLifetimeStatistics(issue: Issue) {
        if (issue.createdAt !== undefined && issue.closedAt !== undefined && issue.closedAt !== null && issue.createdAt !== null) {
            let createdAt: string = issue.createdAt;
            let createdAtRaw: Date = new Date(createdAt);
            let createdAtTimestamp: number = new Date(createdAt).getTime();

            let closedAt: string = issue.closedAt;
            let closedAtRaw: Date = new Date(closedAt);
            let closedAtTimestamp: number = new Date(closedAt).getTime();

            let lifetimeH: number = closedAtTimestamp - createdAtTimestamp;
            let lifetimeD: number = this.differenceInDays(closedAtRaw, createdAtRaw);

            this.totalIssuesLifetimeH += lifetimeH;
            this.totalIssuesLifetimeD += lifetimeD;
        }
    }

    private differenceInDays(date1: Date, date2: Date): number {
        const millisecondsPerDay: number = 1000 * 60 * 60 * 24;
        const timeDifference: number = Math.abs(date2.getTime() - date1.getTime());
        return timeDifference / millisecondsPerDay;
    }
}