var process = require('child_process'),
	options = {},
  splitCharacter = ',';

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

		callback(null, stdout.split('\n').join(splitCharacter));
	});
}

var prettyFormat = ["%h", "%H", "%s", "%f", "%b", "%at", "%ct", "%an", "%ae", "%cn", "%ce", "%N"];

var command =
	'git log -1 --pretty=format:"' + prettyFormat.join(splitCharacter) +'"' +
	' && git rev-parse --abbrev-ref HEAD' +
	' && git tag --contains HEAD';

module.exports = {
	getLastCommit : function(callback, _options) {
		options = _options;

    if (!!options && options.splitChar) {
      splitCharacter = options.splitChar;
    }

		_command(command, function(err, res) {
			if (err) {
				callback(err);
				return;
			}

			var a = res.split(splitCharacter);

			var tags = [];
			if (a[a.length-1] !== '') {
				tags = a.slice(13 - a.length);
			}

			callback(null, {
				shortHash: a[0],
				hash: a[1],
				subject: a[2],
				sanitizedSubject: a[3],
				body: a[4],
				authoredOn: a[5],
				committedOn: a[6],
				author: {
					name: a[7],
					email: a[8],
				},
				committer: {
					name: a[9],
					email: a[10]
				},
				notes: a[11],
				branch: a[12],
				tags: tags
			});
		});
	}
};
