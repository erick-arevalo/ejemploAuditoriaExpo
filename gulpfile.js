var gulp                = require('gulp'),
    connect             = require('gulp-connect'), //Gulp plugin para correr un servidor web (con LiveReload).
    inject              = require('gulp-inject'), //Plugin para inyectar referencias a hojas de estilo, javascript y otros componentes.
    gulpif              = require('gulp-if'),
    minifyCss           = require('gulp-clean-css'),
    useref              = require('gulp-useref'),
    uglify              = require('gulp-uglify'),
    uncss               = require('gulp-uncss'),
    pump                = require('pump');

//Servidor web de desarrollo
gulp.task('server',() =>
{
    connect.server({
        root: 'app',
        livereload: true
    });
});

//Servidor web para probar en produccion
gulp.task('server-dist',()=>
{
    connect.server({
        root: 'dist',
        livereload: true,
        port: 9000
    });
});

//Recarga el navegador cuando hay cambios en el html
gulp.task('html', () =>
{
    gulp.src('./app/**/*.html')
        .pipe(connect.reload());
});

//Busca en las carpetas de estilos y javascript los archivos creados para inyectarlos a index.html
gulp.task('inject', () =>
{
    let target  = gulp.src('./app/index.html');
    let sources = gulp.src(['./app/js/*.js','./app/css/*.css'], {read: false});
    return target.pipe(inject(sources, {relative: true}))
                .pipe(gulp.dest('app'))
                .pipe(connect.reload());
});

//Unir archivos js y css
gulp.task('compress',() =>
{
    return gulp.src('app/index.html')
//        .pipe(assets)
        .pipe(useref())
        .pipe(gulp.dest('./app'));
});

//Comprimir archivos css
gulp.task('minify-css', () => {
    return gulp.src('app/css/combined.css')
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('dist/css'));
});

//comprimir archivo js
gulp.task('min-js', (cb) => {
    pump([
        gulp.src('app/js/combined.js'),
        uglify(),
        gulp.dest('dist/js')
        ],
        cb
    );
});


//Realiza copia del index.html a la carpeta dist sin comentarios y con los nuevos enlaces
gulp.task('copy',() => 
{
    gulp.src('./app/index.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

//Realiza copia de la data al dist
gulp.task('copy-data',() => 
{
    gulp.src('./app/data/*')        
        .pipe(gulp.dest('./dist/data'));
});

//Vigila los cambios que se produzcan en el proyecto
gulp.task('watch', () =>
{
    gulp.watch(['./app/**/*.html'],['html']);
    gulp.watch(['./app/js/**/*.js'],['inject']);
    gulp.watch(['./app/css/**/*.css'],['inject']);
});

gulp.task('default', ['server','inject','watch']);
gulp.task('build', ['compress','copy','copy-data', 'minify-css','min-js','server-dist']);