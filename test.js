var VariationsStream = require("./");
var mocha = require("mocha");
var expect = require("chai").expect;

describe("variations-stream", function () {
  it("should generate all variations of a string", function (done) {
    var alphabet = "abcd";
    var expected = [
      "aa",
      "ba",
      "ca",
      "da",
      "ab",
      "bb",
      "cb",
      "db",
      "ac",
      "bc",
      "cc",
      "dc",
      "ad",
      "bd",
      "cd",
      "dd",
      "aaa",
      "baa",
      "caa",
      "daa",
      "aba",
      "bba",
      "cba",
      "dba",
      "aca",
      "bca",
      "cca",
      "dca",
      "ada",
      "bda",
      "cda",
      "dda",
      "aab",
      "bab",
      "cab",
      "dab",
      "abb",
      "bbb",
      "cbb",
      "dbb",
      "acb",
      "bcb",
      "ccb",
      "dcb",
      "adb",
      "bdb",
      "cdb",
      "ddb",
      "aac",
      "bac",
      "cac",
      "dac",
      "abc",
      "bbc",
      "cbc",
      "dbc",
      "acc",
      "bcc",
      "ccc",
      "dcc",
      "adc",
      "bdc",
      "cdc",
      "ddc",
      "aad",
      "bad",
      "cad",
      "dad",
      "abd",
      "bbd",
      "cbd",
      "dbd",
      "acd",
      "bcd",
      "ccd",
      "dcd",
      "add",
      "bdd",
      "cdd",
      "ddd",
    ];
    var results = [];
    var variationsStream = VariationsStream(alphabet, {
      minLength: 2,
      maxLength: 3,
    });
    variationsStream
      .on("data", function (data) {
        results.push(data);
      })
      .on("end", function () {
        expect(results).to.be.deep.equal(expected);
        done();
      });
  });
});
