
$(document).ready(function(){
    $('#wrapper').bind('scroll',toggleScrollIndicator); 
});

var scrollLimit = 22;

function toggleScrollIndicator()
{
  var elem = $("#wrapper");
  var isBottom = (elem[0].scrollHeight - elem.scrollTop() - scrollLimit <= elem.outerHeight());
  $('#scrollIndicator').toggleClass('can-scroll', !isBottom);
}

function showMenu() {
  hideSettings(function() {
    $("#menu").slideDown("fast");
    $("#menu").scrollTop(0);
  });
}

function hideMenu(cb) {
  $("#menu").slideUp("fast", cb);
}

function showSettings() {
  hideMenu(function() {
    $("#settings").slideDown("fast");
    $("#settings").scrollTop(0);
  });
}

function hideSettings(cb) {
  $("#settings").slideUp("fast", cb);
}

$('#menubutton').click(function() {
  if ($("#menu").is(":hidden")) {
    showMenu();
  } else {
    hideMenu();
  }
});

$('#settingsbutton').click(function() {
  if ($("#settings").is(":hidden")) {
    showSettings();
  } else {
    hideSettings();
  }
});

function toggleHeaderbar() {
  if ($("#topbar").is(":hidden")) {
    $("#topbar").slideDown('fast');
  } else if ($("#menu").is(":hidden") && $("#settings").is(":hidden")) {
    $("#topbar").slideUp('fast');      
  } else {
    hideMenu();
    hideSettings();
  }
}

$('#setMapTypeMap').click(function() {
  map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
});

$('#setMapTypeSatellite').click(function() {
  map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
});

$('#resetViewButton').click(function() {
  google.maps.event.addListenerOnce(map, 'idle', onMapIdle);
  hideSettings();
  resetMap();
});

var wasSelected = [];
$('.box').click(function(event) {
  $('#infopage').fadeIn();
  $(".infosection").hide();
  $(this.getAttribute("data-target")) .show();
  hideMenu();
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

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function showLanguage(lang) {
  $("[lang]").each(function () {
    if ($(this).attr("lang") == lang)
      $(this).show();
    else
      $(this).hide();
  })
}

$('.lang-button').click(function(event) {
  setLanguage(event.currentTarget.getAttribute("setlang"));
});

var currentLang;

function setLanguage(lang) {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('language', lang);
  }
  if (lang != 'fi' && lang != 'sv') lang = 'en';
  $(".lang-button").toggleClass('active', false);
  $(".lang-button[setlang=" + lang +"]").toggleClass('active', true);
  currentLang = lang;

  if (objects) {
    objects.forEach(function(object){ if (object.init) object.init(); });
    rerender(map, true);
  }

  if (typeof lauttaRoutes !== 'undefined') {
    lauttaRoutes.forEach(function(route) { if(route.init) route.init(); });
  }

  if (selected) {
    select(selected);
  }

  showLanguage(lang);
}

function initLanguage() {
  var lang;
  if (typeof Storage !== 'undefined') {
    lang = localStorage.getItem('language');
  }
  lang = lang || window.navigator.language.split("-")[0];
  setLanguage(lang);
}

initLanguage();

$(document).ready(function() {
  showLanguage(currentLang);
});


function shortName(props) {
  return props["sname_" + currentLang] || props.sname;
}

function longName(props) {
  var localName = props.sname;
  var currLocaleName = props["sname_" + currentLang];
  var firstName = currLocaleName? currLocaleName: localName;
  var otherNames = ["", "_fi", "_sv", "_en"].map(function(l) {
    return props["sname" + l];
  }).filter(function(name) { return typeof name !== 'undefined' && name != firstName; }).filter(onlyUnique);
  return firstName + ((otherNames.length > 0)? "/" + otherNames.join("/"): "");
}

function description(props) {
  return props["description_" + currentLang] || props.description;
}

$(document).ready(function() {
  var hostname = window.location.hostname;
  var framed = inIframe();
  var title = framed? '<a href="https://' + hostname + '" target="saaristolautat">' + hostname + '</a>': hostname;
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

  if (!inIframe()) map.addListener('click', toggleHeaderbar);
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
    rerender(map, true);
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
  var markerL = createMarker(positionL, false, iconL, map);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function setInfoContent(targets) {
  $(".infocontent:last #selectedTitle").html(targets.map(function(target) { return target.name; }).filter(onlyUnique).join('<br>'));
  $(".infocontent:last #selectedDescription").html(targets.map(function(target) { return target.description? target.description: ' '; }).map(function(desc) {
    return "<p>" + desc + "</p>";
  }).filter(onlyUnique).join("\n"));
} 

var selected = [];

function select(targets, mouseEvent) {

  if (!targets.length) return;

  var selectedCountWas = selected.length;
  selected.forEach(function(target) { target.highlight(false); });
  selected = [];

  var bounds = null;
  targets = (targets.constructor === Array)? targets: [targets];
  targets.forEach(function(target) {
    target.highlight(true);
    selected.push(target);
    if (!bounds) bounds = target.bounds;
    if (bounds && target.bounds) bounds.union(target.bounds);
  });

  if (selectedCountWas == 0) {

    var newElem = $(".infocontent.template").clone(true);
    newElem.removeClass("template");
    newElem.appendTo($("#info"));
    newElem.addClass("active-info");
    setInfoContent(targets);

    var clientY = mouseEvent? latLng2Point(mouseEvent.latLng, map).y: 0;
    if ($("#map").height()*0.80 < clientY) map.panBy(0, $("#map").height()*0.2);
    $(function() { 
      $("#info").show();
      $("#mapcontainer").animate({height: '80%'});
      $("#info").animate({top: '80%'}, toggleScrollIndicator);
    });
  } else { // swap content of #info
    
    // all this just calculate needed scroll animation
    var wrapper = $("#wrapper");
    var wrapperHeight0 = wrapper[0].scrollHeight;
    var visibleHeight = wrapper.outerHeight();
    var scrolled0 = wrapper.scrollTop();

    var newElem = $(".infocontent.template").clone(true);
    newElem.removeClass("template");
    newElem.addClass("hidden-info");
    newElem.appendTo($("#info"));
    setInfoContent(targets);

    var infoContentHeight0 = $(".infocontent.active-info")[0].scrollHeight;
    var infoContentHeight1 = $(".infocontent.hidden-info")[0].scrollHeight;

    var wrapperHeight1 = wrapperHeight0 + infoContentHeight1 - infoContentHeight0;
    var maxScroll1 = wrapperHeight1 - visibleHeight;
    var scrolled1 = Math.min(scrolled0, maxScroll1);

    if (maxScroll1 + 25 > scrolled0) { // skip animations in certain conditions. This is needed to avoid jumping in Chrome.
      newElem.removeClass("hidden-info") // show new infocontent
      $(".infocontent.active-info").remove(); // remove old infocontent
      newElem.addClass("active-info"); // make new infocontent active
      wrapper.scrollTop(scrolled1);
      toggleScrollIndicator();
      return;
    }
    // scroll smoothly down;
    wrapper.animate({scrollTop: scrolled1}, 1+(scrolled0 - scrolled1)*2, function() {
      $("#info").animate({opacity: 0.3}, 'fast', function() { // hide info during the swap
        newElem.removeClass("hidden-info") // show new infocontent
        $(".infocontent.active-info").remove(); // remove old infocontent
        newElem.addClass("active-info"); // make new infocontent active
        toggleScrollIndicator();
        $("#info").animate({opacity: 1}, 'fast'); // show info again
      });
    });
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
      selected.forEach(function(target) { target.highlight(false); });
      selected = [];
    });
    var scrolled = $("#wrapper")[0].scrollTop;
    $("#wrapper").animate({scrollTop: 0}, scrolled*2, function() {
      $("#info").animate({top: '100%'}, 100, function() {
        $("#info").hide();
        $(".infocontent.active-info").remove();
        toggleScrollIndicator();
      });
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
  rerender(map, true);
});

$("#showLive").click(function() {
  var liveMapUri =  "live.html?lng=" + map.getCenter().lng() + "&lat=" + map.getCenter().lat() + "&zoom=" + map.getZoom();
  window.open(liveMapUri, "livemap");
  $('.navbar-toggle').click();
});

var map;
var tooltip;

//var roadColor = '#91755d';
var roadColor = '#696d4b';

function createMapStyles(mapTypeId, zoom, settings) {
  return [
    // forests visible
    { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [ 
          {lightness: -15},
          {saturation: -50},
          {hue: '#00ff3b'},
          {gamma: 1.2}
          ]},
    // flat style
    // { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{color: '#b8cbb8'}, {lightness: 20} ]},

    { featureType: 'water', elementType: 'geometry.fill', stylers: [{color: '#edf3ff'}, {lightness: 40}]},

    { elementType: 'labels', stylers: [{ "visibility": "off" }]},
    { featureType: 'administrative', elementType: 'labels', stylers: [{ "visibility": zoom <= 7 || zoom >= 13? 'on': 'off' }]},
    { featureType: 'landscape', elementType: 'labels', stylers: [{ "visibility": zoom >= 13? 'on': 'off' }]},
    { featureType: 'poi', elementType: 'labels', stylers: [{ "visibility": zoom >= 10? 'on': 'off' }]},
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ saturation: -10}]},

    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{color: '#400040'}, {weight: 1}]},
    { featureType: 'transit', stylers: [{ "visibility": "off" }]},

    { featureType: 'road', elementType: 'labels', stylers: [{visibility: 'on'}]},
    { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{color: '#ffffff'}, {weight: 3}]},
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#000000'}]},
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{color: roadColor}]},
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: roadColor}]},
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{visibility: "simplified"}, {weight: zoom <= 7? 0.5: Math.max(0.6, 0.6 + (zoom-7)*0.4)}]},
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{visibility: "simplified"}, {weight: 0.1}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.fill', stylers: [{visibility: "simplified"}, {weight: zoom <= 6? 0.7: Math.max(0.8, 0.8 + (zoom-6)*0.55)}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{visibility: "simplified"}, {weight: 0.2}]},
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{weight: Math.max(0.8, 0.8 + (zoom-9)*0.3)}]},
    { featureType: 'road.local', elementType: 'geometry', stylers: [{weight: 0.8}]},
  ];
}

function updateMapStyles() {
  map.setOptions({styles: createMapStyles(map.getMapTypeId(), map.getZoom(), {})});
  $("div.gm-style").css({'font-size': map.getZoom()});
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
    cursor: clickable? 'pointer': 'default',
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
    strokeColor: roadColor,
    strokeOpacity: 1,
    strokeWeight: 1,
    zIndex: 0,
    map: map,
    clickable: false
  });
  var minZ = feature.properties.minZ || 8;
  var maxZ = feature.properties.maxZ || 8;
  return {
    rerender: function(zoom, mapTypeId) {
      roadObject.setVisible(zoom >= minZ && zoom <= maxZ);
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

var pierIcons;
function getPierIcons() {
  if (pierIcons) return pierIcons;
  pierIcons = {
    a1_08: createCircleIcon('#e00000', 1, 3, null),
    a1_10: createCircleIcon('#e00000', 1, 4, null),
    a1_11: createCircleIcon('#e00000', 0.8, 5, null),
    a1_30: createCircleIcon('#e00000', 0.8, 6, null),
    a2_09: createCircleIcon('#e00000', 0.5, 3, null),
    a2_10: createCircleIcon('#e00000', 0.5, 3.5, null),
    a2_11: createCircleIcon('#e00000', 0.5, 4, null),
    a2_12: createCircleIcon('#e00000', 0.8, 4, null),
    a2_30: createCircleIcon('#e00000', 0.8, 5, null),
    a3_09: createCircleIcon('#e00000', 0.5, 2.5, null),
    a3_10: createCircleIcon('#e00000', 0.5, 3, null),
    a3_12: createCircleIcon('#e00000', 0.5, 3.5, null),
    a3_30: createCircleIcon('#e00000', 0.8, 4.5, null),
    a4_09: createCircleIcon('#e00000', 0.5, 1, null),
    a4_10: createCircleIcon('#e00000', 0.5, 2, null),
    a4_11: createCircleIcon('#e00000', 0.5, 3, null),
    a4_12: createCircleIcon('#e00000', 0.5, 4, null),
    a4_30: createCircleIcon('#e00000', 0.8, 4, null),
    a5_30: createCircleIcon('#e00000', 0, 0, null),
  }
  return pierIcons;
}

var pierStylers = {
  "1": {
    markerVisibleFrom: 8,
    labelVisibleFrom: 8,
    markerScale: function(zoom) {return zoom <= 8? 3: zoom <= 10? 4: zoom <= 11? 5: 6;},
    markerOpacity: function(zoom) {return zoom <= 10? 1 : 0.8;},
    icon: function(zoom) { return getPierIcons()[zoom <= 8? "a1_08": zoom <= 10? "a1_10": zoom <= 11? "a1_11": "a1_30"]; },
    clickable: function(zoom) { return true; }
  },
  "2":  {
    markerVisibleFrom: 9,
    labelVisibleFrom: 9,
    markerScale:  function(zoom) {return zoom <= 9? 3: zoom <= 10? 3.5: zoom <= 12? 4: 5;},
    markerOpacity: function(zoom) {return zoom <= 11? 0.5: 0.8; },
    icon: function(zoom) { return getPierIcons()[zoom <= 9? "a2_09": zoom <= 10? "a2_10": zoom <= 11? "a2_11": zoom <= 12? "a2_12": "a2_30"]; },
    clickable: function(zoom) { return true; }
  },
  "3": {
    markerVisibleFrom: 9,
    labelVisibleFrom: 10,
    markerScale:  function(zoom) {return (zoom <= 9? 2.5: zoom <= 10? 3: zoom <= 12? 3.5: 4.5);},
    markerOpacity: function(zoom) {return zoom <= 12? 0.5: 0.8; },
    icon: function(zoom) { return getPierIcons()[zoom <= 9? "a3_09": zoom <= 10? "a3_10": zoom <= 12? "a3_12": "a3_30"]; },
    clickable: function(zoom) { return true; }
  },
  "4": {
    markerVisibleFrom: 9,
    labelVisibleFrom: 11,
    markerScale:  function(zoom) {return (zoom <= 9? 1: zoom <= 10? 2: zoom <= 11? 3: 4);},
    markerOpacity: function(zoom) {return  zoom <= 12? 0.5: 0.8},
    icon: function(zoom) { return getPierIcons()[zoom <= 9? "a4_09": zoom <= 10? "a4_10": zoom <= 11? "a4_11": zoom <= 12? "a4_12": "a4_30"]; },
    clickable: function(zoom) { return zoom >= 10; }
  },
  "5": {
    markerVisibleFrom: 30,
    labelVisibleFrom: 11,
    markerScale:  function(zoom) {return 0;},
    markerOpacity: function(zoom) {return  0;},
    icon: function(zoom) { return getPierIcons()["a5_30"]; },
    clickable: function(zoom) { return true; }
  }
};

function pier(feature, map) {
  var styler = pierStylers[feature.properties.ssubtype];
  var markerVisibleFrom = feature.properties.markerVisibleFrom || styler.markerVisibleFrom;
  var labelVisibleFrom = feature.properties.labelVisibleFrom || styler.labelVisibleFrom;
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var icon = getPierIcons().a1_30;
  var marker = createMarker(position, true, icon, map);
  var shortName_ = shortName(feature.properties);
  var longName_ = longName(feature.properties).replace('/', '<br/>');
  var label = new txtol.TxtOverlay(position, longName_, "pier pier-" + feature.properties.ssubtype, map, feature.properties.labelAnchor);

  function showTooltip() {
    tooltip.openedAt = new Date().getTime();
    tooltip.setPosition(marker.getPosition());
    tooltip.setContent(longName_);
    tooltip.open(map, marker);
  }

  marker.addListener('click', showTooltip);
  label.addEventListener('click', function(event) { event.stopPropagation(); event.preventDefault(); showTooltip(); });
  return {
    init: function() {
      shortName_ = shortName(feature.properties);
      longName_ = longName(feature.properties).replace('/', '<br/>');
      label.setInnerHTML(longName_);
    },
    hide: function() {
      marker.setVisible(false);
      label.hide();
    },
    rerender: function(zoom, mapTypeId) {
      marker.setIcon(styler.icon(zoom));
      marker.setClickable(styler.clickable(zoom));
      marker.setVisible(zoom >= markerVisibleFrom);
      if (zoom >= labelVisibleFrom) label.show(); else label.hide();
    }
  };
}

var cableferryStyler = {
  highlightColor: '#f97cdc',
  highlightWeight: 17,
  highlightOpacity: .6,
  visibleFrom: 9
}

var _cableferrySymbol;
function cableferrySymbol() {
  _cableferrySymbol = _cableferrySymbol || {
    path: google.maps.SymbolPath.CIRCLE,
    strokeOpacity: 1,
    strokeColor: '#00a000',
    strokeWeight: 2,
    fillColor: '#00a000',
    fillOpacity: 0.3,
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
  var visibleFrom = feature.properties.visibleFrom || styler.visibleFrom;

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
    hide: function(zoom, mapTypeId) {
      line.setVisible(zoom >= visibleFrom);
    },
    rerender: function(zoom, mapTypeId) {
      line.setVisible(zoom >= visibleFrom);
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
    weight: 2,
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
  var connectionObject = { name: shortName(connection.properties), description: connection.properties.description};
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

  connectionObject.init = function() {
    connectionObject.name = shortName(connection.properties);
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
    hide: function() {
      marker.setVisible(false);
    },
    rerender: function(zoom, mapTypeId) {
      marker.setVisible(zoom >= 11);
    }
  };
}

var areaStylers = {
  "province": {
    labelVisibleFrom: 1,
    labelVisibleTo: 10
  },
  "mun1": {
    labelVisibleFrom: 1,
    labelVisibleTo: 30
  },
  "mun2": {
    labelVisibleFrom: 8,
    labelVisibleTo: 30
  },
  "island1": {
    labelVisibleFrom: 9,
    labelVisibleTo: 30
  },
};

function area(feature, map) {
  var styler = areaStylers[feature.properties.ssubtype];
  var labelVisibleFrom = feature.properties.labelVisibleFrom || styler.labelVisibleFrom;
  var labelVisibleTo = feature.properties.labelVisibleTo || styler.labelVisibleTo;
  var longNameFrom = feature.properties.longNameFrom || styler.longNameFrom || 9;
  var coords = feature.geometry.coordinates;
  var position = new google.maps.LatLng(coords[1], coords[0]);
  var shortName_ = shortName(feature.properties);
  var longName_ = longName(feature.properties).replace('/', '<br/>');
  var label = new txtol.TxtOverlay(
    position, longName_, "area " + feature.properties.ssubtype + (feature.properties.background? " bg": ""), map, feature.properties.labelAnchor);
  return {
    init: function() {
      shortName_ = shortName(feature.properties);
      longName_ = longName(feature.properties).replace('/', '<br/>');
    },
    hide: function(zoom) {
      if (zoom >= labelVisibleFrom && zoom <= labelVisibleTo) label.show(); else label.hide();
    },
    rerender: function(zoom, mapTypeId) {
      label.setInnerHTML(zoom >= longNameFrom? longName_: shortName_);
      if (zoom >= labelVisibleFrom && zoom <= labelVisibleTo) label.show(); else label.hide();      
    }
  };
}

var boxStylers = {
  "distance": {
    visibleFrom: 11,
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
    position, description(feature.properties), "distancebox", map, feature.properties.anchor);
  return {
    init: function() {
      box.setInnerHTML(description(feature.properties));
    },
    hide: function() {
      box.hide();
    },
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
var prevRerender = "";
var hidden = true;
var prevRenderZoom = 0; 
function rerender(map, force) {
  var zoom = map.getZoom();
  var mapTypeId = map.getMapTypeId();
  var newRerender = mapTypeId + ":" + zoom;
  if (prevRerender === newRerender && !force) return;
  prevRerender = newRerender;
  var t0 = new Date().getTime();
  console.log('rerender started at', newRerender);
  objects.forEach(function(object){ object.rerender(zoom, mapTypeId); }); 
  console.log('rerender finished at', zoom, 'in', new Date().getTime() - t0, 'ms');
  hidden = false;
  prevRenderZoom = zoom;
}

function hideObjects(map) {
  if (hidden) return;
  var zoom = map.getZoom();
  // if (zoom > prevRenderZoom) return; // hide only when zooming out
  var t0 = new Date().getTime();
  console.log('hide started');
  objects.forEach(function(object){ if (object.hide) object.hide(); }); 
  console.log('hide finished in', new Date().getTime() - t0, 'ms');
  hidden = true;
}

function renderData(data, map) {
  var features = data.features;
  features.forEach(function(feature) {
    var type = feature.properties.stype;
    if (typeof renderers[type] !== 'undefined') {
      objects.push(renderers[type](feature, map));
    }
  });
}

var mapOptions = {
  center: {lat: 60.25, lng: 21.25},
  zoom: 9,
  minZoom: 4,
  maxZoom: 17,
  mapTypeControl: false,
  // mapTypeId: google.maps.MapTypeId.TERRAIN,
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

var lauttaRoutes;

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

  var loaded = 0;
  $.get('/data/saaristo.json', function(data) {
    renderData(data, map);
    if (++loaded >= 3) rerender(map, true);
  });

  $.get('/data/roads.json', function(data) {
    renderData(data, map);
    if (++loaded >= 3) rerender(map, true);
  });

  $.get('/data/routes.json', function(data) {
    renderData(data, map);
    if (++loaded >= 3) rerender(map, true);
  });

  var oldZoom = map.getZoom();
  map.addListener('zoom_changed', function() {
    var newZoom = map.getZoom();
    console.log('zoom_changed: ', oldZoom, newZoom);
    oldZoom = newZoom;
  });
  
  map.addListener('zoom_changed',function() {
    hideObjects(map);
    setTimeout(function() { rerender(map); }, 50);
  });

  map.addListener('maptypeid_changed',function () {
    rerender(map);
  });

  addMapListeners(map);

  tooltip = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true
  });


  // ----------

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
  { id: 7, name: "Herröskatan - Hanko",
  path: "20.1375961,59.9568151,0.0 20.1618004,59.9589636,0.0 20.1935577,59.9587917,0.0 20.3082275,59.9231945,0.0 20.5149078,59.8009796,0.0 21.6616058,59.7044776,0.0 23.6027527,59.7256004,0.0" },
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
  { id: 15, name: "Hanko - Helsinki",
  path: "23.6027527,59.7256004,0.0 24.8881531,59.9869673,0.0 24.9904633,60.1510752,0.0 24.9568176,60.1661089,0.0" },
  { id: 16, name: "Hanko - Tallinn",
  path: "23.6027527,59.7256004,0.0 24.555864,59.632669,0.0 24.784230,59.456251,0.0 24.770607,59.443868,0.0" },
  ];

  var lauttaRoutesList = [
  { sname: "Turku - Maarianhamina/Långnäs - Tukholma", 
    sname_sv: "Åbo - Mariehamn/Långnäs - Stockholm",
    sname_en: "Turku - Mariehamn/Långnäs - Stockholm",
    operators: ["Viking"], legs: [2, 3, 4, 5, 6, 8, 9, 11, 13],
    description_fi: "2 kertaa päivässä, kesto n. 11 tuntia",
    description_sv: "2 gånger om dagen, längd ca 11 timmar",
    description_en: "twice a day, duration about 11 hours"},
  { sname: "Turku - Maarianhamina/Långnäs - Tukholma", 
    sname_sv: "Åbo - Mariehamn/Långnäs - Stockholm",
    sname_en: "Turku - Mariehamn/Långnäs - Stockholm",
    operators: ["Silja"], legs: [2, 3, 4, 5, 6, 8, 9, 11, 12],
    description_fi: "2 kertaa päivässä, kesto n. 11 tuntia",
    description_sv: "2 gånger om dagen, längd ca 11 timmar",
    description_en: "twice a day, duration about 11 hours"},
  { sname: "Helsinki - Maarianhamina - Tukholma",
    sname_sv: "Helsingfors - Mariehamn - Stockholm",
    sname_en: "Helsinki - Mariehamn - Stockholm",
    operators: ["Viking"], legs: [7, 6, 9, 11, 13, 15],
    description_fi: "kerran päivässä, kesto n. 17,5 tuntia",
    description_sv: "en gång om dagen, längd ca 17,5 timmar",
    description_en: "once a day, duration about 17,5 hours"},
  { sname: "Helsinki - Maarianhamina - Tukholma",
    sname_sv: "Helsingfors - Mariehamn - Stockholm",
    sname_en: "Helsinki - Mariehamn - Stockholm",
    operators: ["Silja"], legs: [7, 6, 9, 11, 12, 15],
    description_fi: "kerran päivässä, kesto n. 17,5 tuntia",
    description_sv: "en gång om dagen, längd ca 17,5 timmar",
    description_en: "once a day, duration about 17,5 hours"},
  { sname: "Tallinna - Maarianhamina - Tukholma",
    sname_sv: "Tallinn - Mariehamn - Stockholm",
    sname_en: "Tallinn - Mariehamn - Stockholm",
    operators: ["Tallink"], legs: [7, 6, 9, 11, 12, 16],
    description_fi: "kerran päivässä, kesto n. 17,5 tuntia",
    description_sv: "en gång om dagen, längd ca 17,5 timmar",
    description_en: "once a day, duration about 17,5 hours"},
  { sname: "Mariehamn - Stockholm",
    sname_fi: "Maarianhamina - Tukholma",
    operators: ["Viking"], legs: [9, 11, 13],
    description_fi: "kerran päivässä, kesto 7-12 tuntia",
    description_sv: "en gång om dagen, längd 7-12 timmar",
    description_en: "once a day, duration 7-12 hours"},
  { sname: "Kapellskär - Mariehamn",
    sname_fi: "Kapellskär - Maarianhamina",
    operators: ["Viking"], legs: [9, 10],
    description_fi: "2-3 kertaa päivässä, kesto n. 2,5 tuntia, linja-autoyhteys Tukholmaan",
    description_sv: "2-3 gånger om dagen, längd ca 2,5 timmar, bussförbindelse till Stockholm",
    description_en: "2-3 times a day, duration about 2.5 hours, bus connection to Stockholm"},
  { sname: "Eckerö - Grisslehamn", operators: ["Eckerolinjen"], legs: [14],
    description_fi: "2-3 kertaa päivässä, kesto n. 2 tuntia",
    description_sv: "2-3 gånger om dagen, längd ca 2 timmar",
    description_en: "2-3 times a day, duration about 2 hours"},
  { sname: "Naantali - Långnäs - Kapellskär",
    sname_sv: "Nådendal - Långnäs - Kapellskär",
    operators: ["Finnlines"], legs: [1, 3, 4, 5, 8, 10],
    description_fi: "2 kertaa päivässä, kesto n. 8,5 tuntia",
    description_sv: "2 gånger om dagen, längd ca 8,5 timmar",
    description_en: "twice a day, duration about 8.5 hours"},
  ];

  var operators = {
    Viking: {name: "Viking Line", logo: "img/vikingline.png", height: 15, link: "https://www.vikingline.fi/"},
    Silja: {name: "Tallink / Silja Line", logo: "img/siljaline.png", height: 20, link: "https://www.tallinksilja.fi/"},
    Tallink: {name: "Tallink / Silja Line", logo: "img/tallink.png", height: 20, link: "https://www.tallink.ee/"},
    Finnlines: {name: "Tallink / Silja Line", logo: "img/finnlines.png", height: 20, link: "https://www.finnlines.com/"},
    Eckerolinjen: {name: "Eckerölinjen", logo: "img/eckerolinjen.png", height: 20, link: "https://www.eckerolinjen.ax/"}
  };

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
    this.operators = object.operators;
    this.legs = object.legs.map(function(id) { return lauttaLegIndex[id]; });
    this.init = function() {
      this.name = shortName(object);
      this.description = this.operators.map(function(operator) {
        var op = operators[operator];
        return shortName(object) + ', ' + description(object) + '&nbsp;&nbsp; <a href="' + op.link + '" target="info"><img src="' + operators[operator].logo + '" height="' + op.height + '"/></a>' ;
      }).join(" ");
    }
    this.init();
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

  lauttaRoutes = lauttaRoutesList.map(function(route) {
    route = new Route(route);
    route.legs.forEach(function(leg) { leg.addRoute(route); });
    return route;
  });

}