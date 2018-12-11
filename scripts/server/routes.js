const express = require('express')
const router = express.Router()
const gateway = require('../lib/gateway')
const flash = require('req-flash')
const braintree = require('braintree')


//not sure about this stuff yet but it does something:

var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  var formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  var result;
  var status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    };
  }

  return result;
}

// and these are routes:

router.get('/', function (req, res) {
  res.redirect('checkouts/new')
})

router.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', {clientToken: response.clientToken, messages:
      req.flash('error')});
    if (err) {
      console.error(err)
    }
  });
});

router.post("/checkouts", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  var transactionErrors //still need to create this
  var amount = req.body.amount;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
      if (result.success || result.transaction) {
        res.redirect('checkouts/' + result.transaction.id)
      }
       else {
        console.error(err)
        transactionErrors = result.errors.deepErrors();
        req.flash('error', {msg: formatErrors(transactionErrors)});
        res.redirect('checkouts/new')
      }
  });
});

module.exports = router
