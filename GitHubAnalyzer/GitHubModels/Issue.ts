import {Author} from "./Author";
import {Label} from "./Label";
import {CommentGH} from "./CommentGH";

export class Issue {
    number: number | undefined;
    title: string | undefined;
    body: string | undefined;
    state: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    closedAt: Date | undefined;
    createdBy: Author | undefined;
    comments: CommentGH[] | undefined;
    assignees: Author[] | undefined;
    labels: Label[] | undefined;
}