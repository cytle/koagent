export interface IHttpServer {
  create(): Promise<IHttpServer> | IHttpServer;
  onRequest(handler: Function): void;
  onConnect(handler: Function): void;
  onUpgrade(handler: Function): void;
  onError(handler: Function): void;
  listen(port: string): void;
}
