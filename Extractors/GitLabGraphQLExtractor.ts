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

  async getMergeRequests(cursor: string | null) {
    const config = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        mergeRequests(first: 100, after: ${cursor}) {
          edges {
            node {
              title
              iid
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    `;

    let randomToken = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);

    let mergeRequests = result.project.mergeRequests;
    let hasNextPage = result.project.mergeRequests.pageInfo.hasNextPage;
    let endCursor = result.project.mergeRequests.pageInfo.endCursor;

    return {mergeRequests, hasNextPage, endCursor};
  }

  //     const Query_GI = `
  //       {
  //         project(fullPath: "${config.projectFullPath}") {
  //           id
  //           name
  //           path
  //           fullPath
  //           webUrl
  //           createdAt
  //           lastActivityAt
  //           archived
  //           group {
  //             fullName
  //             fullPath
  //             id
  //             projectsCount
  //             description
  //           }
  //           namespace {
  //             fullName
  //             fullPath
  //             id
  //             totalRepositorySize
  //             description
  //           }
  //           codeCoverageSummary {
  //             averageCoverage
  //             coverageCount
  //             lastUpdatedOn
  //           }
  //           languages {
  //             name
  //             share
  //           }
  //           description
  //           topics
  //           openIssuesCount
  //           openMergeRequestsCount
  //         }
  //       }
  //     `;
  
    //   const Query_2 = `
    //   {
    //     project(fullPath: "octopus-code/octopus") {
    //       mergeRequests(first: 3) {
    //         nodes {
    //           approvalsRequired
    //           approved
    //           approvedBy {
    //             nodes {
    //               username
    //             }
    //           }
    //           assignees {
    //             nodes {
    //               username
    //             }
    //           }
    //           author {
    //             username
    //           }
    //           commenters {
    //             nodes {
    //               username
    //             }
    //           }
    //           commitCount
    //           commits {
    //             nodes {
    //               sha
    //             }
    //           }
    //           commitsWithoutMergeCommits {
    //             nodes {
    //               sha
    //             }
    //           }
    //           committers {
    //             nodes {
    //               username
    //             }
    //           }
    //           conflicts
    //           createdAt
    //           description
    //           diffStatsSummary {
    //             changes
    //             fileCount
    //             additions
    //             deletions
    //           }
    //           discussions {
    //             nodes {
    //               id
    //             }
    //           }
    //           downvotes
    //           draft
    //           humanTimeEstimate
    //           humanTotalTimeSpent
    //           id
    //           iid
    //           labels {
    //             nodes {
    //               title
    //             }
    //           }
    //           mergeError
    //           mergeOngoing
    //           mergeStatusEnum
    //           mergeUser {
    //             username
    //           }
    //           mergeable
    //           mergeableDiscussionsState
    //           mergedAt
    //           participants {
    //             nodes {
    //               username
    //             }
    //           }
    //           preparedAt
    //           reviewers {
    //             nodes {
    //               username
    //             }
    //           }
    //           state
    //           taskCompletionStatus {
    //             completedCount
    //             count
    //           }
    //           timeEstimate
    //           timelogs {
    //             nodes {
    //               timeSpent
    //             }
    //           }
    //           title
    //           totalTimeSpent
    //           updatedAt
    //           upvotes
    //           userDiscussionsCount
    //           userNotesCount
    //           userPermissions {
    //             canMerge
    //           }
    //           webUrl
    //         }
    //        }
    //     }
    //   }
    // `;
}