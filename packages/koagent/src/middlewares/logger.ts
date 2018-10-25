import debug from 'debug';
import Koa from 'koa';

interface IKoagentMiddlewareLoggerOptions {
  name?: string;
}

export default (options?: IKoagentMiddlewareLoggerOptions) => {
  const log = debug((options && options.name) || 'koagent:logger');
  return async (ctx: Koa.Context, next) => {
    log('url', ctx.req.url);
    await next();
    log('statusCode', ctx.res.statusCode);
  };
};
