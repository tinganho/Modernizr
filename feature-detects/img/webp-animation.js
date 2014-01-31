/*!
{
  "name": "Webp Animation",
  "async": true,
  "property": "webpanimation",
  "aliases": ["webp-animation"],
  "tags": ["image"],
  "authors": ["Krister Kari", "Rich Bradshaw", "Ryan Seddon", "Paul Irish"],
  "notes": [{
    "name": "WebP Info",
    "href": "http://code.google.com/speed/webp/"
  },{
    "name": "Chormium blog - Chrome 32 Beta: Animated WebP images and faster Chrome for Android touch input",
    "href": "http://blog.chromium.org/2013/11/chrome-32-beta-animated-webp-images-and.html"
  }]
}
!*/
/* DOC

Tests for animated webp support.

*/
define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  Modernizr.addAsyncTest(function(){
    // Profiling
    console.time('webpanimation');
    var image = new Image();

    image.onerror = function() {
      addTest('webpanimation', false, { aliases: ['webp-animation'] });
    };

    image.onload = function() {
      addTest('webpanimation', image.width == 1, { aliases: ['webp-animation'] });
    };

    image.src = 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';
  });
});
