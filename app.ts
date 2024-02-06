import { GitLabGraphQLExtractor } from "./Extractors/GitLabGraphQLExtractor";
import { MergeRequestsProcessor } from "./Processors/MergeRequestsProcessor";

const configFile = 'config.yml';
const extractor = new GitLabGraphQLExtractor(configFile);
const processor = new MergeRequestsProcessor(extractor);
processor.processMergeRequests(null);