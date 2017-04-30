export default function parseCSV (csv) {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];
  for (var i=0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = [];
    for (var j=0; j<data.length; j++) {
      tarr.push(data[j]);
    }
    lines.push(tarr);
  }
  return lines;
}
