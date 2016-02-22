'use strict';

var fetch = require( './dispatchers/get-api-values' );
var financialModel = require( './models/financial-model' );
var schoolModel = require( './models/school-model' );
var financialView = require( './views/financial-view' );
var metricView = require( './views/metric-view' );
var linksView = require( './views/links-view' );

require( './utils/nemo' );
require( './utils/nemo-shim' );
require( './utils/print-page' );

var app = {
  init: function() {
  // jquery promise to delay full model creation until ajax resolves
    $.when( fetch.constants() ).done( function( resp ) {
      schoolModel.init();
      financialModel.init( resp );
      financialView.init();
      // Placeholder to set bar graphs
      metricView.demo();
      linksView.init();
    } );

    $.when( fetch.schoolData( '408039' ) ).done( function( resp ) {
      console.log( 'response', resp );
    } );
    $.when( fetch.programData( '408039-981' ) ).done( function( resp ) {
      console.log( 'response', resp );
    } );
  }
};

$( document ).ready( function() {
  app.init();
} );
