const http = require('http');
const https = require('https');
const { isNull, isUndefined } = require('lodash');

function convert(req) {
  const url = URL.parse(req.url);
  let port = url.port || 80;
  if (url.protocol && url.protocol.startsWith('https')) {
    port = 443;
  }
  return {
    auth: url.auth,
    headers: req.headers,
    host: url.host,
    hostname: url.hostname,
    method: req.method,
    path: url.path,
    port,
    protocol: url.protocol,
    rejectUnauthorized: false,
  };
}

module.exports = function forward(ctx) {
  return new Promise((resolve, reject) => {
    const { req, res } = ctx;
    if (
      !res.writable
        || res.finished
        || !(isUndefined(res.body) || isNull(res.body))
    ) {
      resolve(false);
      return;
    }
    const options = convert(req);
    let client = http;
    if (options.protocol && options.protocol.startsWith('https')) {
      client = https;
    }
    if (req.body && req.body.length) {
      options.headers['content-length'] = req.body.length;
    }
    const proxyReq = client.request(options, (proxyRes) => {
      res.statusCode = proxyRes.statusCode;
      Object.keys(proxyRes.headers).forEach((k) => {
        const v = proxyRes.headers[k];
        res.setHeader(k, v);
      });
      ctx.res.body = proxyRes;
      resolve(proxyRes);
    });
    if (req.body) {
      proxyReq.end(req.body);
    } else {
      req.pipe(proxyReq);
    }
    proxyReq.on('error', e => reject(e));
  });
};
