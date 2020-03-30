const { execSync } = require('child_process')

const branch = require('./lib/branch');

const OWNER = 'vendoor'
const REPOSITORY = 'vendoor-server'

(async function main() {
    let issueNumber
    try {
        issueNumber = Number.parseInt(process.argv[2])
    } catch {
        console.log(`The issue number provided "${issueNumber}" is not a valid number!\n\n  Usage: npm generate:branch -- 17`)
        process.exit(1)
    }

    const branchName = await branch.branchNameForIssue(OWNER, REPOSITORY, issueNumber)

    execSync(`git checkout -b ${branchName}`)
})()
