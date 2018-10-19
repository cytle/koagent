import fs from 'fs-extra';
import Koa from 'koa';
import _ from 'lodash';
import { ICertificateOptions, ICertificateService } from './interfaces';
import { CertificateService } from './CertificateService';
import { CertificateStorage } from './CertificateStorage';

declare module 'koa' {
  interface BaseContext {
    certificate: ICertificateService;
  }
}

export default (app: Koa, options: ICertificateOptions) => {
  fs.ensureDir(options.storagePath);
  const certStorage = new CertificateStorage(options, {});
  const certService = new CertificateService(options.rootKey, certStorage);
  app.context.certificate = certService;
};
