var util = require(__dirname + '/../libs/util.js'),
    mustache = require('mu2');

module.exports = function (express, app) {

    // Common configuration
    app.configure(function () {

            app.get('/', function(req, res) {
            var cwd = process.cwd();
            console.log('====' + cwd);
            res.sendfile(cwd + '/public/awardsforceui/www/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });
    });

    // Development specific configuration
    app.configure('development', function () {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    // Production specific configuration
    app.configure('production', function () {
        app.use(express.errorHandler());
    });

};
