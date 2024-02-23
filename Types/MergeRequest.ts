import {Label} from "./Label";
import {Commit} from "./Commit";

class Discussion {
}

export type MergeRequest = {
    iid?: string;
    approvalsLeft?: number;
    approvalsRequired?: number;
    approved?: boolean;
    approvedBy?: string[];
    assignees?: string[];
    author?: string;
    autoMergeEnabled?: boolean;
    commenters?: string[];
    commitCount?: number;
    committers?: string[];
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
    mergeUser?: string;
    mergeable?: boolean;
    mergeableDiscussionsState?: string;
    mergedAt?: string;
    participants?: string[];
    preparedAt?: string;
    reviewers?: string[];
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
};