module.exports = function (app) {
    app.get('/', function(req, res) {
    	var cwd = process.cwd();
    	console.log('====' + cwd);
		res.sendfile(cwd + '/public/awardsforceui/www/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
