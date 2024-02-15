import * as fs from 'fs/promises';
import { MergeRequest } from './Models/MergeRequest';
import { Member } from './Models/Member';

export class MainClass {

    async readFile(filename: string) {
        const data = await fs.readFile(filename, 'utf8');
        const jsonData = JSON.parse(data);

        let mergeRequestsMap = new Map<MergeRequest, Member[]>();
        let membersMap = new Map<Member, MergeRequest[]>();

        for (let mergeRequestData of jsonData.mergeRequests) {
            let mergeRequest: MergeRequest = {
                iid: mergeRequestData.iid,
                title: mergeRequestData.title,
                state: mergeRequestData.state,
                assignees: mergeRequestData.assignees,
            };
            mergeRequestsMap.set(mergeRequest, []);
        }

        for (let memberData of jsonData.projectMembers) {
            let member: Member = {
                name: memberData.name,
                username: memberData.username,
                publicEmail: memberData.publicEmail,
                mergeRequests: [],
            };
            membersMap.set(member, []);
        }

        for (let mergeRequest of jsonData.mergeRequests) {
            for (let assignee of mergeRequest.assignees) {
                let member = jsonData.projectMembers.find((member: any) => member.username === assignee.username);
                if (member) {
                    mergeRequestsMap.get(mergeRequest)?.push(member);
                    membersMap.get(member)?.push(mergeRequest);
                }
            }
        }

        //console.log(mergeRequestsMap);
        //console.log(membersMap);

        // Visualize mergeRequestsMap
        console.log('Merge Requests Map:');
        mergeRequestsMap.forEach((members, mergeRequest) => {
            console.log(mergeRequest);
            console.log('Associated Members:');
            members.forEach(member => {
                console.log(member);
            });
            console.log('------------------');
        });

        // Visualize membersMap
        console.log('Members Map:');
        membersMap.forEach((mergeRequests, member) => {
            console.log(member);
            console.log('Associated Merge Requests:');
            mergeRequests.forEach(mergeRequest => {
                console.log(mergeRequest);
            });
            console.log('------------------');
        });
    }

}