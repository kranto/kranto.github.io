
fgeojson = [];

$.get("/data/messages.json", function(data) {
  fmessages = data;
  sendDataIf();
});

$.get('/data/saaristo.json', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

$.get('/data/roads.json', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

$.get('/data/routes.json', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

$.get('/data/data.json', function(data) {
  prepareData(data);
  fdata = data;
  sendDataIf();
});

function prepareData(data) {
  Object.keys(data.mun).forEach(function(key) {
    var m = data.mun[key];
    m.name = m.name? m.name: key;
  });


  Object.keys(data.piers).forEach(function(key) {
    var pier = data.piers[key];
    pier.id = key;
    pier.name = pier.name? pier.name: key;
    pier.mun = data.mun[pier.mun];
    pier.type = pier.type? pier.type: "2";
  });

  Object.keys(data.routes).forEach(function(key) {
    var route = data.routes[key];
    route.id = key;
    route.piers = route.piers.map(function(pier) {
      return data.piers[pier];
    });
    route.vessels = route.vessels.map(function(vessel) {
      return data.ferries[vessel];
    });

    route.operator = route.operator? data.operators[route.operator]: null;
    route.pricelists = data.pricelists[route.pricelists];

    if (!Array.isArray(route.timetables)) route.timetables = [route.timetables];

    route.timetables = route.timetables.map(function(timetable) {
      return data.timetables[timetable];
    });

  });
}

var callback = null;
function getFData(cb) {
  callback = cb;
  sendDataIf();
}

function sendDataIf() {
  if (fgeojson.length >= 3 && fdata && fmessages && callback) {
    callback(fdata, fgeojson, fmessages);
  }
}
