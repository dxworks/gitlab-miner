import {Note} from "./Note";
import {Member} from "./Member";

export class Discussion {
    createdAt?: string;
    id?: string;
    notes?: Note[];
    replyId?: string;
    resolvable?: boolean;
    resolved?: boolean;
    resolvedAt?: string;
    resolvedBy?: Member;
}