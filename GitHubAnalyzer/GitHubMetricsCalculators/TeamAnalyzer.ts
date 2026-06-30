import { Member } from "../GitHubModels/Member";
import { PullRequest } from "../GitHubModels/PullRequest";
import { Issue } from "../GitHubModels/Issue";
import fs from "fs/promises";

const folderPath = "results";

export interface TeamNode {
    category: string | undefined;
    name: string | undefined;
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

interface TargetMember {
    username?: string;
    login?: string;
}

export class TeamAnalyzer {
    public teamInteraction: TeamInteraction = {
        nodes: [],
        links: [],
    };

    private linkMap: Map<string, TeamLink> = new Map();

    public async analyzeTeam(
        membersMap: Map<string, Member>,
        pullRequestsMap: Map<string, PullRequest>,
        issuesMap: Map<string, Issue>,
        teamGraphParameters: any
    ): Promise<void> {

        for (const [_, member] of membersMap) {
            this.teamInteraction.nodes.push({
                category: member.username,
                name: member.username,
            });
        }

        const minLinkValue: number = 0;
        const minMemberLinks: number = 0;

        for (const [_, pullRequest] of pullRequestsMap) {
            const author = pullRequest.createdBy?.login;
            if (!author) continue;

            const assignees = pullRequest.assignees ?? [];

            const reviewers =
                pullRequest.reviews
                    ?.filter(r => r?.user)
                    .map(r => r.user) ?? [];

            const commenters =
                pullRequest.comments
                    ?.filter(c => c?.author)
                    .map(c => c.author) ?? [];

            const approvers =
                pullRequest.reviewRequests
                    ?.filter(r => r?.requestedReviewer)
                    .map(r => r.requestedReviewer) ?? [];

            this.updateLinkValue(author, assignees, 1);
            this.updateLinkValue(author, reviewers, 2);
            this.updateLinkValue(author, commenters, 3);
            this.updateLinkValue(author, approvers, 4);
        }

        for (const [_, issue] of issuesMap) {
            const author = issue.createdBy?.login;
            if (!author) continue;

            const assignees = issue.assignees ?? [];
            const commenters = issue.comments?.map(c => c.author) ?? [];

            this.updateLinkValue(author, assignees, 1);
            this.updateLinkValue(author, commenters, 3);
        }

        this.teamInteraction.links = Array.from(this.linkMap.values());

        this.teamInteraction.links = this.teamInteraction.links.filter(
            (link) => link.value >= minLinkValue
        );

        this.teamInteraction.nodes = this.teamInteraction.nodes.filter(
            (node) => {
                const memberLinks = this.teamInteraction.links.filter(
                    (link) =>
                        link.source === node.name ||
                        link.target === node.name
                );
                return memberLinks.length >= minMemberLinks;
            }
        );

        await this.writeGraphToJsonFile();
    }

    private updateLinkValue(
        sourceMember: string,
        targetMembers: (TargetMember | undefined)[],
        interactionValue: number
    ): void {
        for (const targetMember of targetMembers) {
            const targetUsername =
                targetMember?.username ?? targetMember?.login;

            if (!targetUsername || targetUsername === sourceMember) continue;

            const [a, b] =
                sourceMember < targetUsername
                    ? [sourceMember, targetUsername]
                    : [targetUsername, sourceMember];

            const key = `${a}::${b}`;

            let link = this.linkMap.get(key);

            if (!link) {
                link = {
                    source: a,
                    target: b,
                    value: 0,
                };
                this.linkMap.set(key, link);
            }

            link.value += interactionValue;
        }
    }

    private async writeGraphToJsonFile(): Promise<void> {
        await fs.writeFile(
            `${folderPath}/TeamGraph.json`,
            JSON.stringify(this.teamInteraction)
        );
    }
}