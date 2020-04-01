# Chat Developer Guide

  * [Introduction](#introduction)
  * [Implementation of Chat](#implementation-of-chat)
  * [Sending and receiving messages](#sending-and-receiving-message)

## Introduction

Vendoor Server is able to receive and send chat message from and to clients. This enables us to implement chat features in the application

**Important:** Only authenticated clients can send and receive chat messages.

## Implementation of Chat

The details of Chat are abstracted away by the `communication` module (and component). This module wraps `comlink` and creates a new channel, called `Messaging`.

First, the client has to open a new WebSocket connection to this channel as follows:

  1. The client sends a request to the HTTP server to upgrade the connection to a WebSocket connection.
  1. The server the reads the client token from the request.
  1. The client is authenticated using the token.

Afterwards, the server is free to send notifications any time.

If the client sends a new message, then the following sequence kicks in:

  1. The client sends a WebSocket message to the server.
  1. The server resolves the user this connection belongs to.
  1. The chat message handler is invoked.

Overall, it's like a mixture of Notification and RPC.

## Sending and receiving messages

Again, it's like a mixture of Notification and RPC.

Sending a message is analogous to that of Notification:

~~~~JavaScript
const messaging = require('./communication/messaging')

const userIdentifier = 'We assume that you somehow acquired a user identifier'

// Check if the user has an active connection.
if (messaging.isUserOnline(userIdentifier)) {
    // If so, then hit them with our message!
    // Parameters:
    //   userIdentifier - event - message
    // The choice of event is arbitrary, just tell the frontend guys.
    messaging.messageUser(userIdentifier, 'some-event', { hello: 'World' })
}
~~~~

Receiving is done through a handler. If you want to register this handler, you need to create a component, like so:

~~~~JavaScript
// Parameters
//   * sendTo
//       * The user identifier of the recipient.
//   * message
//       * The actual message received from the current user.
//   * client
//       * An object carrying info regarding the authenticated client and user.
async function messageHandler(sendTo, message, client) {

}

const component = {
    name: 'chat',
    dependencies: ['communication'],

    async setup({ communication }) {
        communication.messaging.registerMessageHandler(messageHandler)
    }
}
~~~~

You can only register a single handler.
