var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('test', function (cb) {
	gulp.src(['./source/*.js'])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire()) 
		.on('finish', function () {
			gulp.src(['./test/*.js'])
				.pipe(mocha())
				.pipe(istanbul.writeReports())
				.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
				.on('end', cb);
		});
});
