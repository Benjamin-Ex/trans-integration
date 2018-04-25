let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let pump = require('pump');
let cleanCSS = require('gulp-clean-css');
let runSequence = require('run-sequence');
let autoprefixer = require('gulp-autoprefixer');
let plumber = require('gulp-plumber');

// compiler les fichier sass et les copier dans le dossier css
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// watcher sur tout les dossiers sass, html et js
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// création du serveur browser-sync, la racine du serv sera app
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
})

// compresser tout les fichiers js en un seul et les copier dans dist
gulp.task('scripts', function() {
  return gulp.src('app/js/*.js')
    .pipe(plumber())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js/'));
});

// minifier les fichiers js dans dist
gulp.task('compress', function (cb) {
  pump([
        gulp.src('./dist/js/*.js'),
        uglify(),
        gulp.dest('./dist/js/')
    ],
    cb
  );
});

// minifier les fichiers CSS et les copier dans dist
gulp.task('minify-css', () => {
  return gulp.src('app/css/*.css')
    .pipe(plumber())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('dist/fonts'))
});

// copier tous les fichiers html dans dist
gulp.task('copyhtml', function() {
  return gulp.src('app/*.html')
  .pipe(plumber())
  .pipe(gulp.dest('dist/'))
});

//Ajouter les préfixes
gulp.task('autoprefixer', () =>
    gulp.src('app/css/*.css')
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css/'))
);

//Copier les images
gulp.task('copyimg', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(plumber())
  .pipe(gulp.dest('dist/images'))
});

////Tâches principales \\\\

  //Local\\
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
  callback
  )
})

//Prod\\
gulp.task('build', function (callback) {
  runSequence(['sass', 'scripts', 'fonts','copyhtml','copyimg'],'autoprefixer', ['minify-css','compress'],
  callback
  )
})
