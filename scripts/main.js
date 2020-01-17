class Product {
  constructor(name, count, price) {
    this.name = name;
    this.count = count;
    this.price = price;
  }
}

let productUpdatingId = 0;
const tbody = document.querySelector('tbody');
let filter = '';
const triangleUpIcon = '▽';
const triangleDownIcon = '△';

// We store some initial products, just to improve user experience at this page
// Atm we don't want to confuse them with an empty starting table
let productArray = [
  new Product('арбузики', 5, 2812.43),
  new Product('вишня', 3, 444516.45),
  new Product('елки', 3, 2000000.45),
  new Product('щавель', 2, 100)
];

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

function formatCurrency(price) {
  if (price == '' || isNaN(price)) {
    return '';
  }
  return formatter.format(price);
}

window.addEventListener('load', redrawTableBody());

function redrawTableBody() {
  tbody.textContent = '';
  productArray.forEach((product, id) => {
    const tableRow = document.createElement('tr');
    const nameTd = document.createElement('td');
    const nameDiv = document.createElement('div');
    const nameLink = document.createElement('a');
    const nameSpan = document.createElement('span');
    const priceTd = document.createElement('td');
    const actionsTd = document.createElement('td');
    const actionsButtonEdit = document.createElement('button');
    const actionsButtonEditSpan = document.createElement('span');
    const actionsButtonEditIcon = document.createElement('i');
    const actionsButtonDelete = document.createElement('button');
    const actionsButtonDeleteSpan = document.createElement('span');
    const actionsButtonDeleteIcon = document.createElement('i');

    nameTd.className = 'text-left';
    nameDiv.className =
      'ml-2 ml-md-3 d-flex justify-content-between align-items-center';
    nameLink.className = 'productLink';
    nameLink.setAttribute('href', '#');
    nameLink.textContent = product.name;
    nameSpan.className = 'badge badge-pill badge-success px-2';
    nameSpan.textContent = product.count;

    nameDiv.appendChild(nameLink);
    nameDiv.appendChild(nameSpan);
    nameTd.appendChild(nameDiv);

    priceTd.textContent = formatCurrency(product.price);

    actionsButtonEdit.className =
      'btn btn-outline-dark m-1 mr-lg-2 px-lg-4 btn-edit';
    actionsButtonEdit.setAttribute('data-toggle', 'modal');
    actionsButtonEdit.setAttribute('data-target', '#submitModal');
    actionsButtonEditSpan.className = 'd-none d-lg-block';
    actionsButtonEditSpan.textContent = 'Edit';
    actionsButtonEdit.appendChild(actionsButtonEditSpan);
    actionsButtonEditIcon.className = 'd-lg-none d-xl-none far fa-edit';
    actionsButtonEdit.appendChild(actionsButtonEditIcon);

    actionsButtonDelete.className =
      'btn btn-outline-danger m-1 ml-lg-2 px-lg-4 btn-delete';
    actionsButtonDelete.setAttribute('data-toggle', 'modal');
    actionsButtonDelete.setAttribute('data-target', '#deleteModal');
    actionsButtonDeleteSpan.className = 'd-none d-lg-block';
    actionsButtonDeleteSpan.textContent = 'Delete';
    actionsButtonDelete.appendChild(actionsButtonDeleteSpan);
    actionsButtonDeleteIcon.className = 'd-lg-none d-xl-none fa fa-trash';
    actionsButtonDelete.appendChild(actionsButtonDeleteIcon);

    actionsTd.appendChild(actionsButtonEdit);
    actionsTd.appendChild(actionsButtonDelete);

    tableRow.setAttribute('id', id);
    tableRow.appendChild(nameTd);
    tableRow.appendChild(priceTd);
    tableRow.appendChild(actionsTd);

    tbody.appendChild(tableRow);
  });

  // Example of a result table row:
  // --------------------
  // <tr>
  //  <td class="text-left">
  //   <div class="ml-2 ml-md-3 d-flex justify-content-between align-items-center">
  //      <a href="" class="productLink">Товар 2</a>
  //      <span class="badge badge-pill badge-success px-2">2</span>
  //   </div>
  //  </td>
  //  <td>12.5</td>
  //  <td>
  //      <button class="btn btn-outline-dark m-1 mr-lg-2 px-sm-4 btn-edit">Edit</button>
  //      <button class="btn btn-outline-danger m-1 ml-lg-2 px-sm-4 btn-delete">Delete</button>
  //  </td>
  // </tr>
  // --------------------
}

//Add or Update button
document.getElementById('submitProduct').addEventListener('click', e => {
  const name = document.getElementById('inputName').value;
  const count = document.getElementById('inputCount').value;
  let price = document.getElementById('inputPrice').value;
  price = price.replace(/\$|,/g, '');

  let formInvalid = validate(name, count, price);

  if (!formInvalid) {
    if (e.target.textContent == 'Update') {
      productArray.splice(
        productUpdatingId,
        1,
        new Product(name, count, price)
      );
    } else {
      productArray.push(new Product(name, count, price));
    }
    sortProducts(sortBy, sortDirection);
    redrawTableBody();
    filterProducts(filter);
    $('#submitModal').modal('hide');
  }
  e.preventDefault();
});

function validate(name, count, price) {
  let formInvalid = false;
  if (name.length == 0) {
    document.getElementById('name-invalid-feedback').textContent =
      'Имя не может быть пустым';
    document.getElementById('inputName').classList.add('is-invalid');
    formInvalid = true;
  }
  if (
    !name.replace(/\s/g, '').length ||
    name.length > 15 ||
    parseFloat(count) < 0 ||
    parseFloat(price) < 0 ||
    count.includes('-') ||
    price.includes('-')
  ) {
    formInvalid = true;
  }

  return formInvalid;
}

function resetValidation() {
  document.getElementById('inputName').classList.remove('is-invalid');
  document.getElementById('inputCount').classList.remove('is-invalid');
  document.getElementById('inputPrice').classList.remove('is-invalid');
}

function cleanInputForm() {
  document.getElementById('inputName').value = '';
  document.getElementById('inputCount').value = '';
  document.getElementById('inputPrice').value = '';
}

// 'Delete' button
let idToDelete;

document.querySelector('table').addEventListener('click', e => {
  if (e.target.classList.contains('btn-delete')) {
    idToDelete = e.target.parentNode.parentNode.getAttribute('id');
  } else if (e.target.parentNode.classList.contains('btn-delete')) {
    idToDelete = e.target.parentNode.parentNode.parentNode.getAttribute('id');
  }
  e.preventDefault();
});

document.getElementById('deleteConfirmBtn').addEventListener('click', () => {
  removeProduct(idToDelete);
  redrawTableBody();
  filterProducts(filter);
  resetValidation();
});

function removeProduct(id) {
  productArray.splice(id, 1);
}

// 'Edit' button
document.querySelector('table').addEventListener('click', e => {
  if (
    e.target.classList.contains('btn-edit') ||
    e.target.parentNode.classList.contains('btn-edit')
  ) {
    productUpdatingId = e.target.classList.contains('btn-edit')
      ? e.target.parentNode.parentNode.getAttribute('id')
      : e.target.parentNode.parentNode.parentNode.getAttribute('id');
    document.getElementById('inputName').value =
      productArray[productUpdatingId].name;
    document.getElementById('inputCount').value =
      productArray[productUpdatingId].count;
    document.getElementById('inputPrice').value = formatCurrency(
      productArray[productUpdatingId].price
    );
    document.getElementById('submitProduct').textContent = 'Update';
    e.preventDefault();
  }
});

// 'Add New' button
document.getElementById('addNewBtn').addEventListener('click', () => {
  document.getElementById('submitProduct').textContent = 'Add';
  cleanInputForm();
  resetValidation();
});

document.getElementById('searchBtn').addEventListener('click', e => {
  filter = document.getElementById('searchFilter').value.toUpperCase();
  if (filter != '') {
    filterProducts(filter);
  }
  e.preventDefault();
});

function filterProducts(pattern) {
  productArray.forEach((product, index) => {
    if (product.name.toUpperCase().includes(pattern)) {
      document.getElementById(index).setAttribute('class', '');
    } else {
      document.getElementById(index).setAttribute('class', 'd-none');
    }
  });
}

let sortBy = '';
let sortDirection = '';

document.getElementById('sortByName').addEventListener('click', e => {
  e.target.textContent = toggleIcon(e.target.textContent);
  sortBy = 'name';
  if (e.target.textContent == triangleDownIcon) {
    sortDirection = 'down';
    productArray.sort((a, b) => (a.name > b.name ? 1 : -1));
  } else {
    sortDirection = 'up';
    productArray.sort((a, b) => (a.name < b.name ? 1 : -1));
  }
  redrawTableBody();
  filterProducts(filter);
  e.preventDefault();
});

document.getElementById('sortPrices').addEventListener('click', e => {
  e.target.textContent = toggleIcon(e.target.textContent);
  sortBy = 'price';
  if (e.target.textContent == triangleDownIcon) {
    sortDirection = 'down';
    productArray.sort((a, b) => a.price - b.price);
  } else {
    sortDirection = 'up';
    productArray.sort((a, b) => b.price - a.price);
  }
  redrawTableBody();
  filterProducts(filter);
  e.preventDefault();
});

function sortProducts(sortBy, sortDirection) {
  if (sortBy == 'price') {
    if (sortDirection == 'up') {
      productArray.sort((a, b) => b.price - a.price);
    } else if ((sortDirection = 'down')) {
      productArray.sort((a, b) => a.price - b.price);
    }
  } else if (sortBy == 'name') {
    if (sortDirection == 'down') {
      productArray.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if ((sortDirection = 'up')) {
      productArray.sort((a, b) => (a.name < b.name ? 1 : -1));
    }
  }
}

function toggleIcon(icon) {
  return icon == triangleUpIcon ? triangleDownIcon : triangleUpIcon;
}

document.getElementById('inputName').addEventListener('blur', () => {
  document
    .getElementById('nameLabel')
    .classList.remove('border', 'border-success');
  const name = document.getElementById('inputName').value;
  let invalidMessage = '';
  if (name.length == 0) {
    invalidMessage = 'Имя не может быть пустым';
  } else if (!name.replace(/\s/g, '').length) {
    invalidMessage = 'Имя не может состоять исключительно из пробелов';
  } else if (name.length > 15) {
    invalidMessage = 'Имя не может быть более 15 символов';
  }
  if (invalidMessage != '') {
    document.getElementById(
      'name-invalid-feedback'
    ).textContent = invalidMessage;
    document.getElementById('inputName').classList.add('is-invalid');
  } else {
    document.getElementById('inputName').classList.remove('is-invalid');
  }
});

document.getElementById('inputCount').addEventListener('blur', () => {
  document
    .getElementById('countLabel')
    .classList.remove('border', 'border-success');
  const count = document.getElementById('inputCount').value;
  if (parseFloat(count) < 0 || count.includes('-')) {
    document.getElementById('inputCount').classList.add('is-invalid');
  } else {
    document.getElementById('inputCount').classList.remove('is-invalid');
  }
});

document.getElementById('inputPrice').addEventListener('blur', () => {
  document
    .getElementById('priceLabel')
    .classList.remove('border', 'border-success');
  let price = document.getElementById('inputPrice').value;
  price = price.replace(/\$|,/g, '');
  if (parseFloat(price) < 0 || price.includes('-')) {
    document.getElementById('inputPrice').classList.add('is-invalid');
  } else {
    document.getElementById('inputPrice').classList.remove('is-invalid');
  }
  document.getElementById('inputPrice').value = formatCurrency(price);
});

document.querySelector('.close').addEventListener('click', () => {
  resetValidation();
});

document.getElementById('inputName').addEventListener('focus', () => {
  document
    .getElementById('nameLabel')
    .classList.add('border', 'border-success');
});

document.getElementById('inputCount').addEventListener('focus', () => {
  document
    .getElementById('countLabel')
    .classList.add('border', 'border-success');
});

document.getElementById('inputPrice').addEventListener('focus', () => {
  document
    .getElementById('priceLabel')
    .classList.add('border', 'border-success');
});
