import { Vulnerability } from './vulnerability'

export interface SnykReport {
  vulnerabilities: [Vulnerability]
  ok: boolean
}
