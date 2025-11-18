// products.js
let Proxy_Url = 'http://localhost:3000';
const pageName = `Products.html`;

let currentMode = '';
let currentModeDetails = '';
let filtersData = null;

async function getProducts(url) {
  try {
    const response = await fetch(url);
    // console.log(`Fetch url: ${url}`);
    const data = await response.json();
    const products = data.content;
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
      salePrice.textContent = '€' + (product.salePriceStotinki / 100).toFixed(2);
      productLink.appendChild(salePrice);

      productDiv.appendChild(productLink);
      productContainer.appendChild(productDiv);
    });

    // console.log("TOTAL PAGES " + totalPages);
    updatePagination(totalPages - 1);
    if (currentMode === "category")
    {
      updateFilterButton();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function updatePagination(lastPage) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';

  let searchParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(searchParams.get('p') || '1') - 1;

  searchParams.delete('p');
  const baseQuery = searchParams.toString();
  const currUrl = `${pageName}?${baseQuery ? baseQuery + '&' : ''}p=`;
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
    for (let i = maxPrevPages; i >= 1; i--) {
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

// Render the price slider + text inputs
function renderPriceSlider(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');

  const priceSection = document.createElement('div');
  priceSection.classList.add('filter-section');

  const priceHeader = document.createElement('h3');
  priceHeader.textContent = 'Диапазон на цените';
  priceSection.appendChild(priceHeader);

  // Convert backend stotinki to euro
  const minEuro = filtersResponse.price_lowest / 100;
  const maxEuro = (filtersResponse.price_highest / 100) + 1;

  const priceSliderContainer = document.createElement('div');
  priceSliderContainer.classList.add('price-slider-container');

  const minSlider = document.createElement('input');
  minSlider.type = 'range';
  minSlider.id = 'min-price-slider';
  minSlider.min = minEuro;
  minSlider.max = maxEuro;
  minSlider.value = minEuro;
  minSlider.step = 0.01;
  priceSliderContainer.appendChild(minSlider);

  const maxSlider = document.createElement('input');
  maxSlider.type = 'range';
  maxSlider.id = 'max-price-slider';
  maxSlider.min = minEuro;
  maxSlider.max = maxEuro;
  maxSlider.value = maxEuro;
  maxSlider.step = 0.01;
  priceSliderContainer.appendChild(maxSlider);

  priceSection.appendChild(priceSliderContainer);

  const priceTextContainer = document.createElement('div');
  priceTextContainer.classList.add('price-text-container');

  const minText = document.createElement('input');
  minText.type = 'text';
  minText.id = 'min-price-text';
  minText.value = (+minEuro).toFixed(2);
  priceTextContainer.appendChild(minText);

  const maxText = document.createElement('input');
  maxText.type = 'text';
  maxText.id = 'max-price-text';
  maxText.value = (+maxEuro).toFixed(2);
  priceTextContainer.appendChild(maxText);

  priceSection.appendChild(priceTextContainer);

  // Event listeners for sliders and text inputs
  minSlider.addEventListener('input', () => {
    if (parseFloat(minSlider.value) > parseFloat(maxSlider.value)) minSlider.value = maxSlider.value;
    minText.value = parseFloat(minSlider.value).toFixed(2);
  });
  maxSlider.addEventListener('input', () => {
    if (parseFloat(maxSlider.value) < parseFloat(minSlider.value)) maxSlider.value = minSlider.value;
    maxText.value = parseFloat(maxSlider.value).toFixed(2);
  });
  minText.addEventListener('change', () => {
    let val = parseFloat(minText.value);
    if (isNaN(val) || val < minEuro) val = minEuro;
    if (val > parseFloat(maxText.value)) val = parseFloat(maxText.value);
    minText.value = val.toFixed(2);
    minSlider.value = val;
  });
  maxText.addEventListener('change', () => {
    let val = parseFloat(maxText.value);
    if (isNaN(val) || val > maxEuro) val = maxEuro;
    if (val < parseFloat(minText.value)) val = parseFloat(minText.value);
    maxText.value = val.toFixed(2);
    maxSlider.value = val;
  });

  filterSidebar.appendChild(priceSection);
}

function renderManufacturers(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');

  const manufacturersSection = document.createElement('div');
  manufacturersSection.classList.add('filter-section');

  const manufacturersHeader = document.createElement('h3');
  manufacturersHeader.textContent = 'Производители';
  manufacturersSection.appendChild(manufacturersHeader);

  const manufacturersList = document.createElement('div');
  manufacturersList.classList.add('filter-options');

  // console.log("MANUFACTURERS: " + filtersResponse.manufacturers);

  Array.from(filtersResponse.manufacturers).sort().forEach(manufacturer => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    console.log(manufacturer);
    checkbox.type = 'checkbox';
    checkbox.classList.add('filter-manufacturer');
    checkbox.value = manufacturer;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(manufacturer));
    manufacturersList.appendChild(label);
  });

  manufacturersSection.appendChild(manufacturersList);
  filterSidebar.appendChild(manufacturersSection);
}

function renderRatings(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');

  const ratingsSection = document.createElement('div');
  ratingsSection.classList.add('filter-section');

  const ratingsHeader = document.createElement('h3');
  ratingsHeader.textContent = 'Рейтинг над';
  ratingsSection.appendChild(ratingsHeader);

  const ratingsList = document.createElement('div');
  ratingsList.classList.add('filter-options');

  Array.from(filtersResponse.ratings).sort((a, b) => b - a).forEach(rating => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('filter-rating');
    checkbox.value = rating;
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        // Uncheck all other checkboxes
        document.querySelectorAll('.filter-rating').forEach(cb => {
          if (cb !== this) cb.checked = false;
        });
      }
    });
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
}

function renderAttributes(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');

  if (filtersResponse.category_attributes != null) { // Category Attributes
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
        checkbox.dataset.nameId = attr.attributeName;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        attrList.appendChild(label);
      });
      attrSection.appendChild(attrList);
      filterSidebar.appendChild(attrSection);
    });
  }
}

function renderFilters(filtersResponse) {
  const filterSidebar = document.getElementById('filter-sidebar');
  filterSidebar.innerHTML = '';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.id = 'close-filters';
  closeBtn.textContent = 'X';
  closeBtn.addEventListener('click', hideFiltersMenu);
  filterSidebar.appendChild(closeBtn);

  renderPriceSlider(filtersResponse);
  renderManufacturers(filtersResponse);
  renderRatings(filtersResponse);
  renderAttributes(filtersResponse);

  // Filter actions
  const actions = document.createElement('div');
  actions.classList.add('filter-actions');

  const resetBtn = document.createElement('button');
  resetBtn.id = 'reset-filters';
  resetBtn.textContent = 'Нулиране';
  resetBtn.addEventListener('click', resetFilters);
  actions.appendChild(resetBtn);

  const applyBtn = document.createElement('button');
  applyBtn.id = 'apply-filters';
  applyBtn.textContent = 'Приложи филтри';
  applyBtn.addEventListener('click',async () =>{
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get('p') || '1');

    await applyFilters(page)
  });
  actions.appendChild(applyBtn);

  filterSidebar.appendChild(actions);
}

function toCents(value) {
  return Number((parseFloat(value) * 100).toFixed(1));
}

// async function applyFilters(page = 1) {
//   const filterSidebar = document.getElementById('filter-sidebar');
//
//   const searchParams = new URLSearchParams(window.location.search);
//
//   // Price (take from text inputs to avoid slider precision issues)
//   let minPrice = toCents(document.getElementById('min-price-text').value);
//   let maxPrice = toCents(document.getElementById('max-price-text').value);
//
//   if (searchParams.has('pr')) {
//     const priceRange = searchParams.get('pr').split('-');
//     if (parseInt(priceRange[0]) !== minPrice) {
//       minPrice = priceRange[0];
//     }
//
//     if (parseInt(priceRange[1]) !== maxPrice) {
//       maxPrice = priceRange[1];
//     }
//   }
//
//   const minDefault = filtersData.price_lowest;
//   const maxDefault = filtersData.price_highest;
//
//   // Category
//
//   let currentCategory = '';
//   if (searchParams.has('category')) currentCategory = searchParams.get('category');
//
//   // Manufacturers
//   let selectedManufacturers = Array.from(filterSidebar.querySelectorAll('.filter-manufacturer:checked')).map(cb => cb.value);
//
//   if (!selectedManufacturers.length > 0&& searchParams.has('m')) {
//     selectedManufacturers = Array.from(searchParams.get('m'));
//   }
//
//   // Ratings
//   const selectedRating = filterSidebar.querySelector('.filter-rating:checked')?.value || null;
//
//   // Attributes
//   const selectedAttributes = {};
//   filterSidebar.querySelectorAll('.filter-attribute:checked').forEach(cb => {
//     const nameId = cb.dataset.nameId;
//     if (!selectedAttributes[nameId]) selectedAttributes[nameId] = [];
//     selectedAttributes[nameId].push(encodeURIComponent(cb.value));
//   });
//
//   // Construct filterParams
//   const filterParams = new URLSearchParams();
//   filterParams.append('p', page.toString());
//   if (minPrice > minDefault || maxPrice < maxDefault) {
//     filterParams.append('pr', `${minPrice}-${maxPrice}`);
//   }
//   else {
//     filterParams.append('pr', `${minDefault}-${maxDefault}`);
//   }
//   if (selectedManufacturers.length)
//     filterParams.append('m', selectedManufacturers.map(encodeURIComponent).join(','));
//
//   if (selectedRating)
//     filterParams.append('r', selectedRating);
//
//   Object.keys(selectedAttributes).forEach(nameId => {
//     if (selectedAttributes[nameId].length) filterParams.append(`a${nameId}`, selectedAttributes[nameId].join(','));
//   });
//
//   // Update URL (history)
//   const newSearch = new URLSearchParams(window.location.search);
//
// // keep mode
//   newSearch.set(currentMode, currentModeDetails);
//
// // update filter params
//   for (const [k, v] of filterParams) newSearch.set(k, v);
//
// // remove old `p` param
//   newSearch.set("p", page.toString());
//
//   history.pushState({}, '', `${pageName}?${newSearch.toString()}`);
//
//   // Fetch products
//   // const backendPage = 0;
//   const fetchUrl = `${Proxy_Url}/product/category-filter/${encodeURIComponent(currentCategory)}/pg${page-1}${filterParams.toString() ? '?' + filterParams.toString() : ''}`;
//   console.log("Fetch URL:", fetchUrl);
//   await getProducts(fetchUrl);
//   hideFiltersMenu();
// }

async function applyFilters(page = 1) {
  const filterSidebar = document.getElementById('filter-sidebar');

  const searchParams = new URLSearchParams(window.location.search);

  // Price (take from text inputs to avoid slider precision issues)
  let minPrice = toCents(document.getElementById('min-price-text').value);
  let maxPrice = toCents(document.getElementById('max-price-text').value);

  if (searchParams.has('pr')) {
    const priceRange = searchParams.get('pr').split('-');
    if (parseInt(priceRange[0]) > minPrice) {
      minPrice = priceRange[0];
    }

    if (parseInt(priceRange[1]) < maxPrice) {
      maxPrice = priceRange[1];
    }
  }

  const minDefault = filtersData.price_lowest;
  const maxDefault = filtersData.price_highest;

  // Category

  let currentCategory = '';
  if (searchParams.has('category')) currentCategory = searchParams.get('category');

  // Manufacturers
  let selectedManufacturers = Array.from(filterSidebar.querySelectorAll('.filter-manufacturer:checked')).map(cb => cb.value);

  // Ratings
  const selectedRating = filterSidebar.querySelector('.filter-rating:checked')?.value || null;

  // Attributes
  const selectedAttributes = {};
  filterSidebar.querySelectorAll('.filter-attribute:checked').forEach(cb => {
    const nameId = cb.dataset.nameId;
    if (!selectedAttributes[nameId]) selectedAttributes[nameId] = [];
    selectedAttributes[nameId].push(encodeURIComponent(cb.value));
  });

  // Construct filterParams
  const filterParams = new URLSearchParams();

  filterParams.append('category', currentCategory);

  filterParams.append('p', page.toString());
  if (minPrice > minDefault || maxPrice < maxDefault) {
    filterParams.append('pr', `${minPrice}-${maxPrice}`);
  }
  else {
    filterParams.append('pr', `${minDefault}-${maxDefault}`);
  }
  if (selectedManufacturers.length)
    filterParams.append('m', selectedManufacturers.map(encodeURIComponent).join(','));
  else
  if (searchParams.has('m')) {
    searchParams.delete('m');
  }

  if (selectedRating)
    filterParams.append('r', selectedRating);
  else
  if (searchParams.has('r')) {
    searchParams.delete('r');
  }

  Object.keys(selectedAttributes).forEach(nameId => {
    if (selectedAttributes[nameId].length) filterParams.append(`a${nameId}`, selectedAttributes[nameId].join(','));
  });

  history.pushState({}, '', `${pageName}?${filterParams.toString()}`);

  // Fetch products
  // const backendPage = 0;
  const fetchUrl = `${Proxy_Url}/product/category-filter/${encodeURIComponent(currentCategory)}/pg${page-1}${filterParams.toString() ? '?' + filterParams.toString() : ''}`;
  console.log("Fetch URL:", fetchUrl);
  await getProducts(fetchUrl);
  hideFiltersMenu();
}

async function filterFromURL() {
  const searchParams = new URLSearchParams(window.location.search);

  const page = parseInt(searchParams.get('p'));
  const currentCategory = searchParams.get('category');

  searchParams.delete('p');
  searchParams.delete('category');

  const fetchUrl = `${Proxy_Url}/product/category-filter/${encodeURIComponent(currentCategory)}/pg${page-1}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  console.log("Fetch URL:", fetchUrl);
  await getProducts(fetchUrl);
}


function setFiltersFromParams() {
  const filterSidebar = document.getElementById('filter-sidebar');
  const minSlider = document.getElementById('min-price-slider');
  const maxSlider = document.getElementById('max-price-slider');
  const minText = document.getElementById('min-price-text');
  const maxText = document.getElementById('max-price-text');

  const searchParams = new URLSearchParams(window.location.search);

  // Support two URL formats:
  // 1) old style: minPrice & maxPrice (in cents)
  // 2) new compact style: p=min-max (in cents)
  let minCents = null;
  let maxCents = null;

  if (searchParams.has('pr')) {
    // p is like "1200-45000" (both in cents)
    const parts = searchParams.get('pr').split('-');
    if (parts.length === 2) {
      minCents = parseInt(parts[0], 10);
      maxCents = parseInt(parts[1], 10);
    }
  } else {
    if (searchParams.has('minPrice')) minCents = parseInt(searchParams.get('minPrice'), 10);
    if (searchParams.has('maxPrice')) maxCents = parseInt(searchParams.get('maxPrice'), 10);
  }

  // If we have parsed values, set sliders/texts accordingly (convert cents->euro)
  const minEuroDefault = parseFloat(minSlider.min);
  const maxEuroDefault = parseFloat(maxSlider.max);
  if (minCents !== null) {
    const minEuro = (minCents / 100);
    minSlider.value = Math.max(minEuro, minEuroDefault);
    minText.value = (+minSlider.value).toFixed(2);
  } else {
    minSlider.value = minEuroDefault;
    minText.value = (+minEuroDefault).toFixed(2);
  }
  if (maxCents !== null) {
    const maxEuro = (maxCents / 100);
    maxSlider.value = Math.min(maxEuro, maxEuroDefault);
    maxText.value = (+maxSlider.value).toFixed(2);
  } else {
    maxSlider.value = maxEuroDefault;
    maxText.value = (+maxEuroDefault).toFixed(2);
  }

  // Set checkboxes etc.
  const mans = searchParams.get('m')?.split(',').map(decodeURIComponent) || [];
  filterSidebar.querySelectorAll('.filter-manufacturer').forEach(cb => {
    cb.checked = mans.includes(cb.value);
  });

  const rat = searchParams.get('r');
  filterSidebar.querySelectorAll('.filter-rating').forEach(cb => {
    cb.checked = cb.value === rat;
  });

  // attributes like aAttrName=val1,val2
  filterSidebar.querySelectorAll('.filter-attribute').forEach(cb => {
    const nameId = cb.dataset.nameId;
    const attrParam = searchParams.get(`a${nameId}`)?.split(',').map(decodeURIComponent) || [];
    cb.checked = attrParam.includes(cb.value);
  });
}

function hideFiltersMenu() {
  document.getElementById('filter-overlay').style.display = 'none';
  document.getElementById('filter-sidebar').style.display = 'none';
}

async function resetFilters() {
  const minSlider = document.getElementById('min-price-slider');
  const maxSlider = document.getElementById('max-price-slider');
  const minText = document.getElementById('min-price-text');
  const maxText = document.getElementById('max-price-text');

  document.querySelectorAll('.filter-manufacturer, .filter-attribute, .filter-rating').forEach(cb => cb.checked = false);

  minSlider.value = minSlider.min;
  maxSlider.value = maxSlider.max;
  minText.value = parseFloat(minSlider.min).toFixed(2);
  maxText.value = parseFloat(maxSlider.max).toFixed(2);

  await applyFilters();
}

function calculateFilterCount() {
  const searchParams = new URLSearchParams(window.location.search);
  let count = 0;

  // console.log("SEARCH PARAMS: "+ searchParams);

  if (searchParams.has('pr')) {
    const [minC, maxC] = searchParams.get('pr').split('-').map(Number);
    if (minC > filtersData.price_lowest || maxC < filtersData.price_highest) count += 1;
  }

  count += (searchParams.get('m')?.split(',').length || 0);

  count += (searchParams.has('r') ? 1 : 0);

  searchParams.forEach((v, k) => {
    if (k.startsWith('a')) count += v.split(',').length;
  });

  return count;
}

function updateFilterButton() {
  const count = calculateFilterCount();
  const button = document.getElementById('filters-button');
  button.textContent = `филтри${count > 0 ? `(${count})` : ''}`;
}

document.addEventListener('DOMContentLoaded', async function modeHandler() {
  if (sessionStorage.getItem('customerId') && sessionStorage.getItem('customerName')) {
    let searchParams = new URLSearchParams(window.location.search);
    let page = parseInt(searchParams.get('p') || '1') - 1;
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
      searchParams.delete('p');
      extraParamsStr = searchParams.toString();
    }

    console.log("EXTRA PARAMS: " + extraParamsStr);

    switch (mode) {
      case "":
        break;
      case "manufacturer":
        document.title = `${modeDetails} продукти`;
        document.getElementById("product-mode-message").textContent = `Продукти на ${modeDetails}:`;
        fetchUrl = `${Proxy_Url}/product/manufacturer/${modeDetails}/p${page}`;
        break;
      case "category":
        document.title = `${modeDetails}`;
        document.getElementById("product-mode-message").textContent = `Продукти от категория ${modeDetails}:`;

        if (extraParamsStr==='')
      {
        fetchUrl = `${Proxy_Url}/product/category/${modeDetails}/p${page}${extraParamsStr ? '?' + extraParamsStr : ''}`;
      }
        filtersData = await fetchFilters(modeDetails);
        await filterFromURL();
        renderFilters(filtersData);
        document.querySelector('.product-controls').style.display = 'flex';

        document.getElementById('filters-button').addEventListener('click', () => {
          document.getElementById('filter-overlay').style.display = 'block';
          document.getElementById('filter-sidebar').style.display = 'block';
          setFiltersFromParams();
        });

        document.getElementById('filter-overlay').addEventListener('click', (e) => {
          if (e.target === document.getElementById('filter-overlay')) hideFiltersMenu();
        });

        document.getElementById('sort-select').addEventListener('change', (e) => {
          // TODO: Handle sorting logic here
        });

        break;
      case "search":
        fetchUrl = `${Proxy_Url}/product/search/${encodeURIComponent(modeDetails)}/${page}`;
        break;
      case "featured":
        fetchUrl = `${Proxy_Url}/product/featured/${page}`;
        break;
      default:
        fetchUrl = `${Proxy_Url}/product/featured/0}`;
        break;
    }
    if (fetchUrl!== '')
    {
      await getProducts(fetchUrl);
    }

  } else {
    window.location.href = "Login.html";
  }
});
