# Dependency Injection

Dependency injection for JavaScript in simple terms is a way of injecting references to a module or library in a constructor / factory function. This allows the modules dependencies to be easily mocked during testing.

## Why Dependency Injection

To help visualize why dependency injection is nice for larger projects we can create our own example below:

*Naive approach:*
```javascript
// module-a.js

var dependency1 = require('/some/dependency');
var dependency2 = require('/some/dependency');

function ModuleA() {
  this.db = dependency1.initialize();
  this.user = dependency2.createUser();
}

module.exports = ModuleA;
```

In order to test `ModuleA` you would need to have both `dependency1` and `dependency2` available and configured. The more dependencies you have the harder this becomes to test. Now lets see this same module but with a simple dependency injection pattern.

*Using dependency injection:*
```javascript
// module-a.js

function ModuleA(dependency1, dependency2) {
  this.db = dependency1.initialize();
  this.user = dependency2.createUser();
}

module.exports = ModuleA;
```

You simply pass `ModuleA` its dependencies as arguments through its constructor. You can mock these dependencies now instead of directly requiring them when testing.
