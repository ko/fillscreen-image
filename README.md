# What

Given a metadata about an image and a window, we can
adjust what portion of the image is viewable within
the viewport. 

# Props

|Key|Value|
|---|---|
|json|imageType|
|domExists|boolean|

```
imageType = {
  visible: boolean,
  ratio: float,
  width: int,
  height: int,
  focus: {
    x: int,
    y: int,
  },
}
```

# Server Side Rendering

For SSR purposes, the default window is expected to be 800x800. You will need to update this on ```componentDidMount()``` (for instance) to get accurate window dimension readings.
