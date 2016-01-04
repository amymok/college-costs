'use strict';

var financialModel = require( './models/financial-model' );
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );

require( './utils/nemo' );
require( './utils/nemo-shim' );

var app = {
  init: function() {
  	// TODO: Draw in settlement vs non, depending on how we decide to do that.
  	// Until then, show only the settlement view.
  	settlementView.init();
    financialModel.init();
    financialView.init();
    // Placeholder to set bar graphs
    metricView.demo();
  }
};

$( document ).ready( function() {
  app.init();
} );
