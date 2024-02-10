import { GraphQLClient } from 'graphql-request';
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

    for (let mergeRequest of mergeRequests.edges) {
      let mergeRequestInfo = await this.getMergeRequestInfo(mergeRequest.node.iid);
      mergeRequest.node.info = mergeRequestInfo;
    }

    return {mergeRequests, hasNextPage, endCursor};
  }

  async getMergeRequestInfo(mergeRequestIid: number) {
    const config = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        mergeRequest(iid: "${mergeRequestIid}") {
          approvalsRequired
          approved
          approvedBy {
            nodes {
              id
            }
          }
          assignees {
            count
            nodes {
              bot
              commitEmail
              createdAt
              emails {
                nodes {
                  email
                }
              }
              jobTitle
              lastActivityOn
              name
              organization
              publicEmail
              state
              username
            }
          }
          author {
            id
          }
          commenters {
            nodes {
              id
            }
          }
          commitCount
          commits(first: 100) {
            nodes {
              author {
                id
              }
              authoredDate
              committedDate
              description
              fullTitle
              id
              message
              title
            }
          }
          committers {
            nodes {
              id
            }
          }
          conflicts
          createdAt
          description
          diffStatsSummary {
            changes
            fileCount
            additions
            deletions
          }
          discussions(first: 100) {
            nodes {
              createdAt
              id
              notes {
                count
                nodes {
                  author {
                    id
                  }
                  authorIsContributor
                  body
                  createdAt
                  id
                  internal
                  lastEditedAt
                  lastEditedBy {
                    id
                  }
                  resolvable
                  resolved
                  resolvedAt
                  resolvedBy {
                    id
                  }
                  system
                  updatedAt
                }
              }
              replyId
              resolvable
              resolved
              resolvedAt
              resolvedBy {
                id
              }
            }
          }
          downvotes
          draft
          humanTimeEstimate
          humanTotalTimeSpent
          id
          iid
          labels {
            count
            nodes {
              createdAt
              description
              id
              lockOnMerge
              title
              updatedAt
            }
          }
          mergeError
          mergeOngoing
          mergeStatusEnum
          mergeUser {
            id
          }
          mergeable
          mergeableDiscussionsState
          mergedAt
          participants {
            count
            nodes {
              id
            }
          }
          preparedAt
          reviewers {
            count
            nodes {
              id
            }
          }
          state
          taskCompletionStatus {
            completedCount
            count
          }
          timeEstimate
          timelogs {
            nodes {
              timeSpent
            }
          }
          title
          totalTimeSpent
          updatedAt
          upvotes
          userDiscussionsCount
          userNotesCount
        }
      }
    }
    `;

    let randomToken = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);

    return result.project.mergeRequest;
  }

  async getIssues() {
    const config = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        issues {
          count
          weight
          nodes {
            assignees {
              nodes {
                id
              }
            }
            author {
              id
            }
            blocked
            blockedByCount
            blockedByIssues {
              nodes {
                iid
              }
            }
            blockingCount
            closedAsDuplicateOf {
              iid
            }
            closedAt
            commenters {
              nodes {
                id
              }
            }
            confidential
            createNoteEmail
            createdAt
            description
            discussionLocked
            discussions {
              nodes {
                createdAt
                id
                notes {
                  count
                  nodes {
                    author {
                      id
                    }
                    authorIsContributor
                    body
                    createdAt
                    id
                    internal
                    lastEditedAt
                    lastEditedBy {
                      id
                    }
                    resolvable
                    resolved
                    resolvedAt
                    resolvedBy {
                      id
                    }
                    system
                    updatedAt
                  }
                }
                replyId
                resolvable
                resolved
                resolvedAt
                resolvedBy {
                  id
                }
              }
            }
            downvotes
            dueDate
            epic {
              iid
            }
            hasEpic
            healthStatus
            humanTimeEstimate
            humanTotalTimeSpent
            id
            iid
            iteration {
              iid
            }
            labels {
              count
              nodes {
                createdAt
                description
                id
                lockOnMerge
                title
                updatedAt
              }
            }
            mergeRequestsCount
            moved
            movedTo {
              iid
            }
            participants {
              count
              nodes {
                id
              }
            }
            severity
            state
            taskCompletionStatus {
              completedCount
              count
            }
            timeEstimate
            timelogs {
              nodes {
                timeSpent
              }
            }
            title
            totalTimeSpent
            updatedAt
            upvotes
            userNotesCount
          }
        }
      }
    }
    `;

    let randomToken = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);
    let issues = result.project.issues.nodes;

    for (let issue of issues) {
      let relatedMergeRequests = await this.getRelatedMergeRequests(issue.iid);
      issue.relatedMergeRequests = relatedMergeRequests;
    }

    return issues;
  }

  async getRelatedMergeRequests(issueIid: number) {
    const config = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        issue(iid: "${issueIid}") {
          relatedMergeRequests {
            count
            nodes {
              iid
            }
          }
        }
      }
    }
    `;

    let randomToken = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);
    let relatedMergeRequests = result.project.issue.relatedMergeRequests.nodes;

    return relatedMergeRequests;
  }

  async getProjectInfo() {
    const config = await this.readConfig();

    const query = `
        {
          project(fullPath: "${config.projectFullPath}") {
            archived
            codeCoverageSummary {
              averageCoverage
              coverageCount
              lastUpdatedOn
            }
            createdAt
            description
            fullPath
            group {
              description
              epicBoards {
                nodes {
                  id
                  name
                }
              }
              fullName
              fullPath
              projectsCount
              groupMembersCount
              id
              name
              projectsCount
              stats { 
                releaseStats {
                  releasesCount
                  releasesPercentage
                }
              }
              visibility
            }
            id
            languages {
              name
              share
            }
            lastActivityAt
            name
            namespace {
              description
              fullName
              fullPath
              id
              name
              visibility
            }
            openIssuesCount
            openMergeRequestsCount
            statistics { 
              commitCount
            }
            repository {
              diskPath
              empty
              exists
              rootRef
            }
            topics
            visibility
          }
        }
      `;

    let randomToken = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let projectInfo = await client.executeQuery(query);

    return projectInfo;
  }
}