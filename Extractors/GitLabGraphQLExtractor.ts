import { request, gql, GraphQLClient } from 'graphql-request';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

export interface AppConfig {
  gitlabApiUrl: string;
  projectFullPath: string;
  tokens: string[];
} 

export class GitLabGraphQLClient {
  private client: GraphQLClient;

  constructor(apiUrl: string, token: string) {
    this.client = new GraphQLClient(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const result = await this.client.request(query);
      return result;
    } catch (error) {
      throw new Error(`Error executing query: ${error}`);
    }
  }
}

export class GitLabGraphQLExtractor {
  private configFile: string;

  constructor(configFile: string) {
    this.configFile = configFile;
  }

  private async readConfig(): Promise<AppConfig> {
    try {
      const configYaml = await fs.readFile(this.configFile, 'utf8');
      const config: AppConfig = yaml.load(configYaml) as AppConfig;
      return config;
    } catch (error) {
      throw new Error('Error reading or parsing the configuration file!');
    }
  }

  private async executeQueries(client: GitLabGraphQLClient, queries: string[], tokenIndex: number): Promise<void> {
    for (let queryIndex = 0; queryIndex < queries.length; queryIndex++) {
      const query = queries[queryIndex];

      try {
        const result = await client.executeQuery(query);
        const filename = `result_${tokenIndex + 1}_${queryIndex + 1}.json`;
        await fs.writeFile(filename, JSON.stringify(result, null, 2));
        
        console.log(`Query ${queryIndex + 1} result saved to ${filename}`);
      } catch (error) {
        console.error(`Error executing query ${queryIndex + 1}:`, error);
      }
    }
  }

  async run(): Promise<void> {
    try {
      const config = await this.readConfig();
      const gitlabApiUrl = config.gitlabApiUrl;
      const projectFullPath = config.projectFullPath;
      const tokens = config.tokens;

      const queries: string[] = [];

      const Query_GI = `
        {
          project(fullPath: "${projectFullPath}") {
            id
            name
            path
            fullPath
            webUrl
            createdAt
            lastActivityAt
            archived
            group {
              fullName
              fullPath
              id
              projectsCount
              description
            }
            namespace {
              fullName
              fullPath
              id
              totalRepositorySize
              description
            }
            codeCoverageSummary {
              averageCoverage
              coverageCount
              lastUpdatedOn
            }
            languages {
              name
              share
            }
            description
            topics
            openIssuesCount
            openMergeRequestsCount
          }
        }
      `;
  
      const Query_2 = `
      {
        project(fullPath: "${projectFullPath}") {
          name
          issues {
            nodes {
              title
            }
          }
          mergeRequests {
            nodes {
              title
              author {
                name
              }
              approved
            }
          }
        }
      }
    `;
  
      queries.push(Query_GI);
      queries.push(Query_2);

      for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        const token = tokens[tokenIndex];
        const client = new GitLabGraphQLClient(gitlabApiUrl, token);

        await this.executeQueries(client, queries, tokenIndex);
      }
    } catch (error) {
      console.error('Error running Application:', error);
    }
  }
}
