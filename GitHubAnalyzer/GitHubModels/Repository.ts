import {Language} from "./Language";
import {Owner} from "./Owner";

export class Repository {
    id: string | undefined;
    name: string | undefined;
    fullPath: string | undefined;
    owner: Owner | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    languages: Language[] | undefined;
    description: string | undefined;
}