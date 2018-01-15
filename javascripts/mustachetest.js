

 $(document).ready(function(){
	$("#infotemplateholder").load("templates/infocontent.html #infocontenttemplate", function() {
		var template = document.getElementById('infocontenttemplate').innerHTML;
		var data = routeInfo(routes.enklingelinjen, "fi");
		console.log(data);
		var output = Mustache.render(template, data);
		$("#info").html(output);
	});
	$("#timetabletemplateholder").load("templates/timetabledialog.html #timetabletemplate", function() {
		var template = document.getElementById('timetabletemplate').innerHTML;
		var data = routeInfo(routes.enklingelinjen, "fi");
		var output = Mustache.render(template, data);
		$("#timetabledialog").html(output);
	});
	$("#contactstemplateholder").load("templates/contactsdialog.html #contactstemplate", function() {
		var template = document.getElementById('contactstemplate').innerHTML;
		var data = routeInfo(routes.enklingelinjen, "fi");
		var output = Mustache.render(template, data);
		$("#contactsdialog").html(output);
	});
});
