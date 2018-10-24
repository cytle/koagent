import http from 'http';
import net from 'net';
import { IHttpServer } from './interfaces';

export class HttpServer implements IHttpServer {
  server: net.Server;
  constructor() {}
  public onRequest(handle) {
    this.server.on('request', handle);
    return this;
  }
  public onConnect(handle) {
    this.server.on('connect', handle);
    return this;
  }
  public onUpgrade(handle) {
    this.server.on('upgrade', handle);
    return this;
  }
  public onError(handle) {
    this.server.on('error', handle);
    return this;
  }
  public listen(...args) {
    this.server.listen(...args);
    return this;
  }
  public create() {
    this.server = http.createServer();
  }
}
