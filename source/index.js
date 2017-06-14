var process = require('child_process'),
	options = {};

function _command(command, callback) {
	var dst = __dirname;

	if(!!options && options.dst) {
		dst = options.dst;
	}

	process.exec(command, {cwd: dst}, function(err, stdout, stderr) {
		if (stdout === '') {
			callback('this does not look like a git repo');
			return;
		}

		if (stderr) { 
			callback(stderr);
			return;
		}

		callback(null, stdout.split('\n').join(','));
	});
}

var command = 
	'git log -1 --pretty=format:"%h,%H,%s,%f,%at,%ct,%an,%ae,%cn,%ce,%N,"' + 
	' && git rev-parse --abbrev-ref HEAD' + 
	' && git tag --contains HEAD';

module.exports = {
	getLastCommit : function(callback, _options) {
		options = _options;
		_command(command, function(err, res) {
			if (err) {
				callback(err);
				return;
			}
			
			var a = res.split(',');

			var tags = [];
			if (a[a.length-1] !== '') {
				tags = a.slice(12 - a.length);
			}
			
			callback(null, {
				shortHash: a[0],
				hash: a[1],
				subject: a[2],
				sanitizedSubject: a[3],
				// body: a[4],
				authoredOn: a[4],
				committedOn: a[5],
				author: {
					name: a[6],
					email: a[7],
				},
				committer: {
					name: a[8],
					email: a[9]
				},
				notes: a[10],
				branch: a[11],
				tags: tags
			});
		});
	}
};