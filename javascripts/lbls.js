
// lbls for google maps
// (c) Kyösti Ranto

var lbls = {};

// call this after google maps loaded
lbls.init = function(canvasElementId) {

  var canvas = document.getElementById(canvasElementId);
  var context = canvas.getContext('2d');
  context.font = 'bold 12px sans-serif';

  var directions = { 'N': {y: -1, x: 0}, 'NE': {y: -1, x: 1}, 'E': {y: 0, x: 1}, 'SE': {y: 1, x: 1},
      'S': {x: 0, y: 1}, 'SW': {x: -1, y: 1}, 'W': {x: -1, y: 0}, 'NW': {x: -1, y: -1}, 'C': {x: 0, y: 0}};

  function calculateLabelBox(label, labelAnchor, padding) {
    context.font = label.fontWeight + ' ' + label.fontSize + ' ' + label.fontFamily;
    var box = {height: parseInt(label.fontSize) + 2*padding, width: context.measureText(label.text).width + 2*padding};
    var direction = labelAnchor.dir? directions[labelAnchor.dir]: directions['C'];
    box.x = direction.x * box.width/2 + labelAnchor.x;
    box.y = direction.y * box.height/2 + labelAnchor.y;
    return box;
  }

  var backgroundPresets = {
    'default': {
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 1,
      fillColor: '#FFFFFF',
      fillOpacity: 0.5,
      padding: 0
    },
    'none': {
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 1,
      fillColor: '#FFFFFF',
      fillOpacity: 0,
      padding: 0
    },
    'white': {
      strokeColor: '#000000',
      strokeOpacity: 0,
      strokeWeight: 1,
      fillColor: '#FFFFFF',
      fillOpacity: 1,
      padding: 0
    },
  };

  function sanitizeBackgroundOptions(options) {
    var result = {};
    var defaults = backgroundPresets.default;
    if (typeof options === 'string') {
      if (options in backgroundPresets) {
        defaults = backgroundPresets[options];
      }
      options = {};
    } else if (typeof options === 'undefined') {
      options = {};
    }
    Object.keys(defaults).forEach(function(key) {
      result[key] = (key in options)? options[key]: defaults[key];
    });
    return result;
  }
   
  function sanitizeLabelAnchor(anchor) {
    anchor = anchor? anchor: {};
    anchor.dir = anchor.dir || 'C';
    anchor.x = typeof anchor.x !== 'number'? 0: anchor.x;
    anchor.y = typeof anchor.y !== 'number'? 0: anchor.y;
    return anchor;
  }
   
  function createLabelBackgroundImage(box, options) {
    var x1 = box.width/2;
    var y1 = box.height/2;
    var labelBackgroundImage = {
      path: 'M ' + (-x1+box.x) + ',' + (-y1+box.y) + ' ' + (x1+box.x) + ',' + (-y1+box.y) + ' ' + 
      (x1+box.x) + ',' + (y1+box.y) + ' ' + (-x1+box.x) + ',' + (y1+box.y) + ' Z',
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight,
      fillColor: options.fillColor,
      fillOpacity: options.fillOpacity,
      labelOrigin: {x: box.x, y: box.y}
    };
    return labelBackgroundImage;
  }

  function Label(options) {
    this.labelAnchor = sanitizeLabelAnchor(options.labelAnchor);
    this.background = sanitizeBackgroundOptions(options.background);
    this.box = calculateLabelBox(options.label, this.labelAnchor, 0);
    google.maps.Marker.call(this, {
      anchorpoint: options.anchorpoint,
      animation: options.animation,
      attribution: options.attribution,
      clickable: options.clickable,
      crossOnDrag: options.crossOnDrag,
      cursor: options.cursor,
      draggable: options.draggable,
      icon: createLabelBackgroundImage(this.box, this.background),
      label: options.label,
      map: options.map,
      opacity: options.opacity,
      optimized: options.optimized,
      place: options.place,
      position: options.position,
      shape: options.shape,
      title: options.title,
      visible: options.visible,
      zIndex: options.zIndex,
      clickable: options.clickable,
    });
  }

  Label.prototype = Object.create(google.maps.Marker.prototype);
  Label.prototype.setLabel = function(label) {
    google.maps.Marker.prototype.setLabel.call(this, label);
    this.box = calculateLabelBox(label, this.labelAnchor, this.background.padding);
    this.setIcon(createLabelBackgroundImage(this.box, this.background));
  }
  Label.prototype.setLabelAnchor = function(labelAnchor) {
    this.labelAnchor = sanitizeLabelAnchor(labelAnchor);
    this.box = calculateLabelBox(this.label, this.labelAnchor, this.background.padding);
    this.setIcon(createLabelBackgroundImage(this.box, this.background));
  }
  Label.prototype.getLabelAnchor = function() {
    return this.labelAnchor;
  }
  Label.prototype.getBackground = function() {
    return this.background;
  }
  Label.prototype.setBackground = function(background) {
    this.background = sanitizeBackgroundOptions(background);
    this.box = calculateLabelBox(this.label, this.labelAnchor, this.background.padding);
    this.setIcon(createLabelBackgroundImage(this.box, this.background));
  }

  lbls.Label = Label;
}
