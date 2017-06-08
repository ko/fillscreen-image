exports.FillscreenImage = function FillscreenImage(json, domExists) {  
    this.domExists = domExists;
    this.defaultWindow = {
      innerHeight: 800,
      innerWidth: 800,
    };
    this.state = {
      windowHeight: this.domExists ? window.innerHeight : this.defaultWindow.innerHeight,
      windowWidth: this.domExists ? window.innerWidth : this.defaultWindow.innerWidth,
    };

    this.actions = {
      generateScaleFactor: (image) => {
        const imageHeight = image.width / image.ratio;
        const imageWidth = image.width;
        const windowToImageHeightRatio = this.state.windowHeight / imageHeight;
        const windowToImageWidthRatio = this.state.windowWidth / imageWidth;
        const scaleFactor = imageWidth * windowToImageHeightRatio < this.state.windowWidth ? 
                            windowToImageWidthRatio : windowToImageHeightRatio;

        return scaleFactor;
      },
      normalizeToWindowHeight: (style) => {
        const localStyle = JSON.parse(JSON.stringify(style));
        const imageHeight = this.image.width / this.image.ratio;
        const imageWidth = this.image.width;
        const scaleFactor = this.actions.generateScaleFactor(this.image);
        const displayWidth = imageWidth * scaleFactor;
        const displayHeight = imageHeight * scaleFactor;

        localStyle.height = `${displayHeight}px`;
        localStyle.width = `${displayWidth}px`;

        return localStyle;
      },
      fixLeftMarginToFocusPoint: (style, image) => {
        const localStyle = JSON.parse(JSON.stringify(style));
        const imageWidth = image.width;
        const imageFocusX = image.focus.x;
        const scaleFactor = this.actions.generateScaleFactor(this.image);
        const displayWidth = imageWidth * scaleFactor;
        const scaleFocusX = imageFocusX * scaleFactor;
        const windowHalfWidth = this.state.windowWidth / 2;
        const scaleFocusXFromHalf = windowHalfWidth - scaleFocusX;

        const marginLeft = scaleFocusXFromHalf < 0 ? scaleFocusXFromHalf : 0;

        // fix whitespace showing
        const visibleWidth = displayWidth - Math.abs(marginLeft);
        const visibleWhitespace = this.state.windowWidth - visibleWidth;

        const left = visibleWidth < this.state.windowWidth ? visibleWhitespace : 0;

        localStyle.marginLeft = `${marginLeft}px`;
        localStyle.left = `${left}px`;

        return localStyle;
      },
      fixTopMarginToFocusPoint: (style, image) => {
        const localStyle = JSON.parse(JSON.stringify(style));
        const imageHeight = image.width / image.ratio;
        const imageFocusY = image.focus.y;
        const scaleFactor = this.actions.generateScaleFactor(this.image);
        const displayHeight = imageHeight * scaleFactor;
        const scaleFocusY = imageFocusY * scaleFactor;
        const windowHalfHeight = this.state.windowHeight / 2;
        const scaleFocusYFromHalf = windowHalfHeight - scaleFocusY;

        const marginTop = scaleFocusYFromHalf < 0 ? scaleFocusYFromHalf : 0

        // fix whitespace showing
        const visibleHeight = displayHeight - Math.abs(marginTop);
        const visibleWhitespace = this.state.windowHeight - visibleHeight;

        const top = visibleHeight < this.state.windowHeight ? visibleWhitespace : 0;

        localStyle.marginTop = `${marginTop}px`;
        localStyle.top = `${top}px`;

        return localStyle;
      },
      updatePhotoDisplay: (domExists) => {
        let localStyle = JSON.parse(JSON.stringify(this.style));

        localStyle = this.actions.normalizeToWindowHeight(localStyle);
        localStyle = this.actions.fixLeftMarginToFocusPoint(localStyle, this.image);
        localStyle = this.actions.fixTopMarginToFocusPoint(localStyle, this.image);

        // console.log(localStyle);
        this.style = JSON.parse(JSON.stringify(localStyle));
      },
    }

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
      transformOrigin: 'bottom left',
    };
    
    const defaultImage = {
      visible: false,
      ratio: 0,
      width: 0,
      height: 0,
      focus: {
        x: 0,
        y: 0,
      },
    };
    this.image = json === undefined ? defaultImage : json;

    this.state.windowHeight = this.domExists ? window.innerHeight : this.defaultWindow.innerHeight;
    this.state.windowWidth = this.domExists ? window.innerWidth : this.defaultWindow.innerWidth;

    this.actions.updatePhotoDisplay(this.domExists);
};
