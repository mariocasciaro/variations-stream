const VariationsStream = require(".");
const variationsStream = new VariationsStream("scret", {
  minLength: 6,
  maxLength: 6,
});
let i = 0;
variationsStream
  .on("data", function (data) {
    i++;
    console.log(data);

    if (data == "stssss") {
      variationsStream._exit();
      console.log("real =", i);
    }
  })
  .on("end", function () {
    console.log("Done", i);
  });
