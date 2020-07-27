# Events
A tiny library to create a event listener and emmiter to be used in all *@skarllet* aplications.

## How to use
### Instalation

    npm i @skarllet/events

### Usage

    // Import the module
    const events = require('@skarllet/events')

    // Create an instance
    const { emmit, on } = events.create()

    // Create an event listener
    on('foo', (payload, event) => {
      console.log(event) // prints foo
      console.log(payload) // prints the data sended to the event
    })

    // Creates a event listener that listens to all events emmited
    on('*', (payload, event) => {
      console.log(event) // prints te event
      console.log(payload) // prints the data sended to the event
    })

    // Emmits an event
    emmit('foo', 'hey place some data here')
    emmit('bar', { text: 'accepts any kind of data' })
