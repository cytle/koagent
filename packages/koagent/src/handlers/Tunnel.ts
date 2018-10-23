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
    const conn = net.connect(port, host, () => {
      socket.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'UTF-8', () => {
        conn.pipe(socket);
        socket.pipe(conn);
      });
    });

    conn.on('error', (e) => {
      log('tunnel', 'error', e);
    });
  }
}
