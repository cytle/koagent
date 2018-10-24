import debug from 'debug';
import Koa from 'koa';
import { IKoagentMiddlewareContext } from '../interfaces';

interface IKoagentMiddlewareLoggerOptions {
  name?: string;
}

export default (
  _appCtx?: IKoagentMiddlewareContext,
  options?: IKoagentMiddlewareLoggerOptions,
) => {
  const log = debug((options && options.name) || 'koagent:logger');
  return async (ctx: Koa.Context, next) => {
    log('url', ctx.req.url);
    await next();
    log('statusCode', ctx.res.statusCode);
  };
};
