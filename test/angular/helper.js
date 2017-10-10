var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;
global.navigator = window.navigator = {};
global.Node = window.Node;

global.window.mocha = {};
global.window.beforeEach = beforeEach;
global.window.afterEach = afterEach;

/*
 * Only for NPM users
 */
require('angular/angular');
require('angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;

//libraries
global._ = require("lodash");

var camaraUtils = require('./mock/require.js');
global.camaraRequire = camaraUtils.camaraRequire;
global.camaraConfig = camaraUtils.camaraConfig;
