# Component Developer Guide

  * [Introduction](#introduction)
  * [Writing Components](#writing-components)
  * [Registering Components](#registering-components)
  * [Setup and Teardown](#setup-and-teardown)
  * [Accessing the Component Products](#accessing-the-component-products)
  * [Examples](#examples)

## Introduction

Starting up the application involves a plethora of complex, dependent processes such as:

  * loading the application version,
  * connecting to the database and checking if its migrated to the required version,
  * registering HTTP handlers,
  * registering RPC handlers
  * actually starting the appropriate servers.

Conversely, the teardown process is also a sequence of various resource deallocations.

## Writing Components

To cope with this situation, Vendoor Server introduces the concept of components. Components have nothing to do with Dependency Injection (although, they use it for some extent), they are only there to make the startup and teardown process deterministic.

A component is an object of the following form:

~~~~JavaScript
const component = {
    // Other components can refer to this component by this name.
    // Required.
    name: 'chat',

    // The components that must be set up before this component.
    // Optional.
    dependencies: ['communication'],

    // Setup routine of the module. Will be called with the products of the dependencies
    // (more information on that below).
    // Optional.
    async setup(dependencies) {
        // The dependencies parameter is an object of already setup component product,
        // with the following guarantee:
        // If A appears in the `dependencies` array of B, then
        // dependencies[ name of A ] == product of A
        const { communication } = dependencies

        const product = {}

        // The product is passed to the dependent components. Can be undefined.
        return product
    },

    // Teardown routine of the module. Will be called with the products of the dependencies.
    // Optional.
    async teardown(dependencies) {
        // Same guarantee, if B depends on A then the product of A is still available
        // during the teardown process of B.
        const { communication } = dependencies
    }
}
~~~~

As I mentiones earlier, this system is not used for dependency injection. Thus, the `dependencies` field declares a `must be set up before this one` relationship. In most cases, using `require` is much more appropriate.

## Registering Components

Assuming you have a module `example.js` exporting a component, you can register it as follows:

~~~~JavaScript
const application = require('./application/application')
const exampleComponent = require('./example')

application.registerComponent(exampleComponent)
~~~~

Registration is synchronous and does not trigger dependency resolution. Hence, you can register your components in any order.

## Setup and Teardown

The actual setup process is triggered by calling

~~~~JavaScript
await application.setup()
~~~~

This call will report unresolved and cyclic dependencies by throwing appropriate Errors.

The inverse, teardown is very similar:

~~~~JavaScript
const status = 1

await application.teardown(1)
~~~~

Here status is the exit code of the application. If omitted, the exit code is going to be `0`.

Please note, that this call, if awaited, will not return.

## Accessing the Component Products

After the `application.setup` call took place, one can access the component products:

~~~~JavaScript
const chat = application.getComponentProduct('chat')
~~~~

Although possible, this function should be used sparingly.

## Example

For a working example, see the `version` component: [src/version/component.js](../../src/version/component.js).
