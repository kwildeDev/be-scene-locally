const testData = require("../data/test-data/index-test.js");
const seed = require("./seed");

const db = require("../connection.js");

function runTestSeed() {
  return seed(testData).then(() => db.end());
}
runTestSeed();