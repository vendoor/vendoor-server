const { execSync } = require('child_process')

const CURRENT_BRANCH_COMMAND = 'git rev-parse --abbrev-ref HEAD'

const PERSISTENT_BRANCHES = [
  'master',
  'production'
]

// Matches branch names like this:
//   * #1-some-branch
//   * #127-another-very-nice98_asd-branch
// Test at https://regexr.com/51dno
const EPHEMERAL_BRANCH_REGEX = /#[1-9][0-9]*-([a-z0-9_]+-)*[a-z0-9_]+/g

const currentBranch = execSync(CURRENT_BRANCH_COMMAND, { encoding: 'utf-8' }).trim()

if (PERSISTENT_BRANCHES.includes(currentBranch)) {
  process.exit()
}

if (currentBranch.match(EPHEMERAL_BRANCH_REGEX)) {
  process.exit()
}

console.log(`
The name of the current branch "${currentBranch}" does not match the branch naming policy.

The branch name must
  * either match one of the persistent names: 
  
      ${PERSISTENT_BRANCHES.join(', ')}

  * or match an ephemeral name enforced by the following regex: 
    
      ${EPHEMERAL_BRANCH_REGEX.toString()} (test at https://regexr.com/51dno)
`)

process.exit(1)
