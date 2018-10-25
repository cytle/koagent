import Koa from 'koa';
import debug from 'debug';
import { Tunnel } from '../handlers';

const log = debug('koagent:tunnel');
export default () => {
  const tunnel = new Tunnel();
  return async (ctx: Koa.Context, next) => {
    log('ctx.req.url', ctx.req.url);

    await tunnel.tunnelRequest(ctx.req, ctx.req.socket);
    next();
  };
};
