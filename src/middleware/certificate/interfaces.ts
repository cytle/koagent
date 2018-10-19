export interface ICertificateModel {
  cert: string;
  key: string;
}

export interface ICertificateService {
  getRoot(): Promise<ICertificateModel>;
  getForHost(host: string): Promise<ICertificateModel>;
}

export interface ICertificateStorage {
  has(storageKey: string): Promise<boolean>;
  get(storageKey: string): Promise<ICertificateModel>;
  set(storageKey: string, value: ICertificateModel): Promise<void>;
}

export interface ICertificateStorageOptions {
  storagePath: string;
  encoding?: string;
}

export interface ICertificateOptions extends ICertificateStorageOptions {
  rootKey: string;
}
