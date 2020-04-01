# Comlink Developer Guide

  * [Introduction](#introduction)
  * [Comlink Channels](#comlink-channels)
  * [Testing Comlink Calls](#testing-comlink-calls)

## Introduction

Vendoor Server is built around two modules when it comes to communication: Fastify for unauthorized HTTP and Comlink for authorized WebSocket. In this guide, we will take a short look on the latter.

## Comlink Channels

The `communication` module creates three Comlink channels and all of them uses WebSocket connections:

  * `/Communicator`
    * For RPC calls.
  * `/Messaging`
    * For chat messages.
  * `/Notification`
    * For server-sent notifications.

The details of various communicational forms are abstracted away, however, authentication is common. When logged in through HTTP, the client receives a token, which she usess to establish the above WebSocket connections.

## Testing Comlink Calls

If you want to test your code making use of comlink, use the comlink REPL:

~~~~
npm run repl
~~~~

Make sure, to call `help()` for more information!
