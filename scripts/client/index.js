var client = require('braintree-web/client');
var braintree = require('braintree-web')
var hostedFields = require('braintree-web/hosted-fields');

//braintree.setup('CLIENT-TOKEN-FROM-SERVER', 'custom', options)

client.create({
  authorization: 'CLIENT_AUTHORIZATION'
}, function (clientErr, clientInstance) {

  if (clientErr) {
    return
  }

  var options = {
    client: clientInstance,
    styles: {

    },
    fields: {

    }
  }
  hostedFields.create(options, function(hostedFieldsErr, hostedFieldsInstance) {
    if (hostedFieldsErr) {
      return;
    }

    //use the hosted fields instance here to tokenize a card
  });
});
