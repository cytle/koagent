const pem = require('pem');
const LRU = require('lru-cache');
const promisfy = require('promisfy');

const getCertificate = promisfy(pem.createCertificate);

class CertificateService {
  constructor() {
    this.cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });
  }

  static getRoot() {
    return getCertificate({ days: 1 });
  }
}

module.exports = CertificateService;
