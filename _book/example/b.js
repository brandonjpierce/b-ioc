function B(a) {
  this.a = a;
}

B.prototype.hello = function() {
  console.log(`Module b says hello ${this.a.name}!`);
}

module.exports = B;
