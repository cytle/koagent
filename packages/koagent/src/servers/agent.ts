import getPort from 'get-port';
import debug from 'debug';
import { HttpsServer } from './https';
import { HttpServer } from './http';
import { IHttpServer, IKoagentServerOptions } from './interfaces';
import { Tunnel } from '../handlers';
import fillReqUrl from './fillReqUrl';

const log = debug('koagent:KoangetServer');

export class KoangetServer implements IHttpServer {
  public static async createServer(options: IKoagentServerOptions) {
    const server = new KoangetServer(options);
    await server.create();
    return server;
  }
  private servers: {
    httpServer: HttpServer;
    httpsServer: HttpsServer;
  };
  private httpsPort: number | undefined;
  private httpPort: number;
  private tunnel: Tunnel;
  constructor({ certService, httpsPort } : IKoagentServerOptions) {
    this.httpsPort = httpsPort;
    this.servers = {
      httpServer: new HttpServer(),
      httpsServer: new HttpsServer(certService),
    };
    this.tunnel = new Tunnel();
  }
  public onRequest(handle) {
    this.servers.httpServer.onRequest(handle);
    this.servers.httpsServer.onRequest((req, ...args) => {
      fillReqUrl(req, 'https');
      handle(req, ...args);
    });
    return this;
  }
  public onConnect(handle) {
    this.servers.httpServer.onConnect(handle);
    return this;
  }
  public onUpgrade(handle) {
    this.servers.httpServer.onUpgrade((req, ...args) => {
      fillReqUrl(req, 'ws');
      handle(req, ...args);
    });
    this.servers.httpsServer.onUpgrade((req, ...args) => {
      fillReqUrl(req, 'wss');
      handle(req, ...args);
    });
    return this;
  }
  public onError(handle) {
    this.servers.httpServer.onError(handle);
    this.servers.httpsServer.onError(handle);
    return this;
  }
  public listen(port: number, ...args) {
    this.httpPort = port;
    this.servers.httpServer.listen(this.httpPort, ...args);
    this.servers.httpsServer.listen(this.httpsPort, () => {
      log('httpsServer:listen', this.httpsPort);
    });
    return this;
  }
  public async create() {
    const {
      httpsServer,
      httpServer,
    } = this.servers;
    await httpsServer.create();
    await httpServer.create();
    this.httpsPort = this.httpsPort || await getPort();
    this.servers.httpServer.onConnect((req, socket) => {
      const targetPort = parseInt(req.url.split(':')[1], 10) === 443
        ? this.httpsPort
        : this.httpPort;
      log('http:connect', 'url', req.url);
      log('http:connect', 'targetPort', targetPort);
      // this.tunnel.tunnelRequest(req, socket);
      this.tunnel.tunnel(req, socket, targetPort, '127.0.0.1');
    });
    this.servers.httpsServer.onConnect((req, socket) => {
      log('https:connect', 'url', req.url);
      this.tunnel.tunnelRequest(req, socket);
    });
  }
}
