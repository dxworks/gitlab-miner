import {Commit} from "./Commit";
import {Author} from "./Author";
import {Label} from "./Label";
import {Review} from "./Review";
import {ReviewRequest} from "./ReviewRequest";
import {CommentGH} from "./CommentGH";

export class PullRequest {
    number: number | undefined;
    title: string | undefined;
    body: string | undefined;
    changedFiles: number | undefined;
    commits: Commit[] | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    mergedAt: Date | undefined;
    closedAt: Date | undefined;
    state: string | undefined;
    createdBy: Author | undefined;
    comments: CommentGH[] | undefined;
    assignees: Author[] | undefined;
    labels: Label[] | undefined;
    mergedBy: Author | undefined;
    reviews: Review[] | undefined;
    reviewRequests: ReviewRequest[] | undefined;
}