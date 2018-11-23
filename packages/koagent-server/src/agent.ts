import getPort from 'get-port';
import debug from 'debug';
import http from 'http';
import https from 'https';
import { createSecureContext } from 'tls';
import { IKoagentServerOptions } from './interfaces';
import { Tunnel } from './handlers';
import fillReqUrl from './fillReqUrl';

const log = debug('koagent:KoangetServer');

export default class KoangetServer {
  public static async createServer(options: IKoagentServerOptions) {
    const server = new KoangetServer(options);
    await server.init();
    return server;
  }
  private httpServer: http.Server;
  private httpsServer: https.Server;
  private httpsPort: number;
  private httpPort: number;
  private tunnel: Tunnel;
  private certService;
  constructor(
    { certService } : IKoagentServerOptions,
  ) {
    this.certService = certService;
    this.tunnel = new Tunnel();
  }

  public onRequest(handle) {
    this.httpServer.on('request', handle);
    this.httpsServer.on('request', (req, res) => {
      fillReqUrl(req);
      handle(req, res);
    });
    return this;
  }
  public onError(handle) {
    this.httpServer.on('error', handle);
    this.httpsServer.on('error', handle);
    return this;
  }
  public listen(port: number, ...args) {
    this.httpPort = port;
    this.httpServer.listen(this.httpPort, ...args);
    this.httpsServer.listen(this.httpsPort, () => {
      log('httpsServer:listen', this.httpsPort);
    });
    return this;
  }
  private async init() {
    this.httpServer = http.createServer();
    this.httpsPort = await getPort();

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

    this.httpServer.on('connect', (req, socket) => {
      const targetPort = parseInt(req.url.split(':')[1], 10) === 443
        ? this.httpsPort
        : this.httpPort;
      log('http:connect', 'url', req.url);
      log('http:connect', 'targetPort', targetPort);
      // this.tunnel.tunnelRequest(req, socket);
      this.tunnel.tunnel(req, socket, targetPort, '127.0.0.1');
    });
  }
}
