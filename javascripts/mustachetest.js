

var route="hitisrutt";
var lang="fi";

$(document).ready(function(){
	$("#infotemplateholder").load("templates/infocontent.html #infocontenttemplate", function() {
		var template = document.getElementById('infocontenttemplate').innerHTML;
		var data = routeInfo(routes[route], lang);
		var output = Mustache.render(template, data);

		$(".info").html(output);

		$(".timetablebutton").click(function() {
			console.log(this);
			if (this.getAttribute("linktype") === "external") {
				window.open(this.getAttribute("href"), "info");
			} else {
				var index = parseInt(this.getAttribute("index"))
				var tttemplate = document.getElementById('timetabletemplate').innerHTML;
				data.selectedtimetable = data.timetables[index];
				data.selectedtimetable.L = data.L;
				console.log(data.selectedtimetable);
				var ttoutput = Mustache.render(tttemplate, data.selectedtimetable);
				$("#timetabledialog").html(ttoutput);
				$("#timetableModal").modal();
			}
		});
		$("#timetabletemplateholder").load("templates/timetabledialog.html #timetabletemplate", function() {
		});
		$("#contactstemplateholder").load("templates/contactsdialog.html #contactstemplate", function() {
			var template = document.getElementById('contactstemplate').innerHTML;
			var data = routeInfo(routes[route], lang);
			var output = Mustache.render(template, data);
			$("#contactslist").html(output);

			$("#wrapper2").toggleClass("info-open", true);

		});

	});
	
});

