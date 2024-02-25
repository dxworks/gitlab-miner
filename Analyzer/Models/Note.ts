import {Member} from "./Member";

export class Note {
    author?: Member;
    authorIsContributor?: boolean;
    body?: string;
    createdAt?: string;
    id?: string;
    internal?: boolean;
    lastEditedAt?: string;
    lastEditedBy?: Member;
    resolvable?: boolean;
    resolved?: boolean;
    resolvedAt?: string;
    resolvedBy?: Member;
    system?: boolean;
    updatedAt?: string;
}