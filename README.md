Here is the response to part 1.

The question asked was this:

Hi Braintree,

I just launched my official NBA Bulls merchandise business and started taking orders this
week. I'm new to the payment processing world and I'm very concerned about online fraud. I've already
enabled duplicate transaction checking, and CVV and AVS rules, but want to understand what other
options are out there and I'm pretty overwhelmed. Can you tell me more about what else Braintree has
available to protect my business from fraud and recommend a few things for me or my developer to
consider implementing?

I've also noticed that since I enabled these fraud tools, I've had many
customers reach out to me to say that their transactions said they were declined, but they were still
charged. Can you explain why this would happen and how I can prevent this situation for my
customers?

Thanks,
Jamie


Hello Jamie,

Thanks for reaching out to Braintree Support.  There are two things to consider here that I think will help provide more insight into what is happening.


First, when a transaction triggers one of the AVS or CVV rules, the transaction will be rejected and a void request will be sent to the issuing bank.  This might happen because the postal code the customer entered does not match what the bank has on file.  Now, it's important to note that some banks do not recognize void requests immediately, and it may take 24-48 hours before the transaction actually comes through as void.  This may what your customers are seeing when they say that their transactions are being declined but they are still being charged.

In terms of other things you can implement to protect against fraud, you may wish to consider implement risk threshold rules in addition to the duplicate transaction checking and AVS and CVV rules that you already have in place.

Here's a basic example of a risk threshold rule drawn right from our documentation page.  If you added this text:

Action: Email
    Alert Email Address: cardattackalerts@yourcompanyname.com
    Alert Period (minutes): 20
Threshold: 5
Operation: Verifications
Fields: Customer ID
Window (minutes): 10

Based on the criteria chosen above, this would be your rule:

Email me at cardattackalerts@yourcompanyname.com every 20 minutes when 5 or more verifications with the same Customer ID occur within 10 minutes of each other.

You can find more information about risk threshold rules at this link:

https://articles.braintreepayments.com/guides/fraud-tools/basic/risk-threshold-rules

You can also consider implementing our advanced fraud tools.  In collaboration with our partner company Kount, we are able to create a fraud score for each transaction using additional customer data such as geolocation and device fingerprinting.  You can enable advanced fraud checking in your control panel under Settings > Processing > Advanced Fraud Tools.  More details can be found at this link:

https://articles.braintreepayments.com/guides/fraud-tools/advanced/overview

Please don't hesitate to reach out with any more questions!

