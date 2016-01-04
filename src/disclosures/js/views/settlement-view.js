'use strict';

var verifyOffer = require( '../dispatchers/verify-offer' );

var settlementView = {

  getPageElements: function() {

    var $wrapper = $( '.understanding-financial-aid-offer' );

    return {
      $wrapper:                 $wrapper,
      $verify:                  $wrapper.getElementsByClassName( 'verify' ),
      $correctInfoButton:       $wrapper.getElementsByTagName(
        'button[title="Yes, this information is correct"]' ),
      $incorrectInfoButton:     $wrapper.getElementsByTagName(
        'button[title="No, this is not my information"]' ),
      $correctInfoInstructions: $wrapper.getElementsByClassName(
        'instructions_content__right' ),
      $incorrectInfoInstructions: $wrapper.getElementsByClassName(
        'instructions_content__wrong' ),
      $review:              $wrapper.getElementsByClassName( 'review' ),
      $evaluate:            $wrapper.getElementsByClassName( 'evaluate' ),
      $question:            $wrapper.getElementsByClassName( 'question' ),
      $getoptions:          $wrapper.getElementsByClassName( 'get-options' ),
      $nextsteps:           $wrapper.getElementsByClassName( 'next-steps' )
    };

  },

  init: function() {

    var $settlementPage = this.getPageElements();

    // Make sure only intro and verification areas are showing.
    $settlementPage.verify.show();
    $settlementPage.review.hide();
    $settlementPage.evaluate.hide();
    $settlementPage.question.hide();
    $settlementPage.getoptions.hide();
    $settlementPage.nextsteps.hide();
  }

};

module.exports = settlementView;
