import * as core from '@actions/core'
import fs = require('fs')
import { VulnerabilitiesTransformer } from './vulnerabilitiesTransformer'
const path = require('path')



/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {

    let vulnerabilitiesTransformer = new VulnerabilitiesTransformer();


    const vulnerabilities = vulnerabilitiesTransformer.getVulnerabilitiesFileContent();


  } catch (error) {
    // Fail the workflow run if an error occurs
    console.log('error', error);
    // @ts-ignore
    core.setFailed(error.message)
  }
}
