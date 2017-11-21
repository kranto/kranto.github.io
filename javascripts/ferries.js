
$(document).ready(function(){
    $('#wrapper').bind('scroll',toggleScrollArrow);
});

var scrollLimit = 30; 

function toggleScrollArrow()
{
    var elem = $("#wrapper");
    var isBottom = (elem[0].scrollHeight - elem.scrollTop() - scrollLimit <= elem.outerHeight());
    $('#scrollArrow').toggleClass('can-scroll', !isBottom);
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
  google.maps.event.addListenerOnce(map, 'idle', onMapIdle);
  $('.navbar-toggle').click();
  resetMap();
});

var wasSelected = [];
$('#showInfoPageButton').click(function() {
  $('#infopage').fadeIn();
  $('.navbar-toggle[aria-expanded="true"]').click();
  wasSelected = selected.slice();
  unselectAll();
});

$('#closeInfoPageButton').click(function() {
  $('#infopage').fadeOut();
  select(wasSelected);
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

var timeout = false;
var mapInitialized = false;

setTimeout(function() { timeout = true; hideLoader(); }, 4000);

function onMapIdle() {
  if (map.getZoom() < 8) {
    map.setZoom(8);
    map.panToBounds({south: 60, west: 21.4, east: 22.4, north: 60.5});
  }
  mapInitialized = true;
  hideLoader();
}

function hideLoader() {
  if (timeout && mapInitialized ) {
    $("#loader").fadeOut(1000);
  }
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
    var clientY = mouseEvent? latLng2Point(mouseEvent.latLng, map).y: 0;
    if ($("#map").height()*0.80 < clientY) map.panBy(0, $("#map").height()*0.2);
    $(function() { 
      $("#info").show();
      $("#mapcontainer").animate({height: '80%'}, function() { google.maps.event.trigger(map, 'resize'); });
      $("#info").animate({top: '80%'}, toggleScrollArrow);
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
      selected.forEach(function(target) { target.highlight(false); });
      selected = [];
    });
    $("#info").animate({top: '100%'}, 100, function() {
      $("#info").hide();
      $('#selectedTitle').html(' ');
      $('#selectedDescription').html(' ');
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

function fullscreenchange(event) {
  var isFullScreen = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)? true: false;
  $('#toggleFullscreen').toggleClass('active', isFullScreen);
}

document.onfullscreenchange = fullscreenchange;
document.onwebkitfullscreenchange = fullscreenchange;

$("#toggleFullscreen").click(toggleFullscreen);

var rengastieShown = false;
$("#toggleRengastie").click(function() {
  $(this).toggleClass("active");
  rengastieShown = $(this).hasClass("active");
  rerender(map);
});

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
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#91755d'}, {weight: zoom <= 8? 0: Math.max(2, (zoom-5)*0.5)}]},
    //      { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{color: '#808080'}, {weight: 5}]},
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#91755d'}, {weight: 0.5}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.fill', stylers: [{color: '#91755d'}, {weight: Math.max(1.5, (zoom-5)*0.6)}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{color: '#91755d'}, {weight: zoom <= 6? 0: 1}]},
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#91755d'}, {weight: Math.max(1, (zoom-7)*0.4)}, {lightness: (zoom - 6)*0}]},
    { featureType: 'road.local', elementType: 'geometry', stylers: [{weight: 1}, {color: '#91755d'}, {lightness: (zoom-12)*0}]},
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
    strokeColor: '#91755d',
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
    strokeColor: '#5040c0',
    strokeOpacity: 0.4,
    strokeWeight: 4,
    zIndex: 0,
    map: map,
    cursor: 'context-menu',
    clickable: true
  });
  return {
    rerender: function(zoom, mapTypeId) {
      object.setVisible(rengastieShown && zoom >= 8);
      object.setOptions({strokeWeight: (zoom<=8? 4: zoom<=9? 5: 6)});
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

var cableferryStyler = {
  highlightColor: '#f97cdc',
  highlightWeight: 17,
  highlightOpacity: .6
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

function createDescription(prop) {
  if (!prop.info) {
    return prop.description;
  } else {
    return "<p>" + prop.info.phone.map(
      function(phone) { 
        return '<i class="fa fa-phone" aria-hidden="true"></i> <a class="tel" href="tel:' + phone.replace(/ /g,'') + '">' + phone + '</a>';
      }).join(", ") + "</p>" +
      '<p><a target="info" href="' + prop.info.infolink + '">Aikataulut ja info <i class="fa fa-external-link" aria-hidden="true"></i></a></p>'
  }
}

function cableferry(feature, map) {
  var styler = cableferryStyler;
  var highlightColor = feature.properties.highlightColor || styler.highlightColor;
  var highlightWeight = feature.properties.highlightWeight || styler.highlightWeight;
  var highlightOpacity = feature.properties.highlightOpacity || styler.highlightOpacity;

  var coords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var line = new google.maps.Polyline({
    path: new google.maps.MVCArray(coords),
    geodesic: false,
    zIndex: 11,
    strokeOpacity: 0,
    strokeWeight: highlightWeight,
    strokeColor: highlightColor,
    cursor: 'context-menu',
    icons: [{
      icon: cableferrySymbol(),
      offset: '0',
      repeat: '5px'
    }],
    map: map
  });
  var description = createDescription(feature.properties);
  line.addListener('click', function(event) {
    select([{name: feature.properties.sname, description: description,
      highlight: function(doHighlight) {
        line.setOptions({strokeOpacity: doHighlight? highlightOpacity: 0});
      }
    }], event);
  });
  return {
    rerender: function(zoom, mapTypeId) {
      line.setVisible(zoom >= 9);
    }
  };
}

var connectionStylers = {
  "base": {
    visibleFrom: 8,
    visibleTo: 30,
    weight: 2.5,
    color: '#f08000',
    opacity: 0.7,
    zIndex: 10,
    highlightColor: '#f97cdc',
    highlightWeight: 10,
    highlightOpacity: .6
  },
  "conn1": {
  },
  "conn1b": {
    weight: 1.5,
    zIndex: 9
  },
  "conn2": {
    color: '#005dd8',
  },
  "conn2m": {
    color: '#ff7c0a',
  },
  "conn2b": {
    weight: 1.5,
    zIndex: 9
  },
  "conn3": {
    // visibleFrom: 9,
    weight: 2,
    color: '#e7883e',
    opacity: 1
  },
  "conn4": {
    // visibleFrom: 9,
    weight: 1.5,
    color: '#7fb3e8',
    opacity: 0.8,
    zIndex: 8
  }
};

function connection(connection, map) {
  var baseStyler = connectionStylers["base"];
  var connectionStyler = connection.properties.ssubtype? connectionStylers[connection.properties.ssubtype]: baseStyler;

  var legFeatures = connection.type === 'FeatureCollection'? connection.features: [connection];
  var connectionObject = { name: connection.properties.sname, description: connection.properties.description};
  var legObjects = legFeatures.map(function(leg) {

    var coords = leg.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });

    var legStyler = leg.properties.ssubtype? connectionStylers[leg.properties.ssubtype]: {};
    var weight = leg.properties.weight || legStyler.weight || connection.properties.weight || connectionStyler.weight || baseStyler.weight;
    var opacity = leg.properties.opacity || legStyler.opacity || connection.properties.opacity || connectionStyler.opacity || baseStyler.opacity;
    var color = leg.properties.color || legStyler.color || connection.properties.color || connectionStyler.color || baseStyler.color;
    var zIndex = leg.properties.zIndex || legStyler.zIndex || connection.properties.zIndex || connectionStyler.zIndex || baseStyler.zIndex;
    var visibleFrom = leg.properties.visibleFrom || legStyler.visibleFrom || connection.properties.visibleFrom || connectionStyler.visibleFrom || baseStyler.visibleFrom;
    var visibleTo = leg.properties.visibleTo || legStyler.visibleTo || connection.properties.visibleTo || connectionStyler.visibleTo || baseStyler.visibleTo;
    var highlightColor = leg.properties.highlightColor || legStyler.highlightColor || connection.properties.highlightColor || connectionStyler.highlightColor || baseStyler.highlightColor;
    var highlightWeight = leg.properties.highlightWeight || legStyler.highlightWeight || connection.properties.highlightWeight || connectionStyler.highlightWeight || baseStyler.highlightWeight;
    var highlightOpacity = leg.properties.highlightOpacity || legStyler.highlightOpacity || connection.properties.highlightOpacity || connectionStyler.highlightOpacity || baseStyler.highlightOpacity;

    var line = new google.maps.Polyline({
      path: new google.maps.MVCArray(coords),
      geodesic: false,
      strokeColor: color,
      strokeOpacity: opacity,
      strokeWeight: weight,
      zIndex: zIndex,
      clickable: false,
      map: map
    });
    var lineb = new google.maps.Polyline({
      path: new google.maps.MVCArray(coords),
      geodesic: false,
      strokeOpacity: 0,
      strokeWeight: highlightWeight,
      strokeColor: highlightColor,
      zIndex: zIndex - 1,
      cursor: 'context-menu',
      map: map
    });
    var highlight = function(doHighlight) {
      lineb.setOptions({strokeOpacity: doHighlight? highlightOpacity: 0});
    };
    lineb.addListener('click', function(event) {
      select([connectionObject], event);
    });
    var rerender = function(zoom, mapTypeId) {
      line.setVisible(zoom >= visibleFrom && zoom <= visibleTo);
      lineb.setVisible(zoom >= visibleFrom && zoom <= visibleTo);
    }
    return {highlight: highlight, rerender: rerender };
  });
  connectionObject.highlight = function(doHighlight) {
    legObjects.forEach(function(leg) { leg.highlight(doHighlight); });
  }

  connectionObject.rerender = function(zoom, mapTypeId) {
    legObjects.forEach(function(leg) { leg.rerender(zoom, mapTypeId); });
  }

  return connectionObject;
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
  connection: connection,
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
  unselectAll();
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
  map.setOptions(mapOptions);
  map.fitBounds({south: 60, north: 60.5, west: 20, east: 22.3});
}
  
function initMap() {

  var data = {};
  lbls.init('canvas');
  txtol.init();

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  resetMap();

  google.maps.event.addListenerOnce(map, 'idle', onMapIdle);

  getLocation();

  updateMapStyles();
  map.addListener('zoom_changed', updateMapStyles);

  $.get('/data/saaristo.json', function(response) {
    data = response;
    renderData(data, map);
  });

  tooltip = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true
  });

  map.addListener('click', function() { tooltip.close(); });

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
    strokeOpacity: 0.4,
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
      strokeOpacity: 0.7,
      strokeWeight: 7,
      strokeColor: '#e0b0d0',
      visible: false,
      map: map,
    });
    this.routes = [];
    var that = this;
    this.line.addListener('click', function(event) {
      var routeNames = that.routes.map(function(route) { return route.operator + ": " + route.name; }).join('<br>');
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