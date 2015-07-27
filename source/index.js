var exec = require('child_process').exec;

function _command(command, callback) {
	exec(command, {cwd: __dirname}, function(err, stdout, stderr) {
		callback(stdout.split('\n').join(','));
	});
}

var command = 'git log -1 --pretty=format:"%h,%H,%s,%f,%b,%at,%ct,%an,%ae,%cn,%ce,%N" && git rev-parse --abbrev-ref HEAD && git tag --contains HEAD';

module.exports = {
	getLastCommit : function(callback) {
		_command(command, function(res) {
			console.log(res);
			var a = res.split(',');
			var tags = a.slice(14 - a.length);

			callback({
				shortHash: a[0],
				hash: a[1],
				subject: a[2],
				sanitizedSubject: a[3],
				body: a[4],
				authoredOn: a[4],
				committedOn: a[7],
				author: {
					name: a[8],
					email: a[9],
				},
				committer: {
					name: a[10],
					email: a[11]
				},
				notes: a[12],
				branch: a[13],
				tags: tags
			});
		});
	}
};