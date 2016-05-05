/*!
 * base-register (https://github.com/node-base/base-register)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var debug = require('debug')('base:register');
var extend = require('extend-shallow');
var isGlob = require('is-glob');
var glob = require('matched');

module.exports = function(config) {
  return function plugin(app) {
    if (!this || !this.isApp || this.isRegistered('base-register')) return;
    debug('initializing <%s>, from <%s>', __filename, module.parent.id);

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

    this.define('register', function(patterns, options, fn) {
      debug('registering', patterns);

      if (typeof options === 'function') {
        fn = options;
        options = {};
      }

      if (isGlob(patterns) || Array.isArray(patterns)) {
        var opts = extend({cwd: this.cwd}, config, options);

        var files = glob.sync(patterns, opts);
        for (var i = 0; i < files.length; i++) {
          var filename = files[i];
          var filepath = path.resolve(opts.cwd, filename);
          var resolved = tryResolve(filepath);

          if (typeof resolved === 'string') {

            var dir = path.dirname(resolved);
            if (generatorCache.hasOwnProperty(dir)) {
              continue;
            }

            generatorCache[dir] = resolved;

          }

          var basename = path.basename(dir);
          var name = fn ? fn(basename, resolved) : basename;
          register.call(this, name, resolved);
        }

        this.union('cache.files', files);
        return this;
      }
      return register.apply(this, arguments);
    });

    return plugin;
  };
};

function tryResolve(fp) {
  try {
    return require.resolve(fp);
  } catch (err) {}
}
