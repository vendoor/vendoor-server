# HTTP Developer Guide

  * [Introduction](#introduction)
  * [Accessing Fastify](#accessing-fastify)
  * [Example](#example)

## Introduction

Vendoor Server (as of writing) uses [Fastify](https://www.fastify.io/) for serving HTTP requests.

## Accessing Fastify

The actual fastify instance is placed behind the `communication` facacde which is a component. For a primer on components, please refer to the [Component Developer Guide](./component.md).

Thus, to access the fastify instance you have to create a new component which depends on `communication`:

~~~~JavaScript
const component = {
    name: 'some-http-component`,
    dependencies: ['communication'],

    async setup({ communication }) {
        communication.fastify.route({
            method: 'GET',
            url: '/',
            handler() {
                return 'Hai!'
            }
        })
    }
}
~~~~

## Example

For a working example, see the `healthcheck` component: [src/healthcheck/component.js](../../src/healthcheck/component.js).
