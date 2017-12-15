(function() {
  'use strict';

  require('./index.scss');
  if (IS_DEV) {
    require('./bootstrap_inject.scss');
  }

  require('./module/templates.module.js');
  require('./module/ue-locks.module.js');
  require('./module/localizations.config.js');

  var context = require.context('./module/components', true, /\.js$/);
  context.keys().forEach(context);
  context = require.context('./module/services', true, /\.js$/);
  context.keys().forEach(context);
})();