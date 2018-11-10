import debug from 'debug';
import Koa from 'koa';
import _ from 'lodash';
import Configstore from 'configstore';
import compose from 'koa-compose';
import koagentHttpProxy from '../../koagent-http-proxy/dist';

const log = debug('koagent:dfireReverseProxy');

const regx = /^\/([^/]+)\/([^/]+)\/(.*)?$/;

const defaultProjectsPort = {
  marketing: 8085,
  shop: 8086,
  om: 8087,
  meal: 8088,
  bill: 8089,
  retail: 8090,
  koa: 30000,
  'presell-activity': 8092,
  'presell-shop': 8093,
  'presell-om': 8094,
};

const localDomain = 'http://localhost';
const remoteDomin = 'http://api.l.whereask.com';

const getRmoteUrl = ({ branch, projectName, otherPath }) => {
  return `${remoteDomin}/${branch}/${projectName}/${otherPath}`;
};

const getLocalUrl = ({ otherPath }, port) => {
  return `${localDomain}:${port}/${otherPath}`;
};

interface Project {
  name: string;
  localPort: number;
  desc?: string;
}

export default class DifreProxyLocalMananger {
  private projects: Project[] = [];
  private forwardProjects: string[] = [];
  private configStore: Configstore;
  constructor() {
    this.resetProjects();
    this.configStore = new Configstore('koagent-dfire', {
      forwardProjects: this.forwardProjects,
    });
    this.restore();
  }
  needForward(projectName) {
    return this.forwardProjects.indexOf(projectName) !== -1;
  }
  addForward(projectName) {
    if (!this.needForward(projectName)) {
      this.forwardProjects.push(projectName);
      this.store();
    }
  }
  removeForward(projectName) {
    if (this.needForward(projectName)) {
      this.forwardProjects = this.forwardProjects
        .filter(vo => vo !== projectName);
      this.store();
    }
  }
  restore() {
    this.forwardProjects = this.configStore.get('forwardProjects');
  }
  store() {
    this.configStore.set('forwardProjects', this.forwardProjects);
  }
  match(path: string) {
    const res = path.match(regx);
    if (!res) {
      throw new Error(`path: "${path}" 不是一个有效的地址`);
    }
    const [, branch, projectName, otherPath] = res;
    const options = {
      branch, projectName, otherPath,
    };
    const project = this.projects.find(vo => vo.name === projectName);
    if (project && this.needForward(projectName)) {
      log('localFoward', projectName);
      return getLocalUrl(options, project.localPort);
    }
    return getRmoteUrl(options);
  }
  private resetProjects () {
    this.projects = _.map(defaultProjectsPort, (localPort, name) => ({
      localPort,
      name,
    }));
  }
  public getProjects() {
    return this.projects.map(vo => ({
      ...vo,
      needForward: this.needForward(vo.name),
    }));
  }
  public forward() {
    return compose([
      (ctx: Koa.Context, next) => {
        const targetUrl = this.match(ctx.path);
        log('target', ctx.path, '=>', targetUrl);
        ctx.req.url = targetUrl;
        return next();
      },
      koagentHttpProxy(),
    ]);
  }
}
