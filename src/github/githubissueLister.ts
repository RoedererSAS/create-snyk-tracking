import { IssuelisterInterface } from '../interfaces/issuelisterInterface'
import { Octokit } from '@octokit/core'
import * as console from 'console'
import { Issue } from '../types/issue'

export class GithubissueLister implements IssuelisterInterface {
  octokit
  username: string
  repository: string

  constructor(octokit: Octokit, username: string, repository: string) {
    this.octokit = octokit
    this.username = username
    this.repository = repository
  }
  async getListIssues(): Promise<Issue[] | undefined> {
    try {
      const response = await this.octokit.request(
        'GET /repos/:owner/:repo/issues',
        {
          owner: this.username,
          repo: this.repository,
          state: 'open',
          labels: 'security',
          per_page: 100
        }
      )
      return response.data
    } catch (error) {
      console.error('Error listing issues:', error)
    }
  }
}
