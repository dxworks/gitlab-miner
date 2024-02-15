import { MainClass } from "./Analyzer/run";
import { GitLabGraphQLExtractor } from "./Extractors/GitLabGraphQLExtractor";
import { MergeRequestsProcessor } from "./Processors/MergeRequestsProcessor";

const configFile = 'config.yml';
const extractor = new GitLabGraphQLExtractor(configFile);
const processor = new MergeRequestsProcessor(extractor);
//processor.processMergeRequests(null);
// processor.processIssues(null);
// processor.processProjectInfo();
//processor.processProjectMembers();

const run = new MainClass();
run.readFile(`wwwwwww.json`);