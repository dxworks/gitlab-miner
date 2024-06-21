import { GitLabGraphQLExtractor } from "./Miner/Extraction/GitLabGraphQLExtractor";
import fs from "fs/promises";
import {MembersProcessor} from "./Miner/Processors/MembersProcessor";
import {MergeRequestsAndIssuesProcessor} from "./Miner/Processors/MergeRequestsAndIssuesProcessor";
import {ProjectInfoProcessor} from "./Miner/Processors/ProjectInfoProcessor";
import {Linker} from "./Analyzer/Linker";

console.log('Starting execution...\n');

const configFile = 'config.yml';
const FILENAME = `allData.json`;
const extractor: GitLabGraphQLExtractor = new GitLabGraphQLExtractor(configFile);

export let allData: any = {
    teamGraphParameters: {},
    projectInfo: {},
    projectMembers: [],
    mergeRequests: [],
    issues: [],
};

export async function writeDataToJsonFile() {
    const filename: string = FILENAME;
    await fs.writeFile(filename, JSON.stringify(allData, null, 2) + '\n');
}

const membersProcessor: MembersProcessor = new MembersProcessor(extractor);
const mergeRequestAndIssuesProcessor: MergeRequestsAndIssuesProcessor = new MergeRequestsAndIssuesProcessor(extractor);
const projectInfoProcessor: ProjectInfoProcessor = new ProjectInfoProcessor(extractor);

const linker: Linker = new Linker();

(async () => {
    await projectInfoProcessor.processProjectInfo();
    await membersProcessor.processProjectMembers();
    await mergeRequestAndIssuesProcessor.processMergeRequests(null);
    await mergeRequestAndIssuesProcessor.processIssues(null);
    await linker.parseFile(FILENAME);
})();
