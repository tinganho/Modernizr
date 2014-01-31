define(['tests', 'Modernizr', 'classes', 'is'], function( tests, Modernizr, classes, is ) {

  // Async test doesn't send any unique identifier (name).
  // So we need to extract it from the function string
  function getFeatureName(fn) {
    var name = /addTest\((['|"])(\w*?)\1/g.exec(fn);
    if(name !== null) return name[2];
    return null;
  };

  // Run through all tests and detect their support in the current UA.
  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for ( var featureIdx in tests ) {
      featureNames = [];
      feature = tests[featureIdx];

      if(feature.name) {
        console.time(feature.name);
      }

      //   run the test, throw the return value into the Modernizr,
      //   then based on that boolean, define an appropriate className
      //   and push it into an array of classes we'll join later.
      //
      //   If there is no name, it's an 'async' test that is run,
      //   but not directly added to the object. That should
      //   be done with a post-run addTest call.
      if (feature.name !== null) {
        featureNames.push(feature.name.toLowerCase());

        if (feature.options && feature.options.aliases && feature.options.aliases.length) {
          // Add all the aliases into the names list
          for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
            featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
          }
        }
      }

      // Any cached async test is stored in key value store
      // where key is function string and value is the feature name
      if(feature.name === null) {
        var _name = getFeatureName(feature.fn);
        if (_name && _name in Modernizr._cache) {
          feature.name = _name;
          featureNames.push(feature.name.toLowerCase());
          console.time(feature.name);
        }
      }


      // Get the cached value and if there is nothing cached run the test
      if (feature.name !== null && feature.name in Modernizr._cache) {
        result = Modernizr._cache[feature.name];
      } else {
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;
      }

      // Set each of the names on the Modernizr object
      for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
        featureName = featureNames[nameIdx];
        // Support dot properties as sub tests. We don't do checking to make sure
        // that the implied parent tests have been added. You must call them in
        // order (either in the test, or make the parent test a dependency).
        //
        // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
        // hashtag famous last words
        featureNameSplit = featureName.split('.');

        if (featureNameSplit.length === 1) {
          if (is(result, 'boolean') || result instanceof Boolean) {
            Modernizr[featureNameSplit[0]] = result;
          } else if (is(result, 'object') && Modernizr._config.parentJSONPointer in result) {
            // The result is stored as a normal object literal. We want to convert it
            // to a Boolean object with additional properties.
            Modernizr[featureNameSplit[0]] = new Boolean(result[Modernizr._config.parentJSONPointer]);
            for (var prop in result) {
              if(hasOwnProp(result, prop)) {
                Modernizr[featureNameSplit[0]][prop] = result[prop];
              }
            }
          }

          // We need to set the parent pointer
          if (result instanceof Boolean) {
            // We convert a Boolean instance to an object literal with
            // a parent JSON pointer
            Modernizr._cache[featureNameSplit[0]] = {};
            for (var prop in result) {
              if(hasOwnProp(result, prop)) {
                Modernizr._cache[featureNameSplit[0]][prop] = result[prop];
              }
            }
            if(result) {
              Modernizr._cache[featureNameSplit[0]][Modernizr._config.parentJSONPointer] = true;
            } else {
              Modernizr._cache[featureNameSplit[0]][Modernizr._config.parentJSONPointer] = false;
            }
          } else {
            Modernizr._cache[featureNameSplit[0]] = result;
          }
        } else if (featureNameSplit.length === 2) {
          Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          Modernizr._cache[featureNameSplit[0]][featureNameSplit[1]] = result;
        }

        classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
      }

      if(feature.name) {
        console.timeEnd(feature.name);
      }
    }
  }

  Modernizr._q.push(function() {
    if(!Modernizr.localstorage) return;

    var interval = setInterval( function () {
      if (document.readyState !== 'complete') return;
      clearInterval(interval);
      Modernizr.setCache();
    }, 200);
  });

  return testRunner;
});
