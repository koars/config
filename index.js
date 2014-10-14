var fs = require('fs');
var path = require('path');
var defaults = require('merge-defaults');

module.exports = function() {
	var cache = {};

	return function loadConfig(dir) {
		if(typeof dir !== 'string') throw new TypeError('No string passed as the source directory');

		if(!cache[dir]) {
			var files, config = {};

			try {
				files = fs.readdirSync(dir);
			} catch(e) {
				if(e.code !== 'ENOENT') throw e;
				files = [];
			}

			files.forEach(function(file) {
				config[path.basename(file, path.extname(file))] = require(path.join(process.cwd(), dir, file));
			});

			config.defaults = function(attr, data) {
				if(typeof data !== 'object' && !config.hasOwnProperty(attr)) {
					config[attr] = data;
				} else {
					var src = config[attr] || {};
					config[attr] = defaults(src, data);			
				}
			};

			cache[dir] = config;
		}

		return cache[dir];
	};
};