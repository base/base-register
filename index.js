/*!
 * base-register (https://github.com/node-base/base-register)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var debug = require('debug')('base:register');
var utils = require('./utils');

module.exports = function(config) {
  return function plugin(app) {
    if (!utils.isValid(app, 'base-register')) return;

    var register = this.register;
    var generatorCache = {};

    /**
     * Register a glob of generators. Adds glob support to the `.register`
     * method from [base-generators][].
     *
     * ```js
     * app.register('generators/*');
     * ```
     * @param {Array|String} `patterns` End glob patterns with a slash to register a generator in a directory.
     * @param {Object} `options`
     * @return {Object} Returns the instance for chaining
     * @api public
     */

    this.define('register', function(patterns, options) {
      debug('registering', patterns);

      var defaults = {cwd: this.cwd, rename: utils.rename};
      var opts = utils.extend({}, defaults, config, options);
      var files;

      if (!Array.isArray(patterns)) {
        patterns = [patterns];
      }

      if (utils.hasGlob(patterns)) {
        files = utils.glob.sync(patterns, opts);
      } else {
        files = patterns;
      }

      for (var i = 0; i < files.length; i++) {
        var filename = files[i];
        var filepath = path.resolve(opts.cwd, filename);
        var resolved = utils.tryResolve(filepath);
        if (!resolved) continue;

        var file = new utils.File({path: resolved, cwd: opts.cwd});
        if (generatorCache.hasOwnProperty(file.dirname)) {
          continue;
        }

        generatorCache[file.dirname] = resolved;
        file.name = path.basename(file.dirname);
        file.name = opts.rename(file);

        register.call(this, file.name, resolved);
      }

      this.union('cache.files', files);
      return this;
    });

    return plugin;
  };
};
