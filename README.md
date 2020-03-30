# Vendoor Server

## Up & Running

First, install the dependencies using npm:

~~~~
npm i
~~~~

Then, run the server using the following command:

~~~~
npm run serve
~~~~

## Development

### Code Style

The project uses the [StandardJS code style](https://standardjs.com/).

The code style is enforced using a `pre-push` hook.

### Branch Naming Policy

Allowed branch names are the following:

  * `master`
  * `production`
  * Names matching the regex `/#[1-9][0-9]*-([a-z0-9_]+-)*[a-z0-9_]+/g` (see [hooks/check-branch-name.js](hooks/check-branch-name.js)). Examples:
    * `#17-some-branch`,
    * `#2567-another_branch-with8918-numbers`

The policy is enforced using a `pre-push` hook
