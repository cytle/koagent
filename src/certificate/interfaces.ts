export interface ICertificateModel {
  cert: string;
  key: string;
}

export interface ICertificateService {
  getCertificationForHost(host: string): Promise<ICertificateModel>;
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
