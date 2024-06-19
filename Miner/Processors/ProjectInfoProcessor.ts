import {GitLabGraphQLExtractor} from "../Extraction/GitLabGraphQLExtractor";
import {allData, writeDataToJsonFile} from "../../app";
import {ProjectInfo} from "../Types/ProjectInfo";

export class ProjectInfoProcessor {
    private extractor: GitLabGraphQLExtractor;

    constructor(extractor: GitLabGraphQLExtractor) {
        this.extractor = extractor;
    }

    async processProjectInfo() {
        let projectInfo: any = await this.extractor.getProjectInfo()
        let teamGraphParameters = await this.extractor.getGraphParameters();

        allData.projectInfo = this.mapProjectInfo(projectInfo);

        allData.teamGraphParameters.minLinkValue = teamGraphParameters.minLinkValue;
        allData.teamGraphParameters.minMemberLinks = teamGraphParameters.minMemberLinks;

        await writeDataToJsonFile();

        console.log(`\nQuery ProjectInfo result saved.`);

    }

    private mapProjectInfo(projectInfo: any): ProjectInfo {
        const project = projectInfo.project;
        return {
            id: project.id,
            name: project.name,
            archived: project.archived,
            codeCoverageSummary: {
                averageCoverage: project.codeCoverageSummary?.averageCoverage,
                coverageCount: project.codeCoverageSummary?.coverageCount,
                lastUpdatedOn: project.codeCoverageSummary?.lastUpdatedOn
            },
            createdAt: project.createdAt,
            description: project.description,
            fullPath: project.fullPath,
            group: {
                description: project.group?.description,
                fullName: project.group?.fullName,
                fullPath: project.group?.fullPath,
                projectsCount: project.group?.projectsCount,
                groupMembersCount: project.group?.groupMembersCount,
                id: project.group?.id,
                name: project.group?.name,
                stats: {
                    releaseStats: {
                        releasesCount: project.group?.stats?.releaseStats?.releasesCount,
                        releasesPercentage: project.group?.stats?.releaseStats?.releasesPercentage
                    }
                },
                visibility: project.group?.visibility
            },
            languages: project.languages || [],
            lastActivityAt: project.lastActivityAt,
            namespace: {
                description: project.namespace?.description,
                fullName: project.namespace?.fullName,
                fullPath: project.namespace?.fullPath,
                id: project.namespace?.id,
                name: project.namespace?.name,
                visibility: project.namespace?.visibility
            },
            openIssuesCount: project.openIssuesCount,
            openMergeRequestsCount: project.openMergeRequestsCount,
            statistics: {
                commitCount: project.statistics?.commitCount
            },
            repository: {
                diskPath: project.repository?.diskPath,
                empty: project.repository?.empty,
                exists: project.repository?.exists,
                rootRef: project.repository?.rootRef
            },
            topics: project.topics || [],
            visibility: project.visibility
        };
    }
}