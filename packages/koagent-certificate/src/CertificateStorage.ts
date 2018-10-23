import fs from 'fs-extra';
import path from 'path';
import LRUCache from 'lru-cache';
import { ICertificateStorage, ICertificateModel, ICertificateStorageOptions } from './interfaces';

export class CertificateStorage implements ICertificateStorage {
  private cache: LRUCache.Cache<string, ICertificateModel>;
  private storagePath: string;
  private encoding: string;
  constructor(options: ICertificateStorageOptions, lruCacheOptions: void | LRUCache.Options) {
    // private storagePath: string, private encoding: string,
    fs.ensureDir(options.storagePath);
    this.storagePath = options.storagePath;
    this.encoding = options.encoding || 'utf-8';
    this.cache = new LRUCache({ max: 500, maxAge: 1000 * 60 * 60, ...lruCacheOptions });
  }
  public async has(storageKey: string): Promise<boolean> {
    return this.cache.has(storageKey) ||
      await fs.pathExists(this.getCertPath(storageKey));
  }
  public async get(storageKey: string): Promise<ICertificateModel> {
    if (this.cache.has(storageKey)) {
      const model = this.cache.get(storageKey);
      if (model === undefined) {
        throw new Error(`certificateModel is undefined which storageKey is ${storageKey}`);
      }
      return model;
    }

    const readOptions = {
      encoding: this.encoding,
    };
    const [key, cert] = await Promise.all([
      fs.readFile(this.getKeyPath(storageKey), readOptions),
      fs.readFile(this.getCertPath(storageKey), readOptions),
    ]);
    const model = { key, cert };
    this.cache.set(storageKey, model);
    return model;
  }

  public async set(storageKey: string, model: ICertificateModel) {
    const writeOptions = {
      encoding: this.encoding,
    };

    this.cache.set(storageKey, model);
    await Promise.all([
      fs.writeFile(this.getKeyPath(storageKey), model.key, writeOptions),
      fs.writeFile(this.getCertPath(storageKey), model.cert, writeOptions),
    ]);
  }

  public getCertPath(storageKey: string) {
    return path.join(this.storagePath, `${storageKey}.crt`);
  }

  public getKeyPath(storageKey: string) {
    return path.join(this.storagePath, `${storageKey}.key`);
  }
}
