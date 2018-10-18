import fs from 'fs';
import path from 'path';
import { promisify } from 'es6-promisify';
import LRUCache from 'lru-cache';
import { ICertificateStorage, ICertificateModel, ICertificateStorageOptions } from './interfaces';

const fsReadFile = promisify(fs.readFile);
const fsWriteFile = promisify(fs.writeFile);
const fsExists = (p: string): Promise<boolean> =>
  new Promise((resolve) => {
    fs.exists(p, (exists: boolean) => {
      resolve(exists);
    });
  });

export class CertificateStorage implements ICertificateStorage {
  private cache: LRUCache.Cache<string, ICertificateModel>;
  private storagePath: string;
  private encoding: string;
  constructor(options: ICertificateStorageOptions, lruCacheOptions: void | LRUCache.Options) {
    // private storagePath: string, private encoding: string,
    this.storagePath = options.storagePath;
    this.encoding = options.encoding || 'utf-8';
    this.cache = new LRUCache({ max: 500, maxAge: 1000 * 60 * 60, ...lruCacheOptions });
  }
  public async has(storageKey: string): Promise<boolean> {
    return this.cache.has(storageKey) ||
      await fsExists(this.getCertPath(storageKey));
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
      fsReadFile(this.getKeyPath(storageKey), readOptions),
      fsReadFile(this.getCertPath(storageKey), readOptions),
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
      fsWriteFile(this.getKeyPath(storageKey), model.key, writeOptions),
      fsWriteFile(this.getCertPath(storageKey), model.cert, writeOptions),
    ]);
  }

  public getCertPath(storageKey: string) {
    return path.join(this.storagePath, `${storageKey}.crt`);
  }

  public getKeyPath(storageKey: string) {
    return path.join(this.storagePath, `${storageKey}.key`);
  }
}
