'use strict';

if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}
