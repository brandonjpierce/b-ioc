# Getting Started

To get started with `b-ioc` simply require it into the file you wish to use it in:

```javascript
var Ioc = require('b-ioc');
```

#### Binding Objects To Container

Now we can bind an object to the Ioc container, in the case below we simply add a new instance of a Date object.

```javascript
Ioc.bind('timer', function() {
  return new Date().getTime();
});

var timer1 = Ioc.use('timer');
var timer2 = Ioc.use('timer');

console.log(timer1 === timer2);
// :$ false
```

Note that `timer1` and `timer2` return *new* instances of the `timer` object bound to the IoC. We can also add a singleton if you want to have the same instance of an object returned everytime. This is useful for things like already instantiated objects or even third party libaries.

```javascript
Ioc.singleton('timer', function() {
  return new Date().getTime();
});

var timer1 = Ioc.use('timer');
var timer2 = Ioc.use('timer');

console.log(timer1 === timer2);
// :$ true
```

Notice how this time `timer` actually returns the same instance to both `timer1` and `timer2`.

#### Resolving Dependencies From Container

As you can see from the examples above we are returned an instance of the bound object (or the same instance if a singleton was used). Make sure to read the API reference for [use](../api/use.md) to get a deeper understanding of how dependencies are resolved from the IoC container. 
```javascript
function ModuleA(name) {
  this.name = name;
}

ModuleA.prototype.sayHello = function() {
  console.log('Hello, ' + this.name);
}

Ioc.bind('moduleA', function(name) {
  return new ModuleA(name);
});

var jack = Ioc.use('moduleA', 'Jack');
var jill = Ioc.use('moduleA', 'Jill');

jack.sayHello();
jill.sayHello();

// :$ Hello, Jack
// :$ Hello, Jill
```
