import net from 'net';
import url from 'url';
import debug from 'debug';

const log = debug('koagent:Tunnel');
export class Tunnel {
  constructor() {}

  tunnelRequest(req, socket) {
    const parsedUrl = url.parse(`http://${req.url}`);
    const port = parseInt(parsedUrl.port || '80', 10);
    return this.tunnel(req, socket, port, parsedUrl.hostname);
  }

  tunnel(req, socket, port, host?) {
    log('tunnel', req.url, port);
    return new Promise((resovle, reject) => {
      const conn = net.connect(port, host, () => {
        const head = `HTTP/${req.httpVersion} 200 Connection Established\r\n\r\n`;
        // const head = `HTTP/${req.httpVersion} 200 OK\r\n\r\n`;

        socket.write(head, 'UTF-8', () => {
          conn.pipe(socket);
          socket.pipe(conn);
        });
      });

      conn.on('error', (e) => {
        log('tunnel', 'error', e);
        reject();
      });
      conn.on('end', resovle);
    });
  }
}
