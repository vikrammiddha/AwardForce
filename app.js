var express = require('express'),
    http = require('http'),
    app = express(),
    opts = require(__dirname + '/config/opts.js');
app.use(express.static(__dirname + '/public/awardsforceui/www'));

var apn = require("apn");

options = {
   keyFile : "conf/key.pem",
   certFile : "conf/cert.pem",
   gateway:'gateway.sandbox.push.apple.com',
   passphrase : 'awardforce',
   debug : true
};

var service = new apn.connection(options);



service.on('connected', function() {
    console.log("Connected");
});

service.on('transmitted', function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString('hex'));
});

service.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode == 8) {
        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});

service.on('timeout', function () {
    console.log("Connection Timeout");
});

service.on('disconnected', function() {
    console.log("Disconnected from APNS");
});

service.on('socketError', console.error);

function pushNotificationToMany() {
    console.log("Sending the same notification each of the devices with one call to pushNotification.");

}

pushNotificationToMany();
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

app.get('/service', function(req, res) {
	res.send('OK'); // load the single view file (angular will handle the page changes on the front-end)
});



app.post('/service/sendAPNS', function(req, res) {

	var content = '';

   req.on('data', function (data) {
      // Append data.
      content += data;
   });

   req.on('end', function () {
      // Assuming, we're receiving JSON, parse the string into a JSON object to return.
	    var data = JSON.parse(content);
	    var note = new apn.notification();
	    note.setAlertText(data.alertText);
	    note.sound = "dong.aiff";
	    note.badge = data.badgeCount;

	    var tokens = data.tokens;

	    service.pushNotification(note, tokens);
	    res.send('SENT');
      
   });


	
	
});
