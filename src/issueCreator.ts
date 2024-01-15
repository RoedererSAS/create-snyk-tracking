import { Octokit } from '@octokit/core'
import * as console from 'console'
import { IssueCreatorInterface } from './interfaces/IssueCreatorInterface'

type request = (title: string, body: string) => unknown

export class githubIssueCreator implements IssueCreatorInterface {

  octokit ;

  constructor(octokit: Octokit, request: request) {
    this.octokit = octokit;
  }
  async createIssue() {
    try {
      const response = await this.octokit.request('POST /repos/:owner/:repo/issues', {
        owner: 'your-username',
        repo: 'your-repository',
        title: 'New Issue Created',
        body: 'This is a sample issue created by the GitHub Action.',
      });

      console.log('Issue created:', response.data.html_url);
    } catch (error) {
      console.error('Error creating issue:', error.message);
    }
  }

  isIssueInList(listIssue: any): void {
  }

  listIssues(): void {
  }
}