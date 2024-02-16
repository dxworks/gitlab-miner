import {parseFile} from "./Analyzer/run";

// const configFile = 'config.yml';
// const extractor = new GitLabGraphQLExtractor(configFile);
// const processor = new MergeRequestsProcessor(extractor);
//processor.processMergeRequests(null);
// processor.processIssues(null);
// processor.processProjectInfo();
//processor.processProjectMembers();

console.log('Running...');

parseFile(`test-project.json`);
