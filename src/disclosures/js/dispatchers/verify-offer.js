'use strict';

var financialModel = require( '../models/financial-model' );
var settlementView = require( '../views/settlement-view' );
var financialView = require( '../views/financial-view' );

var verifyOffer = {

  reportIncorrectOffer: function() {
    // Inform the student about contacting the school
    // Inform the school about the incorrect aid offer
  },

  confirmCorrectOffer: function() {
    // Display the section for reviewing the aid offer
    // Hide the verification buttons
    // Hide the "verify that the below info" paragraph
    // Populate cost of attendance fields
    // Populate the graduation rate graph
    // Populate the estimated monthly living expenses
    // Populate the debt burden equation
    // Populate the total debt after graduation graph
    // Populate the loan default rate graph
    // Scroll to start of review section
  },

  init: function() {


  }

};

module.exports = verifyOffer;
