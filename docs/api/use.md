# .use(name, ...args)

#### Arguments

1. `name` *(String)*: The key you want to find in the IoC container.
2. `args` *(Mixed)* *optional*: Any additional argument you want to pass to the factory function of the binded object.

#### Returns

(*`Object`*): The bound object from the IoC container.

#### Usage

Grabs a object from the IoC container. If the object was added with `.bind` it will return a new instance of that object, if it was binded with `.singleton` then it will be the same instance every time.

```javascript
var Ioc = require('b-ioc');

var fooInstance = Ioc.use('foo');
```

`.use` can be called inside of `.bind` or `.singleton` to pull in additional dependencies from the IoC container. In this case it does matter if `dep1` was registered before or after the `foo` binding, as long as its been registered `b-ioc` will find it.

```javascript
var Ioc = require('b-ioc');

Ioc.bind('foo', function() {
  var dep1 = Ioc.use('dep1');
  return new Foo(dep1);
});
```

#### Resolving Dependencies

Resolving dependencies is a sequential process and will happen in the following order:

1. Looks inside the IoC container for values binded with `.bind`
2. Looks inside the IoC container for values binded with `.singleton`
3. Tries requiring from `node_modules` based on supplied key

#### Cyclic Dependencies

Cyclic dependencies are tracked in `b-ioc` and will throw an error if they are attempted.

#### Automatic Dependency Injection

`b-ioc` does not use any introspecting to automatically resolve dependencies based on argument names passed into constructors. `b-ioc` is meant to be as explicit as possible so you can always have 100% clarity on what you are pulling in as dependencies.
