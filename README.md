# Tiny HTML5 Audio Player

An HTML5 audio player with a very small footprint (2.3kb for the JavaScript minified and 1.3kb for the SWF). Fallback support is provided by an equally small Flash player.

## Features

* Supports all modern browsers with the <audio> tag.
* Falls back to a Flash player for older browsers.
* Browsers without Flash support will be given a simple link.
* Shared JavaScript, CSS and image assets makes it simple to customize the player while maintaing a consistent experience.

## Demo

http://ten1seven.github.com/html5audio

## Results (compared to jPlayer)

* Uses ExternalInterface to send/receive data from Flash SWF
* JavaScript: 2.38KB minified (jPlayer: 41.85KB)
* SWF: 1.37KB (jPlayer: 8.25KB)