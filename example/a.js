function A(name) {
  this.name = name || 'Brandon';
}

A.prototype.hello = function() {
  console.log(`Module A says hello ${this.name}!`);
}

module.exports = A;
