/* jshint node : true */
module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        options: {
          style: 'compressed',
          noCache: true
        },
        files: [{
          expand: true,
          cwd: 'public/css/sass',
          src: ['*.scss', '!_*.scss'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },

    jshint: {
      options: {
        force: true
      },
      gruntfile: 'Gruntfile.js',
      cache: ['ops/*.js'],
      js: ['app.js', 'public/js/*.js', 'lib/routes/*.js'],
      routes: 'lib/routes/*.js'
    },

    uglify: {
      options: {
        compress: true,
        mangle: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      build: {
        files: {
          'public/js/min/base.min.js': ['public/js/lib/jquery-1.9.1.min.js', 'public/js/lib/underscore-min.js', 'public/js/lib/jquery.tinysort.min.js', 'public/js/lib/bison.js'],
          'public/js/min/index.min.js': ['public/js/lib/EventEmitter.min.js']
        }
      }
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'public/js/*.js',
        tasks: ['jshint', 'uglify']
      },
      sass: {
        files: ['public/css/sass/*.scss'],
        tasks: ['sass']
      }
    },

    nodemon: {
      prod: {
        options: {
          file: 'app.js',
          ignoredFiles: ['README.md', 'node_modules/**', 'public/js/min/**'],
          watchedExtensions: ['js'],
          debug: false
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });
  // Load grunt tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  // Register grunt tasks
  grunt.registerTask('default', ['jshint', '']);
  grunt.registerTask('quality', ['jshint']);
  grunt.registerTask('style', ['sass']);
  grunt.registerTask('start', ['concurrent']);
};