var assert = require('chai').assert;
require('import-export');
var prepareTransactions = require('../src/prepare-transactions');

var data = [
  ['Number','Date','Account','Amount','Subcategory','Memo'],
  ['','07/09/2016','XX-XX-XX 12345678','-17.16','PAYMENT','LIDL UK               ON 06 SEP          BCC'],
  ['','07/09/2016','XX-XX-XX 12345678','-20.00','PAYMENT','SQUIDCARD             ON 06 SEP          BCC'],
  ['null','06/09/2016','XX-XX-XX 12345678','1234.56','DIRECTDEP','ACME LIMITED    1234567          BGC'],
  ['','05/09/2016','XX-XX-XX 12345678','-29.54','PAYMENT','LIDL UK               ON 04 SEP          BCC'],
  ['','05/09/2016','XX-XX-XX 12345678','-60.50','PAYMENT','PRIMARK               ON 03 SEP          BCC']
];

describe('prepare-transactions', function () {
  it('is a function', function () {
    assert.isFunction(prepareTransactions);
  });

  it('transforms data', function () {
    var out = prepareTransactions(data);
    assert.equal(out[0].date.getTime(), 1473030000000);
    assert.equal(out[0].amount, -90.03999999999999);
    assert.equal(out[0].balance, -90.03999999999999);

    assert.equal(out[1].date.getTime(), 1473116400000);
    assert.equal(out[1].amount, 1234.56);
    assert.equal(out[1].balance, 1144.52);

    assert.equal(out[2].date.getTime(), 1473202800000);
    assert.equal(out[2].amount, -37.16);
    assert.equal(out[2].balance, 1107.36);
  });
});
