export type ProjectInfo = {
    id: string;
    name: string;
    archived: boolean;
    codeCoverageSummary: {
        averageCoverage: number;
        coverageCount: number;
        lastUpdatedOn: string;
    };
    createdAt: string;
    description: string;
    fullPath: string;
    group: {
        description: string;
        fullName: string;
        fullPath: string;
        projectsCount: number;
        groupMembersCount: number;
        id: string;
        name: string;
        stats: {
            releaseStats: {
                releasesCount: number;
                releasesPercentage: number;
            }
        };
        visibility: string;
    };
    languages: { name: string; share: number }[];
    lastActivityAt: string;
    namespace: {
        description: string;
        fullName: string;
        fullPath: string;
        id: string;
        name: string;
        visibility: string;
    };
    openIssuesCount: number;
    openMergeRequestsCount: number;
    statistics: {
        commitCount: number;
    };
    repository: {
        diskPath: string;
        empty: boolean;
        exists: boolean;
        rootRef: string;
    };
    topics: string[];
    visibility: string;
};