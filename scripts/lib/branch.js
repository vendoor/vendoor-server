const issue = require('./issue')

const PERSISTENT_BRANCHES = [
  'master',
  'production'
]

// Matches branch names like this:
//   * #1-some-branch
//   * #127-another-very-nice98_asd-branch
// Test at https://regexr.com/51dno
const EPHEMERAL_BRANCH_REGEX = /#([1-9][0-9]*)-((?:[a-z0-9_]+-)*[a-z0-9_]+)/g

async function branchNameForIssue (owner, repository, issueNumber) {
  const i = await issue.retrieveOpenIssueByNumber(owner, repository, issueNumber)

  if (!i) {
    return null
  }

  const namePart = i.title
    .toLowerCase()
    .replace(/ /g, '-')

  return `#${i.number}-${namePart}`
}

async function hasIssueForBranch (owner, repository, actualBranchName) {
  const split = splitBranchName(actualBranchName)

  if (!split) {
    return false
  }

  return issue.retrieveOpenIssueByNumber(owner, repository, split.number)
}

function splitBranchName (branchName) {
  EPHEMERAL_BRANCH_REGEX.lastIndex = 0
  const result = EPHEMERAL_BRANCH_REGEX.exec(branchName)

  if (!Array.isArray(result) || result.length < 3) {
    return null
  }

  return {
    number: result[1],
    title: result[2]
  }
}

function guardInvalidBranchName (currentBranch) {
  console.log(`
The name of the current branch "${currentBranch}" does not match the branch naming policy.

The branch name must
  * either match one of the persistent names: 
  
      ${PERSISTENT_BRANCHES.join(', ')}

  * or match an ephemeral name enforced by the following regex: 
    
      ${EPHEMERAL_BRANCH_REGEX.toString()} (test at https://regexr.com/51dno)
`)

  process.exit(1)
}

async function guardNoIssueForBranch (owner, repository, actualBranchName) {
  const openIssues = (await issue.retrieveAllOpenIssues(owner, repository))
    .map(i => `#${i.number} - ${i.title}`)

  console.log(`
There is no open issue with the number set in the current branch "${actualBranchName}".

Open issues:
  * ${openIssues.join('\n  * ')}
`)

  process.exit(1)
}

function guardBranchNameDoesNotMatchExpected (expected, actual) {
  console.log(`
The name of the current branch does not match the expected name for the issue.

  Actual: ${actual}
  Expected: ${expected}
`)

  process.exit(1)
}

async function checkBranchName (owner, repository, actualBranchName) {
  if ((!PERSISTENT_BRANCHES.includes(actualBranchName)) && (!actualBranchName.match(EPHEMERAL_BRANCH_REGEX))) {
    guardInvalidBranchName(actualBranchName)
  }

  if (!(await hasIssueForBranch(owner, repository, actualBranchName))) {
    guardNoIssueForBranch(owner, repository, actualBranchName)
  }

  const issueNumber = splitBranchName(actualBranchName).number
  const expected = await branchNameForIssue(owner, repository, issueNumber)
  if (expected !== actualBranchName) {
    guardBranchNameDoesNotMatchExpected(expected, actualBranchName)
  }
}

module.exports = {
  branchNameForIssue,
  hasIssueForBranch,
  splitBranchName,
  checkBranchName
}
