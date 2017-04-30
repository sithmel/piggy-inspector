import parseCSV from './parse-csv';

export default function loadCSV(sel, cb) {
  document.querySelector(sel).addEventListener('change', handleFiles);

  function handleFiles(files) {
    var files = this.files;
    // Check for the various File API support.
    if (window.FileReader) {
      // FileReader are supported.
      getAsText(files[0]);
    } else {
      alert('FileReader are not supported in this browser.');
    }
  }

  function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
  }

  function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
  }

  function processData(csv) {
    cb(null, parseCSV(csv));
  }

  function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
      cb(new Error('Cannot read file'));
    }
  }

}
