import { MergeRequest } from "./MergeRequest";

export class Member {
    name?: string;
    username?: string;
    publicEmail?: string;
    mergeRequests?: MergeRequest[];
    
    // setName(name: string): void {
    //     this.name = name;
    // }

    // setUsername(username: string): void {
    //     this.username = username;
    // }

    // setPublicEmail(publicEmail: string): void {
    //     this.publicEmail = publicEmail;
    // }

    // getName(name: string): string | undefined {
    //     return this.name = name;
    // }

    // getUsername(): string | undefined {
    //     return this.username;
    // }

    // getPublicEmail(): string | undefined {
    //     return this.publicEmail;
    // } 
}