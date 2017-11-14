
$(document).ready(function(){
    $('#wrapper').bind('scroll',toggleScrollArrow);
});

function toggleScrollArrow()
{
    var elem = $("#wrapper");
    var infoVisible = $("#info").is(":visible"); 
    var isBottom = (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight());
    $('#scrollArrow').toggleClass('can-scroll', !isBottom && infoVisible);
}

$('div#map').click(function() { // close menu when map clicked
  $('.navbar-toggle[aria-expanded="true"]').click();
});

$('#setMapTypeMap').click(function() {
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
});

$('#setMapTypeSatellite').click(function() {
  map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
});

$('#resetViewButton').click(function() {
  resetMap();
});


$('#closeInfoButton').click(function() {
  unselectAll();
});


function addMapListeners(map) {
  google.maps.event.addListener(map,'maptypeid_changed',function () {
    var isSatellite = map.getMapTypeId() === 'satellite';
    if (isSatellite) {
      $('#setMapTypeMap').removeClass('active');
      $('#setMapTypeSatellite').addClass('active');
    } else {
      $('#setMapTypeMap').addClass('active');
      $('#setMapTypeSatellite').removeClass('active');          
    }
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    // "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var positionL = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var iconL = createCircleIcon('#0000e0', 0.8, 5, null);
  var markerL = createMarker(positionL, true, iconL, map);
}

var selected = [];

function select(targets, mouseEvent) {
  $('#selectedTitle').html(targets.map(function(target) { return target.name; }).join('<br>'));
  $('#selectedDescription').html(targets[0].description? targets[0].description: ' ');
  var selectedCountWas = selected.length;
  selected.forEach(function(target) { target.highlight(false); });
  selected = [];
  targets = (targets.constructor === Array)? targets: [targets];
  targets.forEach(function(target) {
    target.highlight(true);
    selected.push(target);
  });
  if (selectedCountWas == 0) {
    var clientY = latLng2Point(mouseEvent.latLng, map).y;
    if ($("#map").height()*0.90 < clientY) map.panBy(0, $("#map").height()*0.1);
    $(function() { 
      $("#mapcontainer").animate({height: '90%'}, function() { google.maps.event.trigger(map, 'resize'); });
      $("#info").show();
      toggleScrollArrow();
    });
  } else {
      toggleScrollArrow();
  }
}

function latLng2Point(latLng, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function unselectAll() {
  if (selected.length == 0) return;
  $(function() { 
    $("#mapcontainer").animate({height: '100%'}, 100, function() {
      google.maps.event.trigger(map, 'resize');
      $("#info").hide();
      $('#selectedTitle').html(' ');
      $('#selectedDescription').html(' ');
      selected.forEach(function(target) { target.highlight(false); });
      selected = [];
      toggleScrollArrow();
    });
  });
}

function toggleFullscreen() {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
    ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    element = $('#wrapper').get(0);
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
}

var mapShown = true;
$("#toggleFullscreen").click(toggleFullscreen);
var rengastieShown = true;
$("#toggleRengastie").click(function() {
  $(this).toggleClass("active");
  rengastieShown = $(this).hasClass("active");
  rerender(map);
});

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.font = 'bold 12px sans-serif';

var map;
var tooltip;

function createMapStyles(mapTypeId, zoom, settings) {
  return [
    { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{color: '#b8cbb8'}, 
          {lightness: 20}, // {lightness: -10 + 20 + (zoom < 7? 0: (zoom-7)*4)}, 
          {saturation: 0}, //{saturation: 10 + (zoom - 8)*2}
          ]},
    //{ featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{color: '#808080'}, {lightness: 20 + (zoom < 7? 0: (zoom-7)*4)}, {saturation: 10 + (zoom - 8)*2}]},
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{color: '#ececff'}, {lightness: 30}]},

    { featureType: 'all', elementType: 'labels', stylers: [{ "visibility": "off" }]},
    { featureType: 'administrative', elementType: 'labels', stylers: [{ "visibility": zoom <= 7 || zoom >= 13? 'on': 'off' }]},
    { featureType: 'landscape', elementType: 'labels', stylers: [{ "visibility": zoom >= 13? 'on': 'off' }]},
    { featureType: 'poi', elementType: 'labels', stylers: [{ "visibility": zoom >= 10? 'on': 'off' }]},
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ saturation: -10}]},

    //      { featureType: 'administrative', stylers: [{ "visibility": "off" }, {color: '#000000'}]},
    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{color: '#000040'}, {weight: 2}]},
    { featureType: 'transit', stylers: [{ "visibility": "off" }]},

    { featureType: 'road', elementType: 'labels', stylers: [{visibility: 'on'}]},
    { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{color: '#ffffff'}, {weight: 3}]},
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#000000'}]},
    //      { featureType: 'road', elementType: 'geometry', stylers: [{color: '#808080'}]},
    //      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#a0a0a0'}, {weight: zoom <= 10? 1: 3.5}]},
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#808080'}, {weight: zoom <= 8? 0: Math.max(2, (zoom-5)*0.5)}]},
    //      { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{color: '#808080'}, {weight: 5}]},
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#606060'}, {weight: 0.5}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.fill', stylers: [{color: '#808080'}, {weight: Math.max(1.5, (zoom-5)*0.6)}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{color: '#303030'}, {weight: zoom <= 6? 0: 1}]},
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#808080'}, {weight: Math.max(1, (zoom-6)*0.5)}, {lightness: (zoom - 6)*5}]},
    { featureType: 'road.local', elementType: 'geometry', stylers: [{weight: 1.5}, {color: '#a0a0a0'}, {lightness: (zoom-12)*5}]},
  ];
}

function updateMapStyles() {
  map.setOptions({styles: createMapStyles(map.getMapTypeId(), map.getZoom(), {})});        
}

function sanitizeZoomLevels(object) {
  object.minZoom = typeof object.minZoom !== 'undefined'? object.minZoom: 0; 
  object.maxZoom = typeof object.maxZoom !== 'undefined'? object.maxZoom: 30; 
}

function getPosition(kmlLocationString) {
  var latLong = kmlLocationString.split(","); 
  return new google.maps.LatLng(parseFloat(latLong[1]), parseFloat(latLong[0]));
}

function createCircleIcon(color, opacity, scale, labelOrigin) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    strokeWeight: 0,
    fillColor: color,
    fillOpacity: opacity,
    scale: scale,
    labelOrigin: labelOrigin
  };
}

function createLabel(text, color, fontSize, fontWeight, fontFamily) {
  return {text: text, color: color, fontSize: fontSize + 'px', fontWeight: fontWeight? fontWeight: 'normal', fontFamily: fontFamily? fontFamily: 'sans-serif'};
}

function createMarker(position, clickable, icon, map) {
  return new google.maps.Marker({
    position: position,
    clickable: clickable,
    icon: icon,
    map: map,
    cursor: clickable? 'context-menu': 'default',
  });
}

function getLabelColor(mapTypeId) {
  return '#002080';
  return mapTypeId == 'hybrid' || mapTypeId == 'satellite'? '#aaaa00': '#002080';
}


// object renderers

function road(feature, map) {
  var roadCoords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var roadObject = new google.maps.Polyline({
    path: new google.maps.MVCArray(roadCoords),
    geodesic: false,
    strokeColor: '#808080',
    strokeOpacity: 1,
    strokeWeight: 1,
    zIndex: 0,
    map: map,
    clickable: false
  });
  var maxZ = typeof feature.properties.maxZ === 'undefined'? 8: feature.properties.maxZ;
  return {
    rerender: function(zoom, mapTypeId) {
      roadObject.setVisible(zoom >= 8 && zoom <= maxZ);
    }
  };
}

function route(feature, map) {
  var coords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var object = new google.maps.Polyline({
    path: new google.maps.MVCArray(coords),
    geodesic: false,
    strokeColor: '#803090',
    strokeOpacity: 0.5,
    strokeWeight: 4,
    zIndex: 0,
    map: map,
    cursor: 'context-menu',
    clickable: true
  });
  return {
    rerender: function(zoom, mapTypeId) {
      object.setVisible(rengastieShown && zoom >= 8);
      object.setOptions({strokeWeight: (zoom<=8? 2: zoom<=9? 3: 4)});
    }
  };
}

// Define a symbol using SVG path notation, with an opacity of 1.
var borderLineSymbol = {
  path: 'M 0,-4 0,0',
  strokeOpacity: 0.4,
  strokeColor: '#808080',
  scale: 1
};

function border(feature, map) {
  var coords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var object = new google.maps.Polyline({
    path: new google.maps.MVCArray(coords),
    geodesic: false,
    zIndex: 0,
    map: map,
    clickable: false,
    strokeOpacity: 0,
    icons: [{
      icon: borderLineSymbol,
      offset: '0',
      repeat: '8px'
    }],
  });
  return {
    rerender: function(zoom, mapTypeId) {
      object.setVisible(zoom >= 7 && zoom <= 30);
      borderLineSymbol.opacity = 1;
    }
  };
}

var pierStylers = {
  "1": {
    markerVisibleFrom: 8,
    labelVisibleFrom: 8,
    fontSize: function(zoom) {return zoom + 2;},
    fontWeight: function(zoom) {return 'bold';},
    markerScale: function(zoom) {return zoom <= 8? 3: zoom <= 10? 4: zoom <= 11? 5: 6;},
    markerOpacity: function(zoom) {return zoom <= 10? 1 : 0.8;},
    clickable: function(zoom) { return true; }
  },
  "2":  {
    markerVisibleFrom: 9,
    labelVisibleFrom: 9,
    fontSize: function(zoom) {return zoom + 1;},
    fontWeight: function(zoom) {return 'bold';},
    markerScale:  function(zoom) {return zoom <= 9? 3: zoom <= 10? 3.5: zoom <= 12? 4: 5;},
    markerOpacity: function(zoom) {return zoom <= 11? 0.5: 0.8; },
    clickable: function(zoom) { return true; }
  },
  "3": {
    markerVisibleFrom: 9,
    labelVisibleFrom: 10,
    fontSize: function(zoom) {return zoom;},
    fontWeight: function(zoom) {return zoom <= 10? 'normal': 'bold';},
    markerScale:  function(zoom) {return (zoom <= 9? 2.5: zoom <= 10? 3: zoom <= 12? 3.5: 4.5);},
    markerOpacity: function(zoom) {return zoom <= 12? 0.5: 0.8; },
    clickable: function(zoom) { return true; }
  },
  "4": {
    markerVisibleFrom: 9,
    labelVisibleFrom: 11,
    fontSize: function(zoom) {return zoom-1;},
    fontWeight: function(zoom) {return 'normal'},
    markerScale:  function(zoom) {return (zoom <= 9? 1: zoom <= 10? 2: zoom <= 11? 3: 4);},
    markerOpacity: function(zoom) {return  zoom <= 12? 0.5: 0.8},
    clickable: function(zoom) { return zoom >= 10; }
  },
  "5": {
    markerVisibleFrom: 30,
    labelVisibleFrom: 11,
    fontSize: function(zoom) {return zoom-1;},
    fontWeight: function(zoom) {return 'normal'},
    markerScale:  function(zoom) {return 0;},
    markerOpacity: function(zoom) {return  0;},
    clickable: function(zoom) { return true; }
  }
};

function pier(feature, map) {
  var styler = pierStylers[feature.properties.ssubtype];
  var markerVisibleFrom = feature.properties.markerVisibleFrom || styler.markerVisibleFrom;
  var labelVisibleFrom = feature.properties.labelVisibleFrom || styler.labelVisibleFrom;
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var icon = createCircleIcon('#e00000', 0.8, 3, null);
  var marker = createMarker(position, true, icon, map);
  var label = new lbls.Label({
    map: map,
    position: position,
    labelAnchor: feature.properties.labelAnchor,
    label: createLabel(feature.properties.sname, getLabelColor('roadmap'), styler.fontSize(9), styler.fontWeight(9)),
    background: 'none',
    opacity: 0.9,
    clickable: true,
    cursor: 'context-menu',
  });
  marker.addListener('click', function(event) {
    tooltip.setPosition(event.latLng);
    tooltip.setContent(feature.properties.sname);
    tooltip.open(map, marker);
  });
  label.addListener('click', function(event) {
    google.maps.event.trigger(marker, 'click', event);
  });
  return {
    rerender: function(zoom, mapTypeId) {
      marker.setVisible(zoom >= markerVisibleFrom);
      marker.getIcon().scale = styler.markerScale(zoom);
      marker.getIcon().fillOpacity = styler.markerOpacity(zoom);
      marker.setIcon(marker.getIcon());
      marker.setClickable(styler.clickable(zoom));
      label.setVisible(zoom >= labelVisibleFrom);
      label.setLabel(createLabel(feature.properties.sname, getLabelColor(mapTypeId), styler.fontSize(zoom), styler.fontWeight(zoom)));
      label.setClickable(styler.clickable(zoom));
    }
  };
}

var _cableferrySymbol;
function cableferrySymbol() {
  _cableferrySymbol = _cableferrySymbol || {
    path: google.maps.SymbolPath.CIRCLE,
    strokeOpacity: 1,
    strokeColor: '#00a000',
    strokeWeight: 2.5,
    fillColor: '#00a000',
    fillOpacity: 0.5,
    scale: 2
  };
  return _cableferrySymbol;
}

function cableferry(feature, map) {
  var coords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var line = new google.maps.Polyline({
    path: new google.maps.MVCArray(coords),
    geodesic: false,
    zIndex: 11,
    strokeOpacity: 0,
    strokeWeight: 20,
    strokeColor: '#ffff00',
    cursor: 'context-menu',
    icons: [{
      icon: cableferrySymbol(),
      offset: '0',
      repeat: '5px'
    }],
    map: map
  });
  line.addListener('click', function(event) {
    select([{name: feature.properties.sname, description: feature.properties.description,
      highlight: function(doHighlight) {
        line.setOptions({strokeOpacity: doHighlight? 0.5: 0});
      }
    }], event);
  });
  return {
    rerender: function(zoom, mapTypeId) {
      line.setVisible(zoom >= 9);
    }
  };
}

var _pinPaths = {
  n:  "M 0 0 L -1.4 -27 A 6 6, 0, 1, 1, 1.4 -27 L 0 0 Z",
  e:  "M 0 0 L 27 -1.4 A 6 6, 0, 1, 1, 27 1.4 L 0 0 Z",
  s:  "M 0 0 L -1.4 27 A 6 6, 0, 1, 0, 1.4 27 L 0 0 Z",
  w:  "M 0 0 L -27 -1.4 A 6 6, 0, 1, 0, -27 1.4 L 0 0 Z",
  se: "M 0 0 L 18 20 A 6 6, 0, 1, 0, 20 18 L 0 0 Z",
  ne: "M 0 0 L 18 -20 A 6 6, 0, 1, 1, 20 -18 L 0 0 Z",
  nw: "M 0 0 L -18 -20 A 6 6, 0, 1, 0, -20 -18 L 0 0 Z",
  sw: "M 0 0 L -18 20 A 6 6, 0, 1, 1, -20 18 L 0 0 Z"
}

var _pinSymbols = {};
function pinSymbol(dir) {
  _pinSymbols[dir] = _pinSymbols[dir] || {
    path: _pinPaths[dir],
    strokeOpacity: 1,
    strokeColor: '#0000d0',
    strokeWeight: 1,
    fillColor: '#0000d0',
    fillOpacity: 0.5,
    scale: 0.6
  };
  return _pinSymbols[dir];
}

function pin(feature, map) {
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var marker = createMarker(position, false, pinSymbol(feature.properties.ssubtype), map);
  return {
    rerender: function(zoom, mapTypeId) {
      marker.setVisible(zoom >= 12);
          // marker.getIcon().scale = (zoom-10)/7 + 0.6;
          // marker.setIcon(marker.getIcon());
      }
  };
}

var areaStylers = {
  "province": {
    labelVisibleFrom: 1,
    labelVisibleTo: 10,
    fontFamily: 'Roboto',
    color: '#202030',
    opacity: 0.7,
    fontSize: function(zoom) {return Math.max(12, Math.floor((zoom-6)*3+8));},
    fontWeight: function(zoom) {return zoom <= 7? 'normal': 'bold';},
  },
  "mun1": {
    labelVisibleFrom: 1,
    labelVisibleTo: 30,
    fontFamily: 'Roboto',
    color: '#202030',
    opacity: 0.7,
    fontSize: function(zoom) {return Math.max(14, Math.floor((zoom-6)*2.5+12));},
    fontWeight: function(zoom) {return 'bold';},
  },
  "mun2": {
    labelVisibleFrom: 8,
    labelVisibleTo: 30,
    fontFamily: 'Roboto',
    color: '#202030',
    opacity: 0.7,
    fontSize: function(zoom) {return Math.max(12, Math.floor((zoom-6)*2.2+8));},
    fontWeight: function(zoom) {return 'bold';},
  },
  "island1": {
    labelVisibleFrom: 9,
    labelVisibleTo: 30,
    fontFamily: 'Courier',
    color: '#202030',
    fontSize: function(zoom) {return zoom; },
    fontWeight: function(zoom) {return 'normal';},
  },
};

function area(feature, map) {
  var styler = areaStylers[feature.properties.ssubtype];
  var labelVisibleFrom = feature.properties.labelVisibleFrom || styler.labelVisibleFrom;
  var labelVisibleTo = feature.properties.labelVisibleTo || styler.labelVisibleTo;
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var label = new lbls.Label({
    map: map,
    position: position,
    labelAnchor: feature.properties.labelAnchor,
    label: {text: feature.properties.sname, fontSize: '9px', fontWeight: 'normal', fontFamily: styler.fontFamily, color: styler.color},
    background: feature.properties.background || 'none',
    opacity: styler.opacity || 0.9,
    clickable: false
  });
  return {
    rerender: function(zoom, mapTypeId) {
      label.setVisible(zoom >= labelVisibleFrom && zoom <= labelVisibleTo);
      label.getLabel().fontSize = styler.fontSize(zoom) + 'px';
      label.getLabel().fontWeight = styler.fontWeight(zoom);
      label.setLabel(label.getLabel());
    }
  };
}

var boxStylers = {
  "distance": {
    visibleFrom: 12,
    visibleTo: 15,
  },
};

function box(feature, map) {
  var styler = boxStylers[feature.properties.ssubtype];
  var visibleFrom = feature.properties.visibleFrom || styler.visibleFrom;
  var visibleTo = feature.properties.visibleTo || styler.visibleTo;
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var box = new txtol.TxtOverlay(
    position, '<div>' + feature.properties.description + '</div>', "distancebox", map, feature.properties.anchor);
  return {
    rerender: function(zoom, mapTypeId) {
      if (zoom >= visibleFrom && zoom <= visibleTo) box.show(); else box.hide();
    }
  };
}

var renderers = {
  road: road,
  route: route,
  border: border,
  pier: pier,
  cableferry: cableferry,
  area: area,
  box: box,
  pin: pin
};

var objects = [];
function rerender(map) {
  var zoom = map.getZoom();
  var mapTypeId = map.getMapTypeId();
  objects.forEach(function(object){ object.rerender(zoom, mapTypeId); }); 
}

function renderData(data, map) {
  var features = data.features;
  features.forEach(function(feature) {
    var type = feature.properties.stype;
    if (typeof renderers[type] !== 'undefined') {
      objects.push(renderers[type](feature, map));
    }
  });
  var prevZoom = map.getZoom();
  google.maps.event.addListener(map,'zoom_changed',function() {
        //console.log('zoomChanged: ', prevZoom + ' - ' + map.getZoom());
        var t0 = new Date().getTime();
        prevZoom = map.getZoom();
        setTimeout(function() { rerender(map); }, 300);
        var t1 = new Date().getTime();
        //console.log('zoomChanged complete in ' + (t1-t0) + " ms");
      });

  google.maps.event.addListener(map,'maptypeid_changed',function () {
    rerender(map);
  });
  rerender(map);

  addMapListeners(map);
}

var mapOptions = {
  center: {lat: 60.25, lng: 21.25},
  zoom: 9,
  minZoom: 6,
  maxZoom: 17,
  mapTypeControl: false,
  //mapTypeId: google.maps.MapTypeId.TERRAIN,
  fullscreenControl: false,
  streetViewControl: false,
  gestureHandling: 'greedy',
  scaleControl: true,
  styles: [],
};

function resetMap() {
  map.setOptions(mapOptions);
  map.fitBounds({south: 60, north: 60.5, west: 20, east: 22.3});
}

function initMap() {

  var data = {};
  lbls.init();
  txtol.init();

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  resetMap();

  getLocation();

  function fullscreenchange(event) {
    var isFullScreen = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)? true: false;
    $('#toggleFullscreen').toggleClass('active', isFullScreen);
  }

  document.onfullscreenchange = fullscreenchange;
  document.onwebkitfullscreenchange = fullscreenchange;

  updateMapStyles();
  map.addListener('zoom_changed', updateMapStyles);

  $.get('/data/saaristo6.geojson', function(response) {
    data = response;
    renderData(data, map);
  });
  tooltip = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true
  });

  function openTooltip(object, position, content) {
    tooltip.setPosition(position);
    tooltip.setContent(content);
    tooltip.open(map, object);
  }

  map.addListener('click', function() { tooltip.close(); });

  var Alue2 = {
    create: function(target) {
      sanitizeZoomLevels(target);
      target.label = new lbls.Label({
        map: map,
        position: getPosition(target.location),
        labelAnchor: target.labelOrigin,
        label: {
          text: target.name,
          color: '#202030',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Roboto'
        },
        background: target.background? target.background: 'none',
        opacity: 0.7,
        clickable: false
      });
      return target;
    },
    zoomChanged: function(object, zoom, mapTypeId) {
      object.label.setVisible(zoom >= object.minZoom && zoom <= object.maxZoom);
      object.label.getLabel().fontSize = Math.max(12, Math.floor((zoom-6)*2.2+8)) + 'px';
      object.label.setLabel(object.label.getLabel());
    }
  }

  function getShortName(object) {
    var name = object.name;
    if (typeof name === 'string') return name;
    return name.sv;
  }

  function getNameAndVariants(object) {
    var name = object.name;
    if (typeof name === 'string') return {name: name, aka: []};
    return {name: name.sv, aka: [name.fi]};
  }

  function getAllNames(object) {
    var names = getNameAndVariants(object);
    names.aka.unshift(names.name);
    return names.aka.join('/');
  }

  var reitit = [
  { name: "<b>Pohjoinen reitti:</b><br>Åva - Vuosnainen", color: '#db0a00', highlightColor: '#800080', weight: 2.5, zIndex: 10,
  path: "21.058141,60.5032778,0.0 21.0631943,60.5031457,0.0 21.0666275,60.5025329,0.0 21.0694599,60.5016982,0.0 21.073451,60.5002401,0.0 21.0770988,60.4982748,0.0 21.0795665,60.4964889,0.0 21.0837644,60.4935569,0.0 21.0889916,60.4913856,0.0 21.0972133,60.4901709,0.0 21.1100505,60.4897698,0.0 21.1360658,60.4900626,0.0 21.1839765,60.4930855,0.0 21.2237429,60.4970253,0.0 21.2355631,60.4997952,0.0 21.2449934,60.5033775,0.0 21.2467933,60.5046322,0.0 21.2477351,60.5059714,0.0 21.2472153,60.5071285,0.0" },
  { name: "<b>Pohjoinen reitti:</b><br>Åva - Jurmo", color: '#db0a00', highlightColor: '#800080', weight: 1.5, zIndex: 9,
  path: "21.058141,60.5032778,0.0 21.0621214,60.5036106,0.0 21.0642672,60.5043712,0.0 21.0641813,60.5074983,0.0 21.0652542,60.5116813,0.0 21.0687304,60.5133712,0.0 21.0740519,60.5159482,0.0" },
  { name: "<b>Pohjoinen reitti:</b><br>Hummelvik - Torsholma", color: '#db0a00', highlightColor: '#800080', weight: 2.5, zIndex: 10,
  legs: [
  { name: "Torsholma - Lappo", 
  path: "21.0380459,60.3565714,0.0 21.0380888,60.3539393,0.0 21.0371017,60.3509885,0.0 21.0291624,60.3375686,0.0 21.0226822,60.3291147,0.0 21.0211372,60.3274789,0.0 21.0189486,60.325673,0.0 21.0146141,60.3228684,0.0 21.0092926,60.3202761,0.0 21.0043573,60.3185973,0.0 21.0013533,60.3180235,0.0 20.9960747,60.3174497,0.0" },
  { name: "Lappo - Kumlinge",
  path: "20.9960747,60.3174497,0.0 20.9998512,60.3173647,0.0 21.0033703,60.3170247,0.0 21.006074,60.3161321,0.0 21.0082197,60.315112,0.0 21.0094643,60.3131142,0.0 21.0102367,60.3097983,0.0 21.0085201,60.3067585,0.0 21.0065031,60.3045051,0.0 21.0031128,60.3016774,0.0 20.9962463,60.2961489,0.0 20.9921694,60.2937458,0.0 20.9886074,60.2925123,0.0 20.984273,60.2917254,0.0 20.9728575,60.2908534,0.0 20.9692955,60.2907896,0.0 20.9647036,60.2909385,0.0 20.9589529,60.2913851,0.0 20.9483957,60.2929589,0.0 20.9420013,60.2937245,0.0 20.9377527,60.2941499,0.0 20.9233332,60.2950431,0.0 20.9118748,60.2950643,0.0 20.9071541,60.2947241,0.0 20.8955669,60.2932354,0.0 20.8850098,60.2916403,0.0 20.8652258,60.2895347,0.0 20.8609343,60.2891093,0.0 20.8476305,60.2870886,0.0 20.8416224,60.2863016,0.0 20.8342838,60.2856634,0.0 20.830164,60.2857272,0.0 20.8270311,60.2858974,0.0 20.8243704,60.2863016,0.0 20.8200788,60.2873651,0.0 20.8049297,60.2924698,0.0 20.8026981,60.2928738,0.0 20.7955313,60.2930015,0.0 20.7929134,60.2927037,0.0 20.7908535,60.292172,0.0 20.7898235,60.2915127,0.0 20.7893085,60.2907258,0.0" },
  { name: "Kumlinge - Enklinge",
  path: "20.7893085,60.2907258,0.0 20.7667351,60.3115201,0.0 20.7628727,60.3141556,0.0 20.7590803,60.3158745,0.0 20.7548583,60.3173488,0.0 20.751425,60.3182838,0.0 " },
  { name: "Enklinge - Hummelvik", 
  path: "20.751425,60.3182838,0.0 20.7531309,60.3174285,0.0 20.7538605,60.3165784,0.0 20.7535172,60.3155583,0.0 20.7514143,60.3138368,0.0 20.7473803,60.3119026,0.0 20.7415867,60.3101172,0.0 20.734849,60.3089268,0.0 20.7144642,60.3063971,0.0 20.6941223,60.302464,0.0 20.6694031,60.2931078,0.0 20.6117249,60.2655338,0.0 20.5962753,60.2602546,0.0 20.5791092,60.2554856,0.0 20.5626297,60.2524195,0.0 20.5369663,60.2482456,0.0 20.5137062,60.2449232,0.0 20.4970551,60.2402372,0.0 20.4857254,60.2358914,0.0 20.4697609,60.2312041,0.0 20.4534531,60.2283913,0.0 20.434227,60.2260046,0.0 20.4179192,60.2237882,0.0 20.4151726,60.22398,0.0 20.4137778,60.224289,0.0" }
  ]},
  { name: "<b>Pohjoinen reitti:</b><br>Asterholmalinjen", color: '#db0a00', highlightColor: '#800080', weight: 1.5, zIndex: 9,
  path: "20.9960747,60.3174497,0.0 20.9996367,60.3175985,0.0 21.0026407,60.3174922,0.0 21.0070181,60.3163871,0.0 21.0093355,60.3148145,0.0 21.0108805,60.3126891,0.0 21.0119963,60.3106698,0.0 21.0158157,60.3085229,0.0 21.022253,60.3052704,0.0 21.0266733,60.303931,0.0 21.0297203,60.3035271,0.0 21.0317373,60.3035909,0.0 21.0340977,60.3041224,0.0" },
  { name: "<b>Poikittainen reitti:</b><br>Långnäs - Överö - Snäckö", color: '#f7c71a', highlightColor: '#800080', weight: 3, zIndex: 10,
  legs: [
  { name: "Långnäs - Överö",
  path: "20.3008461,60.1170532,0.0 20.3083992,60.1170532,0.0 20.3221321,60.1157702,0.0 20.3557777,60.1153426,0.0 20.3957748,60.1123488,0.0 20.4373169,60.1029382,0.0 20.4513931,60.1023393,0.0 20.4627228,60.1042216,0.0 20.4704475,60.1114934,0.0 20.4908752,60.1163689,0.0 20.5083847,60.1159413,0.0 20.5107182,60.1115362,0.0" },
  { name: "Överö - Snäckö",
  path: "20.5107182,60.1115362,0.0 20.5106163,60.1163689,0.0 20.55439,60.1209872,0.0 20.5815125,60.1261177,0.0 20.6074333,60.1306491,0.0 20.6144714,60.1339831,0.0 20.6381607,60.1672191,0.0 20.694809,60.1847207,0.0 20.7413292,60.1854889,0.0 20.7471657,60.1889027,0.0 20.7461357,60.19334,0.0 20.7432175,60.1963264,0.0 20.7209015,60.2112541,0.0 20.7198715,60.21458,0.0 20.7257509,60.219291,0.0" },
  { name: "Långnäs - Bergö", weight: 1.5, zIndex: 9,
  path: "20.3008461,60.1170532,0.0 20.2984428,60.1288537,0.0 20.3018761,60.1420175,0.0 20.3501129,60.1591055,0.0 20.3664207,60.1604721,0.0 20.3832436,60.1591909,0.0 20.3904533,60.1633761,0.0 20.3931999,60.1631198,0.0" },
  { name: "Överö - Sottunga", weight: 1.5, zIndex: 9,
  path: "20.5107182,60.1115362,0.0 20.5106163,60.1163689,0.0 20.55439,60.1209872,0.0 20.5815125,60.1261177,0.0 20.6029701,60.1245787,0.0 20.6393623,60.1124344,0.0 20.6589317,60.1108947,0.0 20.6803894,60.1092693,0.0 20.682224,60.1099751,0.0" },
  { name: "Sottunga - Snäckö", weight: 1.5, zIndex: 9,
  path: "20.682224,60.1099751,0.0 20.7006454,60.1079861,0.0 20.704937,60.1095259,0.0 20.7047653,60.1156847,0.0 20.6996155,60.1279988,0.0 20.6944656,60.1332138,0.0 20.6939507,60.1748185,0.0 20.6912041,60.1804529,0.0 20.694809,60.1847207,0.0 20.7413292,60.1854889,0.0 20.7471657,60.1889027,0.0 20.7461357,60.19334,0.0 20.7432175,60.1963264,0.0 20.7209015,60.2112541,0.0 20.7198715,60.21458,0.0 20.7257509,60.219291,0.0" }
  ]},

  { name: "<b>Eteläinen reitti:</b><br>Långnäs - Överö - Sottunga - Kökar", color: '#00a000', highlightColor: '#0000ff', weight: 2.5, zIndex: 10,
  legs: [
  { name: "Långnäs - Överö",
  path: "20.3008461,60.1170532,0.0 20.3205872,60.1142307,0.0 20.3626442,60.1133753,0.0 20.3928566,60.1108947,0.0 20.4359436,60.1007135,0.0 20.4505348,60.1001145,0.0 20.465126,60.1025104,0.0 20.4740524,60.1102958,0.0 20.4932785,60.1144017,0.0 20.5056381,60.1142307,0.0 20.5107182,60.1115362,0.0" },
  { name: "Överö - Sottunga",  
  path: "20.5107182,60.1115362,0.0 20.5125046,60.1150004,0.0 20.5567932,60.1194478,0.0 20.5820274,60.1241511,0.0 20.6019402,60.1226974,0.0 20.6371307,60.1114934,0.0 20.6640816,60.1097826,0.0 20.6750679,60.1086705,0.0 20.682106,60.1086705,0.0 20.682224,60.1099751,0.0" },
  { name: "Sottunga - Kökar",
  path: "20.682224,60.1099751,0.0 20.6839943,60.108756,0.0 20.726738,60.1032805,0.0 20.7754898,60.0623562,0.0 20.7897377,60.0396461,0.0 20.7966042,60.0128882,0.0 20.823555,59.9861945,0.0 20.887928,59.9593933,0.0 20.8938932,59.9479403,0.0 20.8923429,59.9458046,0.0" },
  { name: "Husö", weight: 1.5, zIndex: 9,
  path: "20.7798672,60.0553306,0.0 20.7814121,60.0591434,0.0 20.7875061,60.0604714,0.0 20.8053589,60.0624847,0.0 20.806421,60.0631646,0.0 20.8072901,60.064637,0.0 20.8054984,60.0635448,0.0 20.8042431,60.0630415,0.0 20.8012927,60.0627899,0.0 20.7864332,60.0620563,0.0 20.7791805,60.0630629,0.0 20.7742882,60.0644764,0.0 20.7722712,60.0650118,0.0" },
  { name: "Kyrkogårdsö", weight: 1.5, zIndex: 9,
  path: "20.7892657,60.0405676,0.0 20.7927847,60.0389603,0.0 20.8124399,60.0344806,0.0 20.8205938,60.0307078,0.0 20.8226108,60.0305792,0.0 20.825057,60.0310079,0.0 20.8213193,60.0271024,0.0 20.8189553,60.0261127,0.0 20.8081346,60.0245187,0.0 20.8028875,60.0228314,0.0 20.7988318,60.0205716,0.0 20.7969874,60.0184108,0.0 20.7959605,60.0155907,0.0" },
  ]},
  { name: "<b>Eteläinen reitti:</b><br>Kökar - Galtby", color: '#00a000', highlightColor: '#0000ff', weight: 2.5, zIndex: 10, // #19961c
  path: "21.584959,60.1859156,0.0 21.5804529,60.1874518,0.0 21.5653038,60.1902681,0.0 21.5007591,60.1895854,0.0 21.4746666,60.1807944,0.0 21.4396477,60.1740501,0.0 21.276741,60.1063606,0.0 21.160183,60.0441036,0.0 21.039505,59.9837043,0.0 21.0108376,59.9718517,0.0 20.9991646,59.969704,0.0 20.900631,59.9631743,0.0 20.8937645,59.9603386,0.0 20.8932495,59.9574167,0.0 20.8938932,59.9479403,0.0" },
  { name: "Föglön linja: Svinö - Degerby", color: '#004d9d', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  path: "20.2676296,60.066551,0.0 20.3229046,60.0594433,0.0 20.3524303,60.0357024,0.0 20.3667641,60.0321869,0.0 20.3858185,60.0321441,0.0" },        
  { name: "Iniö - Kustavi", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  description: '<p>m/s Aura, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400320093">0400 320 093</a>, 52 <i class="fa fa-car" aria-hidden="true"></i></p><p>Laiturit: Kannvik(Iniö), Heponiemi(Kustavi)</p><p>Aikataulun mukaan, 5-8 päivittäin</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/inio-kustavi-aura.html">Aikataulut ja info</a></p>',
  path: "21.3966036,60.4392476,0.0 21.3996935,60.4402851,0.0 21.4001656,60.4407085,0.0 21.4029121,60.4488584,0.0 21.4069033,60.4547208,0.0 21.4262152,60.4803802,0.0 21.4301205,60.4853067,0.0 21.4317942,60.4858564,0.0 21.4331675,60.4857295,0.0 21.4348412,60.4852697,0.0" },        
  { name: "Houtskari - Iniö", color: '#f08000', highlightColor: '#ff0000', weight: 2.5, zIndex: 10,
  description: '<p>m/s Antonia, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400320049">0400 320 049</a>, 27 <i class="fa fa-car" aria-hidden="true"></i></p><p>Vain kesäisin, maksullinen</p><p>Laiturit: Mossala(Houtskari), Dalen(Iniö)</p><p>Aikataulun mukaan, 3-4 päivittäin</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/saariston-rengastie-houtskari-inio.html">Aikataulut ja info</a></p><pre>Aikataulu 25.5. - 27.8.2017\n\nMossalasta\n\nma-la  9.00 12.15 14.15 16.15\nsu    12.15 15.15 17.15\n\nDalenista\n\nma-la 11.15 13.15 15.15 17.45\nsu    13.15 16.15 18.15\n\nHinnasto (ajoneuvot matkustajineen)\n\nhenkilöauto              40e\nasuntoauto               75e\nlinja-auto, kuorma-auto 140e\nmoottoripyörä, mopo      25e\npolkupyörä               15e\naikuinen                 10e\nlapsi                     5e</pre>',
  path: "21.4391327,60.2890455,0.0 21.4377594,60.2916403,0.0 21.4343262,60.2934693,0.0 21.4275885,60.2960213,0.0 21.4155722,60.3026979,0.0 21.4000368,60.3113288,0.0 21.3890505,60.325758,0.0 21.3836861,60.3335543,0.0 21.3661766,60.3400322,0.0 21.3647175,60.3412851,0.0 21.3653183,60.3427079,0.0 21.3786221,60.3531114,0.0 21.3788795,60.3544912,0.0 21.3683653,60.3730598,0.0 21.3686657,60.3768147,0.0 21.3713586,60.3815766,0.0" },
  { name: "Korppoo - Houtskari", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  description: '<p>m/s Stella, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400114291">0400 114 291</a>, 65 <i class="fa fa-car" aria-hidden="true"></i><br/>m/s Mergus, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400533461">0400 533 461</a>, 27 <i class="fa fa-car" aria-hidden="true"></i></p><p>Laiturit: Galtby(Korppoo), Kittuis(Houtskari)</p><p>Aikataulun mukaan, 11-12 päivittäin, osa vuoroista vain tilauksesta</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/korppoo-houtskari.html">Aikataulut ja info</a></p>',
  path: "21.584959,60.1859156,0.0 21.5822554,60.1881986,0.0 21.5651751,60.1910574,0.0 21.4995575,60.1910361,0.0 21.4633369,60.180709,0.0 21.4513206,60.1808797,0.0 21.4386606,60.1867051,0.0" },        
  { name: "Korppoo - Norrskata", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  description: '<p>m/s Stella, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400114291">0400 114 291</a>, 65 <i class="fa fa-car" aria-hidden="true"></i><br/>m/s Mergus, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400533461">0400 533 461</a>, 27 <i class="fa fa-car" aria-hidden="true"></i></p><p>Laiturit: Galtby(Korppoo), Olofsnäs(Norrskata)</p><p>Aikataulun mukaan, 13-14 päivittäin, osa vuoroista vain tilauksesta</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/korppoo-norrskata.html">Aikataulut ja info</a></p>',
  path: "21.584959,60.1859156,0.0 21.5829849,60.189244,0.0 21.5580082,60.2164559,0.0" },        
  { name: "Hakkenpää - Teersalo", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  description: '<p>m/s Kivimo, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400320095">0400 320 095</a>, 8 <i class="fa fa-car" aria-hidden="true"></i></p><p>Vain kesäisin, osa Velkuan reittialuetta</p><p>Vain henkilöautoja, moottoripyöriä ja polkupyöriä</p><p>Laiturit: Teersalo(Velkua), Hakkenpää(Taivassalo)</p><p>Aikataulun mukaan, 1-2 päivittäin</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html">Aikataulut ja info</a></p><pre>Aikataulu 1.6.-31.8.2017 (tark. 20.1.)\n\nTeersalo - Hakkenpää  päivät\n\n  8.15   -   9.00     12345..\n 15.00   -  15.45     1234567\n\nHakkenpää - Teersalo  päivät\n\n  9.15   -  10.30     12345..\n 16.00   -  17.00     1234567</pre>',
  path: "21.61354,60.499274 21.634397,60.493272 21.64635,60.482305 21.657599,60.479591 21.672129,60.478783 21.694042,60.467349" },        
  { name: "Nauvo - Seili - Hanka", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  description: '<p>m/s Östern, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400720606">0400 720606</a>, 15 <i class="fa fa-car" aria-hidden="true"></i></p><p>Vain kesäisin <i class="fa fa-sun-o" aria-hidden="true"></i>, maksullinen <i class="fa fa-eur" aria-hidden="true"></i></p><p>Aikataulun mukaan, 3 päivittäin</p><p>Laiturit: Nauvo, Seili, Hanka(Aaslaluoto, Rymättylä)</p><p><a target="info" href="http://www.ostern.fi/">Aikataulut ja info</a></p><pre>Aikataulu 19.5.-3.9.2017 (tark. 18.1.)\n\nNauvo - Seili - Hanka   päivät\n\n 8.40    9.10    9.40   12345..\n 9.00    9.30   10.00   .....67\n12.10   12.40   13.10   1234567\n15.25   15.55   16.25   123456.\n16.20   16.50   17.20   ......7\n\nHanka - Seili - Nauvo   päivät\n\n10.20   10.50   11.20   1234567\n13.50   14.20   14.50   1234567\n16.55   17.25   17.55   12.4.6.\n17.35   18.05   18.35   ..3.5..\n17.40   18.10   18.40   ......7</pre>',
  legs: [
  { name: "Nauvo - Seili",
  path: "21.9118452,60.1941507,0.0 21.9155788,60.1973502,0.0 21.9130039,60.2006135,0.0 21.9075108,60.2050493,0.0 21.9065237,60.2160509,0.0 21.9081974,60.2180334,0.0 21.949439,60.232376,0.0 21.9551468,60.2363814,0.0" },
  { name: "Seili - Hanka",
  path: "21.9551468,60.2363814,0.0 21.9496322,60.2361896,0.0 21.946435,60.2363814,0.0 21.9448256,60.2374679,0.0 21.9447398,60.2383413,0.0 21.9472075,60.247628,0.0 21.9516277,60.2524834,0.0 21.9596958,60.2623409,0.0 21.9708538,60.2763023,0.0 21.9711971,60.2779194,0.0 21.9701672,60.2800471,0.0 21.9663048,60.2838978,0.0 21.9662619,60.2849614,0.0 21.9686651,60.2857698,0.0" },
  ]},
  { name: "Kasnäs - Hiittinen", color: '#f08000', highlightColor: '#ff0000',weight: 2.5, zIndex: 10,
  path: "22.4121737,59.9210221,0.0 22.4124956,59.9199144,0.0 22.4121523,59.9188712,0.0 22.4112725,59.9178924,0.0 22.4094915,59.9164297,0.0 22.4092126,59.915268,0.0 22.4098992,59.9135362,0.0 22.4118733,59.9105134,0.0 22.418611,59.9044239,0.0 22.4221087,59.9024548,0.0 22.4253702,59.9007546,0.0 22.4333739,59.8984086,0.0 22.4409485,59.8952337,0.0 22.4429011,59.8940821,0.0 22.4503255,59.8866224,0.0 22.4535871,59.8828111,0.0 22.454145,59.8814976,0.0 22.4542522,59.8806577,0.0 22.4530721,59.8792148,0.0 22.4513555,59.8785041,0.0 22.4499822,59.8776857,0.0 22.448523,59.875672,0.0 22.4486303,59.8727103,0.0" },        

  { name: "Paraisten reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  path: "22.2613478,60.1963691,0.0 22.2624636,60.1810078,0.0 22.258966,60.1771343,0.0 22.2594166,60.1806663,0.0 22.2352123,60.1826722,0.0 22.2337961,60.1842726,0.0 22.2360706,60.1852115,0.0 22.2017384,60.1821174,0.0 22.1841002,60.1699944,0.0 22.1737576,60.1696101,0.0 22.1708393,60.1676034,0.0 22.1754313,60.1655965,0.0 22.1653461,60.165383,0.0 22.1642303,60.1635469,0.0 22.1632004,60.1611981,0.0 22.1642303,60.1602159,0.0 22.1616554,60.1594898,0.0 22.1595955,60.1514597,0.0 22.159338,60.1494091,0.0 22.1612263,60.1478711,0.0 22.1554756,60.1513743,0.0 22.1368396,60.1479673,0.0" },

  { name: "Nauvon eteläinen reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  legs: [
  { name: "Kirjais - Pensar", 
  path: "22.0181894,60.1212758,0.0 22.0263863,60.1203885,0.0 22.0488739,60.1349234,0.0 22.0581436,60.1491101,0.0 22.078743,60.1513315,0.0 22.1098351,60.151166,0.0 22.1008015,60.144154,0.0" },        
  { name: "Kirjais - Brännskär - Gullkrona", 
  path: "22.0181894,60.1212758,0.0 22.023468,60.1200465,0.0 22.022953,60.1185926,0.0 21.9825268,60.0859495,0.0 21.9790936,60.0854786,0.0 21.9759393,60.0863454,0.0 21.9827843,60.0846653,0.0 22.014029,60.078395,0.0 22.0154214,60.0799992,0.0 22.022438,60.0766598,0.0 22.0299911,60.0767454,0.0 22.0364285,60.0758891,0.0 22.0488954,60.0713073,0.0 22.045784,60.0732771,0.0 22.0466423,60.0755465,0.0 22.0544529,60.074733,0.0 22.0615768,60.0773876,0.0 22.0669842,60.0818829,0.0 22.0702457,60.0879612,0.0 22.0753956,60.0894592,0.0 22.0817471,60.089074,0.0 22.083056,60.0882822,0.0 22.0816612,60.0895876,0.0 22.0595169,60.0920699,0.0 22.0538521,60.0970766,0.0 22.0244122,60.120132,0.0" },
  { name: "Brännskär - Kopparholm", 
  path: "21.9759393,60.0863454,0.0 21.9846725,60.082739,0.0 21.9685364,60.0373314,0.0 21.9673347,60.0293572,0.0 21.969738,60.0148615,0.0 21.9754887,60.0116227,0.0 21.9690514,60.0141751,0.0 21.9438171,59.9829314,0.0 21.9148064,59.9721953,0.0 21.9001293,59.9684583,0.0" },
  { name: "Kopparholm - Björkö", 
  path: "21.8998075,59.9679321,0.0 21.8988419,59.969704,0.0 21.8928337,59.9707779,0.0 21.7920685,59.9617135,0.0 21.762886,59.9286999,0.0 21.7584229,59.9222051,0.0 21.7422223,59.9133749,0.0 21.7453766,59.9134286,0.0 21.7308712,59.9073612,0.0 21.7022896,59.9068878,0.0 21.6993713,59.9120948,0.0 21.6918182,59.9141063,0.0 21.6993713,59.9120948,0.0 21.7065811,59.8988391,0.0 21.7870903,59.8910037,0.0 21.7827988,59.8850613,0.0 21.7723703,59.8825097,0.0" },
  { name: "Lökholm - Trunsö - Borstö", 
  path: "21.8998075,59.9679321,0.0 21.8988419,59.969704,0.0 21.8928337,59.9707779,0.0 21.8890142,59.9678139,0.0 21.8861389,59.9625083,0.0 21.8794012,59.9159457,0.0 21.883564,59.9130414,0.0 21.8823624,59.9124605,0.0 21.8854952,59.9119872,0.0 21.8890572,59.9101584,0.0 21.8867397,59.9032941,0.0 21.8939924,59.892037,0.0 21.9321871,59.8751981,0.0 21.9454479,59.8693607,0.0 21.9594383,59.8589972,0.0 21.9645452,59.8584584,0.0 21.9650173,59.8595574,0.0 21.9663048,59.8606995,0.0 21.9697809,59.8609581,0.0 21.9706392,59.8613244,0.0 21.970253,59.8619062,0.0 21.9693518,59.8621001,0.0 21.9702959,59.8619277,0.0 21.9706392,59.8613244,0.0 21.969738,59.8609365,0.0 21.9663048,59.8607211,0.0 21.9650173,59.8595143,0.0 21.9644594,59.8583938,0.0 21.9597816,59.8577904,0.0 21.9442463,59.8548379,0.0 21.9289255,59.8543207,0.0 21.8898296,59.8620785,0.0 21.8779421,59.8647287,0.0 21.8285465,59.8681758,0.0 21.8202639,59.8700715,0.0 21.8139124,59.8725272,0.0 21.7964458,59.8763181,0.0 21.779108,59.8778688,0.0 21.7742586,59.8789887,0.0 21.7730999,59.8801086,0.0 21.7723703,59.8825097,0.0 21.7827988,59.8850613,0.0 21.7870903,59.8910037,0.0 21.7874336,59.8933071,0.0 21.8193626,59.8994417,0.0 21.8199181,59.9047478,0.0 21.8178985,59.9070411,0.0 21.8114581,59.9052457,0.0 21.8089664,59.9037514,0.0 21.8114581,59.9052457,0.0 21.8178985,59.9070411,0.0 21.8199181,59.9047478,0.0 21.8193626,59.8994417,0.0 21.8407928,59.9036837,0.0 21.8756247,59.9137729,0.0 21.8789291,59.9152357,0.0 21.8794441,59.9159457,0.0" },
  ]},  

  { name: "Utön reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  path: "21.7047143,60.1637924,0.0 21.6961098,60.1618387,0.0 21.675,60.125 21.7045212,60.0945519,0.0 21.7017746,60.0792286,0.0 21.8063164,60.0588435,0.0 21.8073463,60.054388,0.0 21.8016386,60.0543987,0.0 21.8056297,60.0529312,0.0 21.808033,60.0482178,0.0 21.785202,60.0022476,0.0 21.731987,59.9708208,0.0 21.7419434,59.9562135,0.0 21.7464066,59.9521739,0.0 21.7557406,59.95385,0.0 21.7251205,59.947618,0.0 21.6731071,59.9452968,0.0 21.6185188,59.9495951,0.0 21.6142917,59.9515185,0.0 21.6185188,59.9495092,0.0 21.6461563,59.9473601,0.0 21.6528511,59.9439212,0.0 21.6502762,59.9384183,0.0 21.6353416,59.9257753,0.0 21.6349983,59.9069308,0.0 21.5738869,59.8295481,0.0 21.5824699,59.8261833,0.0 21.5847659,59.8270893,0.0 21.5822983,59.8261833,0.0 21.4971542,59.8499884,0.0 21.430378,59.8449873,0.0 21.3989639,59.8392955,0.0 21.3363075,59.8139291,0.0 21.3589668,59.7912211,0.0 21.3721848,59.7858656,0.0 21.3709188,59.7824424,0.0" },        

  { name: "Nauvon pohjoinen reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  legs: [
  { name: "Nauvo - Houtsala",  
  path: "21.902355,60.22144 21.825065,60.23071 21.778392,60.228856 21.755242,60.240535 21.744787,60.247576 21.752628,60.249615 21.747027,60.250541 21.748148,60.263137 21.733586,60.266841 21.696247,60.264619 21.695785,60.261193 21.69214,60.264619 21.646587,60.259063 21.612236,60.256284 21.598824,60.256949"},
  { name: "Maskinnamo",  
  path: "21.617506,60.277892 21.622228,60.283542 21.637166,60.283342 21.636067,60.273694 21.638021,60.258433"},
  { name: "Nauvo - Seili",  
  path: "21.911727,60.194024 21.914394,60.197389 21.905162,60.205698 21.901982,60.220883 21.947908,60.232008 21.955376,60.236642"},
  { name: "Åvensor",  
  path: "21.67123,60.262026 21.659282,60.268323 21.587219,60.284429 21.587219,60.297197 21.578203,60.29831"}
  ]},        

  { name: "Rymättylän reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  description: '<p>m/s Isla, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:040">040</a>-6736697, 8 <i class="fa fa-car" aria-hidden="true"></i></p><p>Päälaituri: Haapala(Rymättylä)</p><p>Aikataulun mukaan</p><p><a target="info" href="https://kuljetus-savolainen.fi/yhteysalusliikenne/">Aikataulut ja info</a></p><p><a href="https://www.facebook.com/MS-Isla-401567819993437/">M/S Islan Facebook</a></p>',
  legs: [
  { name: "Haapala - Korvenmaa",  
  path: "21.809382,60.394549 21.807792,60.395497 21.790773,60.392749 21.802313,60.369929 21.789344,60.366271 21.767544,60.365681 21.7646,60.36808 21.764085,60.365557 21.744441,60.362584 21.727069,60.363207 21.725044,60.359283 21.67942,60.363236 21.680695,60.365591"},
  { name: "Pakinainen",  
  path: "21.703635,60.361151 21.699843,60.3565 21.688316,60.3565 21.687709,60.3553"},
  { name: "Pähkinäinen",  
  path: "21.725122,60.359377 21.735618,60.337703 21.726835,60.33666 21.69908,60.338138 21.69662,60.333617 21.692932,60.33127"},
  { name: "Maisaari",  
  path: "21.802355,60.370068 21.820819,60.342019 21.878582,60.340323 21.885176,60.335363 21.894407,60.332229"},
  { name: "Samsaari",  
  path: "21.775188,60.366025 21.811059,60.357286 21.820819,60.342019 21.846931,60.31891 21.83849,60.316951 21.827676,60.319041"},
  ]},        

  { name: "Velkuan reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  description: '<p>m/s Kivimo, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358400320095">0400 320 095</a>, 8 <i class="fa fa-car" aria-hidden="true"></i></p><p>Päälaiturit: Teersalo(Velkua), kesäisin myös Hakkenpää(Taivassalo)</p><p>Aikataulun mukaan</p><p><a target="info" href="http://www.finferries.fi/lauttaliikenne/lauttapaikat-ja-aikataulut/velkuan-reitti-kivimo.html">Aikataulut ja info</a></p>',
  legs: [
  { name: "Hakkenpää - Teersalo",
  path: ""},
  { name: "Rauhala",  
  path: "21.672409,60.452641 21.695536,60.451279 21.697825,60.448904 21.698535,60.45124 21.708007,60.452369"},
  { name: "Salavainen",  
  path: "21.693871,60.467422 21.678319,60.459975 21.681626,60.457023 21.672867,60.454775 21.666521,60.454907 21.672509,60.452615 21.673582,60.440271 21.680732,60.435597 21.684575,60.421261 21.680911,60.420423 21.685816,60.419131 21.695057,60.405117 21.690879,60.403418 21.70304,60.402031 21.737776,60.411013 21.73194,60.412822 21.724384,60.428664 21.714786,60.432633 21.712666,60.442615 21.712055,60.44805"},
  { name: "Liettinen",  
  path: "21.693799,60.467429 21.712032,60.448165 21.756471,60.427136 21.754734,60.424019"},
  ]},        

  { name: "Nauvon poikittainen reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  legs: [
  { name: "Pärnäs - Berghamn",  
  path: "21.70495,60.16376 21.703,60.163 21.685,60.131 21.731,60.125 21.735627,60.127517 21.741452,60.121369 21.698206,60.112071 21.693763,60.11094 21.703933,60.1041 21.723779,60.104346 21.736121,60.103608 21.747673,60.104641 21.753202,60.104346 21.752511,60.105675 21.749746,60.105773 21.753004,60.105625 21.753893,60.104247 21.772653,60.095831 21.769789,60.087413 21.806815,60.059237 21.808198,60.054752 21.801681,60.054456"},
  { name: "Mattnäs - Kirjais",  
  path: "21.814088,60.117468 21.916795,60.105461 21.931392,60.117117 21.926116,60.119746 21.931568,60.117292 21.916443,60.105461 21.891822,60.099676 21.888304,60.099851 21.891822,60.099413 21.916267,60.105461 21.954782,60.086961 21.968676,60.085733 21.969907,60.084155 21.976062,60.086347 21.979755,60.08547 21.982569,60.085996 22.022667,60.118431 22.023371,60.120184 22.018095,60.12141"},
  { name: "Mattnäs - Hummelholm",  
  path: "21.810775,60.137924 21.821464,60.133405 21.818439,60.131522 21.815225,60.128603 21.816359,60.126061 21.81428,60.117396 21.797075,60.117961 21.785354,60.107976 21.798021,60.102322 21.796319,60.10072 21.797643,60.102322 21.785354,60.107881 21.772687,60.095819"},
  { name: "Berghamn - Brännskär",  
  path: "21.794785,60.068717 21.8915,60.066882 21.942615,60.074771 21.956956,60.086877"},
  ]},        

  { name: "Korppoon reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  legs: [
  { name: "Havträsk - Österskär",  
  path: "21.563808,60.235369 21.552776,60.239195 21.552192,60.242477 21.551461,60.246803 21.550402,60.242107 21.537884,60.23019 21.508316,60.232694 21.533631,60.227293 21.533845,60.179574 21.556878,60.174685 21.533845,60.179644 21.521205,60.187256 21.511374,60.18125 21.508705,60.180901 21.51025,60.178666 21.503509,60.164345 21.496487,60.165394 21.503649,60.164345 21.508284,60.15905 21.489324,60.142063 21.480616,60.138707 21.481459,60.137238 21.464044,60.125138 21.454931,60.106637 21.509182,60.045746 21.50667,60.04098 21.501647,60.041482 21.504159,60.037719 21.405202,59.995294 21.313534,59.984595 21.303584,59.979335 21.295511,59.980744 21.291568,59.978866 21.295886,59.980932 21.303396,59.979523 21.312407,59.984031 21.307714,59.992952 21.343381,60.074703 21.349127,60.078048 21.354235,60.076774 21.350085,60.078525 21.455117,60.10654"},
  { name: "Österskär - Kittuis",  
  path: "21.354443,60.080155 21.318246,60.11114 21.303904,60.148895 21.304799,60.147413 21.313432,60.151889 21.321105,60.151531 21.313432,60.151889 21.30468,60.147354 21.305159,60.145384 21.311993,60.145384 21.318827,60.143594 21.329737,60.145563 21.418711,60.170997 21.446717,60.178871 21.438194,60.187105 21.446961,60.179234 21.465957,60.18323 21.495668,60.192432 21.53366,60.200905"},
  ]},

  { name: "Houtskarin ja Iniön reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  description: '<p><i class="fa fa-ship" aria-hidden="true"></i>m/s Karolina, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358407173455">040 717 3455</a>, 0 <i class="fa fa-car" aria-hidden="true"></i><br/><i class="fa fa-ship" aria-hidden="true"></i>m/s Satava, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358408495140">040 849 5140</a>, 8 <i class="fa fa-car" aria-hidden="true"></i></p><p>Tärkeimmät laiturit: Roslax(Houtskari), Torsholma(Brändö), Norrby(Iniö), Kannvik (Iniö)</p><p>Aikataulut ja info: <a target="info" href="http://www.ferryway.fi/7">Houtskarin reitti</a>, <a target="info" href="http://www.ferryway.fi/8">Iniön lisäreitti</a></p>',
  legs: [
  { name: "Perkala",  
  path: "21.382087,60.412578 21.415426,60.398378 21.465435,60.377682 21.475437,60.379124 21.465643,60.377682 21.473978,60.367381"},
  { name: "Näsby - Torsholma",  
  path: "21.367876,60.224627 21.368029,60.226178 21.390269,60.230187 21.386309,60.236427 21.335048,60.233439 21.337029,60.234309 21.322757,60.234329 21.308507,60.234859 21.295115,60.238793 21.296295,60.264792 21.295823,60.280124 21.291575,60.283635 21.284966,60.282231 21.255935,60.29159 21.242953,60.331102 21.221239,60.331453 21.197164,60.342316 21.194332,60.350257 21.178783,60.355813 21.181114,60.352592 21.142642,60.331803 21.124468,60.332154 21.078206,60.362865 21.070181,60.363915"},
  { name: "Nåtö - Lempnäs",  
  path: "21.156868,60.341351 21.157983,60.340178 21.161049,60.336248 21.163557,60.329282 21.175959,60.323418 21.190312,60.329351 21.196582,60.330592 21.199508,60.328661 21.197279,60.326108 21.199486,60.328686 21.19652,60.330563 21.190279,60.329352 21.175901,60.323411 21.191541,60.316058 21.190851,60.314584 21.194864,60.31578 21.208844,60.313301 21.219416,60.310096 21.208758,60.313323 21.207334,60.318003 21.214626,60.318985 21.247759,60.316493 21.263077,60.317241 21.264286,60.316066 21.270413,60.319506 21.271444,60.318197 21.284648,60.318282 21.286417,60.321017 21.288747,60.318154 21.302081,60.318133 21.272785,60.303658 21.276594,60.302033 21.295109,60.302575 21.252647,60.301295"},
  { name: "Torsholma - Kannvik - Lempnäs",  
  path: "21.092197,60.353621 21.142208,60.353337 21.178667,60.37165 21.178476,60.374952 21.17294,60.375141 21.179621,60.377311 21.199664,60.390423 21.197755,60.392215 21.215065,60.387341 21.233963,60.393094 21.23759,60.399789 21.229572,60.415908 21.220028,60.415531 21.229382,60.416002 21.246943,60.413552 21.299245,60.401863 21.318716,60.428346 21.364719,60.446993 21.384189,60.450288 21.399651,60.44737 21.396024,60.439178 21.397742,60.443039 21.422747,60.442097 21.423702,60.430419 21.415876,60.425049 21.407095,60.420338 21.409958,60.418736 21.395451,60.418359 21.377345,60.410412 21.391061,60.40111 21.389916,60.39715 21.39087,60.401299 21.377317,60.410443 21.36071,60.404693 21.34124,60.394416 21.299055,60.401959 21.3412,60.39442 21.354479,60.377109 21.354479,60.377173 21.363682,60.372751 21.377196,60.355224 21.37636,60.352868 21.369281,60.346915 21.333692,60.330195 21.309494,60.332679 21.308142,60.336247 21.313226,60.338731 21.308078,60.336215 21.309429,60.332711 21.325969,60.327168 21.302028,60.318119"},
  ]},

  { name: "Hiittisten reittialue", color: '#90c0f0', highlightColor: '#ff0000',weight: 1.5, zIndex: 8, opacity: 0.8,
  legs: [
  { name: "Kasnäs - Dalsbruk",  
  path: "22.40009,59.904672 22.418424,59.904672 22.427062,59.90011 22.464496,59.894428 22.563496,59.923074 22.566452,59.942569 22.594034,59.949969 22.589075,59.955797 22.591623,59.957866 22.589006,59.955797 22.582739,59.960521 22.571582,59.958659 22.564281,59.955625 22.560218,59.956694 22.564144,59.955694 22.571513,59.958659 22.582739,59.960486 22.595525,59.96698 22.605167,59.967084 22.608197,59.965257 22.608128,59.964498 22.608128,59.965291 22.605029,59.967187 22.610126,59.970772 22.60496,59.967118 22.595456,59.967015 22.588087,59.971461 22.55861,59.970841 22.561364,59.970944 22.561571,59.975252 22.574381,59.981076 22.572361,59.992541 22.550322,60.000049 22.542768,60.009035 22.511983,60.0174 22.508746,60.019017"},
  { name: "Vänö",  
  path: "22.233259,59.887091 22.227287,59.87206 22.210001,59.865447 22.199218,59.865168 22.196439,59.868377"},
  { name: "Bolax",  
  path: "22.593816,59.950021 22.60464,59.948937 22.610671,59.946072 22.609918,59.944941 22.612175,59.945151 22.623293,59.940419 22.6574,59.928651 22.690207,59.937022 22.6877,59.944224 22.708097,59.948285 22.710437,59.945731"},
  { name: "Stora Ängesö",  
  path: "22.565879,59.939472 22.527721,59.942446 22.509235,59.951151 22.505589,59.94992"},
  { name: "Kasnäs - Tunnhamn",  
  path: "22.411927,59.921275 22.400097,59.904606 22.387116,59.904574 22.376758,59.908101 22.368765,59.906787 22.366718,59.908229 22.368573,59.906787 22.301991,59.886637 22.23329,59.887091 22.217697,59.89752 22.213403,59.926524 22.184476,59.930487 22.183346,59.928109"},
  { name: "Kasnäs - Helsingholm",  
  path: "22.409111,59.917863 22.401698,59.919194 22.388088,59.931892 22.377157,59.998927 22.290432,60.03394 22.282125,60.030755"},
  ]},

  { name: "<b>Polkupyörälautta:</b><br>Skarpnåtö - Hällö", color: '#e7883e', highlightColor: '#ff0000',weight: 2, zIndex: 10, opacity: 1,
  description: '<p><i class="fa fa-ship" aria-hidden="true"></i>M/S Silvana, <i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:+358407173455">040 717 3455</a>, 50 <i class="fa fa-bicycle" aria-hidden="true"></i></p><p>Laiturit: Skarpnåtö(Hammarland), Hällö(Geta)</p><p><a target="info" href="http://www.aland.com/fi/skarpnato">Aikataulut ja info</a></p><pre>Aikataulu 19.6.-19.8.2017\n\nSkarpnåtöstä klo 11.00 ja\nHällöstä klo 11.30\n\nHuom! Ei sunnuntaisin\n\nExtra vuoroja tilauksesta puh. 0400 229 149 / Jan-Anders Häger\n\nHinta:\n12 euroa / henkilö / pyörä\n6 euroa alle 12 vuotta\n6 euroa / kärry</pre>',
  path: "19.761529,60.326862,0 19.763889,60.327287,0 19.777021,60.336804,0 19.784402,60.357017,0 19.783802,60.359139,0 19.780368,60.360243,0 19.773931,60.36037,0 19.769554,60.362365,0 19.766378,60.365294,0 19.768009,60.3661,0" },
  ];

  var reittiObjects = reitit.map(function(reitti) {
    reitti.legs = typeof reitti.path !== 'undefined'? [{name: reitti.name, path: reitti.path}]: reitti.legs;
    legObjects = reitti.legs.map(function(leg) {
      var coords = leg.path.split(" ").map(function(coord) {
        var latLong = coord.split(","); 
        return new google.maps.LatLng(parseFloat(latLong[1]), parseFloat(latLong[0])); 
      });

      leg.weight = leg.weight || reitti.weight || 3;
      leg.opacity = leg.opacity || reitti.opacity || 0.7;
      leg.color = leg.color || reitti.color || '#ff00000';
      leg.highlightColor = leg.highlightColor || reitti.highlightColor || '#00ff000';
      leg.zIndex = leg.zIndex || reitti.zIndex || 1;

      var line = new google.maps.Polyline({
        path: new google.maps.MVCArray(coords),
        geodesic: false,
        strokeColor: leg.color,
        strokeOpacity: leg.opacity,
        strokeWeight: leg.weight,
        zIndex: leg.zIndex,
        clickable: false,
        map: map
      });
      var lineb = new google.maps.Polyline({
        path: new google.maps.MVCArray(coords),
        geodesic: false,
        strokeOpacity: 0,
        strokeWeight: 12,
        strokeColor: '#ffff00',
        zIndex: leg.zIndex - 1,
        cursor: 'context-menu',
        map: map
      });
      leg.highlight = function(doHighlight) {
              //linec.setVisible(doHighlight);
              lineb.setOptions({strokeOpacity: doHighlight? 0.5: 0});
            };
            lineb.addListener('click', function(event) {
              select([reitti], event);
            });
            return {name: leg.name, line: line, lineb: lineb };
          });
    reitti.highlight = function(doHighlight) {
      reitti.legs.forEach(function(leg) { leg.highlight(doHighlight); });
    };
    return {name: reitti.name, legs: legObjects};
  });

  map.addListener('zoom_changed', function() {
    var zoom = map.getZoom();
    var mapTypeId = map.getMapTypeId();
    reittiObjects.forEach(function(reitti) {
      reitti.legs.forEach(function(leg) {
        leg.line.setVisible(zoom > 8);
        leg.lineb.setVisible(zoom > 8);
      });
    });
  });
  var lauttaLegs = [
  { id: 1, name: 'Naantali - Airisto', 
  path: "22.0399475,60.4572178,0.0 22.0845795,60.4426562,0.0 22.077713,60.4307989,0.0 22.1003723,60.3836657,0.0" },
  { id: 2, name: "Turku - Airisto",
  path: "22.219162,60.4370668,0.0 22.1728134,60.420971,0.0 22.1525574,60.4218183,0.0 22.1285248,60.4143609,0.0 22.1003723,60.3836657,0.0" },
  { id: 3, name: "Airisto - Järsö",
  path: "22.1003723,60.3836657,0.0 22.0124817,60.2759193,0.0 21.5132904,60.1995684,0.0 21.2255859,60.1001145,0.0 20.6433105,60.1014836,0.0 20.5176544,60.1309056,0.0 20.3768921,60.0949798,0.0" },
  { id: 4, name: "Järsö - Långnäs",
  path: "20.3768921,60.0949798,0.0 20.2997518,60.1170478,0.0" },
  { id: 5, name: "Järsö - Herröskatan",
  path: "20.1375961,59.9568151,0.0 20.185318,59.9679858,0.0 20.2611923,60.0075683,0.0 20.3768921,60.0949798,0.0" },
  { id: 6, name: "Herröskatan - Mariehamn",
  path: "19.9276543,60.0920271,0.0 19.9265383,60.0896932,0.0 19.9267959,60.0724635,0.0 19.9263668,60.0541738,0.0 19.9403572,60.0321012,0.0 19.9405289,60.0009602,0.0 20.0013828,59.971551,0.0 20.0325394,59.9568581,0.0 20.1375961,59.9568151,0.0" },
  { id: 7, name: "Herröskatan - Helsinki",
  path: "20.1375961,59.9568151,0.0 20.1618004,59.9589636,0.0 20.1935577,59.9587917,0.0 20.3082275,59.9231945,0.0 20.5149078,59.8009796,0.0 21.6616058,59.7044776,0.0 23.6027527,59.7256004,0.0 24.8881531,59.9869673,0.0 24.9904633,60.1510752,0.0 24.9568176,60.1661089,0.0" },
  { id: 8, name: "Herröskatan - Fejan",
  path: "19.1717434,59.7310521,0.0 19.342804,59.7643486,0.0 20.1375961,59.9568151,0.0" },
  { id: 9, name: "Mariehamn - Fejan",
  path: "19.1717434,59.7310521,0.0 19.3379974,59.766596,0.0 19.5910263,59.8808408,0.0 19.8796749,60.0355309,0.0 19.9230194,60.0727205,0.0 19.924907,60.090806,0.0 19.9276543,60.0920271,0.0" },
  { id: 10, name: "Fejan - Kapellskär",
  path: "19.0666008,59.722831,0.0 19.0717506,59.7218789,0.0 19.1717434,59.7310521,0.0" },
  { id: 11, name: "Fejan - Stockholm",
  path: "18.2084656,59.3335396,0.0 18.2654572,59.3583959,0.0 18.2984161,59.3772885,0.0 18.3746338,59.3695928,0.0 18.4384918,59.3531461,0.0 18.4501648,59.3580459,0.0 18.4501648,59.3975688,0.0 18.3904266,59.4325064,0.0 18.3952332,59.4391405,0.0 18.4309387,59.4461223,0.0 18.453598,59.4841479,0.0 18.5572815,59.5336217,0.0 18.6602783,59.5684189,0.0 18.7447357,59.5826754,0.0 18.9541626,59.6698211,0.0 19.0447998,59.6975491,0.0 19.1717434,59.7310521,0.0" },
  { id: 12, name: "Stockholm Värtan",
  path: "18.108902,59.3503459,0.0 18.1281281,59.3505209,0.0 18.1614304,59.3380922,0.0 18.2084656,59.3335396,0.0" },
  { id: 13, name: "Stockholm Stadsgården",
  path: "18.0965424,59.3170755,0.0 18.1075287,59.318477,0.0 18.1597137,59.3205792,0.0 18.2084656,59.3335396,0.0" },
  { id: 14, name: "Grisslehamn - Eckerö",
  path: "19.5357513,60.2258341,0.0 19.5304298,60.2283061,0.0 19.5201302,60.226857,0.0 19.4531822,60.1805383,0.0 18.8297379,60.094225,0.0 18.8154602,60.0981463,0.0" },
  ];

  var lauttaRoutes = [
  {name: "Kapellskär - Mariehamn", operators: ["Viking"], legs: [9, 10]},
  {name: "Eckerö - Grisslehamn", operators: ["Eckerölinjen"], legs: [14]},
  {name: "Naantali - Långnäs - Kapellskär", operators: ["Finnlines"], legs: [1, 3, 4, 5, 8, 10]},
  {name: "Turku - Mariehamn - Stockholm", operators: ["Viking"], legs: [2, 3, 5, 6, 9, 11, 13]},
  {name: "Turku - Mariehamn - Stockholm", operators: ["Tallink"], legs: [2, 3, 5, 6, 9, 11, 12]},
  {name: "Turku - Långnäs - Stockholm", operators: ["Viking"], legs: [2, 3, 4, 5, 8, 11, 13]},
  {name: "Turku - Långnäs - Stockholm", operators: ["Tallink"], legs: [2, 3, 4, 5, 8, 11, 12]},
  {name: "Helsinki - Mariehamn - Stockholm", operators: ["Viking"], legs: [7, 6, 9, 11, 13]},
  {name: "Helsinki - Mariehamn - Stockholm", operators: ["Tallink"], legs: [7, 6, 9, 11, 12]},
  ];

  // Define a symbol using SVG path notation, with an opacity of 1.
  var lauttaLineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.6,
    strokeColor: '#d00000',
    scale: 1
  };

  var lauttaLineSymbolDimmed = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.25,
    strokeColor: '#d00000',
    scale: 1
  };

  map.addListener('click', unselectAll);


  function Leg(object) {
    this.id = object.id;
    this.name = object.name;
    this.path = object.path.split(" ").map(function(coord) {
      var latLong = coord.split(","); 
      return new google.maps.LatLng(parseFloat(latLong[1]), parseFloat(latLong[0])); 
    });
    this.line = new google.maps.Polyline({
      path: new google.maps.MVCArray(this.path),
      zIndex: 1,
      strokeOpacity: 0,
      strokeWeight: 15,
      icons: [{
        icon: lauttaLineSymbol,
        offset: '4',
        repeat: '4px'
      }],
      cursor: 'context-menu',
      map: map
    });
    this.highlightLine = new google.maps.Polyline({
      path: new google.maps.MVCArray(this.path),
      zIndex: 0,
      strokeOpacity: 0.3,
      strokeWeight: 7,
      strokeColor: '#b00060',
      visible: false,
      map: map,
    });
    this.routes = [];
    var that = this;
    this.line.addListener('click', function(event) {
      var routeNames = that.routes.map(function(route) { return route.operator + ": " + route.name; }).join('<br>');
    // openTooltip(that.line, event.latLng, routeNames);
    select(that.routes, event);
  });
    this.rerender = function(zoom, mapTypeId) {
      this.line.setVisible(zoom >= 7 && zoom <= 11);
      this.line.setOptions({icons: [{
        icon: zoom <= 9? lauttaLineSymbol: lauttaLineSymbolDimmed,
        offset: '4',
        repeat: '4px'
      }]})
      if (!this.line.getVisible()) this.highlightLine.setVisible(false);
    }
  }

  Leg.prototype.highlight = function(doHighlight) {
    this.highlightLine.setVisible(doHighlight);
  }

  Leg.prototype.addRoute = function(route) {
    this.routes.push(route);
  }

  function Route(object) {
    this.name = object.name;
    this.operator = object.operators[0];
    this.legs = object.legs.map(function(id) { return lauttaLegIndex[id]; });
    var that = this;
  }

  Route.prototype.highlight = function(doHighlight) {
    this.legs.forEach(function(leg) { leg.highlight(doHighlight); });
  }

  var lauttaLegs =
  lauttaLegs.map(function(leg) {
    return new Leg(leg);
  });

  map.addListener('zoom_changed', function() {
    var zoom = map.getZoom();
    var mapTypeId = map.getMapTypeId();
    lauttaLegs.forEach(function(leg) { leg.rerender(zoom, mapTypeId); });
  });

  lauttaLegIndex = {};
  lauttaLegs.forEach(function(leg) { lauttaLegIndex[leg.id] = leg});

  var lauttaRoutes = lauttaRoutes.map(function(route) {
    route = new Route(route);
    route.legs.forEach(function(leg) { leg.addRoute(route); });
    return route;
  });

}