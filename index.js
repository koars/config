var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function loadConfig(dir) {
	var config = {};
	var files = fs.readdirSync(dir);

	files.forEach(function(file) {
		config[path.basename(file, path.extname(file))] = require(path.join(process.cwd(), dir, file));
	});

	config.defaults = function(attr, data) {
		if(typeof data !== 'object' && !config.hasOwnProperty(attr)) {
			config[attr] = data;
		} else {
			var src = config[attr] || {};
			config[attr] = _.defaults(src, data);			
		}
	};

	return config;
};