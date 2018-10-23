import http from 'http';
import net from 'net';
import { IHttpServer } from './interfaces';

export class HttpServer implements IHttpServer {
  server: net.Server;
  constructor() {}
  public onRequest(handler) {
    this.server.on('request', handler);
  }
  public onConnect(handler) {
    this.server.on('connect', handler);
  }
  public onUpgrade(handler) {
    this.server.on('upgrade', handler);
  }
  public onError(handler) {
    this.server.on('upgrade', handler);
  }
  public listen(port) {
    this.server.listen(port, '0.0.0.0');
  }
  public create(): Promise<IHttpServer> | IHttpServer {
    this.server = http.createServer();
    return this;
  }
}
