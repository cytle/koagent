import net from 'net';
import url from 'url';

export function connectHandler(req, cSock) {
  const parsedUrl = url.parse(`http://${req.url}`);
  const port = parseInt(parsedUrl.port || '80', 10);
  const pSock = net.connect(port, parsedUrl.hostname, () => {
    cSock.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'UTF-8', () => {
      pSock.pipe(cSock);
      cSock.pipe(pSock);
    });
  });

  pSock.on('error', (e) => {
    console.error(e);
  });
}
