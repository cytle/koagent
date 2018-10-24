import Koa from 'koa';
import debug from 'debug';
import { Tunnel } from '../handlers';
import { IKoagentMiddlewareContext } from '../interfaces';

const log = debug('koagent:tunnel');
export default (
  _appCtx?: IKoagentMiddlewareContext,
) => {
  const tunnel = new Tunnel();
  return async (ctx: Koa.Context, next) => {
    log('ctx.req.url', ctx.req.url);

    await tunnel.tunnelRequest(ctx.req, ctx.req.socket);
    next();
  };
};
