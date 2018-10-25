import debug from 'debug';
import Koa from 'koa';

interface IKoagentMiddlewareLoggerOptions {
  name?: string;
}

export default (options?: IKoagentMiddlewareLoggerOptions) => {
  const name = (options && options.name) || 'koagent:logger';
  const log = debug(name);
  console.log('logger name', name);

  return async (ctx: Koa.Context, next) => {
    log('start', ctx.req.url);
    await next();
    log('end', ctx.req.url, ctx.res.statusCode);
  };
};
