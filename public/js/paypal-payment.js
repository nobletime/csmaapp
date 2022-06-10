paypal.Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: document.getElementById("credits_add").value
          }
        }]
      });
    },
    // Finalize the transaction after payer approval
    onApprove: (data, actions) => {
      return actions.order.capture().then(function(orderData) {
        // Successful capture! For dev/demo purposes:
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        const transaction = orderData.purchase_units[0].payments.captures[0];
        // transaction.status == 'COMPLETED'

        //alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
        // When ready to go live, remove the alert and show a success message within this page. For example:
        // const element = document.getElementById('paypal-button-container');
        // element.innerHTML = '<h3>Thank you for your payment!</h3>';
        // Or go to another URL:  actions.redirect('thank_you.html');
        document.getElementById("verify_payment").value = "done" // orderData.purchase_units[0].payee.merchant_id;
        document.getElementById("credits_add").value = transaction.amount.value;
                
        document.getElementById("credits-form").submit();
       // document.getElementById("credits-message").innerHTML = "Amount added";
      });
    }
  }).render('#paypal');


//   <!-- Set up a container element for the button -->
//   <div id="paypal-button-container"></div>
  
//   <!-- Include the PayPal JavaScript SDK. Replace `YOUR_CLIENT_ID` with your client ID.-->
//   <!-- Note that `enable-funding=venmo` is added as a query parameter -->
//   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&enable-funding=venmo"></script>
  
//   <script>
//     // Render the Venmo button into #paypal-button-container
//     paypal.Buttons().render('#paypal-button-container')
//   </script>


//   let fundingSource

//   paypal.Buttons({
//     onClick: (data) => {
//       // fundingSource = "venmo"
//       fundingSource = data.fundingSource
  
//       // Use this value to determine what funding source was used to pay
//       // Update your confirmation pages and notifications from "PayPal" to "Venmo"
//     },
//   }) 