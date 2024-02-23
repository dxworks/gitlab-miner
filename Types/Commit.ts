import {Diff} from "./Diff";

export type Commit = {
    author?: string;
    authoredDate?: string;
    committedDate?: string;
    description?: string;
    diffs?: Diff[];
    fullTitle?: string;
    message?: string;
    title?: string;
}