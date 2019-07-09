"use strict";

let bindings = {};
let resolvedBindings = {};
let singletons = {};
let resolvedSingletons = {};

/**
 * Checks if an object is a string
 * @method isString
 * @param  {Object} obj Object we want to check
 * @return {Boolean} Is the object a string?
 */
function isString(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

/**
 * Checks if an object is an object
 * @method isObject
 * @param  {Object} obj Object we want to check
 * @return {Boolean} Is the object a object?
 */
function isObject(obj) {
  var type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
}

/**
 * Checks if an object is a function
 * @method isFunction
 * @param  {Object} obj Object we want to check
 * @return {Boolean} Is the object a function?
 */
function isFunction(obj) {
  return typeof obj == "function" || false;
}

/**
 * Checks if a key is in an object
 * @method inObject
 * @param  {String} key Key of object
 * @param  {Object} obj Object we want to check
 * @return {Boolean} Is that key in the object?
 */
function inObject(key, obj) {
  return obj.hasOwnProperty(key);
}

/**
 * Gets all of the current bindings in the container
 * @method getBindings
 * @return {Object} The containers bindings
 */
exports.getBindings = function getBindings() {
  return bindings;
};

/**
 * Gets all of the current singletons in the container
 * @method getSingletons
 * @return {Object} The containers singletons
 */
exports.getSingletons = function getSingletons() {
  return singletons;
};

/**
 * Resets container to default state
 * @method clearAll
 */
exports.clear = function clearAll() {
  bindings = {};
  resolvedBindings = {};
  singletons = {};
  resolvedSingletons = {};
};

/**
 * Assigns to our bindings object
 * @method bind
 * @param  {String} binding The name of the IoC binding
 * @param  {Mixed} closure Factory method or value to bind to container
 */
exports.bind = function bind(binding, closure) {
  if (inObject(binding, bindings) || inObject(binding, singletons)) {
    throw new Error(`Binding: ${binding} already binded.`);
  }

  if (!isFunction(closure)) {
    throw new Error(`Binding: ${binding} does not implement a factory.`);
  }

  bindings[binding] = closure;
};

/**
 * Assigns to our singleton object
 * @method singleton
 * @param  {String} binding The name of the IoC binding
 * @param  {function} closure Factory method or value to bind to container
 */
exports.singleton = function singleton(binding, closure) {
  if (inObject(binding, singletons) || inObject(binding, bindings)) {
    throw new Error(`Singleton: ${binding} already binded.`);
  }

  singletons[binding] = closure;
};

/**
 * Grabs a binding from the IoC. Leverages node require as a fallback
 * @method use
 * @param  {String} binding The name of the binding in the container
 * @return {Object} The instance of the binding
 */
exports.use = function use(binding) {
  var args = Array.prototype.slice.call(arguments, 1);

  // first check bindings
  if (inObject(binding, bindings)) {
    if (resolvedBindings[binding]) {
      throw new Error(`Cyclic dependency detected in binding: ${binding}.`);
    }

    resolvedBindings[binding] = true;

    var instance = bindings[binding].apply(null, args);

    resolvedBindings[binding] = false;

    return instance;
  }

  // then check singletons
  if (inObject(binding, singletons)) {
    if (!inObject(binding, resolvedSingletons)) {
      // we are not guarenteed to receive a factory function for a singleton
      if (isFunction(singletons[binding])) {
        resolvedSingletons[binding] = singletons[binding].apply(null, args);
      } else {
        resolvedSingletons[binding] = singletons[binding];
      }
    }

    return resolvedSingletons[binding];
  }

  // finally check node_modules
  throw new Error(`Binding: ${binding} not found.`);
};

/**
 * Creates an instance of a class and will inject dependencies defined in static
 * inject method. This is an alternative to using Ioc.bind
 * @method make
 * @param  {Function} Obj The class you wish to create a new instance of
 * @return {Object} The instantiated function instance
 */
exports.make = function make(Obj) {
  if (!isFunction(Obj)) {
    throw new Error(
      ".make implementation error, expected function got: " + typeof obj
    );
  }

  if (!Obj.inject) {
    throw new Error(
      `.make requires ${obj.constructor.name} to have a static inject method.`
    );
  }

  var dependencies = Obj.inject();

  if (dependencies.length) {
    var resolved = [];

    dependencies.forEach(dependency => {
      if (!isString(dependency) && !isObject(dependency)) {
        throw new Error(
          "static .inject implementation error, a string or object is required."
        );
      }

      // string based binding
      if (isString(dependency)) {
        resolved.push(exports.use(dependency));
      }

      // binding you want to pass args to
      if (isObject(dependency)) {
        dependency.args.unshift(dependency.key);
        resolved.push(exports.use.apply(null, dependency.args));
      }
    });

    return new (Function.prototype.bind.apply(Obj, [null].concat(resolved)))();
  } else {
    return new Obj();
  }
};
