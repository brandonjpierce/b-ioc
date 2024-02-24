const test = require('tape');

const Ioc = require('..');

function A() {}
function B() {}
function Test() {}
Test.inject = () => ['a'];

test('IoC throws if binding already exists', (t) => {
  Ioc.bind('123', () => '123');

  t.throws(() => {
    Ioc.singleton('123', () => '123');
  }, 'throws because key was already in container');
  t.end();
});

test('IoC throws error if binding could not be resolved', (t) => {
  t.throws(() => {
    Ioc.use('foobar');
  }, 'throws because key was not in container');
  t.end();
});

test('IoC throws if .bind() implementation is wrong', (t) => {
  t.throws(() => {
    Ioc.bind('foo', 'bar');
  }, 'throws from anything other than a function');
  t.end();
});

test('IoC throws if .make() implementation is wrong', (t) => {
  t.throws(() => {
    Ioc.make('foo');
  }, 'throws from anything other than a function');
  t.end();
});

test('IoC throws if class passed to .make() does not have a static .inject() method', (t) => {
  t.throws(() => {
    Ioc.make(A);
  }, 'class did not have static .inject() method');
  t.end();
});

test('IoC throws if a cyclic dependency is detected', (t) => {
  Ioc.bind('a', () => new A(Ioc.use('b')));

  Ioc.bind('b', () => new B(Ioc.use('a')));

  t.throws(() => {
    Ioc.use('b');
  }, 'throws on Ioc.use("b")');
  t.end();
});

test('IoC resolves local bindings', (t) => {
  Ioc.clear();

  Ioc.bind('exampleA', () => new A());

  const exampleA = Ioc.use('exampleA');
  const bindings = Ioc.getBindings();

  t.ok(bindings.exampleA, 'found in bindings container');
  t.ok(exampleA, 'returns a value');
  t.ok(exampleA instanceof A, 'has correct instance of class');
  t.end();
});

test('IoC resolves local singletons (factory method)', (t) => {
  Ioc.clear();

  Ioc.singleton('timer', () => new Date().getTime());

  const timer = Ioc.use('timer');
  const timer2 = Ioc.use('timer');
  const singletons = Ioc.getSingletons();

  t.ok(singletons.timer, 'found in singleton container');
  t.ok(timer && timer2, 'returns a value');
  t.equal(timer, timer2, 'returns same instance');
  t.end();
});

test('IoC resolves local singletons (straight value)', (t) => {
  const foo = new A();

  Ioc.clear();
  Ioc.singleton('instances', foo);

  const instance1 = Ioc.use('instances');
  const instance2 = Ioc.use('instances');
  const singletons = Ioc.getSingletons();

  t.ok(singletons.instances, 'found in singleton container');
  t.ok(instance1 && instance2, 'returns a value');
  t.equal(instance1, instance2, 'returns same instance');
  t.ok(instance1 instanceof A && instance2 instanceof A, 'has correct instance of class');
  t.end();
});

test('IoC resolves classes', (t) => {
  Ioc.clear();

  Ioc.bind('a', () => new A());

  const test = Ioc.make(Test);

  t.ok(test, 'returns a value');
  t.ok(test, 'class is constructed properly');
  t.ok(test instanceof Test, 'has correct instance of class');
  t.end();
});

test('IoC does not resolve node modules as fallback', (t) => {
  t.throws(() => {
    const _utils = Ioc.use('util');
  });
  t.end();
});

test.onFinish(() => process.exit(0));