const Proxy_Url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function ()
{

  if (!sessionStorage.getItem('customerId') || !sessionStorage.getItem('customerName')) {
    window.location.href = 'Login.html';
  }

  let emptyCart = true;

  fetch(`${Proxy_Url}/customer/cart/${sessionStorage.getItem('customerId')}`)
    .then(response => response.json())
    .then(data => {
      const productsDiv = document.getElementById('products');
      const totalCostDiv = document.getElementById('total-cost');

      if (!data.productQuantityPair.isEmpty) {
        data.productQuantityPair.forEach(pair => {
          const productContainer = document.createElement('div');
          productContainer.classList.add('product-container');

          const img = document.createElement('img');
          img.src = pair.compactProductResponse.imageUrl;
          img.alt = pair.compactProductResponse.name;
          img.classList.add('product-image');

          const productDetails = document.createElement('div');
          productDetails.classList.add('product-details');

          const productName = document.createElement('div');
          productName.classList.add('product-name');
          productName.textContent = pair.compactProductResponse.name;

          const productPrice = document.createElement('div');
          productPrice.classList.add('product-price');
          const adjustedPrice = pair.compactProductResponse.salePriceStotinki / 100;
          productPrice.textContent = `${pair.quantity} x ${adjustedPrice} =
          ${adjustedPrice * pair.quantity} лв.`;

          productDetails.appendChild(productName);
          productDetails.appendChild(productPrice);

          productContainer.appendChild(img);
          productContainer.appendChild(productDetails);

          productsDiv.appendChild(productContainer);
        });

        emptyCart = false;
      }
      totalCostDiv.textContent = `Общо ${data.totalCost/100} лв.`

    })
    .catch(error => console.error('Error fetching data:', error));

  const continueButton = document.getElementById("continueButton");

  // if (emptyCart)
  // {
  //   document.getElementById(continueButton).disable();
  //   // continueButton.classList.add('disabled'); //TODO do
  // }

  continueButton.addEventListener("click", async ()=>{

    window.location.href = "OrderDetails.html";
  })
});
