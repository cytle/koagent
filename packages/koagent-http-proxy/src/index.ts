import debug from 'debug';
import url from 'url';
import HttpProxy from 'http-proxy';
import Koa from 'koa';
import _ from 'lodash';

const log = debug('koagent:http-proxy');

const isSSL = /^https|wss/i;
const isSecureProtocol = (protocol: string | undefined) => isSSL.test(protocol || '');

const isWS = /^ws/i;
const isWebsocketProtocol = (protocol: string | undefined) => isWS.test(protocol || '');

/**
 * 使用http-proxy转发请求
 */

export default (options?: HttpProxy.ServerOptions) => {
  const proxy = new HttpProxy(options);

  return ({ req, res }: Koa.Context) =>
  new Promise(async (resolve, reject) => {
    if (res.finished) {
      resolve();
      return;
    }
    // 如果没有设置全局的target则直接转发当前的url
    const proxyTargetUrl = req.url || '';

    log('proxyTargetUrl', proxyTargetUrl);

    const target = _.isString(proxyTargetUrl)
      ? url.parse(proxyTargetUrl)
      : proxyTargetUrl;

    res.setHeader('x-koagent-proxy-target', target.href || '');

    res.on('close', () => {
      reject(new Error(`Http response closed while proxying ${req.url}`));
    });
    res.on('finish', () => {
      resolve();
    });

    const proxyOptions = {
      target,
      secure: isSecureProtocol(target.protocol),
      ws: isWebsocketProtocol(target.protocol),
      changeOrigin: true,
      prependPath: false,
      followRedirects: false,
    };

    proxy.web(req, res, proxyOptions, reject);
  });
};
