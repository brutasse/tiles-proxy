var http = require('http'),
httpProyx = require('http-proxy');

var port = process.env.PORT || 8080

httpProyx.createServer(function(req, res, proxy) {
	proxy.proxyRequest(req, res, {host: "c.tile2.opencyclemap.org", port: 80});
}).listen(port, function() {
	console.log("Listening on port " + port);
});
