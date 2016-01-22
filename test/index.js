'use strict';

var test = require('tape');
var tapSpec = require('tap-spec');

var Ioc = require('../src');

function A() {};
function B() {};
function C() {};

test('IoC throws if binding or singleton already exists', function(t) {
  t.plan(1);

  Ioc.bind('123', function() {
    return  '123';
  });

  t.throws(function() {
    Ioc.singleton('123', function() { return  '123'; });
  }, 'Binding already exists in either bindings or singletons object');
});

test('IoC throws error if binding could not be resolved', function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.use('foobar');
  }, 'throws on Ioc.use("foobar")');
});

test('IoC throws if .bind() implementation is wrong', function(t) {
  t.plan(1);

  t.throws(function() {
    Ioc.bind('foo', 'bar');
  }, 'throws on Ioc.bind("foo", "bar")');
});

// reset container for the following tests
Ioc.clear();

test('IoC throws if a cyclic dependency is detected', function(t) {
  t.plan(1);

  Ioc.bind('a', function() {
    return new A(Ioc.use('b'));
  });

  Ioc.bind('b', function() {
    return new B(Ioc.use('a'));
  });

  t.throws(function() {
    Ioc.use('b');
  }, 'throws on Ioc.use("b")');
});

// reset container for the following tests
Ioc.clear();

test('IoC resolves local bindings', function(t) {
  t.plan(3);

  Ioc.bind('exampleA', function() {
    return new A();
  });

  var exampleA = Ioc.use('exampleA');
  var bindings = Ioc.getBindings();

  t.ok(bindings.exampleA, '"exampleA" key was found in bindings container');
  t.ok(exampleA, 'Ioc.use("exampleA") returns a value');
  t.ok(exampleA instanceof A, 'Ioc.use("exampleA") has correct instance of class');
});

test('IoC resolves local singletons (factory method)', function(t) {
  t.plan(3);

  Ioc.singleton('timer', function() {
    return new Date().getTime();
  });

  var timer = Ioc.use('timer');
  var timer2 = Ioc.use('timer');
  var singletons = Ioc.getSingletons();

  t.ok(singletons.timer, '"timer" key was found in singleton container');
  t.ok(timer && timer2, 'Ioc.use("timer") returns a value');
  t.equal(timer, timer2, 'Ioc.use("timer") returns same instance');
});

test('IoC resolves local singletons (straight value)', function(t) {
  t.plan(4);

  var foo = new A();

  Ioc.singleton('instances', foo);

  var instance1 = Ioc.use('instances');
  var instance2 = Ioc.use('instances');
  var singletons = Ioc.getSingletons();

  t.ok(singletons.instances, '"instances" key was found in singleton container');
  t.ok(instance1 && instance2, 'Ioc.use("instances") returns a value');
  t.equal(instance1, instance2, 'Ioc.use("instances") returns same instance');
  t.ok(instance1 instanceof A && instance2 instanceof A, 'Ioc.use("instances") has correct instance of class');
});

test('IoC resolves node modules as fallback', function(t) {
  t.plan(1);

  var utils = Ioc.use('util');

  t.ok(utils, 'Ioc.use("util") returns a node module');
});
