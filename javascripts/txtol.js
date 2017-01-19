var txtol = {};

// call this after google maps loaded
txtol.init = function() {

  var directions = { 'N': {y: -1, x: -0.5}, 'NE': {y: -1, x: 0}, 'E': {y: -0.5, x: 0}, 'SE': {y: 0, x: 0},
      'S': {x: -0.5, y: 0}, 'SW': {x: -1, y: 0}, 'W': {x: -1, y: -0.5}, 'NW': {x: -1, y: -1}, 'C': {x: -0.5, y: -0.5}};

  function sanitizeAnchor(anchor) {
    anchor = anchor? anchor: {};
    anchor.dir = anchor.dir || 'C';
    anchor.x = typeof anchor.x !== 'number'? 0: anchor.x;
    anchor.y = typeof anchor.y !== 'number'? 0: anchor.y;
    return anchor;
  }

    function TxtOverlay(pos, txt, cls, map, anchor) {

      // Now initialize all properties.
      this.pos = pos;
      this.txt_ = txt;
      this.cls_ = cls;
      this.map_ = map;

      anchor = sanitizeAnchor(anchor);
      this.offset_ = { kx: directions[anchor.dir].x, ky: directions[anchor.dir].y, x: anchor.x, y: anchor.y};

      // We define a property to hold the image's
      // div. We'll actually create this div
      // upon receipt of the add() method so we'll
      // leave it null for now.
      this.div_ = null;

      // Explicitly call setMap() on this overlay
      this.setMap(map);
    }

    TxtOverlay.prototype = new google.maps.OverlayView();



    TxtOverlay.prototype.onAdd = function() {

      // Note: an overlay's receipt of onAdd() indicates that
      // the map's panes are now available for attaching
      // the overlay to the map via the DOM.

      // Create the DIV and set some basic attributes.
      var div = document.createElement('DIV');
      div.className = this.cls_;

      div.innerHTML = this.txt_;

      // Set the overlay's div_ property to this DIV
      this.div_ = div;

      this.draw();

      // We add an overlay to a map via one of the map's panes.

      var panes = this.getPanes();
      // panes.floatPane.appendChild(div);

      //add element to clickable layer 
      this.getPanes().overlayMouseTarget.appendChild(div);
      this.draw();

      // set this as locally scoped var so event does not get confused
      var me = this;

      // Add a listener - we'll accept clicks anywhere on this div, but you may want
      // to validate the click i.e. verify it occurred in some portion of your overlay.
      google.maps.event.addDomListener(div, 'click', function() {
        console.log('clicked');
        google.maps.event.trigger(me, 'click');
      });
    }
    TxtOverlay.prototype.draw = function() {


        var overlayProjection = this.getProjection();

        // Retrieve the southwest and northeast coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to resize the DIV.
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
        var div = this.div_;
        var offset = this.offset_;
        div.style.left = (position.x + offset.kx * div.offsetWidth + offset.x)+ 'px';
        div.style.top = (position.y + offset.ky * div.offsetHeight + offset.y) + 'px';
    }

    //Optional: helper methods for removing and toggling the text overlay.  
    TxtOverlay.prototype.onRemove = function() {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
    TxtOverlay.prototype.hide = function() {
      if (this.div_) {
        this.div_.style.visibility = "hidden";
      }
    }

    TxtOverlay.prototype.show = function() {
      if (this.div_) {
        this.div_.style.visibility = "visible";
      }
    }

    TxtOverlay.prototype.toggle = function() {
      if (this.div_) {
        if (this.div_.style.visibility == "hidden") {
          this.show();
        } else {
          this.hide();
        }
      }
    }

    TxtOverlay.prototype.toggleDOM = function() {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(this.map_);
      }
    }

    txtol.TxtOverlay = TxtOverlay;
}