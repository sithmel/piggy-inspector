import loadCSV from './load-csv.js';
import prepareTransactions from './prepare-transactions';
import Graph from './graph';

var graph = new Graph({ selector: '.graph', selectorInfo: '.graph__info' });

loadCSV('#csvfile', function (err, data) {
  graph.plot(prepareTransactions(data));
});
