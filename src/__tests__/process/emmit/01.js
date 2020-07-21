const { keepAlive } = require('../utils');

keepAlive();

process.on('message', event => {
  process.send(event)
})
