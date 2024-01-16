import * as core from '@actions/core'
import { VulnerabilitiesTransformer } from './vulnerabilitiesTransformer'
import { Octokit } from '@octokit/core'
import { GithubIssueCreator } from './githubIssueCreator'

export function initIssueCreator(): GithubIssueCreator {
  const octokit = new Octokit({
    auth: core.getInput('gh-token')
  })
  const repoInfo = core.getInput('repo-info')
  const owner = repoInfo.split('/')[0]
  const repository = repoInfo.split('/')[1]

  return new GithubIssueCreator(octokit, owner, repository)
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const vulnerabilitiesTransformer = new VulnerabilitiesTransformer()

    const vulnerabilities =
      vulnerabilitiesTransformer.getVulnerabilitiesFileContent()

    vulnerabilitiesTransformer.getFailedReports(vulnerabilities)

    const issueCreator = initIssueCreator()
    console.log(issueCreator)
    await issueCreator.createIssue('aaa', 'aaaa')
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.log('error', error)
    // @ts-expect-error idk the type of error for now
    core.setFailed(error.message)
  }
}
