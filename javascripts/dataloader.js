
fgeojson = [];

$.get("/data/messages.json?v=1.3", function(data) {
  fmessages = data;
  sendDataIf();
});

$.get('/data/saaristo.json?v=1.4', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

$.get('/data/roads.json?v=1', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

$.get('/data/routes.json?v=1', function(data) {
  fgeojson.push(data);
  sendDataIf();
});

var fdata;

$.get('/data/data.json?v=1.15', function(data) {
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

    if (!route.operator) route.operator = [];
    if (!Array.isArray(route.operator)) route.operator = [route.operator];
    route.operator = route.operator.map(function(op) { return data.operators[op] });
    route.pricelists = data.pricelists[route.pricelists];

    if (!Array.isArray(route.timetables)) route.timetables = [route.timetables];

    route.timetables = route.timetables.map(function(timetable) {
      data.timetables[timetable].id = timetable;
      return data.timetables[timetable];
    });

  });

  var i = 0;
  data.lauttaRoutes.forEach(function(lr) { lr.id = i++; });

  Object.keys(data.mun).forEach(function(key) { addFinnishInessiivi(data.mun[key]); });
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

function addFinnishInessiivi(mun) {
  var vokaalit = "aeiouyåäö";
  var etuvokaalit = "yäö";
  if (mun.name_fi_in) return;
  var name = mun.name_fi || mun.name;
  var lastChar = name.slice(-1);
  if (!vokaalit.includes(lastChar)) name += "i";
  var isEtu = etuvokaalit.split("").map(function(ev) { return name.indexOf(ev) >= 0; }).reduce(function(x, y) { return x || y; }, false);
  name += isEtu? "ssä": "ssa";
  mun.name_fi_in = name;
}
