const request = require('request');
const { PassThrough } = require('stream');

module.exports = function proxy({
  rules = [],
} = {}) {
  return async (ctx) => {
    const { req } = ctx;
    ctx.body = request({
      uri: req.url,
      method: ctx.method,
      // headers: ctx.headers,
    })
      .on('error', ctx.onerror)
      .pipe(PassThrough());
  };
};
