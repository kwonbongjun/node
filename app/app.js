/************************************************
 * npm install express --save
 ************************************************/
var app = {
  urlPattern : () => {
    var ex = require("express");
    console.log(">> Server url pattern");
    return ex().use(ex.static(require("path").join(__dirname, "../static")));
  },
  server : () => {
    console.log(">> Server init");
    return require('http').createServer(app.urlPattern());
  },
  start : (port) => {
    console.log(">> Server start");
    app.server().listen(port, () => {require("./log.js").info('Server running~');});
  }
}

app.start(80);
