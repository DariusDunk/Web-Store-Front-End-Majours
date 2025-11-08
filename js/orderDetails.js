const Proxy_Url = 'http://localhost:3000';
function submitForm() {

  if (!sessionStorage.getItem('customerId') || !sessionStorage.getItem('customerName')) {
    window.location.href = 'Login.html';
  }

  const contactName = document.getElementById('contact-name').value;
  const contactNumber = document.getElementById('contact-number').value;
  const address = document.getElementById('address').value;
  const customerId = sessionStorage.getItem('customerId');

  const PurchaseRequest = {
    contactName: contactName,
    contactNumber: contactNumber,
    address: address
  };

  const requestBody = {
    customerId: customerId,
    recipient_request: PurchaseRequest
  };

  fetch(`${Proxy_Url}/purchase/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      console.log(`status: ${response.status}`);
      if (response.ok) {
        alert("Поръчано успешно!");
        window.location.href = "MainPage.html";
      } else {
        console.error('Error submitting form:', response.statusText);
        alert("Имаше проблем с поръчката")
        window.location.href = "customerCart.html";
      }
    })
    .catch(error => console.error('Error submitting form:', error));
}
