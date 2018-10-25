"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../src/config"));
Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
    yield fs_extra_1.default.remove(config_1.default.certifacateStoragePath);
    yield fs_extra_1.default.mkdir(config_1.default.certifacateStoragePath);
    const { certifacateRootKey, certifacatePath, certifacateStoragePath } = config_1.default;
    const files = ['crt', 'key']
        .map(suffix => `${certifacateRootKey}.${suffix}`)
        .map(name => [
        path_1.default.join(certifacatePath, name),
        path_1.default.join(certifacateStoragePath, name),
    ]);
    console.log(files);
    yield files.map(([src, dest]) => fs_extra_1.default.copy(src, dest));
    console.log('finish copy');
}));
//# sourceMappingURL=postinstall.js.map