import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import {GitLabGraphQLClient} from "./GitLabGraphQLClient";

export interface AppConfig {
  gitlabApiUrl: string;
  projectFullPath: string;
  tokens: string[];
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
    const config: AppConfig = await this.readConfig();

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

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);

    let mergeRequests = result.project.mergeRequests.edges;
    let hasNextPage = result.project.mergeRequests.pageInfo.hasNextPage;
    let endCursor = result.project.mergeRequests.pageInfo.endCursor;

    for (let mergeRequest of mergeRequests) {
      let mergeRequestInfo = await this.fetchMergeRequestInfo(mergeRequest.node.iid);
      mergeRequest.node.info = mergeRequestInfo;
    }

    return {mergeRequests, hasNextPage, endCursor};
  }

  async fetchMergeRequestInfo(mergeRequestIid: number) {
    const config: AppConfig = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        mergeRequest(iid: "${mergeRequestIid}") {
          iid
          approvalsLeft
          approvalsRequired
          approved
          approvedBy {
            count
            nodes {
              username
            }
          }
          assignees {
            count
            nodes {
              username
            }
          }
          author {
            username
          }
          autoMergeEnabled
          commenters {
            count
            nodes {
              username
            }
          }
          commitCount
          committers {
            count
            nodes {
              username
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
          divergedFromTargetBranch
          downvotes
          draft
          humanTimeEstimate
          humanTotalTimeSpent
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
            username
          }
          mergeable
          mergeableDiscussionsState
          mergedAt
          participants {
            count
            nodes {
              username
            }
          }
          preparedAt
          reviewers {
            count
            nodes {
              username
            }
          }
          state
          sourceBranch
          taskCompletionStatus {
            completedCount
            count
          }
          targetBranch
          timeEstimate
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

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let mergeRequestInfoResult = await client.executeQuery(query);
    let mergeRequestInfo = mergeRequestInfoResult.project.mergeRequest;

    let commitsAndDiacussionsResult = await this.fetchCommitsAndDiscussions(mergeRequestIid);
    mergeRequestInfo.commits = commitsAndDiacussionsResult.project.mergeRequest.commits;
    mergeRequestInfo.discussions = commitsAndDiacussionsResult.project.mergeRequest.discussions;

    return mergeRequestInfo;
  }

  async fetchCommitsAndDiscussions(mergeRequestIid: number) {
    const config: AppConfig = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        mergeRequest(iid: "${mergeRequestIid}") {
          commits {
            nodes {
                author {
                  username
                }
                authoredDate
                committedDate
                description
                fullTitle
                message
                title
            }
          }
          discussions {
            nodes {
              createdAt
              id
              notes {
                count
                nodes {
                  author {
                    username
                  }
                  authorIsContributor
                  body
                  createdAt
                  id
                  internal
                  lastEditedAt
                  lastEditedBy {
                    username
                  }
                  resolvable
                  resolved
                  resolvedAt
                  resolvedBy {
                    username
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
                username
              }
            }
          }
        }
      }
    }
    `;

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let commitsAndDiscussionsResult = await client.executeQuery(query);

    return commitsAndDiscussionsResult;
  }

  async getIssues(cursor: string | null) {
    const config: AppConfig = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        issues(first: 100, after: ${cursor}) {
          edges {
            node {
              assignees {
                nodes {
                  username
                }
              }
              author {
                username
              }
              blocked
              blockedByCount
              blockingCount
              closedAt
              commenters {
                nodes {
                  username
                }
              }
              createdAt
              description
              downvotes
              dueDate
              hasEpic
              healthStatus
              humanTimeEstimate
              humanTotalTimeSpent
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
                  username
                }
              }
              severity
              state
              timeEstimate
              title
              totalTimeSpent
              updatedAt
              upvotes
              userNotesCount
              weight
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

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);

    let issues = result.project.issues;
    let hasNextPage = result.project.issues.pageInfo.hasNextPage;
    let endCursor = result.project.issues.pageInfo.endCursor;

    for (let edge of issues.edges) {
      let issue = edge.node;

      let relatedMergeRequests = await this.fetchRelatedMergeRequests(issue.iid);
      issue.relatedMergeRequests = relatedMergeRequests;

      let discussionsResult = await this.fetchDiscussions(issue.iid);
      issue.discussions = discussionsResult.project.issue.discussions;
    }

    return {issues, hasNextPage, endCursor};
  }

  async fetchRelatedMergeRequests(issueIid: number) {
    const config: AppConfig = await this.readConfig();

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

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);
    let relatedMergeRequests = result.project.issue.relatedMergeRequests.nodes;

    return relatedMergeRequests;
  }

  async fetchDiscussions(issueIid: number) {
    const config: AppConfig = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        issue(iid: "${issueIid}") {
          discussions {
            nodes {
              createdAt
              id
              notes {
                count
                nodes {
                  author {
                    username
                  }
                  authorIsContributor
                  body
                  createdAt
                  id
                  internal
                  lastEditedAt
                  lastEditedBy {
                    username
                  }
                  resolvable
                  resolved
                  resolvedAt
                  resolvedBy {
                    username
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
                username
              }
            }
          }
        }
      }
    }
    `;

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let discussionsResult = await client.executeQuery(query);

    return discussionsResult;
  }

  async getProjectInfo() {
    const config: AppConfig = await this.readConfig();

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

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let projectInfo = await client.executeQuery(query);

    return projectInfo;
  }

  async getProjectMembers() {
    const config: AppConfig = await this.readConfig();

    const query = `
    {
      project(fullPath: "${config.projectFullPath}") {
        projectMembers {
          nodes {
            user {
              name
              username
              createdAt
              publicEmail
              commitEmail
              bot
              groupCount
              jobTitle
              lastActivityOn
              organization
              state
            }
          }
        }
      }
    }
    `;

    let randomToken: string = config.tokens[Math.floor(Math.random() * config.tokens.length)];
    let client: GitLabGraphQLClient = new GitLabGraphQLClient(config.gitlabApiUrl, randomToken);

    let result = await client.executeQuery(query);
    let projectMemebers = result.project.projectMembers.nodes;

    return projectMemebers;
  }
}