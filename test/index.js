"use strict";

var test = require("tape");
require("@randomgoods/tap-spec");

var Ioc = require("../src");

function A() {}
function B() {}
function C() {}
function Test() {}
Test.inject = function() {
  return ["a"];
};

test("IoC throws if binding already exists", function(t) {
  t.plan(1);

  Ioc.bind("123", function() {
    return "123";
  });

  t.throws(function() {
    Ioc.singleton("123", function() {
      return "123";
    });
  }, "throws because key was already in container");
});

test("IoC throws error if binding could not be resolved", function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.use("foobar");
  }, "throws because key was not in container");
});

test("IoC throws if .bind() implementation is wrong", function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.bind("foo", "bar");
  }, "throws from anything other than a function");
});

test("IoC throws if .make() implementation is wrong", function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.make("foo");
  }, "throws from anything other than a function");
});

test("IoC throws if class passed to .make() does not have a static .inject() method", function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.make(A);
  }, "class did not have static .inject() method");
});

test("IoC throws if a cyclic dependency is detected", function(t) {
  t.plan(1);

  Ioc.bind("a", function() {
    return new A(Ioc.use("b"));
  });

  Ioc.bind("b", function() {
    return new B(Ioc.use("a"));
  });

  t.throws(function() {
    Ioc.use("b");
  }, 'throws on Ioc.use("b")');
});

test("IoC resolves local bindings", function(t) {
  t.plan(3);

  Ioc.clear();

  Ioc.bind("exampleA", function() {
    return new A();
  });

  var exampleA = Ioc.use("exampleA");
  var bindings = Ioc.getBindings();

  t.ok(bindings.exampleA, "found in bindings container");
  t.ok(exampleA, "returns a value");
  t.ok(exampleA instanceof A, "has correct instance of class");
});

test("IoC resolves local singletons (factory method)", function(t) {
  t.plan(3);

  Ioc.clear();

  Ioc.singleton("timer", function() {
    return new Date().getTime();
  });

  var timer = Ioc.use("timer");
  var timer2 = Ioc.use("timer");
  var singletons = Ioc.getSingletons();

  t.ok(singletons.timer, "found in singleton container");
  t.ok(timer && timer2, "returns a value");
  t.equal(timer, timer2, "returns same instance");
});

test("IoC resolves local singletons (straight value)", function(t) {
  t.plan(4);

  var foo = new A();

  Ioc.clear();
  Ioc.singleton("instances", foo);

  var instance1 = Ioc.use("instances");
  var instance2 = Ioc.use("instances");
  var singletons = Ioc.getSingletons();

  t.ok(singletons.instances, "found in singleton container");
  t.ok(instance1 && instance2, "returns a value");
  t.equal(instance1, instance2, "returns same instance");
  t.ok(
    instance1 instanceof A && instance2 instanceof A,
    "has correct instance of class"
  );
});

test("IoC resolves classes", function(t) {
  t.plan(3);

  Ioc.clear();

  Ioc.bind("a", function() {
    return new A();
  });

  var test = Ioc.make(Test);

  t.ok(test, "returns a value");
  t.ok(test, "class is constructed properly");
  t.ok(test instanceof Test, "has correct instance of class");
});

test("IoC does not resolve node modules as fallback", function(t) {
  t.plan(1);

  t.throws(function() {
    var utils = Ioc.use("util");
  });
});
