'use strict';

var A = require('./a');
var B = require('./b');
var C = require('./c');

var Ioc = require('../src');

Ioc.bind('a', function(name) {
  return new A(name);
});

Ioc.bind('b', function(name) {
  return new B(Ioc.use('a', name));
});

Ioc.bind('c', function(name1, name2) {
  return new C(Ioc.use('a', name1), Ioc.use('a', name2));
});


var jack = Ioc.use('a', 'Jack');
var jill = Ioc.use('b', 'Jill');
var couple = Ioc.use('c', 'Brandon', 'Corinne');

jack.hello();
jill.hello();
couple.hello();
