'use strict';

var errorsFactory = require('./errors');
var pluginFactory = require('./plugin');

module.exports = pluginFactory(errorsFactory);