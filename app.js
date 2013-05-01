var http = require('http'),
httpProyx = require('http-proxy'),
cluster = require('cluster'),
os = require('os');

var port = process.env.PORT || 8080

var stopping = false;
var workers = {};
var num_workers = Math.floor(os.cpus().length) || 1;
var restart_timeout = 1000;

var start_worker = function() {
	if (!stopping) {
		var worker = cluster.fork();
		workers[worker.process.pid] = worker;
		console.log("Started worker with PID " + worker.process.pid);
	}
};

var stop_workers = function(code) {
	stopping = true;
	var k;
	for (k in workers) {
		if (workers.hasOwnProperty(k)) {
			process.kill(k, "SIGHUP");
		}
	}
	process.exit(code);
};

if (cluster.isMaster) {
	console.log("Starting " + num_workers + " workers");

	for (i=0; i<num_workers; i++) {
		start_worker();
	}

	cluster.on('death', function(worker) {
		console.log("Worker " + worker.process.pid + " died");
		delete workers[worker.process.pid];
		if (!stopping) {
			setTimeout(function() {
				start_worker();
			}, restart_timeout);
		}
	});

	process.on('SIGTERM', function() {
		stop_workers(0);
	});

	process.on('SIGINT', function() {
		stop_workers(0);
	});
} else {
	httpProyx.createServer(function(req, res, proxy) {
		proxy.proxyRequest(req, res, {host: "c.tile2.opencyclemap.org", port: 80});
	}).listen(port, function() {
		console.log("Listening on port " + port);
	});
}
