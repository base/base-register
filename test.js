'use strict';

require('mocha');
var assert = require('assert');
var register = require('./');
var generators = require('base-generators');
var Base = require('base');
var app;

describe('base-register', function() {
  beforeEach(function() {
    app = new Base();
    app.isApp = true;
    app.use(generators());
    app.use(register());
  });

  describe('plugin', function() {
    it('should export a function', function() {
      assert.equal(typeof register, 'function');
    });

    it('should expose a .register method', function() {
      assert.equal(typeof app.register, 'function');
    });
  });

  describe('.register', function() {
    it('should register a generator by filepath', function() {
      app.register(__dirname + '/fixtures/a/index.js');
      assert(app.generators.hasOwnProperty('a'));
    });

    it('should register a generator by directory', function() {
      app.register(__dirname + '/fixtures/a/');
      assert(app.generators.hasOwnProperty('a'));
    });

    it('should register a glob of generators', function() {
      app.register(__dirname + '/fixtures/*/');
      assert(app.generators.hasOwnProperty('a'));
      assert(app.generators.hasOwnProperty('b'));
      assert(app.generators.hasOwnProperty('c'));
    });

    it('should support a custom rename function', function() {
      app.register(__dirname + '/fixtures/*/index.js', function(name, filepath) {
        return 'foo-' + name;
      });

      assert(app.generators.hasOwnProperty('foo-a'));
      assert(app.generators.hasOwnProperty('foo-b'));
      assert(app.generators.hasOwnProperty('foo-c'));
    });
  });
});
