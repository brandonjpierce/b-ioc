function B(a) {
  this.name = a.name;
}

B.prototype.hello = function() {
  console.log(`Module b says hello ${this.name}!`);
}

module.exports = B;
