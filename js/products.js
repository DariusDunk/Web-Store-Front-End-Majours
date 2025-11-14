let Proxy_Url = 'http://localhost:3000';
const pageName = `Products.html`;

let currentMode = '';
let currentModeDetails = '';

async function getProducts(url) {
  try {
    const response = await fetch(url);
    console.log(`Fetch url: ${url}`);
    const data = await response.json();
    const products = data.content;
    // const totalPages = data.page.totalPages;
    const totalPages = data.totalPages;

    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = '';
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const productLink = document.createElement('a');
      productLink.href = `product-details.html?productCode=${product.productCode}`;

      const productImage = document.createElement('img');
      productImage.src = product.imageUrl;
      productLink.appendChild(productImage);

      const productName = document.createElement('div');
      productName.classList.add('product-name');
      productName.textContent = product.name;
      productLink.appendChild(productName);

      const ratingContainer = document.createElement('div');
      ratingContainer.classList.add('rating-container');

      let rating = 0;
      let totalStars = 0;

      if (product.rating !== 0) {
        rating = product.rating / 10;
        totalStars = Math.min(Math.ceil(rating), 5);
      }

      if (rating !== 0) {
        for (let i = 0; i < Math.floor(rating); i++) {
          const starIcon = document.createElement('span');
          starIcon.classList.add('star', 'full');
          ratingContainer.appendChild(starIcon);
        }
        if (rating % 1 !== 0) {
          const starIcon = document.createElement('span');
          starIcon.classList.add('star', 'empty');
          ratingContainer.appendChild(starIcon);
        }
      }
      for (let i = 0; i < 5 - totalStars; i++) {
        const starIcon = document.createElement('span');
        starIcon.classList.add('star', 'empty');
        ratingContainer.appendChild(starIcon);
      }

      const reviewCount = document.createElement('span');
      reviewCount.classList.add('review-count');
      reviewCount.textContent = `(${product.reviewCount})`;
      ratingContainer.appendChild(reviewCount);

      productLink.appendChild(ratingContainer);

      if (product.originalPriceStotinki !== product.salePriceStotinki) {
        const originalPrice = document.createElement('div');
        originalPrice.classList.add('product-original-price');
        originalPrice.textContent = '€' + (product.originalPriceStotinki / 100).toFixed(2);
        productLink.appendChild(originalPrice);
      }

      const salePrice = document.createElement('div');
      salePrice.classList.add('product-price');
      salePrice.textContent = '€' +(product.salePriceStotinki / 100).toFixed(2);
      productLink.appendChild(salePrice);

      productDiv.appendChild(productLink);
      productContainer.appendChild(productDiv);
    });

    console.log("TOTAL PAGES " + totalPages);
    updatePagination(totalPages-1);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function updatePagination(lastPage) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';

  let searchParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(searchParams.get('page') || '1') - 1;

  searchParams.delete('page');
  const baseQuery = searchParams.toString();
  const currUrl = `${pageName}?${baseQuery ? baseQuery + '&' : ''}page=`;
  let url = ``;

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');

  const prevDoubleButton = document.createElement('span');
  prevDoubleButton.innerHTML = '&lt;&lt;';
  prevDoubleButton.classList.add('pagination-button');
  if (currentPage === 0) {
    prevDoubleButton.classList.add('disabled');
  } else {
    prevDoubleButton.addEventListener('click', () => {
      url = currUrl + 1;
      window.location.href = url;
    });
  }
  pagination.appendChild(prevDoubleButton);

  const prevButton = document.createElement('span');
  prevButton.innerHTML = '&lt;';
  prevButton.classList.add('pagination-button');
  if (currentPage === 0) {
    prevButton.classList.add('disabled');
  } else {
    prevButton.addEventListener('click', () => {
      url = currUrl + currentPage;
      window.location.href = url;
    });
  }
  pagination.appendChild(prevButton);

  let maxPrevPages = 0;
  let maxNextPages = 0;
  if (currentPage - 2 >= 0) {
    maxPrevPages = 2;
  } else if (currentPage - 1 >= 0) {
    maxPrevPages = 1;
  }

  if (currentPage + 2 <= lastPage) {
    maxNextPages = 2;
  } else if (currentPage + 1 <= lastPage) {
    maxNextPages = 1;
  }

  if (maxPrevPages) {
    for (let i = maxPrevPages; i >=1 ; i--) {
      const pageButton = document.createElement('span');
      let prevPageInteger = parseInt(currentPage) + 1 - i;
      pageButton.textContent = prevPageInteger;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
        url = currUrl + (prevPageInteger);
        window.location.href = url;
      });
      pagination.appendChild(pageButton);
    }
  }
  const currentPageVisual = document.createElement('span');
  currentPageVisual.textContent = parseInt(currentPage) + 1;
  currentPageVisual.classList.add('pagination-button');
  currentPageVisual.classList.add('disabled');
  currentPageVisual.classList.add('pagination-button-current')
  pagination.appendChild(currentPageVisual)

  if (maxNextPages) {
    for (let i = 1; i <= maxNextPages; i++) {
      const pageButton = document.createElement('span');
      let nextPageInteger = parseInt(currentPage) + 1 + i;
      pageButton.textContent = nextPageInteger;
      pageButton.classList.add('pagination-button');
      pageButton.addEventListener('click', () => {
        url = currUrl + (nextPageInteger);
        window.location.href = url;
      });
      pagination.appendChild(pageButton);
    }
  }

  const nextButton = document.createElement('span');
  nextButton.innerHTML = '&gt;';
  nextButton.classList.add('pagination-button');
  if (currentPage === lastPage) {
    nextButton.classList.add('disabled');
  } else {
    nextButton.addEventListener('click', () => {
      url = currUrl + (currentPage + 2);
      window.location.href = url;
    });
  }
  pagination.appendChild(nextButton);

  const nextDoubleButton = document.createElement('span');
  nextDoubleButton.innerHTML = '&gt;&gt;';
  nextDoubleButton.classList.add('pagination-button');
  if (currentPage === lastPage) {
    nextDoubleButton.classList.add('disabled');
  } else {
    nextDoubleButton.addEventListener('click', () => {
      url = currUrl + (lastPage + 1);
      window.location.href = url;
    });
  }
  pagination.appendChild(nextDoubleButton);
  paginationContainer.appendChild(pagination);
}

async function fetchFilters(categoryName) {
  try {
    const response = await fetch(`${Proxy_Url}/attribute/getFilters/${encodeURIComponent(categoryName)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching filters:', error);
    return null;
  }
}

function renderFilters(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');
  filterSidebar.innerHTML = '';
  filterSidebar.style.display = 'block';

  if (!filtersResponse) return;

  // Price Range
  const priceSection = document.createElement('div');
  priceSection.classList.add('filter-section');
  const priceHeader = document.createElement('h3');
  priceHeader.textContent = 'Диапазон на цените';
  priceSection.appendChild(priceHeader);

  const minPriceInput = document.createElement('input');
  minPriceInput.id = 'min-price-slider';
  minPriceInput.type = 'range';
  minPriceInput.min = filtersResponse.price_lowest / 100;
  minPriceInput.max = filtersResponse.price_highest / 100;
  minPriceInput.value = filtersResponse.price_lowest / 100;
  minPriceInput.step = 0.01;

  const maxPriceInput = document.createElement('input');
  maxPriceInput.id = 'max-price-slider';
  maxPriceInput.type = 'range';
  maxPriceInput.min = filtersResponse.price_lowest / 100;
  maxPriceInput.max = filtersResponse.price_highest / 100;
  maxPriceInput.value = filtersResponse.price_highest / 100;
  maxPriceInput.step = 0.01;

  const minPriceText = document.createElement('input');
  minPriceText.id = 'min-price-text';
  minPriceText.type = 'text';
  minPriceText.value = (filtersResponse.price_lowest / 100).toFixed(2);

  const maxPriceText = document.createElement('input');
  maxPriceText.id = 'max-price-text';
  maxPriceText.type = 'text';
  maxPriceText.value = (filtersResponse.price_highest / 100).toFixed(2);

  // Event listeners to sync
  minPriceInput.addEventListener('input', () => {
    let minVal = parseFloat(minPriceInput.value);
    let maxVal = parseFloat(maxPriceInput.value);
    if (minVal > maxVal) minVal = maxVal;
    minPriceInput.value = minVal;
    minPriceText.value = minVal.toFixed(2);
    applyFilters();
  });

  maxPriceInput.addEventListener('input', () => {
    let minVal = parseFloat(minPriceInput.value);
    let maxVal = parseFloat(maxPriceInput.value);
    if (maxVal < minVal) maxVal = minVal;
    maxPriceInput.value = maxVal;
    maxPriceText.value = maxVal.toFixed(2);
    applyFilters();
  });

  minPriceText.addEventListener('change', () => {
    let val = parseFloat(minPriceText.value);
    if (isNaN(val) || val < filtersResponse.price_lowest / 100) val = filtersResponse.price_lowest / 100;
    if (val > parseFloat(maxPriceInput.value)) val = parseFloat(maxPriceInput.value);
    minPriceInput.value = val;
    minPriceText.value = val.toFixed(2);
    applyFilters();
  });

  maxPriceText.addEventListener('change', () => {
    let val = parseFloat(maxPriceText.value);
    if (isNaN(val) || val > filtersResponse.price_highest / 100) val = filtersResponse.price_highest / 100;
    if (val < parseFloat(minPriceInput.value)) val = parseFloat(minPriceInput.value);
    maxPriceInput.value = val;
    maxPriceText.value = val.toFixed(2);
    applyFilters();
  });

  const priceSliderContainer = document.createElement('div');
  priceSliderContainer.classList.add('price-slider-container');
  priceSliderContainer.appendChild(minPriceInput);
  priceSliderContainer.appendChild(maxPriceInput);

  const priceTextContainer = document.createElement('div');
  priceTextContainer.classList.add('price-text-container');
  priceTextContainer.appendChild(minPriceText);
  priceTextContainer.appendChild(document.createTextNode(' - '));
  priceTextContainer.appendChild(maxPriceText);

  priceSection.appendChild(priceSliderContainer);
  priceSection.appendChild(priceTextContainer);
  filterSidebar.appendChild(priceSection);

  // Manufacturers
  const manufacturersSection = document.createElement('div');
  manufacturersSection.classList.add('filter-section');
  const manufacturersHeader = document.createElement('h3');
  manufacturersHeader.textContent = 'Производители';
  manufacturersSection.appendChild(manufacturersHeader);

  const manufacturersList = document.createElement('div');
  manufacturersList.classList.add('filter-options');
  Array.from(filtersResponse.manufacturers).sort((a, b) => a.name.localeCompare(b.name)).forEach(manufacturer => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('filter-manufacturer');
    checkbox.value = manufacturer.id;
    checkbox.addEventListener('change', applyFilters);
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(manufacturer.name));
    manufacturersList.appendChild(label);
  });
  manufacturersSection.appendChild(manufacturersList);
  filterSidebar.appendChild(manufacturersSection);

  // Ratings
  const ratingsSection = document.createElement('div');
  ratingsSection.classList.add('filter-section');
  const ratingsHeader = document.createElement('h3');
  ratingsHeader.textContent = 'Рейтинг';
  ratingsSection.appendChild(ratingsHeader);

  const ratingsList = document.createElement('div');
  ratingsList.classList.add('filter-options');
  Array.from(filtersResponse.ratings).sort((a, b) => b - a).forEach(rating => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('filter-rating');
    checkbox.value = rating;
    checkbox.addEventListener('change', applyFilters);
    label.appendChild(checkbox);
    const starsContainer = document.createElement('span');
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      if (i <= rating) {
        star.classList.add('full');
      } else {
        star.classList.add('empty');
      }
      starsContainer.appendChild(star);
    }
    label.appendChild(starsContainer);
    ratingsList.appendChild(label);
  });

  ratingsSection.appendChild(ratingsList);
  filterSidebar.appendChild(ratingsSection);
if (filtersResponse.category_attributes!=null)
  { // Category Attributes
    Array.from(filtersResponse.category_attributes).forEach(attr => {
      const attrSection = document.createElement('div');
      attrSection.classList.add('filter-section');
      const attrHeader = document.createElement('h3');
      attrHeader.textContent = attr.attributeName;
      attrSection.appendChild(attrHeader);

      const attrList = document.createElement('div');
      attrList.classList.add('filter-options');
      Array.from(attr.options).sort().forEach(option => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('filter-attribute');
        checkbox.value = option;
        checkbox.dataset.nameId = attr.nameId;
        checkbox.addEventListener('change', applyFilters);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        attrList.appendChild(label);
      });
      attrSection.appendChild(attrList);
      filterSidebar.appendChild(attrSection);
    });
  }
}

function applyFilters() {
  const filterSidebar = document.getElementById('filter-sidebar');

  // Price
  const minPriceInput = document.getElementById('min-price-slider');
  const maxPriceInput = document.getElementById('max-price-slider');
  const minPrice = Math.round(parseFloat(minPriceInput.value) * 100);
  const maxPrice = Math.round(parseFloat(maxPriceInput.value) * 100);

  // Manufacturers
  const selectedManufacturers = Array.from(filterSidebar.querySelectorAll('.filter-manufacturer:checked')).map(cb => cb.value);

  // Ratings
  const selectedRatings = Array.from(filterSidebar.querySelectorAll('.filter-rating:checked')).map(cb => cb.value);

  // Attributes
  const selectedAttributes = {};

  if (filterSidebar.querySelectorAll('.filter-attribute:checked')!=null)
  {
    filterSidebar.querySelectorAll('.filter-attribute:checked').forEach(cb => {
      const nameId = cb.dataset.nameId;
      if (!selectedAttributes[nameId]) {
        selectedAttributes[nameId] = [];
      }
      selectedAttributes[nameId].push(encodeURIComponent(cb.value));
    });
  }
  // Construct filterParams
  let filterParams = new URLSearchParams();
  filterParams.append('minPrice', minPrice);
  filterParams.append('maxPrice', maxPrice);
  if (selectedManufacturers.length > 0) {
    filterParams.append('manufacturers', selectedManufacturers.join(','));
  }
  if (selectedRatings.length > 0) {
    filterParams.append('ratings', selectedRatings.join(','));
  }
if (selectedAttributes.length > 0)
  {
    Object.keys(selectedAttributes).forEach(nameId => {
      if (selectedAttributes[nameId].length > 0) {
        filterParams.append(`attr${nameId}`, selectedAttributes[nameId].join(','));
      }
    });
  }

  // Update URL
  let newSearch = new URLSearchParams();
  newSearch.set(currentMode, currentModeDetails);
  newSearch.set('page', 1);
  for (let [key, val] of filterParams) {
    newSearch.set(key, val);
  }
  history.pushState({}, '', `${pageName}?${newSearch.toString()}`);

  // Construct fetchUrl
  const extraParamsStr = filterParams.toString();
  const fetchUrl = `${Proxy_Url}/product/category/${currentModeDetails}/p0${extraParamsStr ? '?' + extraParamsStr : ''}`;
  getProducts(fetchUrl);
}

function setFiltersFromParams() {
  const filterSidebar = document.getElementById('filter-sidebar');
  let searchParams = new URLSearchParams(window.location.search);

  // Price
  const minPriceParam = searchParams.get('minPrice');
  if (minPriceParam) {
    const minEuro = parseInt(minPriceParam) / 100;
    document.getElementById('min-price-slider').value = minEuro;
    document.getElementById('min-price-text').value = minEuro.toFixed(2);
  }
  const maxPriceParam = searchParams.get('maxPrice');
  if (maxPriceParam) {
    const maxEuro = parseInt(maxPriceParam) / 100;
    document.getElementById('max-price-slider').value = maxEuro;
    document.getElementById('max-price-text').value = maxEuro.toFixed(2);
  }

  // Manufacturers
  const mans = searchParams.get('manufacturers')?.split(',') || [];
  filterSidebar.querySelectorAll('.filter-manufacturer').forEach(cb => {
    cb.checked = mans.includes(cb.value);
  });

  // Ratings
  const rats = searchParams.get('ratings')?.split(',') || [];
  filterSidebar.querySelectorAll('.filter-rating').forEach(cb => {
    cb.checked = rats.includes(cb.value);
  });

  // Attributes
  filterSidebar.querySelectorAll('.filter-attribute').forEach(cb => {
    const nameId = cb.dataset.nameId;
    const attrParam = searchParams.get(`attr${nameId}`)?.split(',').map(decodeURIComponent) || [];
    cb.checked = attrParam.includes(cb.value);
  });
}

document.addEventListener('DOMContentLoaded', async function modeHandler() {
  if (sessionStorage.getItem('customerId') && sessionStorage.getItem('customerName')) {
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get('page') || '1') - 1;
    let mode = '';
    let modeDetails = '';
    const knownModes = ['manufacturer', 'category', 'search', 'featured'];
    for (let key of knownModes) {
      if (searchParams.has(key)) {
        mode = key;
        modeDetails = searchParams.get(key);
        break;
      }
    }
    if (!mode) {
      mode = 'featured';
      modeDetails = '';
    }
    currentMode = mode;
    currentModeDetails = modeDetails;

    let fetchUrl = ``;
    let extraParamsStr = '';
    if (mode === 'category') {
      searchParams.delete('category');
      searchParams.delete('page');
      extraParamsStr = searchParams.toString();
    }

    switch (mode) {
      case "manufacturer":
        document.title = `${modeDetails} продукти`;
        document.getElementById("product-mode-message").textContent = `Продукти на ${modeDetails}:`;
        fetchUrl = `${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`;
        break;
      case "category":
        document.title = `${modeDetails}`;
        document.getElementById("product-mode-message").textContent = `Продукти от категория ${modeDetails}:`;
        fetchUrl = `${Proxy_Url}/product/category/${modeDetails}/p${page}${extraParamsStr ? '?' + extraParamsStr : ''}`;
        const filtersResponse = await fetchFilters(modeDetails);
        renderFilters(filtersResponse);
        setFiltersFromParams();
        break;
      case "search":
        // fetchUrl = `${Proxy_Url}/search/${encodeURIComponent(modeDetails)}/${page}`;
        fetchUrl = `${Proxy_Url}/product/search/${encodeURIComponent(modeDetails)}/${page}`;
        break;
      // case "filter":
      //   // fetchUrl = [urlParams.get('filterQuery')];
      //   //Not implemented
      //   break;
      case "featured":
        // fetchUrl = `${Proxy_Url}/featured/${page}`;
        fetchUrl = `${Proxy_Url}/product/featured/${page}`;
        break;
      default:
        // fetchUrl = `${Proxy_Url}/featured/0`;
        fetchUrl = `${Proxy_Url}/product/featured/0}`;
        break;
    }
    getProducts(fetchUrl);
  } else {
    window.location.href = "Login.html";
  }
});
