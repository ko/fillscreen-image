'use strict';

exports.FillscreenImage = function FillscreenImage(json, domExists) {
  var _this = this;

  this.domExists = domExists;
  this.defaultWindow = {
    innerHeight: 800,
    innerWidth: 800
  };
  this.state = {
    windowHeight: this.domExists ? window.innerHeight : this.defaultWindow.innerHeight,
    windowWidth: this.domExists ? window.innerWidth : this.defaultWindow.innerWidth
  };

  this.actions = {
    generateScaleFactor: function generateScaleFactor(image) {
      var imageHeight = image.width / image.ratio;
      var imageWidth = image.width;
      var windowToImageHeightRatio = _this.state.windowHeight / imageHeight;
      var windowToImageWidthRatio = _this.state.windowWidth / imageWidth;
      var scaleFactor = imageWidth * windowToImageHeightRatio < _this.state.windowWidth ? windowToImageWidthRatio : windowToImageHeightRatio;

      return scaleFactor;
    },
    normalizeToWindowHeight: function normalizeToWindowHeight(style) {
      var localStyle = JSON.parse(JSON.stringify(style));
      var imageHeight = _this.image.width / _this.image.ratio;
      var imageWidth = _this.image.width;
      var scaleFactor = _this.actions.generateScaleFactor(_this.image);
      var displayWidth = imageWidth * scaleFactor;
      var displayHeight = imageHeight * scaleFactor;

      localStyle.height = displayHeight + 'px';
      localStyle.width = displayWidth + 'px';

      return localStyle;
    },
    fixLeftMarginToFocusPoint: function fixLeftMarginToFocusPoint(style, image) {
      var localStyle = JSON.parse(JSON.stringify(style));
      var imageWidth = image.width;
      var imageFocusX = image.focus.x;
      var scaleFactor = _this.actions.generateScaleFactor(_this.image);
      var displayWidth = imageWidth * scaleFactor;
      var scaleFocusX = imageFocusX * scaleFactor;
      var windowHalfWidth = _this.state.windowWidth / 2;
      var scaleFocusXFromHalf = windowHalfWidth - scaleFocusX;

      var marginLeft = scaleFocusXFromHalf < 0 ? scaleFocusXFromHalf : 0;

      // fix whitespace showing
      var visibleWidth = displayWidth - Math.abs(marginLeft);
      var visibleWhitespace = _this.state.windowWidth - visibleWidth;

      var left = visibleWidth < _this.state.windowWidth ? visibleWhitespace : 0;

      localStyle.marginLeft = marginLeft + 'px';
      localStyle.left = left + 'px';

      return localStyle;
    },
    fixTopMarginToFocusPoint: function fixTopMarginToFocusPoint(style, image) {
      var localStyle = JSON.parse(JSON.stringify(style));
      var imageHeight = image.width / image.ratio;
      var imageFocusY = image.focus.y;
      var scaleFactor = _this.actions.generateScaleFactor(_this.image);
      var displayHeight = imageHeight * scaleFactor;
      var scaleFocusY = imageFocusY * scaleFactor;
      var windowHalfHeight = _this.state.windowHeight / 2;
      var scaleFocusYFromHalf = windowHalfHeight - scaleFocusY;

      var marginTop = scaleFocusYFromHalf < 0 ? scaleFocusYFromHalf : 0;

      // fix whitespace showing
      var visibleHeight = displayHeight - Math.abs(marginTop);
      var visibleWhitespace = _this.state.windowHeight - visibleHeight;

      var top = visibleHeight < _this.state.windowHeight ? visibleWhitespace : 0;

      localStyle.marginTop = marginTop + 'px';
      localStyle.top = top + 'px';

      return localStyle;
    },
    updatePhotoDisplay: function updatePhotoDisplay(domExists) {
      var localStyle = JSON.parse(JSON.stringify(_this.style));

      localStyle = _this.actions.normalizeToWindowHeight(localStyle);
      localStyle = _this.actions.fixLeftMarginToFocusPoint(localStyle, _this.image);
      localStyle = _this.actions.fixTopMarginToFocusPoint(localStyle, _this.image);

      // console.log(localStyle);
      _this.style = JSON.parse(JSON.stringify(localStyle));
    }
  };

  this.style = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: '0',
    marginLeft: '0',
    top: '0',
    marginTop: '0',

    /* TODO: make optional in constructor */
    transitionProperty: 'opacity, transform',
    transitionDuration: '3s, 10s',
    transformOrigin: 'bottom left'
  };

  var defaultImage = {
    visible: false,
    ratio: 0,
    width: 0,
    height: 0,
    focus: {
      x: 0,
      y: 0
    }
  };
  this.image = json === undefined ? defaultImage : json;

  this.state.windowHeight = this.domExists ? window.innerHeight : this.defaultWindow.innerHeight;
  this.state.windowWidth = this.domExists ? window.innerWidth : this.defaultWindow.innerWidth;

  this.actions.updatePhotoDisplay(this.domExists);
};