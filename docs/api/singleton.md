# .singleton(name, value)

#### Arguments

1. `name` *(String)*: The key you want to identify the object as in the IoC container.
2. `value` *(Mixed)*: The value or factory function you want to bind to the IoC container.

#### Usage

Binds a single instance to the IoC container under a given key. When you get this object from the container the same instance will be returned each time. A string is required for the first argument and the second argument can take either a function or a straight value. `b-ioc` will throw an error in the event that two bindings with the same name are being added to the container.

```javascript
var Ioc = require('b-ioc');

Ioc.singleton('foo', function() {
  return new Foo();
});
```
