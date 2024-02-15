import { Member } from "./Member";

export class MergeRequest {
    iid?: string;
    title?: string;
    state?: string;
    assignees?: Member[];

    // setIiid (iid: string): void {
    //     this.iid = iid;
    // }

    // setTitle(title: string): void {
    //     this.title = title;
    // }

    // setState(state: string): void {
    //     this.state = state;
    // }

    // getIid(): string | undefined {
    //     return this.iid;
    // }

    // getTitle(): string | undefined {
    //     return this.title;
    // }

    // getState(): string | undefined {
    //     return this.state;
    // }
}
