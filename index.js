let Readable = require("readable-stream").Readable;
let util = require("util");

class VariationsStream {
  constructor(alphabet, ...options) {
    if (!(this instanceof VariationsStream)) {
      return new VariationsStream(alphabet, ...options);
    }

    let scope = options?.[0];
    options = options?.[1] || {};
    if (
      typeof scope === "number" ||
      (typeof scope === "string" && !isNaN(parseInt(scope)))
    ) {
      scope = { maxLength: parseInt(scope) };
    } else {
      scope = scope || {};
    }

    let opt = {
      objectMode: true,
      highWaterMark: 10000,
    };
    Readable.call(this, opt);
    this.alphabet = alphabet;
    this.minLength = scope.minLength || 1;
    this.maxLength = scope.maxLength || alphabet.length;
    if (this.minLength < 0) this.minLength = 1;
    if (this.maxLength < 0) this.maxLength = alphabet.length;
    this.indexes = [];
    for (var i = 0; i < this.minLength; i++) {
      this.indexes.push(0);
    }
    this.isString = typeof this.alphabet === "string";
    this.sync = options.sync || scope.sync;
    this.exit = false;
  }

  next() {
    let self = this;
    if (!self.indexes || this.exit) return null;

    let word = self.indexes.map((idx) => self.alphabet[idx]);
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
  }

  _push() {
    let self = this;
    let word;
    let backPressure = false;
    do {
      const next = self.next();
      word = next;
      backPressure = !self.push(word);
    } while (word && !backPressure);
  }

  _read() {
    if (this.sync) {
      this._push();
    } else {
      let self = this;
      setImmediate(function () {
        self.push(self.next());
      });
    }
  }

  _exit() {
    this.exit = true;
  }
}

util.inherits(VariationsStream, Readable);
module.exports = VariationsStream;
