import { Member } from "./Member";

export type MergeRequest = {
    iid?: string;
    title?: string;
    state?: string;
    assignees?: Member[];
};