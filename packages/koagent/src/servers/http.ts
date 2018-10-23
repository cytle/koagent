import http from 'http';
import net from 'net';
import { IHttpServer } from './interfaces';

export class HttpServer implements IHttpServer {
  server: net.Server;
  constructor() {}
  public onRequest(handle) {
    this.server.on('request', handle);
  }
  public onConnect(handle) {
    this.server.on('connect', handle);
  }
  public onUpgrade(handle) {
    this.server.on('upgrade', handle);
  }
  public onError(handle) {
    this.server.on('error', handle);
  }
  public listen(...args) {
    this.server.listen(...args);
    return this;
  }
  public create(): Promise<IHttpServer> | IHttpServer {
    this.server = http.createServer();
    return this;
  }
}
