module.exports = function(grunt) {
    //配置参数
    grunt.initConfig({
        name: 'Mapv',
        version: '1.0.0',
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            dist: {
                src: [
                    "src/start.js",
                    "src/common/util.js",
                    "src/common/MVCObject.js",
                    "src/common/Class.js",
                    "src/Mapv.js",
                    "src/layer/*.js",
                    "src/data/*.js",
                    "src/control/*.js",
                    "src/Drawer/Drawer.js",
                    "src/Drawer/*.js",
                    "src/end.js",
                ],
                dest: "dist/Mapv.js"
            }
        },
        uglify: {
            options: {
            },
            dist: {
                files: {
                    'dist/Mapv.min.js': 'dist/Mapv.js'
                }
            }
        },
        watch: {    
            js: {
                files: ['src/*.js', 'src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        }
    });
 
    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    //注册任务
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
}
