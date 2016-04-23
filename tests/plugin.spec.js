'use strict';

describe('The plugin', function () {

    var pluginFactory = require('../src/plugin');
    var nightShift, plugin, errorsFactory, errors;

    beforeEach(function () {
        setUpErrorsFactory();
        setUpNightShift();
        plugin = pluginFactory(errorsFactory);
    });

    function setUpErrorsFactory() {
        errors = 'errors';
        errorsFactory = jasmine.createSpy('errorsFactory');
        errorsFactory.and.returnValue(errors);
    }

    function setUpNightShift() {
        nightShift = {
            functions: 'functions'
        };
    }

    it('should enrich the NightShift core object with a \'errors\' plugin', function () {
        plugin(nightShift);
        expect(errorsFactory).toHaveBeenCalledWith(nightShift.functions);
        expect(nightShift.errors).toBe(errors);
    });
});