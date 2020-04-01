# Contributing to Vendoor Server

**Table of Contents**

  * [Style Guides](#style-guides)
    * [JavaScript Code](#javascript-code)
    * [Git Commit Messages](#git-commit-messages)
    * [Branch Naming Policy](#branch-naming-policy)
  * [Developer Guides](#developer-guides)

## Style Guides

### JavaScript Code

Vendoor Server uses the [StandardJS code style](https://standardjs.com/). The code style is enforced using a `pre-push` hook.

You can use the `npm run lint` command to check if your code follows the style, and use `npm run lint:fix` to automatically fix violations.

### Git Commit Messages

There is no strict ruleset regarding the git commit messages. They should be short and sweet, describing the changes in the commit. Please refrain from using messages such as:

  * `Small fixes`,
  * `Minor changes`,
  * `Changed logging`

### Branch Naming Policy

Branches must be named according to the following convention:

~~~~
#<issue number>-<lowercase title of the issue with hyphens>[-index if multiple branches are created]
~~~~

Examples:

  * `#17-some-issue`,
  * `#17-some-issue-2`,
  * `#123-you_may-include-2838-numbers`

This is enforced using a `pre-push` hook.

You can use the `npm run generate:branch` command automatically generate a new branch for an issue:

  * `npm run generate:branch -- 17`
    * Results in: `#17-some-issue`
  * `npm run generate:branch -- 17 2`
    * Results in: `#17-some-issue-2`

## Developer Guides

The following developer guides are available:

  * [Component Developer Guide](./docs/developer-guides/component.md)
    * Writing application startup and teardown components.
  * [HTTP Developer Guide](./docs/developer-guides/http.md)
    * Accessing the underlying HTTP server of Vendoor Server.
  * [Notification Developer Guide](./docs/developer-guides/notification.md)
    * Sending immediate notifications to connected clients.
  * [RPC Developer Guide](./docs/developer-guides/rpc.md)
    * Non-HTTP Remote Procedure Calls.
