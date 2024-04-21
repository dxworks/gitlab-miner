import {Note} from "./Note";

export type Discussion = {
    createdAt?: string;
    id?: string;
    notes?: Note[];
    replyId?: string;
    resolvable?: boolean;
    resolved?: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
};
