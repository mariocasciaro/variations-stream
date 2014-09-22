variations-stream
===========

A readable stream that generates all the variations (with repetitions) of a set.

[![NPM version](https://badge.fury.io/js/variations-stream.png)](http://badge.fury.io/js/variations-stream)
[![Build Status](https://travis-ci.org/mariocasciaro/variations-stream.png)](https://travis-ci.org/mariocasciaro/variations-stream)
![Downloads](http://img.shields.io/npm/dm/variations-stream.svg)

## Install

### Node.js

```
npm install variations-stream
```

## Usage

```javascript
var variationsStream = require('variations-stream');

variationsStream('abc', 2)
  .on('data', function(comb) {
    console.log(comb);
  });

/* Prints:

a
b
c
aa
ba
ca
ab
bb
cb
ac
bc
cc

*/

```

### Credits

* [Mario Casciaro](https://github.com/mariocasciaro) - Author
