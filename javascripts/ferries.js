
$(document).ready(function(){
    $('#wrapper2').bind('scroll',toggleScrollIndicator); 
});

$(window).resize(function() {
  toggleScrollIndicator();
  keepCenter();
});

var mapCenter;
var leftInfo = false;
var bottomInfo = false;

function rememberCenter() {
  mapCenter = map.getCenter();
  leftInfo = $("body").outerWidth() >= 768 && selected.length > 0;
  bottomInfo = $("body").outerWidth() < 768 && selected.length > 0;
}

function keepCenter() {
  var oldCenter = mapCenter;
  if (map && mapCenter) setTimeout(function() {
    map.setCenter(oldCenter);
    if (leftInfo && $("#map").outerWidth() < 768) map.panBy(200, 0);
    if (bottomInfo && $("#map").outerWidth() >= 768) map.panBy(-200, 0);
  }, 50);
}

$(document).ready(function(){

  $("#infopage").load("templates/infopage.html #infopagecontent", initInfoPage);
  $("#menu").load("templates/menucontent.html #menucontent", initMenu);
  $("#settings").load("templates/settingscontent.html #settingscontent", initSettings);

});

var scrollLimit = 22;

function toggleScrollIndicator()
{
  var elem = $("#wrapper2");
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

function hideHeaderbar() {
  $("#topbar").slideUp('fast');
}

function showHeaderbar() {
  $("#topbar").slideDown('fast');
}

window.onhashchange = function() {
  console.log("hash changed", location.hash);
}

function doToggleHeaderbar() {
  if (!$("#menu").is(":hidden") || !$("#settings").is(":hidden")) {
    hideMenu();
    hideSettings();
  } else if (selected.length > 0) {
    unselectAll();
  } else if ($("#topbar").is(":hidden")) {
    showHeaderbar();
  } else if (!inIframe()) {
    hideHeaderbar();
  }
}

var headerBarTimeout = null;
function toggleHeaderbar() {
  if (new Date().getTime() - latestHandledMapClickAt < 200) return; // too short time since a label was clicked
  headerBarTimeout = setTimeout(doToggleHeaderbar, 200);
}

function cancelHeaderBarToggle() {
  if (headerBarTimeout) clearTimeout(headerBarTimeout);
  headerBarTimeout = null;
}

function initInfoPage() {
  $('#closeInfoPageButton').click(function() {
    $('#infopage').fadeOut();
    select(wasSelected);
  });

  showLanguage(currentLang);
}

function initMenu() {

  $('.box').click(function(event) {
    $('#infopage').fadeIn();
    $(".infosection").hide();
    $(this.getAttribute("data-target")) .show();
    hideMenu();
    wasSelected = selected.slice();
    unselectAll();
  });

  showLanguage(currentLang);
}

function initSettings() {
  $(".mapTypeSelect").bind('change', function() {
    newValue = this.options[this.selectedIndex].value;
    map.setMapTypeId(newValue);
  });

  $("#toggleFullscreen").click(toggleFullscreen);

  for (var key in layers) {
    $("input[type=checkbox][data-target=" +  key +"]").prop("checked", layers[key]);
  }

  $(".boxs input[type=checkbox]:not([data-target])").prop("disabled", true);

  $("input[type=checkbox]").change(function() {
    var layer = this.getAttribute("data-target");
    layers[layer] = this.checked; 
    localStorage.setItem("layers", JSON.stringify(layers));
    rerender(map, true);
  });

  $(".lang-button[setlang=" + currentLang +"]").toggleClass('active', true);
  $('.lang-button').click(function(event) {
    setLanguage(event.currentTarget.getAttribute("setlang"));
  });

  $("#showLive").click(function() {
    var liveMapUri =  "live.html?lng=" + map.getCenter().lng() + "&lat=" + map.getCenter().lat() + "&zoom=" + map.getZoom();
    window.open(liveMapUri, "livemap");
    $('.navbar-toggle').click();
  });

  showLanguage(currentLang);
}


var wasSelected = [];

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
    var isSatellite = map.getMapTypeId() === 'satellite' || map.getMapTypeId() == 'hybrid';
    if (isSatellite) {
      $('#setMapTypeMap').removeClass('active');
      $('#setMapTypeSatellite').addClass('active');
    } else {
      $('#setMapTypeMap').addClass('active');
      $('#setMapTypeSatellite').removeClass('active');          
    }
  });

  map.addListener('click', toggleHeaderbar);
  map.addListener('idle', rememberCenter);

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

if (window.location.hostname == "localhost") $("#loader").fadeOut(500);

function getLocation() {
  if (navigator.geolocation) {
    //navigator.geolocation.getCurrentPosition(showPosition);
    // disabled for now
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

$(document).keyup(function(e) {
  if (e.keyCode == 27) { // escape key maps to keycode `27`
    //closeTimetables();
    history.back();
  }
});

function closeTimetables() {
  $('#timetables').fadeOut();
  $('#timetables').scrollTop(0);
}

function setInfoContent(targets) {

  var output;
  $(".info .infocontent").addClass("removing");
  if (targets[0].ref) {
    var route = targets[0].ref;
    var hash = "/#/" + route;
    if (hash.substring(1) !== location.hash) history.pushState(null, null, "/#/" + route);

    var template = document.getElementById('infocontenttemplate').innerHTML;
    var data = routeInfo(fdata.routes[route], currentLang);
    output = Mustache.render(template, data);
  } else {
    var template = document.getElementById('infocontent2template').innerHTML;
    var uniqueNames = targets.map(function(target) { return target.name; }).filter(onlyUnique);
    var data = { names: uniqueNames, contents: targets };
    output = Mustache.render(template, data);
  }

  $(".info").append(output);
  if ($(".infocontent.removing").length) $(".infocontent:not(.removing)").hide();

  if (targets[0].style) {
    var style = targets[0].style;
    $(".infocontent:not(.removing)").find(".infotitle, .headerbox").css({borderBottom: style.weight + "px " + style.style + " " + style.color });
  } else {
    $(".infocontent:not(.removing)").find(".infotitle, .headerbox").css({borderBottom: "none" });      
  }
  
  $('.closeInfoButton:not(#closeInfoPageButton)').click(function() {
    history.back();
  });


  $(".infocontent.removing").fadeOut('fast', function() {
    $(".infocontent.removing").remove();
    $(".infocontent").fadeIn('fast');
  });

  $(".timetablebutton").click(function() {
    if (this.getAttribute("linktype") === "external") {
      window.open(this.getAttribute("href"), "info");
    } else {
      var index = parseInt(this.getAttribute("index"))
      var tttemplate = document.getElementById('timetabletemplate').innerHTML;
      data.selectedtimetable = data.timetables[index];
      data.selectedtimetable.L = data.L;
      var ttoutput = Mustache.render(tttemplate, data.selectedtimetable);
      $('#timetables').fadeIn();
      $("#timetables").html(ttoutput);
      $("#timetables").click(function(event) { if (event.target == this) closeTimetables(); });
      $('#closeTimetablesButton').click(function() { history.back(); });
      hideMenu();
      history.pushState(null, null, location.hash  + "/timetables");
    }
  });
}

window.onpopstate = function() {
  closeTimetables();
  console.log(location.hash);
  if (location.hash.length == 0) {
    unselectAll();
  } else {
    var id = location.hash.substring(2);
    selectByIds([id]);
  }
};

var selected = [];

function selectByIds(ids) {
  var matching = objects.filter(function(o) { return o.ref && ids.indexOf(o.ref) >= 0; });
  if (matching.length) {
    select(matching, null);
  } else {
    unselectAll();
  }

}

function select(targets, mouseEvent) {

  if (!targets.length) return;

  var selectedCountWas = selected.length;
  selected.forEach(function(target) { target.highlight(false);  if (target.rerender) target.rerender(map.getZoom(), map.getMapTypeId()); });
  selected = [];

  var bounds = null;
  targets = (targets.constructor === Array)? targets: [targets];
  targets.forEach(function(target) {
    target.highlight(true);
    selected.push(target);
    if (!bounds) bounds = target.bounds;
    if (bounds && target.bounds) bounds.union(target.bounds);
  });

  showHeaderbar();
  setInfoContent(targets);
  toggleScrollIndicator();

  $(".info").scrollTop(0);

  if (selectedCountWas == 0) {

    $(function() {
      $("#wrapper2").toggleClass("info-open", true);
      if ($("body").outerWidth() >= 768) {
        $(".info").css({left: -400});
        $(".info").animate({left: 0}, 'fast', function() {$(".info").css({left: "" }); });
        //$(".map").animate({left: 400}, 'fast');
        var clientX = mouseEvent? latLng2Point(mouseEvent.latLng, map).x: 500;
        if (clientX < (400 + 50)) map.panBy(clientX - (($("#map").width() - 400)/3 +400), 0);
        //map.panBy(200,0);

      } else {
        $(".info").css({top: '100%'});
        $(".info").animate({top: '80%'}, 'fast', function() {$(".info").css({top: "" }); });
        $("#mapcontainer").css({height: '100%'});
        $("#mapcontainer").animate({height: '80%'}, 'fast', function() {$("#mapcontainer").css({height: ""}); toggleScrollIndicator(); });
        
        var clientY = mouseEvent? latLng2Point(mouseEvent.latLng, map).y: 0;
        if ($("#map").height()*0.80 < clientY) map.panBy(0, $("#map").height()*0.2);
      }
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
    if ($("body").outerWidth() >= 768) {
      //map.panBy(-200, 0);
      //$("#map").animate({left: 0});
      $(".info").animate({left: -400}, 'fast', function() {
        $(".info").css({left: "" });
        $("#wrapper2").toggleClass("info-open", false);
        $(".info .infocontent").remove();
      });
    } else {
      $("#wrapper2").animate({scrollTop: 0}, 'fast', function() {
        $(".info").animate({top: '100%'}, 200, function() {
          $(".info").css({top: "" }); 
        });
        $("#mapcontainer").animate({height: '100%'}, 'fast', function() {
          $("#mapcontainer").css({height: ""});
          $("#wrapper2").toggleClass("info-open", false);
          $(".info .infocontent").remove();
          toggleScrollIndicator();
        }); 
      });
    }
  });
  selected.forEach(function(target) { target.highlight(false); if (target.rerender) target.rerender(map.getZoom(), map.getMapTypeId()); });
  selected = [];
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

var localStorgageLayers = localStorage.getItem("layers");

var layers = localStorgageLayers? JSON.parse(localStorgageLayers): {
  ringroads: false,
  distances: true,
  roadferries: true,
  conn4: true,
  conn5: true,
  longdistanceferries: true,
};

localStorage.setItem("layers", JSON.stringify(layers));

var map;
var tooltip;

//var roadColor = '#91755d';
//var roadColor = '#696d4b';
var roadColor = '#8a7d6a';
var roadColorSatellite = '#c0c0c0';

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
    { featureType: 'road', elementType: 'geometry.fill', stylers: [{color: mapTypeId == google.maps.MapTypeId.ROADMAP? roadColor: roadColorSatellite}]},
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: mapTypeId == google.maps.MapTypeId.ROADMAP? roadColor: roadColorSatellite}]},
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{visibility: "simplified"}, {weight: zoom <= 7? 0.5: Math.max(0.6, 0.6 + (zoom-7)*0.4)}]},
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{visibility: "simplified"}, {weight: 0.1}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.fill', stylers: [{visibility: "simplified"}, {weight: zoom <= 6? 0.7: Math.max(0.8, 0.8 + (zoom-6)*0.55)}]},
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{visibility: "simplified"}, {weight: 0.2}]},
    { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{visiblity: "simplified"}, {weight: Math.max(0.8, 0.8 + (zoom-9)*0.3)}]},
    { featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{visiblity: "simplified"}, {weight: 0.1}]},
    { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{visiblity: "simplified"}, {weight: 0.8}]},
    { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{visiblity: "simplified"}, {weight: 0.1}]}
  ];
}

function updateMapStyles() {
  map.setOptions({styles: createMapStyles(map.getMapTypeId(), map.getZoom(), {})});
  $("div.gm-style").css({'font-size': map.getZoom()+1});
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
  //return '#002080';
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
      var addZ = mapTypeId == 'hybrid'? 2: 0;
      roadObject.setVisible(zoom >= minZ + addZ && zoom <= maxZ + addZ);
      roadObject.setOptions({strokeColor: mapTypeId == google.maps.MapTypeId.ROADMAP? roadColor: roadColorSatellite});
    }
  };
}

function route(feature, map) {
  var coords = feature.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
  var object = new google.maps.Polyline({
    path: new google.maps.MVCArray(coords),
    geodesic: false,
    strokeColor: '#a16bc4',
    strokeOpacity: 0.7,
    strokeWeight: 4,
    zIndex: 0,
    map: map,
    cursor: 'context-menu',
    clickable: true
  });
  return {
    rerender: function(zoom, mapTypeId) {
      object.setVisible(layers.ringroads && zoom >= 8);
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
    latestHandledMapClickAt = new Date().getTime();
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

var lineWeightUnit = 1.5;

var connectionStylers = {
  "base": {
    visibleFrom: 8,
    visibleTo: 30,
    weight: 3.5 * lineWeightUnit,
    color: '#f08000',
    opacity: 0.7,
    zIndex: 10,
    highlightColor: '#f97cdc',
    highlightWeight: 8,
    highlightOpacity: .7,
    layer: "roadferries"
  },
  "conn1": {
  },
  "conn1b": {
    weight: 2 * lineWeightUnit,
    zIndex: 12
  },
  "conn2": {
    weight: 2.5 * lineWeightUnit,
    color: '#005dd8'
  },
  "conn2m": {
    weight: 2 * lineWeightUnit,
    color: '#ff7c0a',
  },
  "conn2b": {
    weight: 1.5 * lineWeightUnit,
    zIndex: 9
  },
  "conn3": {
    // visibleFrom: 9,
    weight: 2 * lineWeightUnit,
    color: '#e7883e',
    opacity: 1
  },
  "conn4": {
    // visibleFrom: 9,
    weight: 1.5 * lineWeightUnit,
    color: '#7fb3e8',
    opacity: 0.8,
    zIndex: 8,
    layer: "conn4"
  },
  "conn5": {
    visibleFrom: 9,
    icons: [{
        icon: {
        path: 'M 0,-1.5 0,1.5',
        strokeOpacity: 1,
        strokeColor: '#ff7c0a',
        strokeWeight: 1 * lineWeightUnit,
        scale: 1
      },
      offset: '0',
      repeat: '8px'
    }],
    zIndex: 8,
    layer: "conn5",
    style: { color: "#ff7c0a", weight: 2, style: "dashed", opacity: 1 }
  },
  "cableferry": {
    visibleFrom: 9,
    icons: [{
        icon: {
        path: 0, // circle. cannot refer to google.maps.SymbolPath.CIRCLE before map has been loaded
        strokeOpacity: 1,
        strokeColor: '#00a050',
        strokeWeight: 1.5 * lineWeightUnit,
        scale: 1.5 * lineWeightUnit
      },
      offset: '0',
      repeat: (3*lineWeightUnit) + 'px'
    }],
    highlightWeight: 10,
    zIndex: 11,
    layer: "roadferries",
    style: { color: "#00a050", weight: 3*lineWeightUnit, style: "dotted", opacity: 1 },
  }

};

function pickProperty(name, sources) {
  for (var i in sources) {
    if (typeof sources[i][name] !== 'undefined') return sources[i][name];
  }
}

function pickProperties(names, sources) {
  var result = {};
  names.forEach(function(name) {
    result[name] = pickProperty(name, sources);
  });
  return result;
}

function connection(connection, map) {
  var baseStyler = connectionStylers["base"];
  var subtype = connection.properties.ssubtype;
  var connectionStyler = subtype? connectionStylers[subtype]: baseStyler;
  var layer = connectionStyler.layer || baseStyler.layer;
  var layerSelector = function() {
    return layers[layer]; 
  };

  var legFeatures = connection.type === 'FeatureCollection'? connection.features: [connection];
  var connectionObject = { ref: connection.properties.ref };
  var legObjects = legFeatures.map(function(leg) {

    var coords = leg.geometry.coordinates.map(function(coord) { return new google.maps.LatLng(coord[1], coord[0]); });
    var legStyler = leg.properties.ssubtype? connectionStylers[leg.properties.ssubtype]: {};
    var propertyNames = ["weight", "opacity", "color", "zIndex", "visibleFrom", "visibleTo", "highlightColor", "highlightWeight", "highlightOpacity", "icons"];
    var propertySources = [leg.properties, legStyler, connection.properties, connectionStyler, baseStyler]
    var properties = pickProperties(propertyNames, propertySources);
    var isSelected = false;
    connectionObject.style = connectionStyler.style || { color: properties.color, weight: properties.weight, style: "solid", opacity: properties.opacity };

    var line = new google.maps.Polyline({
      path: new google.maps.MVCArray(coords),
      geodesic: false,
      strokeColor: properties.color,
      strokeOpacity: !properties.icons? properties.opacity: 0,
      strokeWeight: properties.weight,
      zIndex: properties.zIndex,
      clickable: false,
      icons: properties.icons,
      map: map
    });
    var lineb = new google.maps.Polyline({
      path: new google.maps.MVCArray(coords),
      geodesic: false,
      strokeOpacity: 0,
      strokeWeight: properties.highlightWeight + properties.weight,
      strokeColor: properties.highlightColor,
      zIndex: properties.zIndex - 1,
      cursor: 'context-menu',
      map: map
    });
    var highlight = function(doHighlight) {
      isSelected = doHighlight;
      lineb.setOptions({strokeOpacity: doHighlight? properties.highlightOpacity: 0});
    };
    lineb.addListener('click', function(event) {
      select([connectionObject], event);
    });
    var rerender = function(zoom, mapTypeId) {
      var lineIsVisible = isSelected || (layerSelector() && zoom >= properties.visibleFrom && zoom <= properties.visibleTo); 
      line.setVisible(lineIsVisible);
      lineb.setVisible(lineIsVisible);
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
      marker.setVisible(layers.distances && zoom >= 11);
    }
  };
}

var areaStylers = {
  "base": {
    labelVisibleFrom: 9,
    labelVisibleTo: 30,
    longNameFrom: 9
  },
  "province": {
    labelVisibleFrom: 5,
    labelVisibleTo: 10
  },
  "mun1": {
    labelVisibleFrom: 1,
  },
  "mun2": {
    labelVisibleFrom: 8,
  },
  "island1": {
    labelVisibleFrom: 9,
  },
};

function area(feature, map) {
  var baseStyler = areaStylers["base"];
  var styler = areaStylers[feature.properties.ssubtype];
  var propertyNames = ["labelVisibleFrom", "labelVisibleTo", "longNameFrom"];
  var propertySources = [feature.properties, styler, baseStyler];
  var properties = pickProperties(propertyNames, propertySources);
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
      if (zoom >= properties.labelVisibleFrom && zoom <= properties.labelVisibleTo) label.show(); else label.hide();
    },
    rerender: function(zoom, mapTypeId) {
      label.setInnerHTML(zoom >= properties.longNameFrom? longName_: shortName_);
      if (zoom >= properties.labelVisibleFrom && zoom <= properties.labelVisibleTo && ["roadmap", "hybrid", "terrain", "satellite"].indexOf(mapTypeId)>=0) label.show(); else label.hide();      
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
      if (layers.distances && zoom >= visibleFrom && zoom <= visibleTo) box.show(); else box.hide();
    }
  };
}

var renderers = {
  road: road,
  route: route,
  border: border,
  pier: pier,
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
  if (lauttaLegs) lauttaLegs.forEach(function(leg) { leg.rerender(zoom, mapTypeId); });
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

function receiveFData(fdata, fgeojson, messages) {
  fgeojson.forEach(function(data) {
    renderData(data, map);
  });
  initRoutes();
}

var mapOptions = {
  center: {lat: 60.25, lng: 21.25},
  zoom: 9,
  minZoom: 4,
  maxZoom: 15,
  mapTypeControl: false,
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
var lauttaLegs;

var latestHandledMapClickAt = 0;

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

  getFData(receiveFData);

  var oldZoom = map.getZoom();
  map.addListener('zoom_changed', function() {
    var newZoom = map.getZoom();
    console.log('zoom_changed: ', oldZoom, newZoom);
    oldZoom = newZoom;
  });
  
  map.addListener('zoom_changed',function() {
    cancelHeaderBarToggle();
    hideObjects(map);
    setTimeout(function() { rerender(map); }, 50);
  });

  map.addListener('maptypeid_changed',function () {
    $(".map").toggleClass("satellite", map.getMapTypeId() == 'satellite' || map.getMapTypeId() == 'hybrid');
    updateMapStyles();
    rerender(map, true);
  });

  addMapListeners(map);

  tooltip = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true
  });

  initMapTypes(map);
}

function initMapTypes(map) {

  function createGetMMLTileUrl(tileDir) {
    return function(coord, zoom) {
      var tilesPerGlobe = 1 << zoom;
      var x = coord.x % tilesPerGlobe;
      if (x < 0) x = tilesPerGlobe+x;

      x0 = ((x+1) << (15-zoom)) - 1
      x1 = x << (15-zoom)
      y0 = ((coord.y+1) << (15 - zoom)) - 1
      y1 = coord.y << (15 - zoom)

      if (zoom < 8 || x0 < 18154 || x1 >= 18528 || y0 < 9376 || y1 >= 9568)
        return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
      else
        return "http://tiles.saaristolautat.fi/" + tileDir + "/" + zoom + "/" + x + "/" + coord.y + ".png";
    }
  }

  var copyrights = {
    MML: 'Taustakartan aineisto <a href="http://www.maanmittauslaitos.fi/" target="_blank">Maanmittauslaitos</a> 12/2017',
    OSM: '© <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }

  var mapTypeCopyrights = {
    MMLTAUSTA: copyrights.OSM + ", " + copyrights.MML,
    MMLMAASTO: copyrights.OSM + ", " + copyrights.MML,
    OSM: copyrights.OSM
  }

  function setCopyrights(innerHTML) {
    if (!innerHTML) innerHTML = ""

    var control = map.controls[google.maps.ControlPosition.BOTTOM_RIGHT];
    if (control.getLength() > 0) control.pop();

    var outerdiv = document.createElement("div");
    outerdiv.style.fontSize = "11px";
    outerdiv.style.whiteSpace = "nowrap";
    outerdiv.style.padding = "2px";
    var copyright = document.createElement("span");
    copyright.style.color = "#000";
    copyright.style.background="#fff";
    copyright.style.opacity =0.8;
    copyright.innerHTML = innerHTML;
    outerdiv.appendChild(copyright);
    control.push(outerdiv);
  }  

  //Define OSM map type pointing at the OpenStreetMap tile server
  map.mapTypes.set("OSM", new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var tilesPerGlobe = 1 << zoom;
      var x = coord.x % tilesPerGlobe;
      if (x < 0) {
        x = tilesPerGlobe+x;
      }

      return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "OpenStreetMap",
    maxZoom: 15
  }));

  //Define OSM map type pointing at the OpenStreetMap tile server
  map.mapTypes.set("MMLTAUSTA", new google.maps.ImageMapType({
    getTileUrl: createGetMMLTileUrl("taustakartta"),
    tileSize: new google.maps.Size(256, 256),
    name: "MML tausta",
    minZoom: 4,
    maxZoom: 15,
    opacity: 1
  }));


  //Define OSM map type pointing at the OpenStreetMap tile server
  map.mapTypes.set("MMLMAASTO", new google.maps.ImageMapType({
    getTileUrl: createGetMMLTileUrl("peruskartta"),
    tileSize: new google.maps.Size(256, 256),
    name: "MML maasto",
    minZoom: 4,
    maxZoom: 15,
    opacity: 1,
    copyright: "testi"
  }));

  map.addListener('maptypeid_changed', function() {
    setCopyrights(mapTypeCopyrights[map.getMapTypeId()]);
  });
}

// ----------

// Define a symbol using SVG path notation, with an opacity of 1.
var lauttaLineSymbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 0.4,
  strokeColor: '#e08080',
  scale: 1.5
};

var lauttaLineSymbolDimmed = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 0.4,
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
  this.isSelected = false;
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
    strokeColor: '#f97cdc',
    visible: false,
    map: map,
  });
  this.routes = [];
  var that = this;
  this.line.addListener('click', function(event) {
    select(that.routes, event);
  });
  this.rerender = function(zoom, mapTypeId) {
    this.line.setVisible(this.isSelected || (layers.longdistanceferries && zoom >= 7 && zoom <= 11));
    this.line.setOptions({icons: [{
      icon: zoom <= 9? lauttaLineSymbol: lauttaLineSymbolDimmed,
      offset: '4',
      repeat: '4px'
    }]})
    if (!this.line.getVisible()) this.highlightLine.setVisible(false);
  }
}

Leg.prototype.highlight = function(doHighlight) {
  this.isSelected = doHighlight;
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
    this.details = description(object);
    this.operatorId = this.operators[0];
    this.operator = fdata.lauttaOperators[this.operatorId];
    this.style = { color: "#e08080", weight: 1.5, style: "dotted", opacity: .7 };
  }
  this.init();
}

Route.prototype.highlight = function(doHighlight) {
  this.legs.forEach(function(leg) { leg.highlight(doHighlight); });
}

Route.prototype.rerender = function(zoom, mapTypeId) {
  this.legs.forEach(function(leg) { leg.rerender(zoom, mapTypeId); });
}

function initRoutes() {
  lauttaLegs = fdata.lauttaLegs.map(function(leg) {
    return new Leg(leg);
  });

  lauttaLegIndex = {};
  lauttaLegs.forEach(function(leg) { lauttaLegIndex[leg.id] = leg});

  lauttaRoutes = fdata.lauttaRoutes.map(function(route) {
    route = new Route(route);
    route.legs.forEach(function(leg) { leg.addRoute(route); });
    return route;
  });  
}

