import https from 'https';
import { createSecureContext } from 'tls';
import { HttpServer } from './http';
import { ICertificateService } from 'koagent-certificate';

export class HttpsServer extends HttpServer{
  constructor(private certService: ICertificateService) {
    super();
  }
  public async create() {
    const serverCrt = await this.certService.getForHost(
      'koagent-https-server',
    );
    this.server = https.createServer({
      SNICallback: async (servername, cb) => {
        const { cert, key } = await this.certService.getForHost(servername);
        cb(null, createSecureContext({ cert, key }));
      },
      cert: serverCrt.cert,
      key: serverCrt.key,
    });
    return this;
  }
}
