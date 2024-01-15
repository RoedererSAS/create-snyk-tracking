import { SnykReport } from './types/snykReport'
import { Vulnerability } from './types/vulnerability'
import path from 'path'
import * as core from '@actions/core'
import * as fs from 'fs'

export class VulnerabilitiesTransformer {
  public getVulnerabilitiesFileContent() {
    const basePath = __dirname
    const filePath = path.join(basePath, core.getInput('file-path'))

    core.debug(`Searching ${filePath} ...`)

    const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return fileContents
  }

  getFailedReports(vulnerabilities: Array<SnykReport>): Array<SnykReport> {
    return vulnerabilities.filter((snykReport: SnykReport) => {
      return !snykReport.ok
    })
  }

  removeDuplicateVulnerabilities(vulnerabilitiesReport: Array<Vulnerability>) {

    const uniqueVulnerabilities: Array<Vulnerability> = vulnerabilitiesReport.reduce((accumulator: Array<Vulnerability>, current) => {
      if (!accumulator.find((item) => item.id === current.id)) {
        accumulator.push(current)
      }
      return accumulator
    }, [])

    vulnerabilitiesReport = uniqueVulnerabilities

    return vulnerabilitiesReport
  }

  removeAllDuplicateVulnerabilities(failedReports: Array<SnykReport>): Array<SnykReport> {
    failedReports.forEach((failedReport) => {
      // @ts-ignore
      failedReport.vulnerabilities = this.removeDuplicateVulnerabilities(failedReport.vulnerabilities)
    })
    return failedReports
  }
}
