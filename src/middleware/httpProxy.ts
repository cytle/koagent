import url from 'url';
import HttpProxy from 'http-proxy';
import Koa from 'koa';
import _ from 'lodash';

const isSecureProtocol = (protocol: string | undefined) =>
  ['https', 'wss'].indexOf(protocol || '') !== -1;

const isWebsocketProtocol = (protocol: string | undefined) =>
  ['ws', 'wss'].indexOf(protocol || '') !== -1;
/**
 * 使用http-proxy转发请求
 * TODO WebSocket
 */
export default (options: HttpProxy.ServerOptions) => {
  const proxy = new HttpProxy(options);
  const globalTarget = options.target || options.forward;

  return ({ req, res, request, certificate }: Koa.Context) =>
  new Promise((resolve, reject) => {
    if (res.finished) {
      resolve();
      return;
    }
    // 如果没有设置全局的target则直接转发当前的url
    const proxyTargetUrl = globalTarget || request.url || '';
    const target = _.isString(proxyTargetUrl)
      ? url.parse(proxyTargetUrl)
      : proxyTargetUrl;

    res.setHeader('x-koagent-proxy-target', target.href || '');

    res.on('close', () => {
      reject(new Error(`Http response closed while proxying ${req.url}`));
    });
    res.on('finish', () => resolve());

    const proxyOptions = {
      target,
      secure: isSecureProtocol(target.protocol),
      ssl: isSecureProtocol(request.protocol)
        ? certificate.getForHost(request.url)
        : undefined,
      ws: isWebsocketProtocol(request.protocol),
    };
    proxy.web(req, res, proxyOptions, reject);
  });
};
