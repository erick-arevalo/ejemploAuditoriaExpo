var gulp                = require('gulp'),
    connect             = require('gulp-connect'),
    inject              = require('gulp-inject'),
    gulpif              = require('gulp-if'),
    minifyCss           = require('gulp-clean-css'),
    useref              = require('gulp-useref'),
    uglify              = require('gulp-uglify'),
    uncss               = require('gulp-uncss');

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
        livereload: true
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

// gulp.task('bower',() =>
// {
//     gulp.src('./app/index.html')
//         .pipe(inject(gulp.src(bowerFiles(),{rad:false}),{name: 'bower'}))
//         .pipe(inject(es.merge(
//             gulp.src('./app/css/*.css', {read: false}),
//             gulp.src('./app/js/*.js', {read: false})
//         )))
//         .pipe(gulp.dest('./app'))
//         .pipe(connect.reload());
// });

//Elimina el CSS que no es utilizado
gulp.task('uncss',() =>
{
    return gulp.src('dist/css/combined.css')
        .pipe(uncss({
            html: 'app/index.html'
        }))
        .pipe(gulp.dest('./dist/css'));
});

//Comprimir archivos js y css
gulp.task('compress',() =>
{
    return gulp.src('app/index.html')
        .pipe(assets)
        .pipe(useref())
        .pipe(gulpif('*.js',uglify()))
        .pipe(gulpif('*.css',minifyCss()))
        .pipe(gulp.dest('./dist'));
});

//Realiza copia del index.html a la carpeta dist sin comentarios y con los nuevos enlaces
gulp.task('copy',() => 
{
    gulp.src('./app/index.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
})

//Vigila los cambios que se produzcan en el proyecto
gulp.task('watch', () =>
{
    gulp.watch(['./app/**/*.html'],['html']);
    gulp.watch(['./app/js/**/*.js'],['inject']);
    gulp.watch(['./app/css/**/*.css'],['inject']);
});

gulp.task('default', ['server','inject','watch']);
gulp.task('build', ['compress','copy','uncss']);