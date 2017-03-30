/* global window */
'use strict';

if (!window.D2L) {
	window.D2L = {};
}
if (!window.D2L.Hypermedia) {
	window.D2L.Hypermedia = {};
}
if (!window.D2L.Hypermedia.Siren) {
	window.D2L.Hypermedia.Siren = {};
}

window.D2L.Hypermedia.Siren.Parser = require('./Entity.js');
