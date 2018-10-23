export interface IHttpServer {
  create(): Promise<IHttpServer> | IHttpServer;
  onRequest(handle: Function): void;
  onConnect(handle: Function): void;
  onUpgrade(handle: Function): void;
  onError(handle: Function): void;
  listen(port?: number, hostname?: string, backlog?: number, listeningListener?: Function): this;
  listen(port?: number, hostname?: string, listeningListener?: Function): this;
  listen(port?: number, backlog?: number, listeningListener?: Function): this;
  listen(port?: number, listeningListener?: Function): this;
}
