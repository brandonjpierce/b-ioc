function C(a, b) {
  this.a = a;
  this.b = b;
}

C.prototype.hello = function() {
  console.log(`Module c says hello ${this.a.name} and ${this.b.name}!`);
}

module.exports = C;
