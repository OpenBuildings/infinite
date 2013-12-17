'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('infinite.jquery.json'),
		copyright: {
			holder: 'OpenBuildings, Inc.'
		},
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= copyright.holder %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: [ 'src/**/*.js' ]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc',

					// Ignore document.write warning in tests
					'-W060': true
				},
				src: [ 'test/**/*.js' ]
			}
		},
		jscs: {
			src: "src/**/*.js",
			gruntfile: "Gruntfile.js"
		},
		csslint: {
			src: {
				src: 'src/css/**/*.css'
			}
		},
		qunit: {
			files: [ 'test/**/*.html' ]
		},
		clean: {
			files: [ 'dist/**/*' ]
		},
		concat: {
			options: {
				banner: '<%= banner %>'
			},
			js: {
				src: [
					'src/js/jquery.isScrolledTo.js',
					'src/js/jquery.infinite.js'
				],
				dest: 'dist/js/jquery.<%= pkg.name %>.js'
			},
			css: {
				src: 'src/css/**/*.css',
				dest: 'dist/css/jquery.<%= pkg.name %>.css'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: '<%= concat.js.dest %>',
				dest: 'dist/js/jquery.<%= pkg.name %>.min.js'
			}
		},
		cssmin: {
			minify: {
				src: '<%= concat.css.dest %>',
				dest: 'dist/css/jquery.<%= pkg.name %>.min.css'
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: [ 'jshint:gruntfile' ]
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: [ 'jshint:src', 'qunit' ]
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: [ 'jshint:test', 'qunit' ]
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jscs-checker');

	// Default task.
	grunt.registerTask('check', [ 'jshint', 'jscs', 'csslint' ]);
	grunt.registerTask('build', [ 'clean', 'concat', 'uglify', 'cssmin' ]);
	grunt.registerTask('default', [
		'jshint',
		'jscs',
		'qunit',
		'clean',
		'concat',
		'uglify',
		'cssmin'
	]);

};
