const url = require('url');
const HttpProxy = require('http-proxy');

/**
 * 使用http-proxy转发请求
 * TODO WebSocket
 */
module.exports = (options = {}) => {
  const proxy = new HttpProxy(options);
  const globalTarget = options.target || options.forward;

  return ({
    req, res,
  }) => new Promise((resolve, reject) => {
    if (res.finished) {
      resolve();
      return;
    }
    res.on('close', () => {
      reject(new Error(`Http response closed while proxying ${req.url}`));
    });
    res.on('finish', () => resolve());

    // 如果没有设置全局的target则直接转发当前的url
    const target = globalTarget || req.url;
    const {
      protocol,
    } = url.parse(target);

    res.setHeader('x-koagent-proxy-target', target);
    proxy.web(req, res, {
      target,
      secure: ['https', 'wss'].indexOf(protocol) !== -1,
      // ws: ['ws', 'wss'].indexOf(protocol) !== -1,
    }, reject);
  });
};
