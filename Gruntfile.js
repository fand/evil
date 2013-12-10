module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */'
            },
            dist: {
                files: {
                    'static/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        coffee: {
            dist: {
                src: 'static/coffee/', dest: 'static/coffee/'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['static/coffee/*.js'],
                dest: 'static/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            coffee: {
                files: ['static/coffee/*.coffee'],
                tasks: 'coffee concat min'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-coffee');    
    
    grunt.registerTask('default', ['coffee', 'concat', 'uglify']);
};
