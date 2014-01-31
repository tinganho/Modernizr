define(['tests'], function ( tests ) {
  var ModernizrProto = {
    // The current version, dummy
    _version: 'v3.0.0pre',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      classPrefix : '',
      enableClasses : true,
      usePrefixes : true,
      localStorageName : 'modernizr_cache',
      parentJSONPointer : '__parent__'
    },

    // Localstorage cache
    _cache : {},

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function( test, cb ) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for
      // actual async tests. This is in case people listen to
      // synchronous tests. I would leave it out, but the code
      // to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      setTimeout(function() {
        cb(this[test]);
      }, 0);
    },

    addTest: function( name, fn, options ) {
      tests.push({name : name, fn : fn, options : options });
    },

    addAsyncTest: function (fn) {
      tests.push({name : null, fn : fn});
    },

    getCache : function() {
      try {
        var cache = JSON.parse(localStorage.getItem(Modernizr._config.localStorageName));
        return cache === null ? {} : cache;
      } catch(e) {
        return {};
      }
    },

    setCache : function() {
      localStorage.setItem(Modernizr._config.localStorageName, JSON.stringify(Modernizr._cache));
    }
  };

  return ModernizrProto;
});
