import * as core from '@actions/core'
import fs = require('fs')
const path = require('path')

export function getVulnerabilitiesFileContent() {
  const basePath = __dirname
  const filePath = path.join(basePath, core.getInput('file-path'))

  core.debug(`Searching ${filePath} ...`)

  const fileContents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return fileContents;
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const vulnerabilites = getVulnerabilitiesFileContent();


  } catch (error) {
    // Fail the workflow run if an error occurs
    console.log('error', error);
    // @ts-ignore
    core.setFailed(error.message)
  }
}
