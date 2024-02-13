import { GitLabGraphQLExtractor } from "../Extractors/GitLabGraphQLExtractor";
import * as fs from 'fs/promises';
import { Issue } from "../Types/Issue";
import { User } from "../Types/User";
import { ProjectInfo } from "../Types/ProjectInfo";
import { Note } from "../Types/Note";
import { Discussion } from "../Types/Discussion";

export class MergeRequestsProcessor { 
    private extractor: GitLabGraphQLExtractor;

    constructor(extractor: GitLabGraphQLExtractor) {
        this.extractor = extractor;
    }

    async processMergeRequests(endCursor: string | null) { 
        let allMergeRequests: any[] = [];
        let hasNextPage = true;
        let cnt = 0;

        while(hasNextPage) {
            let newMergeRequests: any = await this.extractor.getMergeRequests(endCursor);
            allMergeRequests = allMergeRequests.concat(newMergeRequests.mergeRequests);

            const filename = `MergeRequests_test_test.json`;
            await fs.appendFile(filename, JSON.stringify(newMergeRequests.mergeRequests, null, 2)+ '\n');

            console.log(`Query MergeRequests result saved to ${filename}`);
            cnt++;

            endCursor = JSON.stringify(newMergeRequests.endCursor);
            hasNextPage = newMergeRequests.hasNextPage;
        }
        console.log(cnt);
        return cnt;
    }

    async processIssues(endCursor: string | null) { 
        let allIssues: any[] = [];
        let hasNextPage = true;
        let cnt = 0;

        while(hasNextPage) {
            let newIssues = await this.extractor.getIssues(endCursor);
            allIssues = allIssues.concat(newIssues.issues);

            let mappedIssues: Issue[] = [];

            for (let edge of newIssues.issues.edges) {
                let issue = edge.node;
                mappedIssues.push(this.mapIssue(issue));
            }

            const filename = `IssuesMapped_test_test.json`;
            await fs.appendFile(filename, JSON.stringify(mappedIssues, null, 2)+ '\n');

            console.log(`Query Issues result saved to ${filename}`);
            cnt++;

            endCursor = JSON.stringify(newIssues.endCursor);
            hasNextPage = newIssues.hasNextPage;
        }

        console.log(cnt);
        return cnt;
    }

    private mapIssue(issue: any): Issue {
        return {
            assignees: issue.assignees.nodes.map((assignee: any) => assignee.id),
            author: issue.author.id,
            blocked: issue.blocked,
            blockedByCount: issue.blockedByCount,
            blockingCount: issue.blockingCount,
            closedAsDuplicateOf: issue.closedAsDuplicateOf?.iid,
            closedAt: issue.closedAt,
            commenters: issue.commenters.nodes.map((commenter: any) => commenter.id),
            confidential: issue.confidential,
            createNoteEmail: issue.createNoteEmail,
            createdAt: issue.createdAt,
            description: issue.description,
            discussionLocked: issue.discussionLocked,
            discussions: issue.discussions.nodes.map((discussion: any) => this.mapDiscussion(discussion)),
            downvotes: issue.downvotes,
            dueDate: issue.dueDate,
            epic: issue.epic?.iid,
            hasEpic: issue.hasEpic,
            healthStatus: issue.healthStatus,
            humanTimeEstimate: issue.humanTimeEstimate,
            humanTotalTimeSpent: issue.humanTotalTimeSpent,
            id: issue.id,
            iid: issue.iid,
            iteration: issue.iteration?.iid,
            labels: issue.labels,
            mergeRequestsCount: issue.mergeRequestsCount,
            moved: issue.moved,
            movedTo: issue.movedTo?.iid,
            participants: issue.participants.nodes.map((participant: any) => participant.id),
            severity: issue.severity,
            state: issue.state,
            taskCompletionStatus: issue.taskCompletionStatus,
            timeEstimate: issue.timeEstimate,
            timelogs: issue.timelogs.nodes.map((timelog: any) => timelog.timeSpent),
            title: issue.title,
            totalTimeSpent: issue.totalTimeSpent,
            updatedAt: issue.updatedAt,
            upvotes: issue.upvotes,
            userNotesCount: issue.userNotesCount,
            relatedMergeRequests: issue.relatedMergeRequests?.map((mergeRequest: { iid: any; }) => mergeRequest.iid)
        };
    }

    private mapDiscussion(discussion: any): Discussion {
        return {
            createdAt: discussion.createdAt,
            id: discussion.id,
            notes: discussion.notes.nodes.map((note: any) => this.mapNote(note)),
            replyId: discussion.replyId,
            resolvable: discussion.resolvable,
            resolved: discussion.resolved,
            resolvedAt: discussion.resolvedAt,
            resolvedBy: discussion.resolvedBy?.id
        };
    }
    
    private mapNote(note: any): Note {
        return {
            author: note.author.id,
            authorIsContributor: note.authorIsContributor,
            body: note.body,
            createdAt: note.createdAt,
            id: note.id,
            internal: note.internal,
            lastEditedAt: note.lastEditedAt,
            lastEditedBy: note.lastEditedBy?.id,
            resolvable: note.resolvable,
            resolved: note.resolved,
            resolvedAt: note.resolvedAt,
            resolvedBy: note.resolvedBy?.id,
            system: note.system,
            updatedAt: note.updatedAt
        };
    }

    async processProjectInfo() {
        let projectInfo: any = await this.extractor.getProjectInfo();
        let projectInfoMapped = this.mapProjectInfo(projectInfo);

        const filename = `ProjInfoMapped_test_test.json`;
        await fs.appendFile(filename, JSON.stringify(projectInfoMapped, null, 2)+ '\n');

        console.log(`Query ProjectInfo result saved to ${filename}`);
    }
    
    private mapProjectInfo(projectInfo: any): ProjectInfo {
        const project = projectInfo?.project;
        if (!project) {
            throw new Error("Project information not found.");
        }
    
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
                epicBoards: project.group?.epicBoards?.nodes || [],
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