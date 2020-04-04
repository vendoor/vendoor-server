const notification = require('../../communication/notification')

module.exports = {
  method: 'GET',
  url: '/documentation/events',
  handler () {
    return {
      results: Object.values(notification.getEvents())
    }
  }
}
