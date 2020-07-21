const {serializeError, deserializeError} = require('serialize-error');

const isError = obj => !!(obj && obj.stack && obj.message)
const handlePayloadSerialization = payload => isError(payload) ? serializeError(payload) : payload
const handlePayloadDeserialization = payload => isError(payload) ? deserializeError(payload) : payload

const create = process => {
  if (!process)
    throw new Error('No process atatched!')

  const events = {};

  const callEventHandlers = (event, payload, id, sourceEvent = null) => {
    if (events[event])
      for (const handler of events[event])
        handler(handlePayloadDeserialization(payload), id, sourceEvent || event)
  }

  const emmit = (event, payload = null, id = null) => process.send({ event, payload: handlePayloadSerialization(payload), id })

  const remove = (event, handler) => {
    if (!events[event])
      return

    events[event] = events[event].filter(h => h !== handler);
  }

  const on = (event, handler) => {
    // if the key doesnt exists it create
    if (!events[event])
      events[event] = []

    // Adds the event to the 
    events[event].push(handler)
  }

  const once = (event, handler, id = null) => {
    const fn = (_payload, _id) => {
      if (id && _id !== id)
        return

      handler(_payload, _id)
      remove(event, fn)
    }

    on(event, fn)
  }

  // Listens for messages from process
  process.on('message', ({ event, payload, id }) => {
    // Handle all events
    callEventHandlers('*', payload, id, event)
    callEventHandlers(event, payload, id)
  })

  return { emmit, on, once, remove }
}

module.exports = { create }
