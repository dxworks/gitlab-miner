import {Member} from "../Models/Member";
import {MergeRequest} from "../Models/MergeRequest";
import {Issue} from "../Models/Issue";
import fs from "fs/promises";

const folderPath = 'results';

export interface TeamNode {
    category: string | undefined;
    name: string | undefined
}

export interface TeamLink {
    source: string | undefined;
    target: string | undefined;
    value: number;
}

export interface TeamInteraction {
    nodes: TeamNode[];
    links: TeamLink[];
}

export class TeamAnalyzer {
    public teamInteraction: TeamInteraction = {
        nodes: [],
        links: []
    };

    private createGraph(membersMap: Map<String, Member>) {
        for (let [_, member] of membersMap) {
            this.teamInteraction.nodes.push({
                category: member.username,
                name: member.username,
            });

            for (let [_, colleague] of membersMap) {
                if(colleague.username !== member.username) {
                    this.teamInteraction.links.push({
                        source: member.username,
                        target: colleague.username,
                        value: 0
                    })
                }
            }
        }
    }

    public analyzeTeam(membersMap: Map<String, Member>, mergeRequestsMap: Map<String, MergeRequest>, issuesMap: Map<String, Issue>, teamGraphParameters: any) {
        this.createGraph(membersMap);

        let minLinkValue = teamGraphParameters.minLinkValue;
        let minMemberLinks = teamGraphParameters.minMemberLinks;

        for (let [_, member] of membersMap) {

            for (let [_, mergeRequest] of mergeRequestsMap) {
                if (mergeRequest.author === member.username && member.username !== undefined) {
                    if (mergeRequest.assignees !== undefined &&
                        mergeRequest.commenters !== undefined &&
                        mergeRequest.reviewers !== undefined &&
                        mergeRequest.approvedBy !== undefined) {
                        this.updateLinkValue(member.username, mergeRequest.assignees, 1);
                        this.updateLinkValue(member.username, mergeRequest.reviewers, 2);
                        this.updateLinkValue(member.username, mergeRequest.commenters, 3);
                        this.updateLinkValue(member.username, mergeRequest.approvedBy, 4);
                    }
                }
            }

            for (let [_, issue] of issuesMap) {
                if (issue.author === member.username && member.username !== undefined) {
                    if (issue.assignees !== undefined && issue.commenters !== undefined) {
                        this.updateLinkValue(member.username, issue.assignees, 1);
                        this.updateLinkValue(member.username, issue.commenters, 3);
                    }
                }
            }
        }

        this.teamInteraction.links = this.teamInteraction.links.filter((link: TeamLink) => link.value >= minLinkValue);
        this.teamInteraction.nodes = this.teamInteraction.nodes.filter((node: TeamNode) => {
            let memberLinks: TeamLink[] = this.teamInteraction.links.filter((link: TeamLink) => link.source === node.name || link.target === node.name);
            return memberLinks.length >= minMemberLinks;
        });

        // this.teamInteraction.links = this.teamInteraction.links.filter((link: TeamLink) => link.value >= minLinkValue);
        //
        // let validNodes = new Set<string>();
        // this.teamInteraction.links.forEach((link: TeamLink) => {
        //     if (link.source !== undefined) {
        //         validNodes.add(link.source);
        //     }
        //     if (link.target !== undefined) {
        //         validNodes.add(link.target);
        //     }
        // });
        //
        // this.teamInteraction.nodes = this.teamInteraction.nodes.filter((node: TeamNode) => {
        //     let memberLinks: TeamLink[] = this.teamInteraction.links.filter((link: TeamLink) => link.source === node.name || link.target === node.name);
        //     if (node.name !== undefined) {
        //         return memberLinks.length >= minMemberLinks || validNodes.has(node.name);
        //     }
        // });

        //console.log(this.teamInteraction);
        //console.log(this.teamInteraction.nodes.length)
        //console.log(this.teamInteraction.links.length)
        //console.log(minLinkValue, minMemberLinks);
        this.writeGraphToJsonFile();

        console.log('Execution finished successfully!\n');
    }

    private updateLinkValue(sourceMember: string, targetMembers: (Member | string)[], interactionValue: number) {
        for (let targetMember of targetMembers) {
            let targetUsername: string | undefined = typeof targetMember === 'string' ? targetMember : targetMember.username;

            let link: TeamLink | undefined = this.teamInteraction.links.find((link: TeamLink) => link.source === sourceMember && link.target === targetUsername);
            if (link !== undefined) { //&& link.value <= interactionValue
                //link.value++;
                link.value = link.value + interactionValue;
            }
            link = this.teamInteraction.links.find((link: TeamLink) => link.source === targetUsername && link.target === sourceMember);
            if (link !== undefined) { //&& link.value <= interactionValue)
                //link.value++;
                link.value = link.value + interactionValue;
            }
        }
    }

    private async writeGraphToJsonFile() {
        fs.writeFile(`${folderPath}/TeamGraph.json`, JSON.stringify(this.teamInteraction, null, 2));
    }
}