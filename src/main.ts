import * as core from '@actions/core'
import { VulnerabilitiesTransformer } from './vulnerabilitiesTransformer'
import { Octokit } from '@octokit/core'
import { GithubissueCreator } from './github/githubissueCreator'
import { GithubissueLister } from './github/githubissueLister'
import { SnykReport } from './types/snykReport'
import { Issue } from './types/issue'

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

export function initIssueLister(): GithubissueLister {
  const octokit = new Octokit({
    auth: core.getInput('gh-token')
  })
  const repoInfo = core.getInput('repo-info')
  const owner = repoInfo.split('/')[0]
  const repository = repoInfo.split('/')[1]

  return new GithubissueLister(octokit, owner, repository)
}

export function extractVulnerabilitiesReport(): SnykReport[] {
  const vulnerabilitiesTransformer = new VulnerabilitiesTransformer()

  const vulnerabilities =
    vulnerabilitiesTransformer.getVulnerabilitiesFileContent()

  const failedReports =
    vulnerabilitiesTransformer.getFailedReports(vulnerabilities)
  const uniqueVulnerabilitiesByReport =
    vulnerabilitiesTransformer.removeAllDuplicateVulnerabilities(failedReports)
  return uniqueVulnerabilitiesByReport
}

export function extractIssuesSnykIds(listIssues: Issue[]): string[] {
  const listIssuesIds = listIssues.map(issue => {
    //get text beetween [ & ]
    const match = issue.title.match(/\[(.*?)]/)
    return match ? match[1] : ''
  })

  return listIssuesIds
}

async function createGitHubIssuesForReports(
  vulnerabilitiesReport: SnykReport[]
): Promise<void> {
  const issueCreator = initIssueCreator()
  const issueLister = initIssueLister()

  const listIssues = await issueLister.getListIssues()
  if (listIssues !== undefined) {
    const listIssuesTitle = extractIssuesSnykIds(listIssues)

    for (const report of vulnerabilitiesReport) {
      for (const vulnerability of report.vulnerabilities) {
        if (!listIssuesTitle.includes(vulnerability.id)) {
          await issueCreator.createIssue(
            `${vulnerability.cvssScore} - ${vulnerability.title} [${vulnerability.id}]`,
            vulnerability.description
          )
        }
      }
    }
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const vulnerabilitiesReport = extractVulnerabilitiesReport()
    await createGitHubIssuesForReports(vulnerabilitiesReport)
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.log('error', error)
    // @ts-expect-error idk the type of error for now
    core.setFailed(error.message)
  }
}
