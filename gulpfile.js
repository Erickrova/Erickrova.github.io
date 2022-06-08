
const { src,dest,watch,parallel } = require('gulp');
// dependecias css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
// dependencias imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cache = require('gulp-cache');
const avif = require('gulp-avif');
// dependecian javaScript
const terser = require('gulp-terser-js');



function css (done){
    // identificando archivo .scss a compilar
    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        //css
        .pipe(sass())// compilacion
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));// almanecarla en el disco duro
        
    done();
};

function imagenes (done){
    const opciones = {
        optimizationLevel: 3
    };

    src('src/img/**/*.{png,jpg,webp,jpeg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'));

    done();
};



function versionWebp (done){

    const opciones = {
        quality: 50
    };


    try {        
        src('src/img/**/*.{png,jpg}')
            .pipe(webp(opciones))
            .pipe(dest('build/img'));
    } catch (error) {
    }
        

    done();
};

function versionAvif (done){

    const opciones = {
        quality: 50
    };



    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));

    done();
};

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
};



function dev (done){

    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
};



exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(versionAvif,imagenes,versionWebp,javascript,dev,css);