import { SnykReport } from './types/snykReport'
import { Vulnerability } from './types/vulnerability'
import path from 'path'
import * as core from '@actions/core'
import * as fs from 'fs'

export class VulnerabilitiesTransformer {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getVulnerabilitiesFileContent(needBasePath = false): any {
    let filePath = core.getInput('file-path')
    if (needBasePath) {
      const basePath = __dirname
      filePath = path.join(basePath, core.getInput('file-path'))
    }

    core.debug(`Searching ${filePath} ...`)

    const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return fileContents
  }

  getFailedReports(vulnerabilities: SnykReport[]): SnykReport[] {
    return vulnerabilities.filter((snykReport: SnykReport) => {
      return !snykReport.ok
    })
  }

  removeDuplicateVulnerabilities(
    vulnerabilitiesReport: Vulnerability[]
  ): Vulnerability[] {
    const uniqueVulnerabilities: Vulnerability[] = vulnerabilitiesReport.reduce(
      (accumulator: Vulnerability[], current) => {
        if (!accumulator.find(item => item.id === current.id)) {
          accumulator.push(current)
        }
        return accumulator
      },
      []
    )

    vulnerabilitiesReport = uniqueVulnerabilities

    return vulnerabilitiesReport
  }

  removeAllDuplicateVulnerabilities(failedReports: SnykReport[]): SnykReport[] {
    for (const failedReport of failedReports) {
      // @ts-expect-error removeDuplicateVulnerabilities can send back a tuple
      failedReport.vulnerabilities = this.removeDuplicateVulnerabilities(
        failedReport.vulnerabilities
      )
    }
    return failedReports
  }
}
