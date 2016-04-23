'use strict';

module.exports = function createPluginFunction(errorsFactory) {

    return function plugin(nightShift) {
        nightShift.errors = errorsFactory(nightShift.functions);
    };
};