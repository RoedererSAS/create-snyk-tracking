/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import { VulnerabilitiesTransformer } from '../src/vulnerabilitiesTransformer'
import { GithubissueCreator } from '../src/github/githubissueCreator'
import { GithubissueLister } from '../src/github/githubissueLister'
import { Issue } from '../src/types/issue'

// Mock the GitHub Actions core library
let getInputMock: jest.SpyInstance

describe('action', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let vulnerabilities: any
  const vulnerabilitiesTransformer = new VulnerabilitiesTransformer()

  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()

    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'file-path':
          return '../__tests__/mock-vuln.json'
        case 'issue-tracker':
          return 'github'
        case 'gh-token':
          return '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'
        case 'repo-info':
          return 'RoedererSAS/create-snyk-tracking'
        default:
          return ''
      }
    })

    vulnerabilities =
      vulnerabilitiesTransformer.getVulnerabilitiesFileContent(true)
  })

  it('should get vulnerabilities file content', async () => {
    expect(vulnerabilities).not.toBeNull()
  })

  it('should only get non-ok scan', async () => {
    const failedReports =
      vulnerabilitiesTransformer.getFailedReports(vulnerabilities)
    expect(failedReports).toHaveLength(1)
    expect(failedReports[0].vulnerabilities.length).toBeGreaterThan(0)
  })

  it('should remove duplicate vuln', async () => {
    const failedReports =
      vulnerabilitiesTransformer.getFailedReports(vulnerabilities)
    const uniqueVulnerabilities =
      vulnerabilitiesTransformer.removeAllDuplicateVulnerabilities(
        failedReports
      )[0]

    expect(uniqueVulnerabilities.vulnerabilities.length).toBe(6)
  })

  it('should init a githubIssueCreator', async () => {
    const githubissueCreator = main.initIssueCreator()

    expect(githubissueCreator).toBeInstanceOf(GithubissueCreator)
  })

  it('should init a githubIssueLister', async () => {
    const githubissueLister = main.initIssueLister()

    expect(githubissueLister).toBeInstanceOf(GithubissueLister)
  })

  it('should extract ids from a list of issues from github', async () => {
    const listIssues: Issue[] = [
      { title: '5.3 - Improper Input Validation [SNYK-JS-POSTCSS-5926692]' },
      {
        title:
          '7.5 - Regular Expression Denial of Service (ReDoS) [SNYK-JS-NTHCHECK-1586032]'
      }
    ]

    const extractedIds = main.extractIssuesSnykIds(listIssues)

    expect(extractedIds.length).toBe(2)
    expect(extractedIds[0]).toEqual('SNYK-JS-POSTCSS-5926692')
  })
})
