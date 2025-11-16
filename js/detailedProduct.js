const Proxy_Url = 'http://localhost:3000';
document.addEventListener('DOMContentLoaded', function() {
  const homeLink = '<a href="MainPage.html">Начало</a>';

  if (!sessionStorage.getItem('customerId') || !sessionStorage.getItem('customerName')) {
    window.location.href = 'Login.html';
  }
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const productCode = getQueryParam('productCode');

  function fetchProductInfo(productCode) {
    const backendUrl = `${Proxy_Url}/product/detail/${productCode}?id=${sessionStorage.getItem('customerId')}`;
    fetch(backendUrl)
      .then(response => response.json())
      .then(data => {

        // console.log(data);
        const category = data.categoryName;
        const name = data.name;

        const updatedCategoryLink = `<a href="Products.html?category=${category}&p=1">${category}</a>`;
        document.getElementById('navigation-text').innerHTML = `${homeLink} / ${updatedCategoryLink} / ${name}`;
        updateProductDetails(data);
      })
      .catch(error => {
        console.error('Error fetching product information:', error);
      });
  }

  function updateProductDetails(productData) {
    const productDetailsDiv = document.querySelector('.product-details');
    productDetailsDiv.innerHTML = '';
    document.title = productData.name;
    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('product-image');
    const productImage = document.createElement('img');

    if (productData.productImages.length > 0) {
      productImage.src = productData.productImages[0];
    }
    productImage.alt = productData.name;
    productImageDiv.appendChild(productImage);

    const detailsContainerDiv = document.createElement('div');
    detailsContainerDiv.classList.add('details-container');

    const attributesDiv = document.createElement('div');
    attributesDiv.classList.add('product-attributes');

    const nameElement = document.createElement('h1');
    nameElement.textContent = productData.name;
    attributesDiv.appendChild(nameElement);

    const modelElement = document.createElement('p');
    const modelLabel = document.createElement('b');
    const modelText = document.createTextNode(productData.model);
    modelLabel.textContent = "Модел: ";
    modelElement.appendChild(modelLabel);
    modelElement.appendChild(modelText);
    attributesDiv.appendChild(modelElement);

    const manufacturerElement = document.createElement('p');
    const manufacturerLink = document.createElement('a');
    const manufacturerLabel = document.createElement('b');
    manufacturerLabel.textContent = "Производител: ";
    manufacturerElement.appendChild(manufacturerLabel);
    manufacturerLink.href = `Products.html?manufacturer=${productData.manufacturer}&p=1`;
    manufacturerLink.textContent = productData.manufacturer;
    manufacturerElement.appendChild(manufacturerLink);
    attributesDiv.appendChild(manufacturerElement);

    productData.attributes.forEach(attribute => {
      const attributeElement = document.createElement('p');

      const boldAttributeName = document.createElement('b');
      boldAttributeName.textContent = attribute.attributeName;

      if (attribute.measurementUnit === null|| attribute.measurementUnit === 'null') {
        attributeElement.appendChild(boldAttributeName);


        attributeElement.appendChild(document.createTextNode(`: ${attribute.option}`));
      } else {
        attributeElement.appendChild(boldAttributeName);
        // console.log("MEASUREMENT UNIT: " + attribute.measurementUnit)
        attributeElement.appendChild(document.createTextNode(`: ${attribute.option} ${attribute.measurementUnit}`));
      }

      attributesDiv.appendChild(attributeElement);
    });

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('product-description');

    const descriptionParts = productData.productDescription.split('\n');
    descriptionParts.forEach(part => {
      const paragraphElement = document.createElement('p');
      paragraphElement.textContent = part;
      descriptionDiv.appendChild(paragraphElement);
    });

    detailsContainerDiv.appendChild(attributesDiv);
    detailsContainerDiv.appendChild(descriptionDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('product-buttons');

    const favoritesButton = document.createElement('button');
    favoritesButton.classList.add('favorites-button');
    favoritesButton.innerHTML = '<i class="unfilled-heart-icon"></i> Добави в любими';

    const cartButton = document.createElement('button');
    cartButton.classList.add('cart-button');
    cartButton.innerHTML = '<i class="cart-icon"></i> Добави към количката';

    buttonsDiv.appendChild(favoritesButton);
    buttonsDiv.appendChild(cartButton);

    detailsContainerDiv.appendChild(buttonsDiv);

    productDetailsDiv.appendChild(productImageDiv);
    productDetailsDiv.appendChild(detailsContainerDiv);

    favoritesButton.addEventListener('click', async () => {
      let response;
      let requestBody = JSON.stringify({
        customerId: sessionStorage.getItem('customerId'),
        productCode: productData.productCode
      });

      if (favoritesButton.classList.contains('active')) {
        response = await fetch(`${Proxy_Url}/customer/removefav`, {
          method: 'DELETE',
          body: requestBody,
          headers: {'Content-Type': 'application/json'}
        });
      } else {
        response = await fetch(`${Proxy_Url}/customer/addfavourite`, {
            method: 'POST',
            body: requestBody,
            headers: {'Content-Type': 'application/json'}
          }
        )
      }
      const message = await response.text();
      if (response.ok) {
        alert(message);
        if (favoritesButton.classList.contains('active')) {
          favoritesButton.classList.remove('active');
          favoritesButton.innerHTML = '<i class="unfilled-heart-icon"></i> Добави в любими';
        }
       else {
          favoritesButton.classList.add('active');
          favoritesButton.innerHTML = '<i class="filled-heart-icon"></i> Премахни от любими';
      }
    }
      else {
        alert("Операцията не беше успешна!")
      }
    });

    cartButton.addEventListener('click', async () => {
      let productQuantity;
      if (cartButton.classList.contains('active'))
      {
        productQuantity=0;
      }
      else
      {
        productQuantity=1;
      }
      const response = await fetch(`${Proxy_Url}/customer/addtocart`, {
        method: 'POST',
        body: JSON.stringify({
          customerProductPairRequest: {
            customerId: sessionStorage.getItem('customerId'),
            productCode: productData.productCode,
          },
          quantity: productQuantity
        }),
        headers: {'Content-Type': 'application/json'}
      });
      const message = await response.text();
      alert(message);

      if (response.ok) {
        if (cartButton.classList.contains('active')) {
          cartButton.classList.remove('active');
          cartButton.innerHTML = '<i class="cart-icon"></i> Добави към количката';
        } else {
          cartButton.classList.add('active');
          cartButton.innerHTML = '<i class="cart-icon"></i> Премахни от количката';
        }
      }
    });

    if (productData.inFavourites) {
      favoritesButton.classList.add('active');
      favoritesButton.innerHTML = '<i class="filled-heart-icon"></i> Премахни от любими';
    }

    if (productData.inCart) {
      cartButton.classList.add('active');
      cartButton.innerHTML = '<i class="cart-icon"></i> Премахни от количката';
    }
  }

  if (productCode) {
    fetchProductInfo(productCode);
  } else {
    console.error('No product code found in URL');
  }
});
