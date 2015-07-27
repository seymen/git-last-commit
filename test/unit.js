var git = require('../source/index.js');

describe('feature: git-last-commit to return last commit info', function() {
	it('should', function(done) {
		git.getLastCommit(function(commit) {
			console.log(commit);
			done();
		});
	});
});