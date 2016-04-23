'use strict';

describe('The support for error handling', function () {

    var nightShift = require('nightshift-core');
    var errorHandling = require('../src');

    beforeEach(function () {
        nightShift.plugin(errorHandling);
    });

    describe('for an error type having a non-anonymous constructor function', function () {

        function CustomError() {
        }

        beforeEach(function () {
            nightShift.errors.register(CustomError);
        });

        it('should create an error of the given type', function () {
            expect(nightShift.errors.newCustomError()).toEqual(jasmine.any(CustomError));
        });

        it('should tell that an error is of the given type', function () {
            var customError = new CustomError();
            expect(nightShift.errors.isCustomError(customError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(nightShift.errors.isCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(nightShift.errors.CustomError).toBe(CustomError);
        });
    });

    describe('for an error type having a non-anonymous constructor function whose name is overridden', function () {

        function CustomError() {
        }

        beforeEach(function () {
            nightShift.errors.register(CustomError, 'MyCustomError');
        });

        it('should create an error of the given type', function () {
            expect(nightShift.errors.newMyCustomError()).toEqual(jasmine.any(CustomError));
        });

        it('should tell that an error is of the given type', function () {
            var customError = new CustomError();
            expect(nightShift.errors.isMyCustomError(customError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(nightShift.errors.isMyCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(nightShift.errors.MyCustomError).toBe(CustomError);
        });
    });

    describe('for an error type having an anonymous constructor function', function () {

        var AnonymousError = function () {
        };

        beforeEach(function () {
            nightShift.errors.register(AnonymousError, 'CustomError');
        });

        it('should create an error of the given type', function () {
            expect(nightShift.errors.newCustomError()).toEqual(jasmine.any(AnonymousError));
        });

        it('should tell that an error is of the given type', function () {
            var anonymousError = new AnonymousError();
            expect(nightShift.errors.isCustomError(anonymousError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(nightShift.errors.isCustomError(error)).toBe(false);
        });

        it('should give access to the original constructor function for sub-typing', function () {
            expect(nightShift.errors.CustomError).toBe(AnonymousError);
        });

        it('should throw an error if no name is given', function () {
            expect(nightShift.errors.register.bind(nightShift.errors, AnonymousError)).toThrow();
        });
    });

    describe('for an error type not having a constructor function', function () {

        var thirdParty = 'third-party';
        var isThirdPartyErrorStrategyFn = function (error) {
            return error.code === thirdParty;
        };

        beforeEach(function () {
            nightShift.errors.register(null, 'ThirdPartyError', isThirdPartyErrorStrategyFn);
        });

        it('cannot create an error of the given type', function () {
            expect(nightShift.errors.newThirdPartyError).toBeUndefined();
        });

        it('should tell that an error is of the given type', function () {
            var thirdPartyError = {
                code: thirdParty
            };
            expect(nightShift.errors.isThirdPartyError(thirdPartyError)).toBe(true);
        });

        it('should tell that an error is not of the given type', function () {
            var error = new Error();
            expect(nightShift.errors.isThirdPartyError(error)).toBe(false);
        });

        it('cannot give access to the original constructor function for sub-typing', function () {
            expect(nightShift.errors.ThirdPartyError).toBeUndefined();
        });

        it('should throw an error if no name is given', function () {
            expect(nightShift.errors.register.bind(nightShift.errors, null, null, isThirdPartyErrorStrategyFn)).toThrow();
        });

        it('should throw an error if no strategy function is given', function () {
            expect(nightShift.errors.register.bind(nightShift.errors, null, 'ThirdPartyError', null)).toThrow();
        });
    });

    describe('for Error', function () {

        beforeEach(function () {
            nightShift.errors.register(Error);
        });

        it('should create an error of the type Error', function () {
            expect(nightShift.errors.newError()).toEqual(jasmine.any(Error));
        });

        it('should tell that an error is of the type Error', function () {
            var error = new Error();
            expect(nightShift.errors.isError(error)).toBe(true);
        });

        it('should tell that an error is not of the type Error', function () {
            var error = 42;
            expect(nightShift.errors.isError(error)).toBe(false);
        });

        it('should give access to Error for sub-typing', function () {
            expect(nightShift.errors.Error).toBe(Error);
        });
    });
});