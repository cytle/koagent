const httpForward = require('./httpForward');

module.exports = function forwarder() {
  return ctx => httpForward(ctx);
};
