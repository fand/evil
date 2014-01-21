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
            main: {
                files: [{
                    expand: true,
                    cwd: 'static/coffee/',
                    src: ['*.coffee'],
                    dest: 'static/coffee/',
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: 'static/coffee/test',
                    src: ['*.coffee'],
                    dest: 'static/js/test',
                    ext: '.js'
                }]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['static/js/lib/*.js', 'static/coffee/*.js'],
                dest: 'static/js/<%= pkg.name %>.js'
            }
        },
        watch: {
            coffee: {
                files: ['static/coffee/*.coffee'],
                tasks: ['coffee', 'concat', 'uglify']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('default', ['coffee', 'concat', 'uglify']);
};
