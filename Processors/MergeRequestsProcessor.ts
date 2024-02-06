import { GitLabGraphQLExtractor } from "../Extractors/GitLabGraphQLExtractor";
import * as fs from 'fs/promises';

export class MergeRequestsProcessor { 
    private extractor: GitLabGraphQLExtractor;

    constructor(extractor: GitLabGraphQLExtractor) {
        this.extractor = extractor;
    }

    async processMergeRequests(endCursor: string | null) { 
        let allMergeRequests: any[] = [];
        let hasNextPage = true;
        let cnt = 0;

        while(hasNextPage) {
            let newMergeRequests: any = await this.extractor.getMergeRequests(endCursor);
            allMergeRequests = allMergeRequests.concat(newMergeRequests.mergeRequests);

            const filename = `result_temp.json`;
            await fs.appendFile(filename, JSON.stringify(newMergeRequests.mergeRequests, null, 2)+ '\n');

            console.log(`Query mrs result saved to ${filename}`);
            cnt++;

            endCursor = JSON.stringify(newMergeRequests.endCursor);
            hasNextPage = newMergeRequests.hasNextPage;
        }
        console.log(cnt);
    }
}