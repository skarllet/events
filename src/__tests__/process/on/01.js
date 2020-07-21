const { keepAlive } = require('../utils');
const eventbuzz = require('../../../index');

keepAlive();

const buzz = eventbuzz.create(process);

buzz.on('ping', payload => {
  buzz.emmit('pong', payload)
})
