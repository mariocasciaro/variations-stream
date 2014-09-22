var VariationsStream = require('./');
var mocha = require('mocha');
var expect = require('chai').expect;


describe('variations-stream', function() {
  it('should generate all variations of a string', function(done) {
    var alphabet = 'abcd';
    var expected = ['a', 'b', 'c', 'd', 'aa', 'ba', 'ca', 'da', 'ab',
      'bb', 'cb', 'db', 'ac', 'bc', 'cc', 'dc', 'ad', 'bd', 'cd', 'dd'];
    var results = [];
    var variationsStream = VariationsStream(alphabet, 2);
    variationsStream
    .on('data', function(data) {
      results.push(data);
    })
    .on('end', function() {
      expect(results).to.be.deep.equal(expected);
      done();
    })
  })
});
