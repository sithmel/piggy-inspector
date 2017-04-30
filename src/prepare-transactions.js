import parseDate from './parse-date';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import sum from 'lodash/sum';

export default function prepareTransactions(lines, startBalance) {
  var balance = startBalance || 0;

  var records = lines.filter(function (item, index) {
    return index !== 0;
  })
  .map(function (item) {
    return {
      date: parseDate(item[1]),
      amount: parseFloat(item[3]),
      account: item[2],
      subcategory: item[4],
      info: item[5]
    };
  })
  .filter(function (item) {
    return item.date && item.amount;
  });

  var grouped = groupBy(records, function (d) { return d.date.getTime();})

  var groupedRecords = values(grouped).map(function (g) {
    return {
      date: g[0].date,
      amount: sum(g.map(function (d) { return d.amount; })),
      transactions: g
    };
  });

  groupedRecords.sort(function (a, b) {
    return a.date.getTime() - b.date.getTime();
  });

  groupedRecords.forEach(function (item) {
    balance += item.amount;
    item.balance = balance;
  });

  return groupedRecords;
}
