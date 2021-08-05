# Enface Preloader

##### Preloader animation with Enface logo

## Usage

`import Preloader from '@enface/preloader'`

`<Preloader />`

## Parameters

` endPos` Number, end of axis top point, `310` by default

 `duration` Number, animation duration, `1500` by default
 
`offsetLine` Number, count of pixels that the line touches when passing, `50` by default

`dotScaleSize` Number, dot's increase size when passing the line `1.4` by default

`dotHorizontalOffset` Number, horizontal dot's offset `0.05` by default

`restartDelay` Number, how long the animation will stop after passing the line, `0` by default

`fillStyle` object with 2 keys: `first` and `second`, changing color for animation. String with rgb color.

`fillStyle = {
    first:,  'rgb(55, 164, 255)',
    second: 'rgb(255,255,255',
 }` by default
 
