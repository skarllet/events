let tick = 0;

module.exports = {
  keepAlive: () => setInterval(() => tick++, 1000),
}
