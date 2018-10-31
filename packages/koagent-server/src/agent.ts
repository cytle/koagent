import getPort from 'get-port';
import debug from 'debug';
import http from 'http';
import https from 'https';
import { createSecureContext } from 'tls';
import { IKoagentServerOptions } from './interfaces';
import { Tunnel } from './handlers';
import fillReqUrl from './fillReqUrl';

const log = debug('koagent:KoangetServer');
const localhost = '127.0.0.1';

export default class KoangetServer extends http.Server {
  public static async createServer(options: IKoagentServerOptions) {
    const server = new KoangetServer(options);
    await server.init();
    return server;
  }
  private httpsServer: https.Server;
  private httpsPort: number;
  private tunnel: Tunnel;
  private certService;
  constructor(
    { certService },
  ) {
    super();

    this.certService = certService;
    this.tunnel = new Tunnel();
  }

  public onRequest(handle) {
    this.on('request', handle);
    this.httpsServer.on('request', (req, res) => {
      fillReqUrl(req);
      handle(req, res);
    });
    return this;
  }
  public onError(handle) {
    this.on('error', handle);
    this.httpsServer.on('error', handle);
    return this;
  }
  public close(...args) {
    super.close(...args);
    this.httpsServer.close();
    return this;
  }
  public listen(...args) {
    super.listen(...args);
    getPort().then((port) => {
      this.httpsPort = port;
      this.httpsServer.listen(this.httpsPort, localhost, () => {
        log('httpsServer:listen', this.httpsPort);
      });
    });
    return this;
  }
  private async init() {
    const serverCrt = await this.certService.getForHost(
      'koagent-https-server',
    );
    this.httpsServer = https.createServer({
      SNICallback: async (servername, cb) => {
        const { cert, key } = await this.certService.getForHost(servername);
        cb(null, createSecureContext({ cert, key }));
      },
      cert: serverCrt.cert,
      key: serverCrt.key,
    });

    this.on('connect', (req, socket) => {
      this.tunnel.tunnel(req, socket, this.httpsPort, localhost);
    });
  }
}
