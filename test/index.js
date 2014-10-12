var mock = require('mock-fs');
var config = require('../index.js');

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
			cfg.defaults('default', function() {return 'something';});
			cfg.default.must.be.a.function();
			cfg.default().must.be('something');
		});
	});
});