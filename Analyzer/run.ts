import * as fs from 'fs/promises';
import { MergeRequest } from './Models/MergeRequest';
import { Member } from './Models/Member';
import { Export } from './Models/Export';

export class MainClass {

    async readFile(filename: string) {
        const data = await fs.readFile(filename, 'utf8');
        const jsonData = JSON.parse(data);

        let mergeRequestsMap = new Map<String, MergeRequest>();
        let membersMap = new Map<String, Member>();

        for (let mergeRequestData of jsonData.mergeRequests) {
            let mergeRequest: MergeRequest = {
                iid: mergeRequestData.iid,
                title: mergeRequestData.title,
                state: mergeRequestData.state,
                createdAt: mergeRequestData.createdAt,
                mergedAt: mergeRequestData.mergedAt,
                assignees: [],
            };
            mergeRequestsMap.set(mergeRequestData.iid, mergeRequest);
        }

        for (let memberData of jsonData.projectMembers) {
            let member: Member = {
                name: memberData.name,
                username: memberData.username,
                publicEmail: memberData.publicEmail,
                mergeRequests: [],
            };
            membersMap.set(memberData.username, member);
        }

        for (let mergeRequestData of jsonData.mergeRequests) {
            let mergeRequest = mergeRequestsMap.get(mergeRequestData.iid);
            if (!mergeRequest) {
                continue;
            }
            for (let assignee of mergeRequestData.assignees) {
                let member = membersMap.get(assignee.username);
                if (member) {
                    mergeRequest.assignees?.push(member);
                    member.mergeRequests?.push(mergeRequest);
                }
            }
        }

        // Visualize mergeRequestsMap
        console.log('Merge Requests Map:');
        mergeRequestsMap.forEach((mergeRequest) => {
            console.log(mergeRequest.iid);
            console.log('Associated Members:', mergeRequest.assignees?.length);
            // mergeRequest.assignees?.forEach(member => {
            //     console.log(member.username);
            // });
            console.log('------------------');
        });

        // Visualize membersMap
        console.log('Members Map:');
        membersMap.forEach((member) => {
            console.log(member.username);
            console.log('Associated Merge Requests:', member.mergeRequests?.length);
            // member.mergeRequests?.forEach(mergeRequest => {
            //     console.log(mergeRequest.iid);
            // });
            console.log('------------------');
        });

        const exportData = new Export();
        let openCount = 0;
        let closedCount = 0;
        let mergedCount = 0;
        let totalLifetime = 0;
        let o = 0;
        let c = 0;
        let m = 0;

        for (let [_, mergeRequest] of mergeRequestsMap) {
            switch (mergeRequest.state) {
                case 'opened':
                    openCount++;
                    break;
                case 'closed':
                    closedCount++;
                    break;
                case 'merged':
                    mergedCount++;

                    if (mergeRequest.createdAt !== undefined && mergeRequest.mergedAt !== undefined) {
                        let createdAtTimestamp = new Date(mergeRequest.createdAt).getTime();
                        let mergedAtTimestamp = new Date(mergeRequest.mergedAt).getTime();
                        let lifetime = mergedAtTimestamp - createdAtTimestamp;
                        totalLifetime += lifetime;
                    }

                    break;
                default:
                    break;
            }
        }

        exportData.setOpen(openCount);
        exportData.setClosed(closedCount);
        exportData.setMerged(mergedCount);

        const avgTime: number = (totalLifetime/mergedCount)/(3600 * 1000);
        exportData.setAvgNoUntilMergingAMergeRequest(avgTime);

        console.log(exportData);
    }

}