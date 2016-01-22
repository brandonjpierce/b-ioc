# .make(class)

#### Arguments

1. `class` *(Function)*: The class you want to get an instance of and inject dependencies into

#### Usage

`.make` handles dependency injection a bit more implicitly. You simply pass it a class and `b-ioc` will inject all needed dependencies into the class's constructor. These dependencies are defined from a static `.inject` method.

```javascript
var Ioc = require('b-ioc');

function DBModule(config) {
  this.config = config;
}

DBModule.inject = function() {
  return ['config'];
}

// config dependency will be resolve from the IoC container
var dbInstance = Ioc.make(DBModule);
```

Note that all dependencies defined in the `.inject` method must be present in the IoC container or an error will be thrown.

If you need to pass the dependencies any arguments you can use an object instead of a string inside of the `.inject` array:

```js
function Namer(name) {
  this.name = name;
}

function User(namer) {
  this.name = namer.name;
}

User.inject = function() {
  return [{
    key: 'namer', // name of key in IoC container
    args: ['Yeezus'] // arguments you want to pass binding
  }];
}

Ioc.bind('namer', function(name) {
  return new Namer(name);
});

var user = Ioc.make(User);

console.log(user.name);
// :$ Yeezus
```
