
	let preprocessor = 'sass'; 

	const { src, dest, parallel, series, watch } = require('gulp');
	const browserSync = require('browser-sync').create();
	const concat = require('gulp-concat');
	const uglify = require('gulp-uglify-es').default;
	const sass = require('gulp-sass')(require('sass'));
	const less = require('gulp-less');
	const autoprefixer = require('gulp-autoprefixer');
	const cleancss = require('gulp-clean-css');
	const imagecomp = require('compress-images');
	const del = require('del');
	const fileinclude = require('gulp-file-include');

	function browsersync() {
		browserSync.init({ 
			server: { baseDir: 'app/' }, 
			notify: false, 
			online: true ,
			browser: 'chrome',
		})
	}

	function includeHTML(){
		return src(['app/templates/*.html', '!app/parts/**/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		  }))
		.pipe(dest('app'))
	}

		
	
	 
	function scripts() {
		return src([ 
			'node_modules/swiper/swiper-bundle.min.js',
			'node_modules/swiper/modules/**/.js',
			], { allowEmpty: true })
		.pipe(concat('swiper.min.js')) // Конкатенируем в один файл
		.pipe(uglify()) // Сжимаем JavaScript
		.pipe(dest('app/assets/js/')) // Выгружаем готовый файл в папку назначения
		.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
	}
	 
	function styles() {
		return src(
			'app/assets/css/*.scss',
			) // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
		.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
		.pipe(concat('main.css')) 
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss( { level: { 1: { specialComments: 0 } } , format: 'beautify'} )) 
		.pipe(dest('app/assets/css/')) // Выгрузим результат в папку "app/css/"
		.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
	}
	function swiperStyle(){
		return src(
			'node_modules/swiper/**/*.scss'
			) 
		.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
		.pipe(concat('swiper.min.css')) 
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss( { level: { 1: { specialComments: 0 } } , format: 'minify'} )) 
		.pipe(dest('app/assets/css/')) // Выгрузим результат в папку "app/css/"
		.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
	}
	async function images() {
		imagecomp(
			"app/assets/images/src/**/*", // Берём все изображения из папки источника
			"app/assets/images/dest/", // Выгружаем оптимизированные изображения в папку назначения
			{ compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
			{ jpg: { engine: "mozjpeg", command: ["-quality", "90"] } }, // Сжимаем и оптимизируем изображеня
			{ png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
			{ svg: { engine: 'svgo', command: false } },
			{ gif: { engine: false, command: false } },
			function (err, completed) { // Обновляем страницу по завершению
				if (completed === true) {
					browserSync.reload()
				}
			}
		)
	}

	 
	function cleanimg() {
		return del('app/assets/images/dest/**/*', { force: true }) // Удаляем все содержимое папки "app/images/dest/"
	}

	function buildcopy() {
		return src([ // Выбираем нужные файлы
			'app/assets/css/**/*.css',
			'app/assets/css/fonts/**/*',
			'app/assets/js/**/*.js',
			'app/assets/images/dest/**/*',
			'app/assets/plugins/**/*',
			'app/**/*.html',
			], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
		.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
	}
	 
	function cleandist() {
		return del('dist/**/*', { force: true }) // Удаляем все содержимое папки "dist/"
	}
	 
	function startwatch() {
		watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
		watch('app/assets/css/**/*.scss', styles);
		watch('app/templates/**/*.html').on('change', includeHTML);
		watch('app/parts/**/*.html').on('change', includeHTML);
		watch('app/**/*.html').on('change', browserSync.reload);
		watch('app/assets/images/src/**/*', images);
	}

	exports.browsersync = browsersync;
	 
	exports.scripts = scripts;
	 
	exports.styles = styles;
	 
	exports.images = images;
	 
	exports.cleanimg = cleanimg;
	 
	exports.build = series(cleandist, styles, swiperStyle, scripts, images, includeHTML, buildcopy);
	 
	exports.default = parallel(styles, scripts, includeHTML, swiperStyle, browsersync, startwatch);