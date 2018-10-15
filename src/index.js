const Koa = require('koa');
const proxy = require('./middleware/proxy');

const app = new Koa();

app.use(proxy());

app.listen(3000);
