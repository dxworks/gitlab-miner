import {Author} from "./Author";

export class CommentGH {
    author: Author | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    body: string | undefined;
    url: string | undefined;
}