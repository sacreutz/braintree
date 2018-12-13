const express = require('express')
const router = express.Router()
//const gateway = require('../lib/gateway')
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

// router.get('/', function (req, res) {
//   res.redirect('checkouts/new')
// })
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/client_token', function (req, res) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'ds7p8v5crrrkrygr',
    publicKey: '8875xvj4dm4zp3gd',
    privateKey: '845884585fc1a83d3537fbca75ac77ab'
  });
  gateway.clientToken.generate({}, function (err, response) {
    var clientToken = response.clientToken
    // res.render('/checkouts/new', {clientToken: response.clientToken, messages:
    //   req.flash('error')});
    res.send(response.clientToken)
    if (err) {
      console.error(err)
    }
  });
});

router.post("/checkout", function (req, res) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'ds7p8v5crrrkrygr',
    publicKey: '8875xvj4dm4zp3gd',
    privateKey: '845884585fc1a83d3537fbca75ac77ab'
  });

  var nonceFromTheClient = req.body.paymentMethodNonce;
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
        res.send(result);
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
