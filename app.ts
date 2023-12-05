import { request, gql } from 'graphql-request';
import { promises as fs } from 'fs';

const gitlabApiUrl = 'https://gitlab.com/api/graphql';
const personalAccessToken = ''; //add token

const headers = {
  Authorization: `Bearer ${personalAccessToken}`,
};

const queries: string[] = [];

const newQuery = gql`
  {
    project(fullPath: "octopus-code/octopus") {
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

queries.push(newQuery);

(async () => {
  for (let index = 0; index < queries.length; index++) {
    const query = queries[index];
    try {
      const result = await request(gitlabApiUrl, query, {}, headers);
      const filename = `result_${index + 1}.json`;

      await fs.writeFile(filename, JSON.stringify(result, null, 2));
      console.log(`Query ${index + 1} result saved to ${filename}`);
    } catch (error) {
      console.error(`Error executing query ${index + 1}:`, error);
    }
  }
})();
