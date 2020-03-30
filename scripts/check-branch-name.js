const { execSync } = require('child_process')

const branch = require('./lib/branch')

const CURRENT_BRANCH_COMMAND = 'git rev-parse --abbrev-ref HEAD'

const OWNER = 'vendoor'
const REPOSITORY = 'vendoor-server';

(async function main () {
  const currentBranch = execSync(CURRENT_BRANCH_COMMAND, { encoding: 'utf-8' }).trim()

  await branch.checkBranchName(OWNER, REPOSITORY, currentBranch)
})()
