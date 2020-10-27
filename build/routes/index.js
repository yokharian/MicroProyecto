"use strict";
exports.default = function (_a) {
    var app = _a.app, _b = _a.path, path = _b === void 0 ? '/' : _b, _c = _a.exclude, exclude = _c === void 0 ? '' : _c;
    var join = require('path').join;
    var listaDeRoutes = require('fs')
        .readdirSync(__dirname)
        .filter(function (v) { return !v.match(/index/); })
        .filter(function (v) { return !v.match(new RegExp(exclude, 'gi')); });
    console.log('LOADED', listaDeRoutes);
    listaDeRoutes.forEach(function (api) {
        var router = require(join(__dirname, api)).default(app);
        var apiName = api.slice(0, api.length - 3).toLowerCase();
        app.use(path + apiName, router);
    });
    app.use(path, function (_, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Hello from Express.js!</h1>');
        res.end();
    });
};
