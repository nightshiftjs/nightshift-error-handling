'use strict';

module.exports = function createErrors(functions) {

    var errors = {};

    /**
     * This method registers the given type of errors. It can be used in different ways.
     *
     * <i>register(CustomError)</i> enriches the <i>errors</i> plugin with the 3 methods below. It throws an error if
     * the given constructor function is anonymous.
     * <ul>
     *      <li><i>errors.newCustomError(...)</i> is a factory function that returns new instances of <i>CustomError</i>.
     *      This method expects the same parameters as the original constructor function.</li>
     *      <li><i>errors.isCustomError(error)</i> is a strategy function that returns whether or not an error is of
     *      type <i>CustomError</i>.</li>
     *      <li><i>errors.CustomError</i> is the original constructor function that can be used for sub-typing
     *      <i>CustomError</i>.</li>
     * </ul>
     *
     * <i>register(CustomError, 'Custom')</i> enriches the <i>errors</i> plugin with the same 3 methods, but it uses the
     * given string as base name instead of the name of the given constructor function, which can then be anonymous.
     * <ul>
     *      <li><i>errors.newCustom(...)</i> is a factory function that returns new instances of <i>CustomError</i>.
     *      This method expects the same parameters as the original constructor function.</li>
     *      <li><i>errors.isCustom(error)</i> is a strategy function that returns whether or not an error is of type
     *      <i>CustomError</i>.</li>
     *      <li><i>errors.Custom</i> is the original constructor function that can be used for sub-typing
     *      <i>CustomError</i>.</li>
     * </ul>
     *
     * <i>register(null, 'Custom', function isCustom(error) {...})</i> enriches the <i>errors</i> plugin with the method
     * below. It is intended to be used for registering errors which do not have a constructor function
     * (e.g. third-party errors).
     * <ul>
     *      <li><i>errors.isCustom(error)</i> is a strategy function that returns whether or not an error is a 'Custom'
     *      error.</li>
     * </ul>
     *
     * @param [ErrorConstructorFn] the constructor function of the error type, or <i>null</i> if the error type has no
     * constructor function.
     *
     * @param [errorName] the name of the error type. It is optional and set by default to the name of the constructor
     * function. It has to be specified if the constructor function is anonymous or if there is no constructor function.
     *
     * @param [isErrorStrategyFn] a strategy function that returns whether or not the error it receives is of the type
     * that is being registered. It is optional and will by default check if the error is an <i>instanceof</i> the
     * constructor function. It has to be specified if there is no constructor function.
     */
    errors.register = function (ErrorConstructorFn, errorName, isErrorStrategyFn) {
        // check preconditions
        if (!errorName && (!ErrorConstructorFn || !ErrorConstructorFn.name)) {
            throw new Error('Could not determine the name of the given error type!');
        }
        if (!isErrorStrategyFn && !ErrorConstructorFn) {
            throw new Error('Could not determine the strategy to check whether or not an error is of the given error type!');
        }

        // initialize optional parameters
        errorName = errorName ? errorName : ErrorConstructorFn.name;
        isErrorStrategyFn = isErrorStrategyFn ? isErrorStrategyFn : function (error) {
            return error instanceof ErrorConstructorFn;
        };

        // enrich plugin
        if (ErrorConstructorFn) {
            errors[errorName] = ErrorConstructorFn;
            errors['new' + errorName] = functions.factoryOf(ErrorConstructorFn);
        }
        errors['is' + errorName] = isErrorStrategyFn;
    };

    return errors;
};