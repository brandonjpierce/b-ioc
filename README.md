# b-ioc

b-ioc is a tiny and magic free IoC container for Node. It helps you manage dependencies and facilitates an easy testing environment for your modules.

### Installation

```
npm install b-ioc --save
```

### Small Introduction

```js
var Ioc = require('b-ioc');

var ClassA = require('class-a');
var ClassB = require('class-b');

// binding the classes
Ioc.bind('classA', function() {
  return new ClassA();
});

Ioc.bind('classB', function() {
  // classB needs classA as a dependency
  var classA = Ioc.use('classA');
  return new ClassB(classA);
});

// using the bindings
var classB = Ioc.use('classB');
```

Be sure to consult the documentation for more examples and an in depth look at the API.
