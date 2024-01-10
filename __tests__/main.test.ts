/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

enum rankingCVSS{
  HIGH,
  MEDIUM,
  LOW,
  CRITICAL,
}

interface Vulnerability {
  'id': string,
  'title': string,
  'fixedIn': Array<string>,
  'severity': rankingCVSS
  'cvssScore': number
}

interface SnykReport {
  vulnerabilities: [
    Vulnerability,
  ]
  ok: boolean
}

function getFailedReports(vulnerabilities: Array<SnykReport>): Array<SnykReport> {
  return vulnerabilities.filter((snykReport: SnykReport) => {
    return !snykReport.ok
  });
}

function getVulnerabilities() {
  getInputMock.mockImplementation((name: string): string => {
    switch (name) {
      case 'file-path':
        return '../__tests__/mock-vuln.json'
      default:
        return ''
    }
  })

  let vulnerabilities = main.getVulnerabilitiesFileContent()
  return vulnerabilities
}

function removeDuplicateVulnerabilities(vulnerabilitiesReport: Array<Vulnerability>) {

  const uniqueVulnerabilities: Array<Vulnerability> = vulnerabilitiesReport.reduce((accumulator: Array<Vulnerability>, current) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  vulnerabilitiesReport = uniqueVulnerabilities;

  return vulnerabilitiesReport;

}

function removeAllDuplicateVulnerabilites(failedReports: Array<SnykReport>) {
  failedReports.forEach((failedReport) => {
    // @ts-ignore
    failedReport.vulnerabilities = removeDuplicateVulnerabilities(failedReport.vulnerabilities);
  })
  return failedReports;
}

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('should get vulnerabilities file content', async () => {
    let vulnerabilities = getVulnerabilities()
    expect(vulnerabilities).not.toBeNull();
  })

  it('should only get non-ok scan', async () => {
    let vulnerabilities = getVulnerabilities();
    let failedReports = getFailedReports(vulnerabilities);
    expect(failedReports).toHaveLength(1);
    expect(failedReports[0].vulnerabilities.length).toBeGreaterThan(0);
  })

  it('should remove duplicate vuln', async () => {
    let vulnerabilities = getVulnerabilities();
    let failedReports = getFailedReports(vulnerabilities);

    expect(removeAllDuplicateVulnerabilites(failedReports)[0].vulnerabilities.length).toBe(6);
  })
})
