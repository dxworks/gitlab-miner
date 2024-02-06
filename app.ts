import { GitLabGraphQLExtractor } from "./Extractors/GitLabGraphQLExtractor";

const configFile = 'config.yml';
const gitLabApp = new GitLabGraphQLExtractor(configFile);
gitLabApp.run();