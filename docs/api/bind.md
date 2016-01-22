# .bind(name, factory)

#### Arguments

1. `name` *(String)*: The key you want to identify the object as in the IoC container.
2. `factory` *(Function)*: The factory function you want to bind to the IoC container.

#### Usage

Bind adds the return value of a factory function to the IoC container under a given key. When you attempt to get this object from the IoC container you will receive a new instance of it. A function is required for the second argument and the first argument must be a string. `b-ioc` will throw an error in the event that two bindings with the same name are being added to the container.

```javascript
var Ioc = require('b-ioc');

Ioc.bind('foo', function() {
  return new Foo();
});
```
