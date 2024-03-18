import { GitLabGraphQLExtractor } from "../Extractors/GitLabGraphQLExtractor";
import * as fs from 'fs/promises';
import { Member } from "../Types/Member";
import { MergeRequest } from "../Types/MergeRequest";
import {Commit} from "../Types/Commit";
import {Discussion} from "../Types/Discussion";
import {Note} from "../Types/Note";
import {Label} from "../Types/Label";
import {Issue} from "../Types/Issue";

export class MergeRequestsProcessor { 
    private extractor: GitLabGraphQLExtractor;
    private allData: any = {
        projectMembers: [],
        mergeRequests: [],
        issues: []
    };

    constructor(extractor: GitLabGraphQLExtractor) {
        this.extractor = extractor;
    }

    async writeDataToJsonFile() {
        const filename = `Octopus.json`;
        await fs.writeFile(filename, JSON.stringify(this.allData, null, 2) + '\n');
    }

    async processMergeRequests(endCursor: string | null) {
        //let allMergeRequests: any[] = [];
        let hasNextPage = true;
        let cnt = 0;

        while(hasNextPage) {
            let newMergeRequests = await this.extractor.getMergeRequests(endCursor);
            // allMergeRequests = allMergeRequests.concat(newMergeRequests.mergeRequests);

            for (let mergeRequest of newMergeRequests.mergeRequests) {
                this.allData.mergeRequests.push(this.mapMergeRequest(mergeRequest.node.info));
                //this.allData.mergeRequests.push(mergeRequest.node);
            }

            // this.allData.mergeRequests.push(mappedMergeRequests);

            // allMergeRequests = allMergeRequests.concat(mappedMergeRequests);
            // const filename = `MergeRequestsSimplified_toCheck.json`;
            // await fs.appendFile(filename, JSON.stringify(mappedMergeRequests, null, 2)+ '\n');
            // console.log(`Query MergeRequests result saved to ${filename}`);

            cnt++;

            endCursor = JSON.stringify(newMergeRequests.endCursor);
            hasNextPage = newMergeRequests.hasNextPage;
        }

        await this.writeDataToJsonFile();

        //this.allData.mergeRequests.push(allMergeRequests);

        console.log(cnt);
    }

    private mapMergeRequest(mergeRequest: any): MergeRequest {
        return {
            iid: mergeRequest.iid,
            approvalsLeft: mergeRequest.approvalsLeft,
            approvalsRequired: mergeRequest.approvalsRequired,
            approved: mergeRequest.approved,
            approvedBy: mergeRequest.approvedBy ? mergeRequest.approvedBy.nodes.map((node: any) => node.username) : [],
            assignees: mergeRequest.assignees.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            author: mergeRequest.author ? mergeRequest.author.username : null,
            autoMergeEnabled: mergeRequest.autoMergeEnabled,
            commenters: mergeRequest.commenters.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            commitCount: mergeRequest.commitCount,
            committers: mergeRequest.committers.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            conflicts: mergeRequest.conflicts,
            createdAt: mergeRequest.createdAt,
            description: mergeRequest.description,
            diffStatsSummary: {
                changes: mergeRequest.diffStatsSummary.changes,
                fileCount: mergeRequest.diffStatsSummary.fileCount,
                additions: mergeRequest.diffStatsSummary.additions,
                deletions: mergeRequest.diffStatsSummary.deletions
            },
            divergedFromTargetBranch: mergeRequest.divergedFromTargetBranch,
            downvotes: mergeRequest.downvotes,
            draft: mergeRequest.draft,
            humanTimeEstimate: mergeRequest.humanTimeEstimate,
            humanTotalTimeSpent: mergeRequest.humanTotalTimeSpent,
            labels: mergeRequest.labels ? mergeRequest.labels.nodes.map((node: any) => this.mapLabel(node)) : [],
            mergeError: mergeRequest.mergeError,
            mergeOngoing: mergeRequest.mergeOngoing,
            mergeStatusEnum: mergeRequest.mergeStatusEnum,
            mergeUser: mergeRequest.mergeUser ? mergeRequest.mergeUser.username : null,
            mergeable: mergeRequest.mergeable,
            mergeableDiscussionsState: mergeRequest.mergeableDiscussionsState,
            mergedAt: mergeRequest.mergedAt,
            participants: mergeRequest.participants.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            preparedAt: mergeRequest.preparedAt,
            reviewers: mergeRequest.reviewers ? mergeRequest.reviewers.nodes.map((node: any) => node.username) : [],
            state: mergeRequest.state,
            sourceBranch: mergeRequest.sourceBranch,
            taskCompletionStatus: mergeRequest.taskCompletionStatus,
            targetBranch: mergeRequest.targetBranch,
            timeEstimate: mergeRequest.timeEstimate,
            title: mergeRequest.title,
            totalTimeSpent: mergeRequest.totalTimeSpent,
            updatedAt: mergeRequest.updatedAt,
            upvotes: mergeRequest.upvotes,
            userDiscussionsCount: mergeRequest.userDiscussionsCount,
            userNotesCount: mergeRequest.userNotesCount,
            commits: mergeRequest.commits ? mergeRequest.commits.nodes.map((node: any) => this.mapCommit(node)) : [],
            discussions: mergeRequest.discussions ? mergeRequest.discussions.nodes.map((node: any) => this.mapDiscussion(node)) : []
        };
    }

    private mapMember(member: any): Member {
        return {
            name: member.name || undefined,
            username: member.username || undefined,
            createdAt: member.createdAt || undefined,
            publicEmail: member.publicEmail || undefined,
            commitEmail: member.commitEmail || undefined,
            bot: member.bot || undefined,
            groupCount: member.groupCount || undefined,
            jobTitle: member.jobTitle || undefined,
            lastActivityOn: member.lastActivityOn || undefined,
            organization: member.organization || undefined,
            state: member.state || undefined
        };
    }

    private mapLabel(label: any): Label {
        return {
            createdAt: label.createdAt,
            description: label.description,
            id: label.id,
            lockOnMerge: label.lockOnMerge,
            title: label.title,
            updatedAt: label.updatedAt
        };
    }

    private mapCommit(commit: any): Commit {
        return {
            author: commit.author ? commit.author.username : null,
            authoredDate: commit.authoredDate,
            committedDate: commit.committedDate,
            description: commit.description,
            fullTitle: commit.fullTitle,
            message: commit.message,
            title: commit.title
        };
    }

    private mapDiscussion(discussion: any): Discussion {
        return {
            createdAt: discussion.createdAt,
            id: discussion.id,
            notes: discussion.notes ? discussion.notes.nodes.map((note: any) => this.mapNote(note)) : [],
            replyId: discussion.replyId,
            resolvable: discussion.resolvable,
            resolved: discussion.resolved,
            resolvedAt: discussion.resolvedAt,
            resolvedBy: discussion.resolvedBy ? discussion.resolvedBy.username : null
        };
    }

    private mapNote(note: any): Note {
        return {
            author: note.author ? note.author.username : null,
            authorIsContributor: note.authorIsContributor,
            body: note.body,
            createdAt: note.createdAt,
            id: note.id,
            internal: note.internal,
            lastEditedAt: note.lastEditedAt,
            lastEditedBy: note.lastEditedBy ? note.lastEditedBy.username : null,
            resolvable: note.resolvable,
            resolved: note.resolved,
            resolvedAt: note.resolvedAt,
            resolvedBy: note.resolvedBy ? note.resolvedBy.username : null,
            system: note.system,
            updatedAt: note.updatedAt
        };
    }

    async processIssues(endCursor: string | null) {
        let allIssues: any[] = [];
        let hasNextPage = true;
        let cnt = 0;

        while(hasNextPage) {
            let newIssues = await this.extractor.getIssues(endCursor);
            // allIssues = allIssues.concat(newIssues.issues);

            // let mappedIssues: Issue[] = [];

            for (let issue of newIssues.issues.edges) {
                // let issue = edge.node;
                // mappedIssues.push(this.mapIssue(issue));
                this.allData.issues.push(this.mapIssue(issue.node));
            }

            // const filename = `IssuesMapped_test_test.json`;
            // await fs.appendFile(filename, JSON.stringify(mappedIssues, null, 2)+ '\n');
            //
            // console.log(`Query Issues result saved to ${filename}`);
            cnt++;

            endCursor = JSON.stringify(newIssues.endCursor);
            hasNextPage = newIssues.hasNextPage;
        }

        await this.writeDataToJsonFile();
        console.log(cnt);
    }

    private mapIssue(issue: any): Issue {
        return {
            assignees: issue.assignees.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            author: issue.author.username,
            blocked: issue.blocked,
            blockedByCount: issue.blockedByCount,
            blockingCount: issue.blockingCount,
            closedAsDuplicateOf: issue.closedAsDuplicateOf?.iid,
            closedAt: issue.closedAt,
            commenters: issue.commenters.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            createdAt: issue.createdAt,
            description: issue.description,
            downvotes: issue.downvotes,
            dueDate: issue.dueDate,
            hasEpic: issue.hasEpic,
            healthStatus: issue.healthStatus,
            humanTimeEstimate: issue.humanTimeEstimate,
            humanTotalTimeSpent: issue.humanTotalTimeSpent,
            iid: issue.iid,
            iteration: issue.iteration?.iid,
            labels: issue.labels,
            mergeRequestsCount: issue.mergeRequestsCount,
            moved: issue.moved,
            movedTo: issue.movedTo?.iid,
            participants: issue.participants.nodes.map((node: any) => {
                return this.mapMember(node);
            }),
            severity: issue.severity,
            state: issue.state,
            taskCompletionStatus: issue.taskCompletionStatus,
            timeEstimate: issue.timeEstimate,
            title: issue.title,
            totalTimeSpent: issue.totalTimeSpent,
            updatedAt: issue.updatedAt,
            upvotes: issue.upvotes,
            userNotesCount: issue.userNotesCount,
            weight: issue.weight,
            relatedMergeRequests: issue.relatedMergeRequests?.map((mergeRequest: { iid: any; }) => mergeRequest.iid),
            discussions: issue.discussions ? issue.discussions.nodes.map((node: any) => this.mapDiscussion(node)) : []
        };
    }

    // async processProjectInfo() {
    //     let projectInfo: any = await this.extractor.getProjectInfo();
    //     let projectInfoMapped = this.mapProjectInfo(projectInfo);
    //
    //     const filename = `ProjInfoMapped_test_test.json`;
    //     await fs.appendFile(filename, JSON.stringify(projectInfoMapped, null, 2)+ '\n');
    //
    //     console.log(`Query ProjectInfo result saved to ${filename}`);
    // }
    //
    // private mapProjectInfo(projectInfo: any): ProjectInfo {
    //     const project = projectInfo?.project;
    //     if (!project) {
    //         throw new Error("Project information not found.");
    //     }
    //
    //     return {
    //         id: project.id,
    //         name: project.name,
    //         archived: project.archived,
    //         codeCoverageSummary: {
    //             averageCoverage: project.codeCoverageSummary?.averageCoverage,
    //             coverageCount: project.codeCoverageSummary?.coverageCount,
    //             lastUpdatedOn: project.codeCoverageSummary?.lastUpdatedOn
    //         },
    //         createdAt: project.createdAt,
    //         description: project.description,
    //         fullPath: project.fullPath,
    //         group: {
    //             description: project.group?.description,
    //             epicBoards: project.group?.epicBoards?.nodes || [],
    //             fullName: project.group?.fullName,
    //             fullPath: project.group?.fullPath,
    //             projectsCount: project.group?.projectsCount,
    //             groupMembersCount: project.group?.groupMembersCount,
    //             id: project.group?.id,
    //             name: project.group?.name,
    //             stats: {
    //                 releaseStats: {
    //                     releasesCount: project.group?.stats?.releaseStats?.releasesCount,
    //                     releasesPercentage: project.group?.stats?.releaseStats?.releasesPercentage
    //                 }
    //             },
    //             visibility: project.group?.visibility
    //         },
    //         languages: project.languages || [],
    //         lastActivityAt: project.lastActivityAt,
    //         namespace: {
    //             description: project.namespace?.description,
    //             fullName: project.namespace?.fullName,
    //             fullPath: project.namespace?.fullPath,
    //             id: project.namespace?.id,
    //             name: project.namespace?.name,
    //             visibility: project.namespace?.visibility
    //         },
    //         openIssuesCount: project.openIssuesCount,
    //         openMergeRequestsCount: project.openMergeRequestsCount,
    //         statistics: {
    //             commitCount: project.statistics?.commitCount
    //         },
    //         repository: {
    //             diskPath: project.repository?.diskPath,
    //             empty: project.repository?.empty,
    //             exists: project.repository?.exists,
    //             rootRef: project.repository?.rootRef
    //         },
    //         topics: project.topics || [],
    //         visibility: project.visibility
    //     };
    // }

    async processProjectMembers() {
        let projectMembers = await this.extractor.getProjectMembers();
        let mappedMembers: Member[] = [];

        for (let member of projectMembers) {
            this.allData.projectMembers.push(this.mapProjectMember(member));
        }

        await this.writeDataToJsonFile();
        console.log(`Query Members result saved.`);
    }

    private mapProjectMember(member: any): Member {
        return {
            name: member.user.name,
            username: member.user.username,
            createdAt: member.user.createdAt,
            publicEmail: member.user.publicEmail,
            commitEmail: member.user.commitEmail,
            bot: member.user.bot,
            groupCount: member.user.groupCount,
            jobTitle: member.user.jobTitle,
            lastActivityOn: member.user.lastActivityOn,
            organization: member.user.organization,
            state: member.user.state
        };
    }
}