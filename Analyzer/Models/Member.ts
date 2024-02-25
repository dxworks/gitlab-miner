import { MergeRequest } from "./MergeRequest";
import {Issue} from "./Issue";

export class Member {
    name?: string;
    username?: string;
    createdAt?: string;
    publicEmail?: string;
    commitEmail?: string;
    bot?: boolean;
    groupCount?: number;
    jobTitle?: string;
    lastActivityOn?: string;
    organization?: string;
    state?: string;
    mergeRequests?: MergeRequest[];
    issues?: Issue[];
    
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