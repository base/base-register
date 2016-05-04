'use strict';

require('mocha');
var assert = require('assert');
var baseRegister2 = require('');

describe('base-register2', function() {
  it('should export a function', function() {
    assert.equal(typeof baseRegister2, 'function');
  });

  it('should export an object', function() {
    assert(baseRegister2);
    assert.equal(typeof baseRegister2, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      baseRegister2();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
