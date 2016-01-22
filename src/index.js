'use strict';

var util = require('util');

var bindings = {};
var resolvedBindings = {};
var singletons = {};
var resolvedSingletons = {};

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
}

/**
 * Gets all of the current singletons in the container
 * @method getSingletons
 * @return {Object} The containers singletons
 */
exports.getSingletons = function getSingletons() {
  return singletons;
}

/**
 * Resets container to default state
 * @method clearAll
 */
exports.clear = function clearAll() {
  bindings = {};
  resolvedBindings = {};
  singletons = {};
  resolvedSingletons = {};
}

/**
 * Assigns to our bindings object
 * @method bind
 * @param  {String} binding The name of the IoC binding
 * @param  {Mixed} closure Factory method or value to bind to container
 */
exports.bind = function bind(binding, closure) {
  if (inObject(binding, bindings) || inObject(binding, singletons)) {
    throw new Error(`Binding: ${binding} already binded`);
  }

  if (!util.isFunction(closure)) {
    throw new Error(`Binding: ${binding} does not implement a factory`);
  }

  bindings[binding] = closure;
}

/**
 * Assigns to our singleton object
 * @method singleton
 * @param  {String} binding The name of the IoC binding
 * @param  {function} closure Factory method or value to bind to container
 */
exports.singleton = function singleton(binding, closure) {
  if (inObject(binding, singletons) || inObject(binding, bindings)) {
    throw new Error(`Singleton: ${binding} already binded`);
  }

  singletons[binding] = closure;
}

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
      throw new Error(`Cyclic dependency detected in binding: ${binding}`);
    }

    resolvedBindings[binding] = true;

    var instance = bindings[binding].apply(this, args);

    resolvedBindings[binding] = false;

    return instance;
  }

  // then check singletons
  if (inObject(binding, singletons)) {
    if (!inObject(binding, resolvedSingletons)) {

      // we are not guarenteed to receive a factory function for a singleton
      if (util.isFunction(singletons[binding])) {
        resolvedSingletons[binding] = singletons[binding].apply(this, args);
      } else {
        resolvedSingletons[binding] = singletons[binding];
      }
    }

    return resolvedSingletons[binding];
  }

  // finally check node_modules
  try {
    return require(binding);
  } catch(e) {
    throw new Error(`Binding: ${binding} not found`);
  }
}
