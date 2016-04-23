'use strict';

describe('The errors API', function () {

    var errorsFactory = require('../src/errors');
    var errors, functions, factoryFn;

    beforeEach(function () {
        setUpFunctions();
        errors = errorsFactory(functions);
    });

    function setUpFunctions() {
        functions = jasmine.createSpyObj('functions', ['factoryOf']);
        factoryFn = jasmine.createSpy('factoryFn');
        functions.factoryOf.and.returnValue(factoryFn);
    }

    describe('for an error type having a non-anonymous constructor function', function () {

        function CustomError() {
        }

        beforeEach(function () {
            errors.register(CustomError);
        });

        it('should create an error of the given type', function () {
            expect(functions.factoryOf).toHaveBeenCalledWith(CustomError);
            expect(errors.newCustomError).toBe(factoryFn);
        });

        it('should tell that an error is of the given type', function () {
            var customError = new CustomError();
            expect(errors.isCustomError(customError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(errors.isCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(errors.CustomError).toBe(CustomError);
        });
    });

    describe('for an error type having a non-anonymous constructor function whose name is overridden', function () {

        function CustomError() {
        }

        beforeEach(function () {
            errors.register(CustomError, 'MyCustomError');
        });

        it('should create an error of the given type', function () {
            expect(functions.factoryOf).toHaveBeenCalledWith(CustomError);
            expect(errors.newMyCustomError).toBe(factoryFn);
        });

        it('should tell that an error is of the given type', function () {
            var customError = new CustomError();
            expect(errors.isMyCustomError(customError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(errors.isMyCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(errors.MyCustomError).toBe(CustomError);
        });
    });

    describe('for an error type having an anonymous constructor function', function () {

        var AnonymousError = function () {
        };

        beforeEach(function () {
            errors.register(AnonymousError, 'CustomError');
        });

        it('should create an error of the given type', function () {
            expect(functions.factoryOf).toHaveBeenCalledWith(AnonymousError);
            expect(errors.newCustomError).toBe(factoryFn);
        });

        it('should tell that an error is of the given type', function () {
            var anonymousError = new AnonymousError();
            expect(errors.isCustomError(anonymousError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(errors.isCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(errors.CustomError).toBe(AnonymousError);
        });

        it('should throw an error if no name is given', function () {
            expect(errors.register.bind(errors, AnonymousError)).toThrow();
        });
    });

    describe('for an error type not having a constructor function', function () {

        var thirdParty = 'third-party';
        var isThirdPartyErrorStrategyFn = function (error) {
            return error.code === thirdParty;
        };

        beforeEach(function () {
            errors.register(null, 'ThirdPartyError', isThirdPartyErrorStrategyFn);
        });

        it('cannot create an error of the given type', function () {
            expect(errors.newThirdPartyError).toBeUndefined();
        });

        it('should tell that an error is of the given type', function () {
            var thirdPartyError = {
                code: thirdParty
            };
            expect(errors.isThirdPartyError(thirdPartyError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(errors.isThirdPartyError(error)).toBe(false);
        });

        it('cannot give access to the original constructor function for sub-typing', function () {
            expect(errors.ThirdPartyError).toBeUndefined();
        });

        it('should throw an error if no name is given', function () {
            expect(errors.register.bind(errors, null, null, isThirdPartyErrorStrategyFn)).toThrow();
        });

        it('should throw an error if no strategy function is given', function () {
            expect(errors.register.bind(errors, null, 'ThirdPartyError', null)).toThrow();
        });
    });
});