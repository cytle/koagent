import events from 'events';
import Koa from 'koa';
import KoagentServer from 'koagent-server';
import debug from 'debug';
import koaLogger from 'koa-logger';

const log = debug('koagent-dfire:server');

export default class DfireProxyLocalServer extends events.EventEmitter {
  public static async createServer(options) {
    const server = new DfireProxyLocalServer(options);
    await server.init();
    return server;
  }
  public proxyPort: number;
  public proxyOn: boolean;
  private server: KoagentServer;
  private app: Koa;
  private certService;
  constructor({ certService, mananger }) {
    super();
    this.certService = certService;
    this.app = new Koa;
    this.app.use(koaLogger((str) => {
      console.log('[proxy]', str);
    }));
    this.app.use(mananger.forward());
    this.app.on('error', (err) => {
      log('proxyApp error', err);
    });
  }
  private async init() {
    this.server = await KoagentServer.createServer({ certService: this.certService });
    this.server.onRequest(this.app.callback());
    this.server.onError(this.app.onerror);
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
    this.server.listen(port, () => {
      console.log('listen success');
      this.emit('listend', port);
      this.proxyOn = true;
      this.proxyPort = port;
    });
  }
}
