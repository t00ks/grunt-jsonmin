/*
 * a grunt task wrapper for JSON.minify
 * https://github.com/getify/JSON.minify
 *
 * Custom code to minify cldr json files into seperate language.json files 
 * 
 * 
 */

'use strict';

module.exports = function (grunt) {

    grunt.registerMultiTask('jsonmin', 'A grunt task wrapper for getify/JSON.minify', function () {

        // Get the task options
        var options = {
            supplementalFiles: this.options.supplementalFiles || 'content/cldr/supplemental',
            languageFiles: this.options.languageFiles || 'content/cldr/main',
            destinationPath: this.options.destinationPath || 'content/cldr/min'
        };

        var supplemental = [];
        grunt.file.recurse(options.supplementalFiles, function (abspath, rootdir, subdir, filename) {
            supplemental.push(grunt.file.read(abspath));
        });

        var languages = {}
        grunt.file.recurse(options.languageFiles, function (abspath, rootdir, subdir, filename) {
            if (!languages[subdir]) {
                languages[subdir] = [];
            }
            languages[subdir].push(grunt.file.read(abspath));
        });

        for (var lang in languages) {
            var files = languages[lang];
            var src = supplemental.concat(files).join(grunt.util.normalizelf(', '))
            src = '[' + require('./lib/json-minify/minify.json.js').JSON.minify(src) + ']'
            grunt.file.write(options.destinationPath + '/' + lang + '.json', src);
            // user feedback
            grunt.log.writeln('"' + options.destinationPath + '/' + lang + '.json" created.');
        }

        grunt.log.writeln('✔'.magenta + ' grunt-jsonmin completed successfully');
    });

};
