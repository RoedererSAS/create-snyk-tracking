/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import { VulnerabilitiesTransformer } from '../src/vulnerabilitiesTransformer'

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
          return ''
        case 'gh-token':
          return ''
        case 'repo-info':
          return 'rdr/repo-name'
        default:
          return ''
      }
    })

    vulnerabilities = vulnerabilitiesTransformer.getVulnerabilitiesFileContent()
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
})
