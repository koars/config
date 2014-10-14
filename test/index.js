var mock = require('mock-fs');
var config = require('../index.js')();

before(function() {
	mock({
		'config': {
			'json.json': '{"some": "content"}',
			'script.js': 'module.exports = function() { return "abc";}'
		}
	});
});

describe('The config module', function() {
	describe('when loading json', function() {
		it('provides the correct data', function() {
			var cfg = config('config');
			cfg.json.some.must.be('content');
		});

		it('allows setting defaults', function() {
			var cfg = config('config');
			cfg.defaults('json', {some: 'wrong', unset: 'set'});
			cfg.json.some.must.be('content');
			cfg.json.unset.must.be('set');
		});
	});

	describe('when loading javascript', function() {
		it('provides the correct data', function() {
			var cfg = config('config');
			cfg.script.must.be.a.function();
			cfg.script().must.be('abc');
		});

		it('allows setting defaults', function() {
			var cfg = config('config');
			cfg.defaults('script', {some: 'wrong', unset: 'set'});
			cfg.script.some.must.be('wrong');
			cfg.script.unset.must.be('set');
		});
	});

	describe('allows setting of unset options via defaults', function() {
		it('with objects', function() {
			var cfg = config('config');
			cfg.defaults('default', {'some': 'parts'});
			cfg.default.some.must.be('parts');
		});

		it('with other types', function() {
			var cfg = config('config');
			cfg.defaults('default2', function() {return 'something';});
			cfg.default2.must.be.a.function();
			cfg.default2().must.be('something');
		});
	});

	describe('must persist data across loads', function() {
		before(function() {
			var cfg = config('config');
			cfg.defaults('persist', 'something');
		});

		it('on first load', function() {
			var persisted = config('config');
			persisted.persist.must.be('something');
		});

		it('on second load', function() {
			var persisted = config('config');
			persisted.persist.must.be('something');
		});
	});

	it('must throw a TypeError if no string is supplied', function() {
		config.must.throw(TypeError);
		config.bind(null, function() {}).must.throw(TypeError);
		config.bind(null, 'ABC').must.not.throw();
	});

	it('must resort to an empty object if the directory does not exist', function() {
		var cfg = config('abc');
		Object.keys(cfg).length.must.be(1);
		cfg.must.have.property('defaults');
	});
});