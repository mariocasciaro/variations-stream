var Readable = require('readable-stream').Readable;
var util = require('util');
util.inherits(VariationsStream, Readable);
module.exports = VariationsStream;

function VariationsStream(alphabet, size, options) {
  if(!(this instanceof VariationsStream)) {
    return new VariationsStream(alphabet, size, options);
  }
  
  if(typeof size !== 'number' && isNaN(parseInt(size))) {
    options = size;
    size = null;
  }
  options = options || {};

  var opt = {
    objectMode: true,
    highWaterMark: 10000
  };
  Readable.call(this, opt);
  this.alphabet = alphabet;
  this.indexes = [0];
  this.maxLength = size || alphabet.length;
  this.isString = typeof this.alphabet === 'string';
  this.sync = options.sync;
}

VariationsStream.prototype.next = function() {
  var self = this;
  if(!self.indexes) return null;
  
  var word = self.indexes.map(function(idx) {
    return self.alphabet[idx];
  });
  if(this.isString) {
    word = word.join('');
  }

  for(var i = 0; i < self.indexes.length; i++) {
    if(self.indexes[i] < self.alphabet.length - 1) {
      self.indexes[i]++;
      break;
    }
    self.indexes[i] = 0;
  }

  if(i === self.indexes.length && self.indexes[i - 1] === 0) {
    if(self.indexes.length < self.maxLength) {
      self.indexes.push(0);
    } else {
      self.indexes = null;
    }
  }
  return word;
}

VariationsStream.prototype._push = function() {
  var self = this;
  var word;
  var backPressure = false;
  do {
    word = self.next();
    backPressure = !self.push(word);
  } while(word && !backPressure);
}

VariationsStream.prototype._read = function() {
  if(this.sync) {
    this._push();
  } else {
    var self = this;
    setImmediate(function() {
      self.push(self.next());
    });
  }
};
