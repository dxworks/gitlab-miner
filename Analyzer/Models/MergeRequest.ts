import { Member } from "./Member";
import {Label} from "../../Types/Label";
import {Commit} from "../../Types/Commit";
import {Discussion} from "./Discussion";

export class MergeRequest {
    iid?: string;
    approvalsLeft?: number;
    approvalsRequired?: number;
    approved?: boolean;
    approvedBy?: string[];
    assignees?: Member[];
    author?: Member;
    autoMergeEnabled?: boolean;
    commenters?: Member[];
    commitCount?: number;
    committers?: Member[];
    conflicts?: boolean;
    createdAt?: string;
    description?: string;
    diffStatsSummary?: {
        changes: number;
        fileCount: number;
        additions: number;
        deletions: number;
    };
    divergedFromTargetBranch?: boolean;
    downvotes?: number;
    draft?: boolean;
    humanTimeEstimate?: string;
    humanTotalTimeSpent?: string;
    labels?: Label[];
    mergeError?: string;
    mergeOngoing?: boolean;
    mergeStatusEnum?: string;
    mergeUser?: Member;
    mergeable?: boolean;
    mergeableDiscussionsState?: string;
    mergedAt?: string;
    participants?: Member[];
    preparedAt?: string;
    reviewers?: Member[];
    sourceBranch?: string;
    state?: string;
    taskCompletionStatus?: {
        completedCount: number;
        count: number;
    };
    targetBranch?: string;
    timeEstimate?: string;
    title?: string;
    totalTimeSpent?: string;
    updatedAt?: string;
    upvotes?: number;
    userDiscussionsCount?: number;
    userNotesCount?: number;
    commits?: Commit[];
    discussions?: Discussion[];

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
