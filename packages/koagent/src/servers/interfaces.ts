import { ICertificateService } from 'koagent-certificate';

export interface IHttpServer {
  create(): void;
  onRequest(handle: Function): this;
  onConnect(handle: Function): this;
  onUpgrade(handle: Function): this;
  onError(handle: Function): this;
  listen(port?: number, hostname?: string, backlog?: number, listeningListener?: Function): this;
  listen(port?: number, hostname?: string, listeningListener?: Function): this;
  listen(port?: number, backlog?: number, listeningListener?: Function): this;
  listen(port?: number, listeningListener?: Function): this;
}

export interface IKoagentServerOptions {
  certService: ICertificateService;
  httpsPort?: number;
}
