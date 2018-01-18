

 $(document).ready(function(){
	$("#infotemplateholder").load("templates/infocontent.html #infocontenttemplate", function() {
		var template = document.getElementById('infocontenttemplate').innerHTML;
		var data = routeInfo(routes.velkuataivassalo, "en");
		var output = Mustache.render(template, data);
		$("#info").html(output);

		$("#timetablesbutton").click(function() {
			console.log(this);
			if (this.getAttribute("linktype") === "external") {
				window.open(this.getAttribute("href"), "info");
			} else {
				$("#timetableModal").modal();
			}	
		});
	});
	$("#timetabletemplateholder").load("templates/timetabledialog.html #timetabletemplate", function() {
		var template = document.getElementById('timetabletemplate').innerHTML;
		var data = routeInfo(routes.velkuataivassalo, "en");
		var output = Mustache.render(template, data);
		$("#timetabledialog").html(output);
	});
	$("#contactstemplateholder").load("templates/contactsdialog.html #contactstemplate", function() {
		var template = document.getElementById('contactstemplate').innerHTML;
		var data = routeInfo(routes.velkuataivassalo, "en");
		var output = Mustache.render(template, data);
		$("#contactslist").html(output);
	});
});

