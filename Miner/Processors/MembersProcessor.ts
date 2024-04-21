import {Member} from "../Types/Member";
import {GitLabGraphQLExtractor} from "../Extractors/GitLabGraphQLExtractor";
import {allData, writeDataToJsonFile} from "../../app";

export class MembersProcessor {
    private extractor: GitLabGraphQLExtractor;

    constructor(extractor: GitLabGraphQLExtractor) {
        this.extractor = extractor;
    }

    async processProjectMembers() {
        let projectMembers = await this.extractor.getProjectMembers();

        for (let member of projectMembers) {
            allData.projectMembers.push(this.mapProjectMember(member));
        }

        await writeDataToJsonFile();
        console.log(`Query Members result saved.`);
    }

    private mapProjectMember(member: any): Member {
        return {
            name: member.user.name,
            username: member.user.username,
            createdAt: member.user.createdAt,
            publicEmail: member.user.publicEmail,
            commitEmail: member.user.commitEmail,
            bot: member.user.bot,
            groupCount: member.user.groupCount,
            jobTitle: member.user.jobTitle,
            lastActivityOn: member.user.lastActivityOn,
            organization: member.user.organization,
            state: member.user.state
        };
    }
}