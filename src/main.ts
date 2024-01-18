import * as core from '@actions/core'
import { VulnerabilitiesTransformer } from './vulnerabilitiesTransformer'
import { Octokit } from '@octokit/core'
import { GithubissueCreator } from './githubissueCreator'

export function initIssueCreator(): GithubissueCreator {
  const octokit = new Octokit({
    auth: core.getInput('gh-token')
  })
  const repoInfo = core.getInput('repo-info')
  const assignee = core.getInput('assignee')
  const owner = repoInfo.split('/')[0]
  const repository = repoInfo.split('/')[1]

  return new GithubissueCreator(octokit, owner, repository, assignee)
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

    await issueCreator.createIssue('aaa', 'aaaa')
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.log('error', error)
    // @ts-expect-error idk the type of error for now
    core.setFailed(error.message)
  }
}
