var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');
app.use(express.static(__dirname + '/public/awardsforceui/www'));
// Load express configuration
require(__dirname + '/config/env.js')(express, app);

// Load routes
require(__dirname + '/routes')(app);

// Start the server
var port = process.env.PORT || 3000;
http.createServer(app).listen(port, function () {
    console.log("Express server listening on port %d in %s mode",
                opts.port, app.settings.env);
});
