/**
 * IoC Module
 * @module b-ioc-js
 */

let bindings = {};
let resolvedBindings = {};
let singletons = {};
let resolvedSingletons = {};

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function isFunction(obj) {
  return typeof obj === 'function' || false;
}

function inObject(key, obj) {
  // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
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
 * @method clear
 */
exports.clear = function clear() {
  bindings = {};
  resolvedBindings = {};
  singletons = {};
  resolvedSingletons = {};
};

/**
 * Assigns to our bindings object
 * @method bind
 * @param  {String} binding The name of the IoC binding
 * @param  {any} closure Factory method or value to bind to container
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
 * @param  {any} closure Factory method or value to bind to container
 */
exports.singleton = function singleton(binding, closure) {
  if (inObject(binding, singletons) || inObject(binding, bindings)) {
    throw new Error(`Singleton: ${binding} already binded.`);
  }

  singletons[binding] = closure;
};

/**
 * Grabs a binding from the IoC. Leverages node require as a fallback
 * @template A
 * @method use<A>
 * @param  {String} binding The name of the binding in the container
 * @returns {A} The instance of the binding
 */
exports.use = function use(binding) {
  // biome-ignore lint/style/noArguments: <explanation>
  const args = Array.prototype.slice.call(arguments, 1);

  // first check bindings
  if (inObject(binding, bindings)) {
    if (resolvedBindings[binding]) {
      throw new Error(`Cyclic dependency detected in binding: ${binding}.`);
    }

    resolvedBindings[binding] = true;

    const instance = bindings[binding].apply(null, args);

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
 * @param  {function} Obj The class you wish to create a new instance of
 * @return {Object} The instantiated function instance
 */
exports.make = function make(Obj) {
  if (!isFunction(Obj)) {
    throw new Error(`.make implementation error, expected function got: ${typeof obj}`);
  }

  if (!Obj.inject) {
    throw new Error(`.make requires ${obj.constructor.name} to have a static inject method.`);
  }

  const dependencies = Obj.inject();

  if (dependencies.length) {
    const resolved = [];

    dependencies.forEach((dependency) => {
      if (!isString(dependency) && !isObject(dependency)) {
        throw new Error('static .inject implementation error, a string or object is required.');
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
  }
  return new Obj();
};
