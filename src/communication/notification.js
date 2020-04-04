const fastJson = require('fast-json-stringify')

const copy = require('../util/copy')
const log = require('../util/log')
const session = require('../session/session')

const internalEventMap = new Map()
const publicEventMap = new Map()

let _impl

function defaultMessageStringifier (obj) {
  return JSON.stringify(obj)
}

function initializeInternalEvent (eventRegistration) {
  const internalRegistrationObject = copy.deep(eventRegistration)

  if (eventRegistration.schema) {
    internalRegistrationObject.messageStringifier = fastJson(eventRegistration.schema)
  } else {
    internalRegistrationObject.messageStringifier = defaultMessageStringifier
  }

  return internalRegistrationObject
}

function makePublicEventRegistration (eventRegistration) {
  return {
    event: eventRegistration.event,
    schema: eventRegistration.schema,
    meta: copy.deep(eventRegistration.meta)
  }
}

async function sendNotificationToUser (userIdentifier, event, message) {
  const token = session.getTokenForUserSession(userIdentifier)

  const clientID = _impl.getClientIDByToken(token)

  await _impl.sendMessageToClient(clientID, event, message)
}

module.exports = {
  setup (impl) {
    _impl = impl
  },
  isUserOnline (userIdentifier) {
    const token = session.getTokenForUserSession(userIdentifier)

    return _impl.isTokenActive(token)
  },
  /**
   * Sends a notification to the specified user.
   * @param {string} userIdentifier The identifier of the user to be notified.
   * @param {Object} notification The notification to be sent to the user.
   * @param {string} notification.event The name of the event. Must be registered.
   * @param {Object} notification.message The payload of the notification.
   */
  async notifyUser (userIdentifier, notification) {
    const eventRegistration = internalEventMap.get(notification.event)

    if (!eventRegistration) {
      throw new Error(`Event "${notification.event}" is not registered!`)
    }

    log.debug('Sending notification to user "%s" about event "%s"', userIdentifier, notification.event)

    const stringifiedMessage = eventRegistration.messageStringifier(notification.message)

    await sendNotificationToUser(userIdentifier, notification.event, stringifiedMessage)
  },
  /**
   * Registers a new event type.
   * @param {Object} eventRegistration Information about the event being registered.
   * @param {Object} eventRegistration.event The event that will be reported to clients.
   * @param {Object} [eventRegistration.schema] JSON schema for notification description and serialization.
   * @param {Object} [eventRegistration.meta] Metainformation about the event being registered.
   * @param {string} [eventRegistration.meta.title] The title of the event.
   * @param {string} [eventRegistration.meta.description] Markdown formatted description of the event.
   * @param {string[]} [eventRegistration.meta.tags] Arbitrary string tags.
   */
  registerEvent (eventRegistration) {
    if (internalEventMap.has(eventRegistration.event)) {
      throw new Error(`Event ${eventRegistration.event} is already registered!`)
    }

    internalEventMap.set(eventRegistration.event, initializeInternalEvent(eventRegistration))
    publicEventMap.set(eventRegistration.event, makePublicEventRegistration(eventRegistration))

    log.info('Registered new event "%s"', eventRegistration.event)
  },
  getEvents () {
    const result = {}

    for (const event of publicEventMap.values()) {
      result[event.event] = event
    }

    return result
  }
}
