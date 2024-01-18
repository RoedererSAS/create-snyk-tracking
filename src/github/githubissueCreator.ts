import { Octokit } from '@octokit/core'
import * as console from 'console'
import { IssuecreatorInterface } from '../interfaces/issuecreatorInterface'

export class GithubissueCreator implements IssuecreatorInterface {
  octokit
  username: string
  repository: string
  assignee: string

  constructor(
    octokit: Octokit,
    username: string,
    repository: string,
    assignee: string
  ) {
    this.octokit = octokit
    this.username = username
    this.repository = repository
    this.assignee = assignee
  }
  async createIssue(title: string, body: string): Promise<void> {
    try {
      const response = await this.octokit.request(
        'POST /repos/:owner/:repo/issues',
        {
          owner: this.username,
          repo: this.repository,
          assignees: [this.assignee],
          labels: ['security'],
          title,
          body
        }
      )

      console.log('Issue created:', response.data.html_url)
    } catch (error) {
      console.error('Error creating issue:', error)
    }
  }
}
