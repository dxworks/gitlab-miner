import {Author} from "./Author";

export class Commit {
    sha: string | undefined;
    author: Author | undefined;
    message: string | undefined;
    url: string | undefined;
    date: Date | undefined;
    changedFiles: number | undefined;
}