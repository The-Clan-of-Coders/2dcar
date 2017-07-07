/**
 * Created by jonas on 2015-08-14.
 */

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({

		watch: {
			scripts: {
				files: [
					'src/*.js'
				],
				tasks: ['build']
			}
		},
		jshint: {
			options: {
				evil: true
			},
			all: ['src/*/*.js']
		},
		concat: {
			basic_and_extras: {
				files: {
					'build/2dcar.js': [
						'src/RigidBody.js',
						'src/Wheel.js',
						'src/Vehicle.js',
						'src/Car.js',
						'src/*.js'
					]
				}
			}
		},
    'http-server': {
      dev: {
        root: '',
        port: 3115,
        runInBackground: true
      }
    },
		uglify: {
			my_target: {
				files: {
					'dist/derby.min.js': ['dist/derby.js'],
					'../js-game-server/examples/derby/game/derby.min.js': ['dist/derby.js']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-ssh');
	grunt.registerTask('monitor', [
		'watch'
	]);

	grunt.registerTask('build', ['jshint', 'concat']);
	grunt.registerTask('default', ['build', 'http-server', 'monitor']);

};
