const express = require('express')
const router = express.Router()
const gateway = require('../lib/gateway')

router.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
    if (err) {
      console.error(err)
    }
  });
});

router.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
      if (result.success) {
        result.transaction.customFields
      }
       else {
        console.error(err)
      }

  });

});

module.exports = router
