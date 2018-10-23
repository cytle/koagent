import debug from 'debug';
export * from './https';
export * from './http';
export * from './interfaces';
import { HttpsServer } from './https';
import { HttpServer } from './http';
import { IHttpServer } from './interfaces';
import { Tunnel } from '../handlers';
import fillReqUrl from './fillReqUrl';

const log = debug('koagent:proxyServer');

export default class Server implements IHttpServer {
  private servers: {
    httpServer: HttpServer;
    httpsServer: HttpsServer;
  };
  private tunnel: Tunnel;
  constructor(certService, private httpsPort: number, private httpPort: number) {
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
  }
  public onConnect(handle) {
    this.servers.httpServer.onConnect(handle);
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
  }
  public onError(handle) {
    this.servers.httpServer.onError(handle);
    this.servers.httpsServer.onError(handle);
  }
  public listen(port: number, ...args) {
    this.servers.httpServer.listen(port, ...args);
    this.servers.httpsServer.listen(this.httpsPort, () => {
      log('httpsServer:listen', this.httpsPort);
    });
    return this;
  }
  public async create(): Promise<IHttpServer> {
    const {
      httpsServer,
      httpServer,
    } = this.servers;
    await httpsServer.create();
    await httpServer.create();
    this.servers.httpServer.onConnect((req, socket) => {
      const targetPort = parseInt(req.url.split(':')[1], 10) === 443
        ? this.httpsPort
        : this.httpPort;
      log('httpServer:connect', parseInt(req.url.split(':')[1], 10), targetPort);
      log('httpServer:connect', req.url);
      // this.tunnel.tunnelRequest(req, socket);
      this.tunnel.tunnel(req, socket, targetPort, '127.0.0.1');
    });
    this.servers.httpsServer.onConnect((req, socket) => {
      log('httpsServer:connect', req.url);
      this.tunnel.tunnelRequest(req, socket);
    });
    return this;
  }
}
