# nightshift-error-handling

[![Build Status][build]](https://travis-ci.org/nightshiftjs/nightshift-error-handling) [![Coverage Status][coverage]](https://coveralls.io/github/nightshiftjs/nightshift-error-handling) [![Dependencies Status][deps]](https://david-dm.org/nightshiftjs/nightshift-error-handling)

[build]: https://img.shields.io/travis/nightshiftjs/nightshift-error-handling/promises.svg?maxAge=2592000&style=flat
[coverage]: https://img.shields.io/coveralls/nightshiftjs/nightshift-error-handling/promises.svg?maxAge=2592000&style=flat
[deps]: https://img.shields.io/david/nightshiftjs/nightshift-error-handling/promises.svg?maxAge=2592000&style=flat

This [NightShift](https://github.com/nightshiftjs) plugin helps you writing robust code by providing an extendable, consistent and test-friendly way of handling errors.

## About Error Handling

Handling errors typically implies 

- throwing new errors, e.g. when business rules are violated
- checking whether or not an error is of a given type, e.g. to log only the _unexpected_ errors 
- creating custom, fine-grained error types and sub-types (thanks to prototypal inheritance), so that you can tell exactly what went wrong

When writing robust code, you have to cope not only with your own errors, but also with the ones thrown by third-party libraries and frameworks. In JavaScript, the expression that is thrown is not necessarily an instance of ```Error```. All the examples below are valid.

```javascript
throw new Error('ERROR-42');
throw {code: 42};
throw 'ERROR-42';
throw 42;
throw true;
```

## Setup
The support for error handling can be added to NightShift as a plugin.

```javascript
var nightShift = require('nightshift-core');
var errorHandling = require('nightshift-error-handling');

nightShift.plugin(errorHandling);
```

## nightShift.errors
The NightShift plugin for error handling enriches `nightShift` with the `errors` object.

### register(ErrorConstructorFn, errorName, isErrorStrategyFn)
The method `nightShift.errors.register(ErrorConstructorFn, errorName, isErrorStrategyFn)` registers the given type of errors.
 
- `ErrorConstructorFn`is the constructor function of the error type, or `null` if the error type has no constructor function.
- `errorName` is the name of the error type. It is optional and set by default to the name of the constructor function. It has to be specified if the constructor function is anonymous or if there is no constructor function.
- `isErrorStrategyFn` is a strategy function that returns whether or not the error it receives is of the type that is being registered. It is optional and will by default check if the error is an `instanceof` the constructor function. It has to be specified if there is no constructor function.

This method is intended to be used in 3 different ways, as explained below. 

#### Register a constructor function
Let's consider an error type whose constructor function is `CustomError`. 

```javascript
function CustomError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.message = message;
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;
```

`register(CustomError)` enriches the `errors` plugin with the 3 methods below.

- `errors.newCustomError(...)` is a factory function that returns new instances of `CustomError`. This method expects the same parameters as the original constructor function (i.e. `code` and `message` in this example).
- `errors.isCustomError(error)` is a strategy function that returns whether or not an error is of type `CustomError`.
- `errors.CustomError` is the original constructor function that can be used for sub-typing `CustomError`.

#### Register an anonymous constructor function
Let's consider an error type whose constructor function is anonymous.
 
```javascript
var CustomError = function (code, message) {...}
``` 
 
`register(CustomError, 'Custom')` enriches the `errors` plugin with the same 3 methods, but it uses the given string as base name instead of the name of the given constructor function, which can then be anonymous.

- `errors.newCustom(...)` is a factory function that returns new instances of `CustomError`. This method expects the same parameters as the original constructor function (i.e. `code` and `message` in this example).
- `errors.isCustom(error)` is a strategy function that returns whether or not an error is of type `CustomError`.
- `errors.Custom` is the original constructor function that can be used for sub-typing `CustomError`.

Note that an error is thrown when registering an anonymous constructor function without specifying a name.

#### Register a strategy function
Let's consider an error type that does not have a constructor function, typically errors thrown by third-party libraries or frameworks.

```javascript
throw {
    code: '...',
    message: '...'
};
```

`register(null, 'Custom', function isCustom(error) {...})` enriches the `errors` plugin with the method below.

- `errors.isCustom(error)` is the strategy function that returns whether or not an error is a _Custom_ error.

## Extendability
The NightShift plugin for error handling is designed to be extended with your own error types. 
```javascript
// plug the support for error handling
var nightShift = require('nightshift-core');
var errorHandling = require('nightshift-error-handling');
nightShift.plugin(errorHandling);

// register your own error types
var CustomError = require('./errors/custom-error');
nightShift.errors.register(CustomError);
```

Error types can also be registered by other NightShift plugins.
```javascript
module.exports = function createPluginFunction(CustomError) {
    return function plugin(nightShift) {
        // nightShift.errors is an optional runtime dependency
        if (nightShift.errors) {
            nightShift.errors.register(CustomError);   
        }        
    };
};
```

## Consistency
You want to throw a new error? You want to check whether or not an error is of a given type? Easy! Everything is gathered under a common API that follows consistent naming conventions.

## Test-Friendliness
Using `new` when throwing an error or `instanceof` when checking if an error is of a given type makes your code harder to test. Relying on `errors` allows you to mock the factory methods and the strategy methods that you use. Testing is therefore easier.

## Tips
- Even if you don't create your own error types, you can register `Error` and benefit from the methods `errors.newError(...)` and `errors.isError(error)`.
 
```javascript
nightShift.errors.register(Error);
```
 
- You can combine this plugin with the plugin for [dependency injection](https://github.com/nightshiftjs/nightshift-dependency-injection) and make `errors` injectable. This is an elegant solution if you want to decentralize the registration of errors.

```javascript
var nightShift = require('nightshift-core');

// plug the dependency injection
var di = require('nightshift-dependency-injection');
nightShift.plugin(di);

// plug the support for error handling
var errorHandling = require('nightshift-error-handling');
nightShift.plugin(errorHandling);

// create a new injector
var injector = nightShift.di.newInjector();

// make errors injectable
injector.register(nightShift.errors, 'errors', false);
```

## Contribute
The tests can be executed by running the command below.
```
npm install && npm test
```

The test coverage can be checked by running the command below. It executes the tests and it generates a coverage report in _build/coverage/index.html_.
```
npm install && npm build-coverage
```

The quality of the code can be checked by running the command below. It detects potential problems in the code with JSHint, it executes the tests and it generates a coverage report. 
```
npm install && npm build
```