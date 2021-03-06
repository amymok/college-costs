'use strict';

var settlementAidOfferPage = function( url ) {
    if ( typeof url !== 'undefined' ) {
      browser.get( url )
    }
    else {
      browser.get( 'http://localhost:8000/paying-for-college2/understanding-your-financial-aid-offer/offer/?iped=408039&pid=981&oid=f38283b5b7c939a058889f997949efa566c616c5&tuit=38976&hous=3000&book=650&tran=500&othr=500&pelg=1500&schg=2000&stag=2000&othg=100&ta=3000&mta=3000&gib=3000&wkst=3000&parl=14000&perl=3000&subl=15000&unsl=2000&ppl=1000&gpl=1000&prvl=3000&prvi=4.55&insl=3000&insi=4.55' );
    }
};

settlementAidOfferPage.prototype = Object.create({}, {
    verifySection: {
      get: function() {
        return element( by.css( '.verify_wrapper' ) );
      }
    },
    correctInfoButton: {
      get: function() {
        return element ( by.css( 'a[title="Yes, this information is correct"]' ) );
      }
    },
    incorrectInfoButton: {
      get: function() {
        return element( by.css( 'a[title="No, this is not my information"]' ) );
      }
    },
    confirmVerification: {
      value: function() {
        this.correctInfoButton.click();
      }
    },
    denyVerification: {
      value: function() {
        this.incorrectInfoButton.click();
      }
    },
    correctInfoSection: {
      get: function() {
        return element( by.id( 'info-right' ) );
      }
    },
    incorrectInfoSection: {
      get: function() {
        return element( by.id( 'info-wrong' ) );
      }
    },
    programLengthSelect: {
      get: function() {
        return element ( by.css( '#estimated-years-attending' ) );
      }
    },
    setProgramLength: {
      value: function( length ) {
        return this.programLengthSelect.element( by.css( '[value="' + length + '"]') ).click();
      }
    },
    // Step 1: Review your first year offer
    reviewSection: {
      get: function() {
        return element( by.css( '.review' ) );
      }
    },
    schoolName: {
      get: function() {
        return element( by.id( 'intro__school-name' ) );
      }
    },
    tuitionFeesCosts: {
      get: function() {
        return element( by.id( 'costs__tuition' ) );
      }
    },
    setTuitionFeesCosts: {
      value: function( tuition ) {
        this.tuitionFeesCosts.clear();
        return this.tuitionFeesCosts.sendKeys( tuition );
      }
    },
    housingMealsCosts: {
      get: function() {
        return element( by.id( 'costs__room-and-board' ) );
      }
    },
    setHousingMealsCosts: {
      value: function( housing ) {
        this.housingMealsCosts.clear();
        return this.housingMealsCosts.sendKeys( housing );
      }
    },
    booksSuppliesCosts: {
      get: function() {
        return element( by.id( 'costs__books' ) );
      }
    },
    setBooksSuppliesCosts: {
      value: function( books ) {
        this.booksSuppliesCosts.clear();
        return this.booksSuppliesCosts.sendKeys( books );
      }
    },
    transportationCosts: {
      get: function() {
        return element( by.id( 'costs__transportation' ) );
      }
    },
    setTransportationCosts: {
      value: function( transportation ) {
        this.transportationCosts.clear();
        return this.transportationCosts.sendKeys( transportation );
      }
    },
    otherEducationCosts: {
      get: function() {
        return element( by.id( 'costs__other' ) );
      }
    },
    setOtherEducationCosts: {
      value: function(othercosts) {
        this.otherEducationCosts.clear();
        return this.otherEducationCosts.sendKeys( othercosts );
      }
    },
    totalCostOfAttendance: {
      get: function() {
        return element( by.id( 'summary_cost-of-attendance' ) );
      }
    },
    federalPellGrants: {
      get: function() {
        return element( by.id( 'grants__pell' ) );
      }
    },
    setFederalPellGrants: {
      value: function(pellgrant) {
        this.federalPellGrants.clear();
        return this.federalPellGrants.sendKeys(pellgrant);
      }
    },
    schoolScholarships: {
      get: function() {
        return element( by.id( 'grants__school' ) );
      }
    },
    setSchoolScholarships: {
      value: function(schoolscholarships) {
        this.schoolScholarships.clear();
        return this.schoolScholarships.sendKeys(schoolscholarships);
      }
    },
    stateScholarships: {
      get: function() {
        return element( by.id( 'grants__state' ) );
      }
    },
    setStateScholarships: {
      value: function(statescholarships) {
        this.stateScholarships.clear();
        return this.stateScholarships.sendKeys(statescholarships);
      }
    },
    otherGrantsScholarships: {
      get: function() {
        return element( by.id( 'grants__scholarships' ) );
      }
    },
    setOtherGrantsScholarships: {
      value: function(othergrants) {
        this.otherGrantsScholarships.clear();
        return this.otherGrantsScholarships.sendKeys(othergrants);
      }
    },
    totalGrantsScholarships: {
      get: function() {
        return element( by.id( 'summary_total-grants-scholarships' ) );
      }
    },
    studentTotalCost: {
      get: function() {
        return element( by.id( 'summary_total-cost' ) );
      }
    },
    studentContribution: {
      get: function() {
        return element( by.id( 'contrib__savings' ) );
      }
    },
    setStudentContribution: {
      value: function(studentcontrib) {
        this.studentContribution.clear();
        return this.studentContribution.sendKeys(studentcontrib);
      }
    },
    familyContribution: {
      get: function() {
        return element( by.id( 'contrib__family' ) );
      }
    },
    setFamilyContribution: {
      value: function(familycontrib) {
        this.familyContribution.clear();
        return this.familyContribution.sendKeys(familycontrib);
      }
    },
    workStudyContribution: {
      get: function() {
        return element( by.id( 'contrib__workstudy' ) );
      }
    },
    setWorkStudyContribution: {
      value: function(workstudy) {
        this.workStudyContribution.clear();
        return this.workStudyContribution.sendKeys(workstudy);
      }
    },
    totalContributions: {
      get: function() {
        return element( by.id( 'summary_total-contributions' ) );
      }
    },
    federalPerkinsLoans: {
      get: function() {
        return element( by.id( 'contrib__perkins' ) );
      }
    },
    setFederalPerkinsLoans: {
      value: function(perkins) {
        this.federalPerkinsLoans.clear();
        return this.federalPerkinsLoans.sendKeys(perkins);
      }
    },
    subsidizedLoans: {
      get: function() {
        return element( by.id( 'contrib__subsidized' ) );
      }
    },
    setSubsidizedLoans: {
      value: function( subsidized ) {
        this.subsidizedLoans.clear();
        return this.subsidizedLoans.sendKeys( subsidized );
      }
    },
    unsubsidizedLoans: {
      get: function() {
        return element( by.id( 'contrib__unsubsidized' ) );
      }
    },
    setUnsubsidizedLoans: {
      value: function( unsubsidized ) {
        this.unsubsidizedLoans.clear();
        return this.unsubsidizedLoans.sendKeys( unsubsidized );
      }
    },
    directPLUSLoans: {
      get: function() {
        return element( by.id( 'contrib__direct-plus' ) );
      }
    },
    setDirectPLUSLoans: {
      value: function( directplus ) {
        this.directPLUSLoans.clear();
        return this.directPLUSLoans.sendKeys( directplus );
      }
    },
    totalFederalLoans: {
      get: function() {
        return element( by.id( 'summary_total-federal-loans' ) );
      }
    },
    // TODO: Refactor this here and in the HTML/CSS for multiple private loans?
    privateLoanAmount: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="amount"]' ) );
      }
    },
    setPrivateLoanAmount: {
      value: function(privateamount) {
        this.privateLoanAmount.clear();
        return this.privateLoanAmount.sendKeys( privateamount );
      }
    },
    privateLoanInterestRate: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="rate"]' ) );
      }
    },
    setPrivateLoanInterestRate: {
      value: function( privateinterest ) {
        this.privateLoanInterestRate.clear();
        return this.privateLoanInterestRate.sendKeys( privateinterest );
      }
    },
    privateLoanFees: {
      get: function() {
        return element( by.css( '[data-private-loan] [data-private-loan_key="fees"]' ) );
      }
    },
    setPrivateLoanFees: {
      value: function( privatefees ) {
        this.privateLoanFees.clear();
        return this.privateLoanFees.sendKeys(privatefees);
      }
    },
    addPrivateLoanButton: {
      get: function() {
        return element( by.css( 'button.private-loans_add-btn' ) );
      }
    },
    paymentPlanAmount: {
      get: function() {
        return element( by.id( 'contrib__payment-plan' ) );
      }
    },
    setPaymentPlanAmount: {
      value: function(paymentamount) {
        this.paymentPlanAmount.clear();
        return this.setPaymentPlanAmount.sendKeys( paymentamount );
      }
    },
    paymentPlanInterestRate: {
      get: function() {
        return element( by.id( 'contrib__payment-plan-interest' ) );
      }
    },
    paymentPlanDueDate: {
      get: function() {
        return element( by.id( 'contrib__payment-plan-due-date' ) );
      }
    },
    totalPrivateLoansPaymentPlans: {
      get: function() {
        return element( by.id( 'summary_total-private-loans' ) );
      }
    },
    totalDebt: {
      get: function() {
        return element( by.id( 'summary_total-loans' ) );
      }
    },
    remainingCostContrib: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-after-contrib' ) );
      }
    },
    remainingCostLoans: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-after-loans' ) );
      }
    },
    remainingCostFinal: {
      get: function() {
        return element( by.id( 'summary_remaining-cost-final' ) );
      }
    },
    totalProgramDebt: {
      get: function() {
        return element( by.id( 'summary_total-program-debt' ) );
      }
    },
    totalRepayment: {
      get: function() {
        return element( by.id( 'summary_total-repayment' ) );
      }
    },
    futurePositiveRemainingCost: {
      get: function() {
        return element( by.id( 'future_remaining-cost-positive' ) );
      }
    },
    futureNegativeRemainingCost: {
      get: function() {
        return element( by.id( 'future_remaining-cost-negative' ) );
      }
    },
    futureTotalLoans: {
      get: function() {
        return element( by.id( 'future_total-loans' ) );
      }
    },
    futureYearsAttending: {
      get: function() {
        return element( by.id( 'future_years-attending' ) );
      }
    },
    futureTotalDebt: {
      get: function() {
        return element( by.id( 'future_total-debt' ) );
      }
    },
    // Metrics
    completionRate: {
      get: function() {
        return element( by.id( 'option_completion-rate' ) );
      }
    },
    jobRate: {
      get: function() {
        return element( by.id( 'criteria_job-placement-rate' ) );
      }
    },
    // Step 2: Evaluate your offer
    evaluateSection: {
      get: function() {
        return element( by.css( '.evaluate' ) );
      }
    },
    schoolGradRatePoint: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__you' ) );
      }
    },
    schoolGradRateValue: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__you .bar-graph_value' ) );
      }
    },
    nationalGradRatePoint: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__average' ) );
      }
    },
    nationalGradRateValue: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .bar-graph_point__average .bar-graph_value' ) );
      }
    },
    gradRateNotification: {
      get: function() {
        return element( by.css( '.metric.graduation-rate .metric_notification' ) );
      }
    },
    schoolSalaryPoint: {
      get: function() {
        return element( by.css( '.metric.average-salary .bar-graph_point__you' ) );
      }
    },
    schoolSalaryValue: {
      get: function() {
        return element( by.css( '.metric.average-salary .bar-graph_point__you .bar-graph_value' ) );
      }
    },
    nationalSalaryPoint: {
      get: function() {
        return element( by.css( '.metric.average-salary .bar-graph_point__average' ) );
      }
    },
    nationalSalaryValue: {
      get: function() {
        return element( by.css( '.metric.average-salary .bar-graph_point__average .bar-graph_value' ) );
      }
    },
    salaryNotification: {
      get: function() {
        return element( by.css( '.metric.average-salary .metric_notification' ) );
      }
    },
    debtBurdenPayment: {
      get: function() {
        return element( by.css( '.debt-equation [data-debt-burden="monthly-payment"]' ) );
      }
    },
    debtBurdenSalary: {
      get: function() {
        return element( by.css( '.debt-equation [data-debt-burden="monthly-salary"]' ) );
      }
    },
    debtBurdenPercent: {
      get: function() {
        return element( by.css( '.debt-equation [data-debt-burden="debt-burden"]' ) );
      }
    },
    debtBurdenNotification: {
      get: function() {
        return element( by.css( '.metric.debt-burden .metric_notification' ) );
      }
    },
    schoolDefaultRatePoint: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__you' ) );
      }
    },
    schoolDefaultRateValue: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__you .bar-graph_value' ) );
      }
    },
    nationalDefaultRatePoint: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__average' ) );
      }
    },
    nationalDefaultRateValue: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .bar-graph_point__average .bar-graph_value' ) );
      }
    },
    defaultRateNotification: {
      get: function() {
        return element( by.css( '.metric.loan-default-rates .metric_notification' ) );
      }
    },
    monthlyRent: {
      get: function() {
        return element( by.id( 'expenses__rent' ) );
      }
    },
    setMonthlyRent: {
      value: function( rentamount ) {
        this.monthlyRent.clear();
        return this.monthlyRent.sendKeys( rentamount );
      }
    },
    monthlyFood: {
      get: function() {
        return element( by.id( 'expenses__food' ) );
      }
    },
    setMonthlyFood: {
      value: function( foodamount ) {
        this.monthlyFood.clear();
        return this.monthlyFood.sendKeys( foodamount );
      }
    },
    monthlyTransportation: {
      get: function() {
        return element( by.id( 'expenses__transportation' ) );
      }
    },
    setMonthlyTransportation: {
      value: function( transportationamount ) {
        this.monthlyTransportation.clear();
        return this.monthlyTransportation.sendKeys( transportationamount );
      }
    },
    monthlyInsurance: {
      get: function() {
        return element( by.id( 'expenses__insurance' ) );
      }
    },
    setMonthlyInsurance: {
      value: function( insuranceamount ) {
        this.monthlyInsurance.clear();
        return this.monthlyInsurance.sendKeys( insuranceamount );
      }
    },
    monthlyRetirement: {
      get: function() {
        return element( by.id( 'expenses__retirement' ) );
      }
    },
    setMonthlyRetirement: {
      value: function( retirementamount ) {
        this.monthlyRetirement.clear();
        return this.monthlyRetirement.sendKeys( retirementamount );
      }
    },
    monthlyOther: {
      get: function() {
        return element( by.id( 'expenses__other' ) );
      }
    },
    setMonthlyOther: {
      value: function( otherexpensesamount ) {
        this.monthlyOther.clear();
        return this.monthlyOther.sendKeys( otherexpensesamount );
      }
    },
    averageMonthlySalary: {
      get: function() {
        return element( by.id( 'summary_monthly-salary' ) );
      }
    },
    totalMonthlyExpenses: {
      get: function() {
        return element( by.id( 'summary_monthly-expenses' ) );
      }
    },
    totalMonthlyLeftOver: {
      get: function() {
        return element( by.id( 'summary_monthly-left-over' ) );
      }
    },
    bigQuestionYesButton: {
      get: function() {
        return element ( by.id( 'question_answer-yes' ) );
      }
    },
    bigQuestionNoButton: {
      get: function() {
        return element ( by.id( 'question_answer-no' ) );
      }
    },
    bigQuestionNotSureButton: {
      get: function() {
        return element ( by.id( 'question_answer-not-sure' ) );
      }
    },
    answerBigQuestionYes: {
      value: function() {
        this.bigQuestionYesButton.click();
      }
    },
    answerBigQuestionNo: {
      value: function() {
        this.bigQuestionNoButton.click();
      }
    },
    answerBigQuestionNotSure: {
      value: function() {
        this.bigQuestionNotSureButton.click();
      }
    },
    // Step 3: You have options / A few more things to consider
    optionsConsiderationsSection: {
      get: function() {
        return element( by.css( '.get-options' ) );
      }
    },
    followupNoNotSureContent: {
      get: function() {
        return element( by.css( '.followup__no-not-sure' ) );
      }
    },
    followupYesContent: {
      get: function() {
        return element( by.css( '.followup__yes' ) );
      }
    },
    schoolLink: {
      get: function() {
        return element( by.css( '.school-link' ) );
      }
    },
    followSchoolLink: {
      value: function() {
        this.schoolLink.click();
      }
    },
    scorecardLink: {
      get: function() {
        return element( by.css( '.scorecard-link' ) );
      }
    },
    followScorecardLink: {
      value: function() {
        this.scorecardLink.click();
      }
    },
    nextStepsSection: {
      get: function() {
        return element( by.css( '.next-steps' ) );
      }
    },
    //Feedback
    feedbackSection: {
      get: function() {
        return element( by.css( '.feedback' ) );
      }
    },
    feedbackLink: {
      get: function() {
        return element( by.css( '.feedback .btn' ) );
      }
    },
    followFeedbackLink: {
      value: function() {
        this.feedbackLink.click();
      }
    }

} );

module.exports = settlementAidOfferPage;
