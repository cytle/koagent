import debug from 'debug';
import Koa from 'koa';
import _ from 'lodash';
import Configstore from 'configstore';
import compose from 'koa-compose';
import { koagentHttpProxy } from 'koagent';

const log = debug('koagent:dfireReverseProxy');

const regx = /(^[^/]+)\/([^/]+)(\/.*)?$/;

const defaultProjectsPort = {
  'presell-shop': 9999,
};

const localDomain = 'http://localhost';
const remoteDomin = 'http://api.l.whereask.com';

const getRmoteUrl = ({ branch, projectName, otherPath }) => {
  return `${remoteDomin}/${branch}/${projectName}${otherPath}`;
};

const getLocalUrl = ({ otherPath }, port) => {
  return `${localDomain}:${port}/${otherPath}`;
};

interface Project {
  name: string;
  localPort: number;
  desc?: string;
}

class DifreProxyLocalMananger {
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
  forward(projectName) {
    if (!this.needForward(projectName)) {
      this.forwardProjects.push(projectName);
      this.store();
    }
  }
  dontForward(projectName) {
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
  match(req) {
    const res = req.path.match(regx);
    if (!res) {
      return req.url || '';
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
}

/**
 * 使用http-proxy转发请求
 */

export default () => {
  const mananger = new DifreProxyLocalMananger();
  return compose([
    ({ req }: Koa.Context) => {
      req.url = mananger.match(req);
    },
    koagentHttpProxy(),
  ]);
};
