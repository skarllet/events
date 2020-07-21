const { keepAlive } = require('../utils');
const eventbuzz = require('../../../index');

keepAlive();

const buzz = eventbuzz.create(process);

buzz.on('ping', (payload, id) => {
  buzz.emmit('pong', payload, id);
})
