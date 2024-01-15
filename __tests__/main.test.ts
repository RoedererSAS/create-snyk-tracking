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

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

type request = (title: string, body: string) => unknown

describe('action', () => {
  let vulnerabilities: any;
  let vulnerabilitiesTransformer = new VulnerabilitiesTransformer();

  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()

    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'file-path':
          return '../__tests__/mock-vuln.json'
        default:
          return ''
      }
    })

    vulnerabilities = vulnerabilitiesTransformer.getVulnerabilitiesFileContent()
  })

  it('should get vulnerabilities file content', async () => {
    expect(vulnerabilities).not.toBeNull();
  })

  it('should only get non-ok scan', async () => {
    let failedReports = vulnerabilitiesTransformer.getFailedReports(vulnerabilities);
    expect(failedReports).toHaveLength(1);
    expect(failedReports[0].vulnerabilities.length).toBeGreaterThan(0);
  })

  it('should remove duplicate vuln', async () => {
    let failedReports = vulnerabilitiesTransformer.getFailedReports(vulnerabilities);
    let uniqueVulnerabilities = vulnerabilitiesTransformer.removeAllDuplicateVulnerabilities(failedReports)[0];

    expect(uniqueVulnerabilities.vulnerabilities.length).toBe(6);
  })

  it('', () => {
    let failedReports = vulnerabilitiesTransformer.getFailedReports(vulnerabilities);
    let uniqueVulnerabilities = vulnerabilitiesTransformer.removeAllDuplicateVulnerabilities(failedReports)[0];



  })
})
