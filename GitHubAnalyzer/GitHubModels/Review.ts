import {Author} from "./Author";
import {CommentGH} from "./CommentGH";

export class Review {
    state: string | undefined;
    user: Author | undefined;
    body: string | undefined;
    submittedAt: Date | undefined;
    comments: CommentGH[] | undefined;
}