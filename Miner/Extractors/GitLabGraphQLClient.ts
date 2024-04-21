import {GraphQLClient} from "graphql-request";

export class GitLabGraphQLClient {
    private client: GraphQLClient;

    constructor(apiUrl: string, token: string) {
        this.client = new GraphQLClient(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async executeQuery(query: string, retries: number = 3): Promise<any> {
        for (let attempt: number = 1; attempt <= retries; attempt++) {
            try {
                const result = await this.client.request(query);
                return result;
            } catch (error) {
                console.error(`Error executing query (attempt ${attempt}/${retries}):`, error);
                if (attempt < retries) {
                    console.log(`Retrying after a delay...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                } else {
                    throw new Error(`Failed to execute query after ${retries} attempts: ${error}`);
                }
            }
        }
    }
}