import debug from 'debug';
import { IKoagentMiddlewareContext } from '../interfaces';

interface IKoagentMiddlewareLoggerOptions {
  name?: string;
}

export default (
  _appCtx?: IKoagentMiddlewareContext,
  options?: IKoagentMiddlewareLoggerOptions,
) => {
  const log = debug((options && options.name) || 'koagent:logger');
  return (ctx, next) => {
    log('url', ctx.req.url);
    next();
  };
};
