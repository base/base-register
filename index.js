/*!
 * base-register (https://github.com/node-base/base-register)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-register');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('base-register')) return;

    this.define('base-register2', function() {
      debug('running base-register2');
      
    });
  };
};
