import { Member } from "./Member";
import {Label} from "../../Types/Label";
import {Commit} from "../../Types/Commit";
import {Discussion} from "./Discussion";

export class MergeRequest {
    iid: string | undefined;
    approvalsLeft: number | undefined;
    approvalsRequired: number | undefined;
    approved: boolean | undefined;
    approvedBy: string[] | undefined;
    assignees: Member[] | undefined;
    author: Member | undefined;
    autoMergeEnabled: boolean | undefined;
    commenters: Member[] | undefined;
    commitCount: number | undefined;
    committers: Member[] | undefined;
    conflicts: boolean | undefined;
    createdAt: string | undefined;
    description: string | undefined;
    diffStatsSummary: {
        changes: number | undefined;
        fileCount: number | undefined;
        additions: number | undefined;
        deletions: number | undefined;
    } | undefined;
    divergedFromTargetBranch: boolean | undefined;
    downvotes: number | undefined;
    draft: boolean | undefined;
    humanTimeEstimate: string | undefined;
    humanTotalTimeSpent: string | undefined;
    labels: Label[] | undefined;
    mergeError: string | undefined;
    mergeOngoing: boolean | undefined;
    mergeStatusEnum: string | undefined;
    mergeUser: Member | undefined;
    mergeable: boolean | undefined;
    mergeableDiscussionsState: string | undefined;
    mergedAt: string | undefined;
    participants: Member[] | undefined;
    preparedAt: string | undefined;
    reviewers: Member[] | undefined;
    sourceBranch: string | undefined;
    state: string | undefined;
    taskCompletionStatus: {
        completedCount: number | undefined;
        count: number | undefined;
    } | undefined;
    targetBranch: string | undefined;
    timeEstimate: string | undefined;
    title: string | undefined;
    totalTimeSpent: string | undefined;
    updatedAt: string | undefined;
    upvotes: number | undefined;
    userDiscussionsCount: number | undefined;
    userNotesCount: number | undefined;
    commits: Commit[] | undefined;
    discussions: Discussion[] | undefined;

    // setIid (iid: string): void {
    //     this.iid = iid;
    // }

    // setTitle(title: string): void {
    //     this.title = title;
    // }

    // setState(state: string): void {
    //     this.state = state;
    // }

    // getIid(): string | undefined {
    //     return this.iid;
    // }

    // getTitle(): string | undefined {
    //     return this.title;
    // }

    // getState(): string | undefined {
    //     return this.state;
    // }
}
