/**
 * IoC Module
 * @module b-ioc-js
 */ "use strict";
function _type_of(obj1) {
    "@swc/helpers - typeof";
    return obj1 && typeof Symbol !== "undefined" && obj1.constructor === Symbol ? "symbol" : typeof obj1;
}
var bindings = {};
var resolvedBindings = {};
var singletons = {};
var resolvedSingletons = {};
function isString(obj1) {
    return Object.prototype.toString.call(obj1) === "[object String]";
}
function isObject(obj1) {
    var type = typeof obj1 === "undefined" ? "undefined" : _type_of(obj1);
    return type === "function" || type === "object" && !!obj1;
}
function isFunction(obj1) {
    return typeof obj1 === "function" || false;
}
function inObject(key, obj1) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    return obj1.hasOwnProperty(key);
}
/**
 * Gets all of the current bindings in the container
 * @method getBindings
 * @return {Object} The containers bindings
 */ exports.getBindings = function getBindings() {
    return bindings;
};
/**
 * Gets all of the current singletons in the container
 * @method getSingletons
 * @return {Object} The containers singletons
 */ exports.getSingletons = function getSingletons() {
    return singletons;
};
/**
 * Resets container to default state
 * @method clear
 */ exports.clear = function clear() {
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
 */ exports.bind = function bind(binding, closure) {
    if (inObject(binding, bindings) || inObject(binding, singletons)) {
        throw new Error("Binding: ".concat(binding, " already binded."));
    }
    if (!isFunction(closure)) {
        throw new Error("Binding: ".concat(binding, " does not implement a factory."));
    }
    bindings[binding] = closure;
};
/**
 * Assigns to our singleton object
 * @method singleton
 * @param  {String} binding The name of the IoC binding
 * @param  {any} closure Factory method or value to bind to container
 */ exports.singleton = function singleton(binding, closure) {
    if (inObject(binding, singletons) || inObject(binding, bindings)) {
        throw new Error("Singleton: ".concat(binding, " already binded."));
    }
    singletons[binding] = closure;
};
/**
 * Grabs a binding from the IoC. Leverages node require as a fallback
 * @template A
 * @method use<A>
 * @param  {String} binding The name of the binding in the container
 * @returns {A} The instance of the binding
 */ exports.use = function use(binding) {
    // biome-ignore lint/style/noArguments: <explanation>
    var args = Array.prototype.slice.call(arguments, 1);
    // first check bindings
    if (inObject(binding, bindings)) {
        if (resolvedBindings[binding]) {
            throw new Error("Cyclic dependency detected in binding: ".concat(binding, "."));
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
    throw new Error("Binding: ".concat(binding, " not found."));
};
/**
 * Creates an instance of a class and will inject dependencies defined in static
 * inject method. This is an alternative to using Ioc.bind
 * @method make
 * @param  {function} Obj The class you wish to create a new instance of
 * @return {Object} The instantiated function instance
 */ exports.make = function make(Obj) {
    if (!isFunction(Obj)) {
        throw new Error(".make implementation error, expected function got: ".concat(typeof obj === "undefined" ? "undefined" : _type_of(obj)));
    }
    if (!Obj.inject) {
        throw new Error(".make requires ".concat(obj.constructor.name, " to have a static inject method."));
    }
    var dependencies = Obj.inject();
    if (dependencies.length) {
        var resolved = [];
        dependencies.forEach(function(dependency) {
            if (!isString(dependency) && !isObject(dependency)) {
                throw new Error("static .inject implementation error, a string or object is required.");
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
        return new (Function.prototype.bind.apply(Obj, [
            null
        ].concat(resolved)))();
    }
    return new Obj();
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }