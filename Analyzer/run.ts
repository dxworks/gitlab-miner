import * as fs from 'fs';
import { MergeRequest } from './Models/MergeRequest';
import { Member } from './Models/Member';

export function parseFile(filename: string) {
    console.log('Reading file...');
    const data = fs.readFileSync(filename, 'utf8').toString();
    console.log(data)
    const jsonData = JSON.parse(data);

    console.log("read data");

    let mergeRequestsMap = new Map<String, MergeRequest>();
    let membersMap = new Map<String, Member>();

    for (let mergeRequestData of jsonData.mergeRequests) {
        let mergeRequest: MergeRequest = {
            iid: mergeRequestData.iid,
            title: mergeRequestData.title,
            state: mergeRequestData.state,
            assignees: [],
        };
        mergeRequestsMap.set(mergeRequestData.iid, mergeRequest);
    }
    console.log("set members")

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
        const mergeRequest = mergeRequestsMap.get(mergeRequestData.iid);
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

    //console.log(mergeRequestsMap);
    //console.log(membersMap);

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

    // // Visualize membersMap
    console.log('Members Map:');
    membersMap.forEach((member) => {
        console.log(member.username);
        console.log('Associated Merge Requests:', member.mergeRequests?.length);
        // member.mergeRequests?.forEach(mergeRequest => {
        //     console.log(mergeRequest.iid);
        // });
        console.log('------------------');
    });
}

