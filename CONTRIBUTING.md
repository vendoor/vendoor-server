# Contributing to Vendoor Server

**Table of Contents**

  * [Style Guides](#style-guides)
    * [JavaScript Code](#javascript-code)
    * [Git Commit Messages](#git-commit-messages)
    * [Branch Naming Policy](#branch-naming-policy)
  * [Database Setup](#database-setup)
  * [Development Environment](#development-environment)
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

## Database Setup

Vendoor Server uses [vendoor/dragonball](https://github.com/vendoor/dragonball) to manage database migrations. When starting up, the application checks whether the database had been migrated to the required version. If not, then it refuses to start.

### Easy Solution

Create a collection called `Migration` in your database. Insert a new document with a single String-valued field:

~~~~JSON
{
  "version": "required version of vendoor-server, example: 1.0.0"
}
~~~~

### Proper Solution

Clone [vendoor/dragonball](https://github.com/vendoor/dragonball) and create and executable JAR using maven (or the maven wrapper in the repository):

~~~~
git clone https://github.com/vendoor/dragonball
cd dragonball
./mvnw clean package
cd ..
~~~~

Afterwards, clone the [Vendoor database schema](https://github.com/vendoor/schema) and kick in maven again:

~~~~
git clone https://github.com/vendoor/schema
cd schema
./mvnw clean package
cd ..
~~~~

Before actually setting up (or migrating the database), make sure to edit `dragonball/config/vendoor.conf`! In most cases the settings are just fine, however, you should at least check them.

Then, setup the database:

~~~~
java -jar ./dragonball/dragonball-cli/target/dragonball-cli-1.0.0.jar setup \
  --config-file=./dragonball/config/vendoor.conf \
  --schema-jar=./schema/target/schema-1.0.0.jar \
  --schema-class="me.vendoor.schema.Schema"
~~~~

Or if you want to do a migration on an already set up database: 

~~~~
java -jar ./dragonball/dragonball-cli/target/dragonball-cli-1.0.0.jar setup \
  --config-file=./dragonball/config/vendoor.conf \
  --schema-jar=./schema/target/schema-1.0.0.jar \
  --schema-class="me.vendoor.schema.Schema" \
  --target-version="1.1.0"
~~~~

**Note:** Actual JAR versions may differ.

## Development Environment

Vendoor Server starts up in development mode if the the `NODE_ENV` environment variable is set to `development`.

## Developer Guides

The following developer guides are available:

  * [Chat Developer Guide](./docs/developer-guides/chat.md)
    * Real-time messaging between users.
  * [Comlink Developer Guide](./docs/developer-guides/comlink.md)
    * How Comlink is integrated into Vendoor Server and how to test Comlink stuff.
  * [Component Developer Guide](./docs/developer-guides/component.md)
    * Writing application startup and teardown components.
  * [HTTP Developer Guide](./docs/developer-guides/http.md)
    * Accessing the underlying HTTP server of Vendoor Server.
  * [Notification Developer Guide](./docs/developer-guides/notification.md)
    * Sending immediate notifications to connected clients.
  * [RPC Developer Guide](./docs/developer-guides/rpc.md)
    * Non-HTTP Remote Procedure Calls.
