import events from 'events';
import Koa from 'koa';
import koaLogger from 'koa-logger';

export default class DfireProxyLocalServer extends events.EventEmitter {
  public proxyPort: number;
  public proxyOn: boolean;
  public app: Koa;
  constructor({ forward }) {
    super();
    this.app = new Koa;
    this.app.use(koaLogger((str, [, method, url, status, time, length]) => {
      console.log('[proxy]', str);
      if (status) {
        this.emit('logRequest', { method, url, status, time, length });
      }
    }));
    this.app.use(forward);
    this.app.on('error', (err) => {
      this.emit('error', err);
    });
  }
  public getState() {
    return {
      proxyPort: this.proxyPort,
      proxyOn: this.proxyOn,
    };
  }
  listen(port: number) {
    this.proxyPort = port;
    this.emit('listening', port);
    this.app.listen(port, () => {
      console.log('listen success');
      this.emit('listend', port);
      this.proxyOn = true;
      this.proxyPort = port;
    });
  }
}
