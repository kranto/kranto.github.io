require('../data/data.js');

$ = {
	get: function() {}
}

require('../javascripts/dataloader.js');
require('../javascripts/datarenderer.js');
require('../javascripts/localizer.js');
require('../data/messages.js');
fmessages = messages;

prepareData(fdata);

console.log(fdata);

console.log(fdata.routes);
var routeIds = Object.keys(fdata.routes);
console.log(routeIds);
var routes = routeIds.map(function(id) { return fdata.routes[id]; });
var routes_fi = routes.map(function(r) { return routeInfo(r, 'fi'); });
var routes_sv = routes.map(function(r) { return routeInfo(r, 'sv'); });

console.log(routes_fi);

var Mustache = require('../js/mustache.min.js');

var fs = require('fs');
var template = fs.readFileSync('../templates/routelist2.html', 'utf8');
var html = Mustache.render(template, {routes: routes_fi});
fs.writeFileSync('../routelist1.html', html);
// console.log(html);
