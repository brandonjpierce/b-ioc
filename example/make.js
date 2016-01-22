function MakeClass(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;
}

MakeClass.prototype.hello = function() {
  this.a.hello();
  this.b.hello();
  this.c.hello();
}

MakeClass.inject = function() {
  return [
    'a',
    {key: 'b', args: ['John']},
    {key: 'c', args: ['Eric', 'Sally']}
  ];
};

module.exports = MakeClass;
