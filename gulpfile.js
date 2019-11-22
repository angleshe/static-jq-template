const gulp = require('gulp')
const plumber = require('gulp-plumber')
var browserSync
const scss = require('gulp-sass')
const changed = require('gulp-changed')
const autoprefixer = require('gulp-autoprefixer')
const dist = './dist/css'

gulp.task('scss', function(){
	let stream = gulp.src('./src/scss/**/*.scss')
	.pipe(changed(dist))
	.pipe(plumber())
	.pipe(scss({ sourcemap: !!browserSync }))
	.pipe(autoprefixer({
		browsers: ['> 1%', 'last 2 versions', 'not ie <= 8', 'ios >= 7']
	}))
	.pipe(gulp.dest(dist))
	return browserSync ? stream.pipe(browserSync.stream()) : stream
})
gulp.task('resource', function () {
	let stream = gulp.src(['./src/**/*', '!./src/{scss,scss/**}']).pipe(changed('./dist')).pipe(gulp.dest('dist'))
	return browserSync ? stream.pipe(browserSync.stream()) : stream
})
gulp.task('build', gulp.parallel('resource', 'scss'))
gulp.task('server', gulp.parallel('build', function () {
	browserSync.init({
		server: './dist'
	})
	gulp.watch(['./src/**/*', '!./src/{scss,scss/**}'], gulp.parallel('resource'))
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'))
}))

gulp.task('importRes', function () {
	browserSync = require('browser-sync').create()
	return Promise.resolve()
})

gulp.task('default', gulp.series('importRes', 'server'))
