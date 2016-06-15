'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('has-glob');
require('is-valid-app', 'isValid');
require('matched', 'glob');
require('vinyl', 'File');
require = fn;

utils.tryResolve = function(name) {
  try {
    return require.resolve(name);
  } catch (err) {}
};

utils.rename = function(file) {
  return file.name;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
