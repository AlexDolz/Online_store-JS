let cart = [];

function drawCart(products) {
  const cartDiv = document.createElement('div');
  cartDiv.classList.add('cart');

  const cartWrapper = document.createElement('div');
  cartWrapper.classList.add('cart_item_wrapper');

  const cartFooter = document.createElement('div');
  cartFooter.classList.add('cart_footer');
  const total = products.reduce((acc, value) => {
    return acc + value.price * value.qty;
  }, 0);
  cartFooter.innerHTML = `Total: ${total} $`;

  products.forEach(product => {
    const item = document.createElement('div');
    item.classList.add('cart_item');

    const img = document.createElement('img');
    img.classList.add('cart_item_image');
    img.src = product.image;

    const content = document.createElement('div');
    content.classList.add('cart_item_content');

    const title = document.createElement('div');
    title.classList.add('cart_item_content_title');
    title.innerHTML = product.title;

    const description = document.createElement('div');
    description.innerHTML = `${product.qty} x ${product.price} $ = ${
      product.qty * product.price
    } $`;

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('cart_item_delete');
    deleteBtn.innerHTML = 'X';
    deleteBtn.style.fontWeight = '900';

    deleteBtn.addEventListener('click', function () {
      cartWrapper.removeChild(item);
      cart = cart.filter(item => {
        return !(item.title === product.title && item.price === product.price);
      });
      const total = cart.reduce((acc, value) => {
        return acc + value.price * value.qty;
      }, 0);
      cartFooter.innerHTML = `Total: ${total} $`;
    });

    content.append(title, description);

    item.append(img, content, deleteBtn);

    cartWrapper.append(item);
  });

  function removeCart(evt) {
    let target = evt.target;
    while (target.parentNode) {
      if (target.classList.contains('cart')) {
        return;
      }
      target = target.parentNode;
    }
    document.body.removeChild(cartDiv);
    window.removeEventListener('click', removeCart, true);
  }

  window.addEventListener('click', removeCart, true);

  cartDiv.append(cartWrapper, cartFooter);

  document.body.append(cartDiv);
}

const cartBtn = document.querySelector('#cart_btn');
cartBtn.addEventListener('click', function () {
  drawCart(cart);
});

function drawProduct(product) {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  const category = document.createElement('div');
  category.classList.add('category', product.category);
  category.innerHTML = product.category;

  const image = document.createElement('img');
  image.classList.add('product_image');
  image.src = product.image;

  const content = document.createElement('div');
  content.classList.add('product_content');

  const title = document.createElement('div');
  title.classList.add('product_title');
  title.innerHTML = product.title;

  const productInfo = document.createElement('div');
  productInfo.classList.add('product_info');

  const productPrice = document.createElement('div');
  productPrice.classList.add('product_price');
  productPrice.innerHTML = `${product.price} $`;

  const btn = document.createElement('div');
  btn.classList.add('btn');
  btn.innerHTML = 'Add to Cart';
  btn.addEventListener('click', () => {
    const sameProduct = cart.find(item => {
      return item.title === product.title && item.price === product.price;
    });
    if (sameProduct) {
      sameProduct.qty = sameProduct.qty + 1;
    } else {
      cart.push({
        title: product.title,
        image: product.image,
        qty: 1,
        price: product.price,
      });
    }
    drawCart(cart);
  });

  const description = document.createElement('div');
  description.classList.add('product_description');
  description.innerHTML = product.description;

  productDiv.appendChild(category);
  productDiv.appendChild(image);
  productDiv.appendChild(content);
  content.appendChild(title);
  content.appendChild(productInfo);
  content.appendChild(description);
  productInfo.appendChild(productPrice);
  productInfo.appendChild(btn);
  document.getElementById('products').appendChild(productDiv);
}

function getRandomCategory() {
  const categories = ['meat', 'vegetable', 'seasoning'];
  const randomCategoryIndex = Math.floor(3 * Math.random());
  return categories[randomCategoryIndex];
}

function getRandomPrice(min, max) {
  const randomPrice = min + Math.floor((max - min + 1) * Math.random());
  return randomPrice;
}

function getRandomProduct() {
  const category = getRandomCategory();
  const randomId = 1 + Math.floor(1000 * Math.random());
  return {
    image: `img/${category}.jpg`,
    title: `Product ${randomId}`,
    description: `Description of Product ${randomId}`,
    price: getRandomPrice(25, 75),
    category: category,
  };
}

let originalProducts = [];

for (let i = 0; i < 500; i++) {
  originalProducts.push(getRandomProduct());
}

let products = [...originalProducts];

function drawProducts(arr) {
  document.getElementById('products').innerHTML = '';
  arr.forEach(drawProduct);
}

const itemsPerPage = 51;

function drawPaginator(totalItemsCount) {
  const paginator = document.getElementById('paginator');
  paginator.innerHTML = '';
  const itemsCount = Math.ceil(totalItemsCount / itemsPerPage);
  for (let i = 0; i < itemsCount; i++) {
    const item = document.createElement('div');
    item.classList.add('paginator_item');
    item.innerHTML = i + 1;
    item.addEventListener('click', () => {
      goToPage(i + 1);
    });
    paginator.appendChild(item);
  }
}

drawPaginator(products.length);

function goToPage(pageNum) {
  const items = document.getElementsByClassName('paginator_item');
  for (let i = 0; i < items.length; i++) {
    if (i === pageNum - 1) {
      items[i].classList.add('paginator_item-active');
    } else {
      items[i].classList.remove('paginator_item-active');
    }
  }
  const startIndex = itemsPerPage * (pageNum - 1);
  const endIndex = itemsPerPage * pageNum;
  const content = products.slice(startIndex, endIndex);
  drawProducts(content);
}
goToPage(1);

function makeSorting(field) {
  const button = document.getElementById(`${field}_sorting`);
  const elements = document.getElementsByClassName('sortings_item-active');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove('sortings_item-active');
  }
  button.classList.add('sortings_item-active');
  products = products.sort((a, b) => {
    const valueA = a[field]; // a.title or a.price
    const valueB = b[field]; // b.title or b.price
    if (field === 'title') {
      return valueA.localeCompare(valueB);
    } else {
      if (valueA > valueB) {
        return 1;
      } else {
        return -1;
      }
    }
  });
  goToPage(1);
}

const titleSorting = document.querySelector('#title_sorting');
const priceSorting = document.querySelector('#price_sorting');

titleSorting.addEventListener('click', () => {
  makeSorting('title');
});
priceSorting.addEventListener('click', () => {
  makeSorting('price');
});

const minPriceInput = document.querySelector('#min_price_input');
const maxPriceInput = document.querySelector('#max_price_input');
let selectedCategory = -1;

function search() {
  const minPrice = minPriceInput.value;
  const maxPrice = maxPriceInput.value;

  const isMinPriceValid = /^[0-9]*$/.test(minPrice);
  const isMaxPriceValid = /^[0-9]*$/.test(maxPrice);
  const isMinPriceLower =
    minPrice === '' ||
    maxPrice === '' ||
    parseInt(minPrice, 10) < parseInt(maxPrice, 10);

  if (isMinPriceValid && isMaxPriceValid && isMinPriceLower) {
    minPriceInput.classList.remove('filters_input-error');
    maxPriceInput.classList.remove('filters_input-error');
    const min = parseInt(minPrice, 10) || -Infinity;
    const max = parseInt(maxPrice, 10) || Infinity;
    products = originalProducts.filter(function (product) {
      const categories = ['meat', 'vegetable', 'seasoning'];
      const fitByPrice = product.price >= min && product.price <= max;
      const fitByCategory =
        selectedCategory === -1 ||
        product.category === categories[selectedCategory];
      return fitByPrice && fitByCategory;
    });
    drawPaginator(products.length);
    goToPage(1);
    const activeItems = document.getElementsByClassName('sortings_item-active');
    for (let i = 0; i < activeItems.length; i++) {
      activeItems[i].classList.remove('sortings_item-active');
    }
  } else {
    minPriceInput.classList.add('filters_input-error');
    maxPriceInput.classList.add('filters_input-error');
  }
}

function inputHandler(evt) {
  if (evt.key === 'Enter') {
    search();
  }
}
minPriceInput.addEventListener('keypress', inputHandler);
maxPriceInput.addEventListener('keydown', inputHandler);

const applyBtn = document.querySelector('#apply_btn');

applyBtn.addEventListener('click', search);

const headerItems = document.getElementsByClassName('header_item');
for (let i = 0; i < headerItems.length; i++) {
  headerItems[i].addEventListener('click', () => {
    for (let j = 0; j < headerItems.length; j++) {
      if (j === i) {
        headerItems[j].classList.add('header_item-active');
      } else {
        headerItems[j].classList.remove('header_item-active');
      }
    }
    selectedCategory = i - 1;
    search();
  });
}
