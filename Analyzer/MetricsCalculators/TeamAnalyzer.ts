import {Member} from "../Models/Member";
import {MergeRequest} from "../Models/MergeRequest";
import {Issue} from "../Models/Issue";
import fs from "fs/promises";

export interface TeamNode {
    username: string | undefined;
    fullName: string | undefined
}

export interface TeamEdge {
    source: string | undefined;
    target: string | undefined;
    weight: number;
}

export interface TeamInteraction {
    nodes: TeamNode[];
    edges: TeamEdge[];
}
export class TeamAnalyzer {
    public teamInteraction: TeamInteraction = {
        nodes: [],
        edges: []
    };

    private createGraph(membersMap: Map<String, Member>) {
        for (let [_, member] of membersMap) {
            this.teamInteraction.nodes.push({
                username: member.username,
                fullName: member.name,
            });

            for (let [_, colleague] of membersMap) {
                if(colleague.username !== member.username) {
                    this.teamInteraction.edges.push({
                        source: member.username,
                        target: colleague.username,
                        weight: 0
                    })
                }
            }
        }
    }
    public analyzeTeam(membersMap: Map<String, Member>, mergeRequestsMap: Map<String, MergeRequest>, issuesMap: Map<String, Issue>) {
        this.createGraph(membersMap);

        for (let [_, member] of membersMap) {

            for (let [_, mergeRequest] of mergeRequestsMap) {
                if (mergeRequest.author === member.username && member.username !== undefined) {
                    if (mergeRequest.assignees !== undefined &&
                        mergeRequest.commenters !== undefined &&
                        mergeRequest.reviewers !== undefined &&
                        mergeRequest.approvedBy !== undefined) {
                        this.updateEdgeWeight(member.username, mergeRequest.assignees, 0.5);
                        this.updateEdgeWeight(member.username, mergeRequest.reviewers, 1);
                        this.updateEdgeWeight(member.username, mergeRequest.approvedBy, 2);
                        this.updateEdgeWeight(member.username, mergeRequest.commenters, 3);
                    }
                }
            }

            for (let [_, issue] of issuesMap) {
                if (issue.author === member.username && member.username !== undefined) {
                    if (issue.assignees !== undefined && issue.commenters !== undefined) {
                        this.updateEdgeWeight(member.username, issue.assignees, 4);
                        this.updateEdgeWeight(member.username, issue.commenters, 5);
                    }
                }
            }
        }

        console.log(this.teamInteraction);
        console.log(this.teamInteraction.nodes.length)
        console.log(this.teamInteraction.edges.length)

        this.writeGraphToJsonFile();
    }

    private updateEdgeWeight(sourceMember: string, targetMembers: (Member | string)[], interactionWeight: number) {
        for (let targetMember of targetMembers) {
            let targetUsername: string | undefined = typeof targetMember === 'string' ? targetMember : targetMember.username;

            let edge: TeamEdge | undefined = this.teamInteraction.edges.find((edge: TeamEdge) => edge.source === sourceMember && edge.target === targetUsername);
            if (edge !== undefined && edge.weight < interactionWeight) {
                edge.weight++;
            }
            edge = this.teamInteraction.edges.find((edge: TeamEdge) => edge.source === targetUsername && edge.target === sourceMember);
            if (edge !== undefined && edge.weight < interactionWeight) {
                edge.weight++;
            }
        }
    }

    private async writeGraphToJsonFile() {
        fs.writeFile(`TeamGraph.json`, JSON.stringify(this.teamInteraction, null, 2));
    }
}