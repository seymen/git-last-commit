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
	'git log -1 --pretty=format:"%h,%H,%s,%f,%b,%at,%ct,%an,%ae,%cn,%ce,%N,"' + 
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
				tags = a.slice(13 - a.length);
			}

			var shouldSkip = 0;
			for(var i= 4; i<a.length; i++){
				if(a[i].length > 0 && !isNaN(a[i])){
					break;
				}
				shouldSkip++;	
			}

			callback(null, {
				shortHash: a[0],
				hash: a[1],
				subject: a[2],
				sanitizedSubject: a[3],
				body: a[4],
				authoredOn: a[4+shouldSkip],
				committedOn: a[5+shouldSkip],
				author: {
					name: a[6+shouldSkip],
					email: a[7+shouldSkip],
				},
				committer: {
					name: a[8+shouldSkip],
					email: a[9+shouldSkip]
				},
				notes: a[10+shouldSkip],
				branch: a[11+shouldSkip],
				tags: tags
			});
		});
	}
};