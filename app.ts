import { MainClass } from "./Analyzer/run";
import { GitLabGraphQLExtractor } from "./Extractors/GitLabGraphQLExtractor";
import { MergeRequestsProcessor } from "./Processors/MergeRequestsProcessor";

const configFile = 'config.yml';
const extractor = new GitLabGraphQLExtractor(configFile);
const processor = new MergeRequestsProcessor(extractor);

// (async () => {
//     await processor.processProjectMembers();
//     await processor.processMergeRequests(null);
//     await processor.processIssues(null);
// })();

const run = new MainClass();
run.readFile(`All_New_Data.json`);