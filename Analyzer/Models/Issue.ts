import {Member} from "./Member";
import {MergeRequest} from "./MergeRequest";
import {Label} from "./Label";
import {Discussion} from "./Discussion";

export class Issue {
    iid?: string;
    assignees?: Member[];
    author?: Member;
    blocked?: boolean;
    blockedByCount?: number;
    blockingCount?: number;
    closedAsDuplicateOf?: string;
    closedAt?: string;
    commenters?: Member[];
    createdAt?: string;
    description?: string;
    downvotes?: number;
    dueDate?: string;
    hasEpic?: boolean;
    healthStatus?: string;
    humanTimeEstimate?: string;
    humanTotalTimeSpent?: string;
    iteration?: string;
    labels?: Label[];
    mergeRequestsCount?: number;
    moved?: boolean;
    movedTo?: string;
    participants?: Member[];
    severity?: string;
    state?: string;
    taskCompletionStatus?: {
        completedCount: number;
        count: number;
    };
    timeEstimate?: string;
    title?: string;
    totalTimeSpent?: string;
    updatedAt?: string;
    upvotes?: number;
    userNotesCount?: number;
    weight?: number;
    relatedMergeRequests?: MergeRequest[];
    discussions?: Discussion[];
}