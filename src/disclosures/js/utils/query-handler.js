'use strict';

var stringToNum = require( './handle-string-input.js' );

/**
 * Handles URL questy string to turn key-value pairs into an object.
 * @param  {string} queryString - The query string of a url (location.search)
 * @returns {object} - An object containing key-value pairs from the query
 */
function queryHandler( queryString ) {
  var valuePairs = {};
  var parameters = {};
  var numericKeys = [
    'iped', 'pid', 'tuit', 'hous', 'book', 'tran', 'othr',
    'pelg', 'schg', 'stag', 'othg', 'mta', 'gib', 'fam', 'wkst', 'parl',
    'perl', 'subl', 'unsl', 'ppl', 'gpl', 'prvl', 'prvi', 'insl', 'insi', 'sav'
  ];
  var keyMaps = {
    iped: 'collegeID',
    pid:  'programID',
    oid:  'offerID',
    tuit: 'tuitionFees',
    hous: 'roomBoard',
    book: 'books',
    tran: 'transportation',
    othr: 'otherExpenses',
    pelg: 'pell',
    schg: 'schoolGrants',
    stag: 'stateGrants',
    othg: 'otherScholarships',
    mta:  'militaryTuitionAssistance',
    gib:  'GIBill',
    fam:  'family',
    wkst: 'workstudy',
    parl: 'parentLoan',
    perl: 'perkins',
    subl: 'directSubsidized',
    unsl: 'directUnsubsidized',
    ppl:  'parentPlus',
    gpl:  'gradPlus',
    prvl: 'privateLoan',
    prvi: 'privateLoanRate',
    insl: 'institutionalLoan',
    insi: 'institutionalLoanRate'
  };

  /**
   * Helper function for checking that expected numeric values are indeed numeric
   * @param {string} key - The key to be checked
   * @param {string|number} value - The value of the key
   * @returns {string|number} newValue - The corrected value of the key
   */
  function checkValue( key, value ) {
    var newValue = value;

    if ( numericKeys.indexOf( key ) !== -1 ) {
      newValue = stringToNum( value );
    }

    return newValue;
  }

  /**
   * Helper function which decodes key-value pairs from the URL
   * Has no parameters, but relies on the queryString passed to its parent function
   */
  function getPairs() {
    var pair;
    var regex = /[?&]?([^=]+)=([^&]*)/g;

    queryString.split( '+' ).join( ' ' );

    while ( pair = regex.exec( queryString ) ) {
      var key = decodeURIComponent( pair[1] );
      var value = decodeURIComponent( pair[2] );

      value = checkValue( key, value );
      parameters[key] = value || 0;
    }
  }

  /**
   * Helper function which maps the parameters object using the keyMaps
   */
  function remapKeys() {
    for ( var key in parameters ) {
      if ( keyMaps.hasOwnProperty( key ) ) {
        var newKey = keyMaps[key];
        valuePairs[newKey] = parameters[key];
      }
    }
  }
  getPairs();
  remapKeys();
  // move private loan properties to privateLoanMulti
  valuePairs.privateLoanMulti = [
    { amount: valuePairs.privateLoan || 0,
      rate:   valuePairs.privateLoanRate / 100 || 0.079,
      fees:   0,
      deferPeriod: 6 }
  ];
  delete valuePairs.privateLoan;
  delete valuePairs.privateLoanRate;
  // family contributions = parent loan + parentPLUS loan
  valuePairs.family = valuePairs.parentLoan + valuePairs.parentPlus;
  // zero parentPlus so that student-debt-calc doesn't use it
  valuePairs.parentPlus = 0;
  valuePairs.institutionalLoanRate /= 100;
  return valuePairs;
}

module.exports = queryHandler;
