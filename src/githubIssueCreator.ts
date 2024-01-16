import { Octokit } from '@octokit/core'
import * as console from 'console'
import { IssueCreatorInterface } from './interfaces/issueCreatorInterface'

type Issue = { id: string }

export class GithubIssueCreator implements IssueCreatorInterface {
  octokit
  username: string
  repository: string

  constructor(octokit: Octokit, username: string, repository: string) {
    this.octokit = octokit
    this.username = username
    this.repository = repository
  }
  async createIssue(title: string, body: string): Promise<void> {
    try {
      const response = await this.octokit.request(
        'POST /repos/:owner/:repo/issues',
        {
          owner: this.username,
          repo: this.repository,
          title,
          body
        }
      )

      console.log('Issue created:', response.data.html_url)
    } catch (error) {
      console.error('Error creating issue:', error)
    }
  }

  isIssueInList(listIssue: Issue[]): void {
    console.error(listIssue)
  }

  listIssues(): void {}
}
