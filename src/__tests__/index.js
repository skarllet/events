const path = require('path');
const cp = require('child_process');
const eventbuzz = require('../index');

const spawn = filePath => cp.spawn('node', [ path.join(__dirname, '/process' , filePath) ], { stdio: [null, null, null, 'ipc'] });

describe('eventbuzz', () => {
  describe('Tests the creation of an buzz', () => {
    test('Should return an object when the create function is called', () => {
      const process = spawn('/create/01.js');
      const buzz = eventbuzz.create(process);

      expect(typeof buzz).toMatch(/object/)

      process.kill()
    })

    test('Should throw an error if is created without an process', () => {
      expect(eventbuzz.create).toThrow(Error)
    })
  });

  describe(`Tests the 'emmit' function`, () => {
    const ipc = (process, type = 'message') => new Promise((resolve) => process.once(type, data => resolve(data)))

    test('Should send a message to the procces and it should send back the payload (via IPC)', () => {
      const process = spawn('/emmit/01.js');
      const buzz = eventbuzz.create(process);

      const event = { event: 'foo', payload: 'bar', id: 1 };

      ipc(process, 'message')
        .then(output => {
          process.kill();
          expect(output).toBeEqual(event);
        })

      // Sends the message after defining the listener
      buzz.emmit(event.event, event.payload, event.id)
    })
  })

  describe(`Tests the 'on' function on the main process and in the spawned process`, () => {
    test('Should recieve a pong when sended a ping with the same payload as sended', () => {
      const process = spawn('/on/01.js');
      const buzz = eventbuzz.create(process);
      const payload = 'foo'

      // Use as a promise to help testing
      const on = event => new Promise(resolve => buzz.on(event, data => resolve))

      on('pong')
        .then((responsePayload) => {
          expect(responsePayload).toMatch(payload)
          process.kill()
        })

      buzz.emmit('ping', payload)
    })
  })
})



