import { request, gql } from 'graphql-request';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

interface AppConfig {
  gitlabApiUrl: string;
  projectFullPath: string;
  tokens: string[];
} 

const configFile = 'config.yml';

(async () => {
  try {
    const configYaml = await fs.readFile(configFile, 'utf8');
    const config: AppConfig = yaml.load(configYaml) as AppConfig;

    const gitlabApiUrl = config.gitlabApiUrl;
    const projectFullPath = config.projectFullPath;
    const tokens = config.tokens;

    const queries: string[] = [];

    const newQuery = gql`
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

    queries.push(newQuery);

    (async () => {
      for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
        const token = tokens[tokenIndex];

        for (let index = 0; index < queries.length; index++) {
            const query = queries[index];

            try {
                const result = await request(gitlabApiUrl, query, {}, { Authorization: `Bearer ${token}` });
                const filename = `result_${tokenIndex + 1}_${index + 1}.json`;

                await fs.writeFile(filename, JSON.stringify(result, null, 2));
                console.log(`Query ${index + 1} result saved to ${filename}`);

            } catch (error) {
                console.error(`Error executing query ${index + 1}:`, error);
            }
        }
      }
    }) ();

} catch (error) {
    console.error('Error reading or parsing the configuration file:', error);
  }
}) ();
