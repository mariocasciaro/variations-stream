var Readable = require("readable-stream").Readable;
var util = require("util");
util.inherits(VariationsStream, Readable);
module.exports = VariationsStream;

function VariationsStream(alphabet, options) {
  if (!(this instanceof VariationsStream)) {
    return new VariationsStream(alphabet, options);
  }

  options = options || {};
  var opt = {
    objectMode: true,
    highWaterMark: 10000,
  };
  Readable.call(this, opt);
  this.alphabet = alphabet;
  this.minLength = options.minLength || 1;
  this.maxLength = options.maxLength || alphabet.length;
  if (this.minLength < 0) this.minLength = 1;
  if (this.maxLength < 0) this.maxLength = alphabet.length;
  this.indexes = [];
  for (var i = 0; i < this.minLength; i++) {
    this.indexes.push(0);
  }
  this.isString = typeof this.alphabet === "string";
  this.sync = options.sync;
}

VariationsStream.prototype.next = function () {
  var self = this;
  if (!self.indexes) return null;

  var word = self.indexes.map((idx) => self.alphabet[idx]);
  if (this.isString) {
    word = word.join("");
  }

  for (var i = 0; i < self.indexes.length; i++) {
    if (self.indexes[i] < self.alphabet.length - 1) {
      self.indexes[i]++;
      break;
    }
    self.indexes[i] = 0;
  }

  if (i === self.indexes.length && self.indexes[i - 1] === 0) {
    if (self.indexes.length < self.maxLength) self.indexes.push(0);
    else self.indexes = null;
  }
  return word;
};

VariationsStream.prototype._push = function () {
  var self = this;
  var word;
  var backPressure = false;
  do {
    const next = self.next();
    word = next;
    backPressure = !self.push(word);
  } while (word && !backPressure);
};

VariationsStream.prototype._read = function () {
  if (this.sync) {
    this._push();
  } else {
    var self = this;
    setImmediate(function () {
      self.push(self.next());
    });
  }
};
