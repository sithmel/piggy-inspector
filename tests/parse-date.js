var assert = require('chai').assert;
require('import-export');
var parseDate = require('../src/parse-date');

describe('parse-date', function () {
  it('is a function', function () {
    assert.isFunction(parseDate);
  });

  it('parses dates', function () {
    var d = parseDate('21/03/2011');
    assert.equal(d.getTime(), 1300665600000);

    d = parseDate('21/3/2011');
    assert.equal(d.getTime(), 1300665600000);

    d = parseDate('21-3-2011');
    assert.equal(d.getTime(), 1300665600000);
  });

  it('returns undefined if invalid', function () {
    var d = parseDate('21/03/201w1');
    assert.isUndefined(d);
  });
});
