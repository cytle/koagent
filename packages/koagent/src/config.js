"use strict";
exports.__esModule = true;
var os_1 = require("os");
var path_1 = require("path");
var configDir = path_1["default"].join(os_1["default"].homedir(), '.config/koagent/');
exports["default"] = {
    certifacateStoragePath: path_1["default"].join(configDir, 'certificate'),
    certifacatePath: path_1["default"].join(__dirname, '..', 'certificate'),
    certifacateRootKey: 'zproxy'
};
