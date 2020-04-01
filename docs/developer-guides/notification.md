# Notification Developer Guide

  * [Introduction](#introduction)
  * [Implementation of Notification](#implementation-of-notification)
  * [Sending notifications](#sending-notifications)

## Introduction

Vendoor Server can send clients immeadiate (push would not be a good term in this case) notifications. For example, if the delivery person sent a new chat message, then the recipient of the order can receive a notification.

**Important:** Only authenticated clients can be notified.

## Implementation of Notification

The details of Notification are abstracted away by the `communication` module (and component). This module wraps `comlink` and creates a new channel, called `Notiication`.

First, the client has to open a new WebSocket connection to this channel as follows:

  1. The client sends a request to the HTTP server to upgrade the connection to a WebSocket connection.
  1. The server the reads the client token from the request.
  1. The client is authenticated using the token.

Afterwards, the server is free to send notifications any time.

## Sending notifications

Sending a notification is a piece of cake, watch:

~~~~JavaScript
const notification = require('./communication/notification')

const userIdentifier = 'We assume that you somehow acquired a user identifier'

// Check if the user has an active connection.
if (notification.isUserOnline(userIdentifier)) {
    // If so, then hit them with our message!
    // Parameters:
    //   userIdentifier - event - message
    // The choice of event is arbitrary, just tell the frontend guys.
    notification.notifyUser(userIdentifier, 'some-event', { hello: 'World' })
}
~~~~
