var assert = require('chai').assert;
require('import-export');
var parseCSV = require('../src/parse-csv');

describe('parse-csv', function () {
  it('is a function', function () {
    assert.isFunction(parseCSV);
  });
  it('parse a CSV', function () {
    var array = parseCSV('1,2,3\n4,5,6');
    assert.deepEqual(array, [['1', '2', '3'], ['4', '5', '6']]);
  });
});
