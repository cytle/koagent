import http from 'http';
import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import DifreproxyLocalManager from './dfireProxyLocal';
import DfireProxyLocalServer from './DfireProxyLocalServer';
import { createCertificateService } from 'koagent-certificate';
import koaStatic from 'koa-static';
import koaLogger from 'koa-logger';
import debug from 'debug';
import createIo from 'socket.io';
import defaultConfig from './config';

const log = debug('koagent-difre');

export default async function koagentDifre({
  proxyPort,
  managerPort,
}) {
  const proxyLocalManager = new DifreproxyLocalManager();

  const certService = createCertificateService({
    storagePath: defaultConfig.certifacateStoragePath,
    rootKey: defaultConfig.certifacateRootKey,
  });
  const proxyLocalServer = await DfireProxyLocalServer.createServer({
    certService,
    forward: proxyLocalManager.forward(),
  });

  proxyLocalServer.listen(proxyPort);

  const router = new KoaRouter({
    prefix: '/api/localProxy',
  });
  router.get('/server', (ctx) => {
    ctx.body = proxyLocalServer.getState();
  });
  router.get('/projects', (ctx) => {
    ctx.body = proxyLocalManager.getProjects();
  });
  router.put('/forward', (ctx) => {
    proxyLocalManager.addForward(ctx.query.projectName);
    ctx.response.status = 200;
  });
  router.delete('/forward', (ctx) => {
    proxyLocalManager.removeForward(ctx.query.projectName);
    ctx.response.status = 200;
  });
  const app = new Koa();
  app
    .use(koaLogger((str) => {
      console.log('[manager]', str);
    }))
    .use(koaStatic(path.join(__dirname, '..', 'dist', 'client')))
    .use(router.routes())
    .use(router.allowedMethods());

  const server = http.createServer(app.callback());
  const io = createIo(server);
  io.on('connection', (socket) => {
    socket.join('localProxy');
    socket.on('removeForward', (projectName) => {
      proxyLocalManager.removeForward(projectName);
    });
    socket.on('addForward', (projectName) => {
      proxyLocalManager.addForward(projectName);
    });
  });
  const localProxyRoom = io.to('localProxy');

  const socketBridge = (emitter, events: string[]) => {
    events.forEach((vo) => {
      emitter.on(vo, (payload) => {
        localProxyRoom.emit(vo, payload);
      });
    });
  };
  app.on('error', (payload) => {
    localProxyRoom.emit('log', payload.message || payload);
  });
  proxyLocalServer.on('error', (payload) => {
    localProxyRoom.emit('log', payload.message || payload);
  });
  socketBridge(proxyLocalManager, ['forward', 'addForward', 'removeForward', 'storing', 'stored']);
  socketBridge(proxyLocalServer, ['logRequest', 'listend', 'log']);

  server.listen(managerPort, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    log('listend', `localhost:${managerPort}`);
  });
}
