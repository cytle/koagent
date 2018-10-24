import Koa from 'koa';

export default (
) => {
  return async (ctx: Koa.Context) => {
    ctx.body = 'helll';
  };
};
