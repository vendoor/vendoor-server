# RPC Developer Guide

  * [Introduction](#introduction)
  * [Implementation of RPC](#implementation-of-rpc)
  * [Registering RPC Handlers](#registering-rpc-handlers)

## Introduction

Most of the communication in Vendoor Server happens through RPC. RPC invocations are simple request-reply style calls, where the user (client) makes a call to the server (Vendoor Server).

**Important:** Only authenticated clients can make RPC invocations.

## Implementation of RPC

The details of RPC are abstracted away by the `communication` module (and component). This module wraps `comlink` and creates a new channel, called `Communicator`, to handle RPC invocations.

Prior to making an actual RPC invocation, the client opens a new WebSocket connection to this channel as follows:

  1. The client sends a request to the HTTP server to upgrade the connection to a WebSocket connection.
  1. The server the reads the client token from the request.
  1. The client is authenticated using the token.

When the client makes the actual RPC invocation, the following sequence takes place:

  1. The client sends a WebSocket message to the server.
  1. The server resolves the user this connection belongs to.
  1. The router selects the appropriate handler based on the path.
  1. The handler function is invoked.
  1. The result is sent back to the client.

## Registering RPC Handlers

In contrast with the implementation of RPC itself, the registration of handlers is rather simple.

You just need to create a new component which depends on `communication` and do some minimal magic:

~~~~JavaScript
const component = {
    name: 'some-rpc-component`
    dependencies: ['communication'],

    async setup({ communication }) {
        communication.rpc.registerRpcHandler({
            path: 'any.path.you.want',

            schema: {
              request: {
                $comment: "JSON schema for the arguments. See https://json-schema.org/understanding-json-schema/reference/array.html#tuple-validation"
                type: "array",
                items: [

                ]
              },
              response: {
                $comment: "JSON schema for the response. Arbitrary."
              }
            }

            meta: {
              title: "Documentation title of the handler",
              description: "Markdown-formatted desciption.",
              tags: ["an", "array", "of" "string tags"]
            }

            // The last argument is always an object carrying info
            // regarding the authenticated client and user.
            async handler(args, you, want, to handle, client) {
                // Will be sent to the client.
                return 'Thanx!'
            }
        })
    }
}
~~~~
