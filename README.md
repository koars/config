koars-config
============
[![Build Status](https://img.shields.io/travis/koars/config.svg?style=flat)](https://travis-ci.org/koars/config)

This module provides config loading for the `koars` framework.

Loading
-------

	var config = require('config')('path/to/config/files');

The above code, loads all files within the `path/to/config/files` directory and requires them. It then assigns each files contents to a shared object and returns it.

*Directory contents:*

	example.js
	static.json

*Resulting object:*

	{
		example: require('example.js'),
		static: require('static.json')
	}

Defaults
--------
The returned object also has a method named `defaults` which can be used to set default values for your configuration files.

	config.defaults('example', {some: 'data'});

This would assign `'data'` to the `config.example.some` property. This overrides no properties, but simply sets those properties which are not set. 