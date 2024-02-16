import { Member } from "./Member";

export type MergeRequest = {
    iid?: string;
    title?: string;
    state?: string;
    createdAt?: string;
    mergedAt?: string;
    assignees?: Member[];
};