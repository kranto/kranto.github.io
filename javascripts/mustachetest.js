

 $(document).ready(function(){
	$("#infotemplateholder").load("templates/infocontent.html #infocontenttemplate", function() {
		var template = document.getElementById('infocontenttemplate').innerHTML;
		var data = routeInfo(routes.korpohoutskar, "en");
		var output = Mustache.render(template, data);
		$("#info").html(output);
		$("#contactscollapsebutton").click(function() {
			$("#contactscollapse").collapse('toggle');
		});
		$('#contactscollapse').on('shown.bs.collapse', function () {
			console.log($("#wrapper2")[0].scrollHeight);
			$("#contactscollapse")[0].scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
		});
	});
	$("#timetabletemplateholder").load("templates/timetabledialog.html #timetabletemplate", function() {
		var template = document.getElementById('timetabletemplate').innerHTML;
		var data = routeInfo(routes.korpohoutskar, "en");
		var output = Mustache.render(template, data);
		$("#timetabledialog").html(output);
	});
	$("#contactstemplateholder").load("templates/contactsdialog.html #contactstemplate", function() {
		var template = document.getElementById('contactstemplate').innerHTML;
		var data = routeInfo(routes.korpohoutskar, "en");
		var output = Mustache.render(template, data);
		$("#contactslist").html(output);
	});
});

