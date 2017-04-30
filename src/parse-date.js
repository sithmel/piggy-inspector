var re = /([0-9]{1,2})[\/-]([0-9]{1,2})[\/-]([0-9]{4})/;

export default function parseDate(s) {
  var match = re.exec(s);
  if (!match) {
    return;
  }
  var day = match[1];
  var month = match[2];
  var year = match[3];
  return new Date(year + '/' + month + '/' + day);
}
