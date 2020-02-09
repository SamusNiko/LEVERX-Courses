const _URL = "http://localhost:3000/api/";
let selectedStore;
let selectedFilterStatus;
let currentStoreData = null;
let Stores;
let Products;

const storeList = document.querySelector(".stores-list");
const detailsPage = document.querySelector(".details");
const searchStoreButton = document.querySelector(
  ".stores-search .search-button"
);

const getStoresFetch = () => {
  fetch(_URL + "Stores")
    .then(response => response.json())
    .then(data => (Stores = data))
    .then(() => createStoresList(Stores))
    .catch(error => console.log(error));
};

const getStoreProductsByIdFetch = id => {
  const products = fetch(_URL + `/Stores/${id}/rel_Products`).then(response =>
    (Products = response.json()).then(data => (Products = data))
  );
  return products;
};

const renderDetailsPage = store => {
  getStoreProductsByIdFetch(store.id).then(products => {
    createDetailsPage(store, products);
  });
};

const renderDefaultDetailsPage = () => {
  detailsPage.innerHTML = "";
  const temp = document.querySelector("#template-default-details-page");
  const item = document.importNode(temp.content, true);
  detailsPage.appendChild(item);
};

const renderTable = products => {
  const tableBody = document.querySelector(".products-table tbody");
  const tableHeader = document.querySelector(".products-table thead");
  const theadData = createProductsTableFrame();
  const data = createProductsTableData(products);
  if (tableBody) {
    tableBody.innerHTML = "";
    tableHeader.innerHTML = "";
    tableHeader.appendChild(theadData);
    data.map(item => tableBody.appendChild(item));
  }
};

const createStoresList = stores => {
  storeList.innerHTML = "";
  const temp = document.querySelector("#template-list-item");
  const listItem = temp.content.querySelector(".list-item");
  const itemName = temp.content.querySelector(".list-item-name");
  const itemAddress = temp.content.querySelector(".list-item-address");
  const itemSquare = temp.content.querySelector(".list-item-area span");
  stores.map(elem => {
    listItem.id = `${elem.id}`;
    itemName.textContent = elem.Name;
    itemAddress.textContent = elem.Address;
    itemSquare.textContent = elem.FloorArea;
    const item = document.importNode(temp.content, true);
    storeList.appendChild(item);
  });
};

const getSortTable = e => {
  const { target } = e;
  const thElem = target.parentNode;
  const order = (thElem.dataset.order = -(thElem.dataset.order || -1));
  const index = [...thElem.parentNode.cells].indexOf(thElem);
  const collator = new Intl.Collator(["en", "ru"], { numeric: true });
  const comparator = (index, order) => (a, b) =>
    order *
    collator.compare(a.children[index].innerHTML, b.children[index].innerHTML);
  for (const tBody of thElem.closest("table").tBodies)
    tBody.append(...[...tBody.rows].sort(comparator(index, order)));
  for (const cell of thElem.parentNode.cells)
    cell.classList.toggle("sorted", cell === thElem);
};

const createDetailsPage = (store, products) => {
  detailsPage.innerHTML = "";
  const contacts = createDetailsContacts(store);
  const productsFilter = createProductsFilter(products);
  detailsPage.appendChild(contacts);
  detailsPage.appendChild(productsFilter);
  renderTable(products);
  const productsSearchButton = document.querySelector(
    ".products-search .search-button"
  );
  productsSearchButton.addEventListener("click", () =>
    filterOfSearch("table-row", "products-search")
  );

  const tableFilter = document.querySelector(".products-filter");
  tableFilter.addEventListener("click", e => {
    if (e.target.closest(".filter")) {
      const oldFilterStatus = selectedFilterStatus;
      const currentFilterStatus = e.target.closest(".filter").attributes.status
        .value;
      if (currentFilterStatus !== oldFilterStatus) {
        makeSelectedCurrentTableFilter(oldFilterStatus, currentFilterStatus);
        filterProductsByStatus(currentFilterStatus);
      }
    }
  });
};

const createDetailsContacts = store => {
  const temp = document.querySelector("#template-details-contacts");
  temp.content.querySelector(
    ".contacts-email p"
  ).textContent = `${store.Email}`;
  temp.content.querySelector(
    ".contacts-phone p"
  ).textContent = `${store.PhoneNumber}`;
  temp.content.querySelector(
    ".contacts-address p"
  ).textContent = `${store.Address}`;
  temp.content.querySelector(
    ".contacts-established p"
  ).textContent = `${dateConversion(store.Established)}`;
  temp.content.querySelector(
    ".contacts-area p"
  ).textContent = `${store.FloorArea}`;
  const item = document.importNode(temp.content, true);
  return item;
};

const createProductsFilter = products => {
  let productsOK = 0;
  let productsStorage = 0;
  let productsOutOfStock = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].Status === "OK") {
      productsOK = productsOK + 1;
    } else if (products[i].Status === "STORAGE") {
      productsStorage = productsStorage + 1;
    } else productsOutOfStock = productsOutOfStock + 1;
  }
  const temp = document.querySelector("#template-filter-bar");
  temp.content.querySelector(
    ".filter-all span"
  ).textContent = `${products.length}`;
  temp.content.querySelector(
    ".filter-ok .number-of-elements"
  ).textContent = productsOK;
  temp.content.querySelector(
    ".filter-storage .number-of-elements"
  ).textContent = productsStorage;
  temp.content.querySelector(
    ".filter-out-of-stock .number-of-elements"
  ).textContent = productsOutOfStock;
  const item = document.importNode(temp.content, true);
  return item;
};

const createProductsTableFrame = () => {
  const temp = document.querySelector(".template-table-legend");
  const item = document.importNode(temp.content, true);
  return item;
};

const createProductsTableData = products => {
  const arrayItem = [];
  const temp = document.querySelector(".template-table-row");
  products.map(product => {
    temp.content.querySelector(".table-row").attributes.prodId.value =
      product.id;
    temp.content.querySelector(".tb-name b").textContent = product.Name;
    temp.content.querySelector(".tb-price b").textContent = product.Price;
    temp.content.querySelector(".tb-specs").textContent = product.Specs;
    temp.content.querySelector(".tb-supplier-info").textContent =
      product.SupplierInfo;
    temp.content.querySelector(".tb-country").textContent = product.MadeIn;
    temp.content.querySelector(".tb-prod-company").textContent =
      product.ProductionCompanyName;
    temp.content.querySelector(".tb-rating").innerHTML = createProductRating(
      product.Rating
    );
    const item = document.importNode(temp.content, true);
    arrayItem.push(item);
  });
  return arrayItem;
};

const createProductRating = rating => {
  const MAX_RATING = 5;
  let ratingHTML = "";
  for (let i = 0; i < MAX_RATING; i++) {
    if (i < rating) {
      ratingHTML =
        ratingHTML + '<i class="fas fa-star bright-rating-star"></i>';
    } else ratingHTML = ratingHTML + '<i class="far fa-star"></i>';
  }
  return ratingHTML;
};

const dateConversion = date => {
  const currentDate = new Date(date);
  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  const newDate = currentDate.toLocaleString("en-US", dateOptions);
  return newDate;
};

const filterOfSearch = (searchItemsClassName, inputClassName) => {
  const listItems = document.querySelectorAll(`.${searchItemsClassName}`);
  const inputValue = document
    .querySelector(`.${inputClassName} input`)
    .value.toUpperCase();
  for (let i = 0; i < listItems.length; i++) {
    txtValue = listItems[i].textContent;
    if (txtValue.toUpperCase().indexOf(inputValue) > -1) {
      listItems[i].style.display = "";
    } else {
      listItems[i].style.display = "none";
    }
  }
};

const filterProductsByStatus = status => {
  const filteredProducts = [];
  if (status != "all") {
    for (let i = 0; i < Products.length; i++) {
      prodStatus = Products[i].Status;
      if (prodStatus.toUpperCase() == status.toUpperCase()) {
        filteredProducts.push(Products[i]);
      }
    }
    renderTable(filteredProducts);
  } else {
    renderTable(Products);
  }
};

const listItemOnClick = e => {
  const oldSelectedStore = selectedStore;
  const newSelectedStore = e.target.closest("li");
  currentStoreData = Stores.find(store => store.id == newSelectedStore.id);
  makeSelectedCurrentListItem(oldSelectedStore, newSelectedStore);
  renderDetailsPage(currentStoreData);
};

const makeSelectedCurrentTableFilter = (oldFilterStatus, newFilterStatus) => {
  const newFilterElem = document.querySelector(`.${newFilterStatus}`);
  if (oldFilterStatus) {
    const oldFilterElem = document.querySelector(`.${oldFilterStatus}`);
    newFilterElem.classList.add(`${newFilterStatus}-selected`);
    oldFilterElem.classList.remove(`${oldFilterStatus}-selected`);
    selectedFilterStatus = newFilterStatus;
  } else {
    newFilterElem.classList.add(`${newFilterStatus}-selected`);
    selectedFilterStatus = newFilterStatus;
  }
};

const makeSelectedCurrentListItem = (oldElem, newElem) => {
  if (oldElem) {
    oldElem.classList.remove("selected");
    newElem.classList.add("selected");
    selectedStore = newElem;
  } else {
    newElem.classList.add("selected");
    selectedStore = newElem;
  }
};

const showModalStoreCreate = () => {
  const createBtn = document.querySelector(".store-create");
  let favDialog = document.querySelector(`#create-store-popup`);
  createBtn.addEventListener("click", () => favDialog.showModal());
  let cancelButtonPopup = document.querySelector(
    `#create-store-popup .popup-cancel-btn`
  );
  let createButtonPopup = document.querySelector(
    `#create-store-popup .popup-create-btn`
  );
  let form = document.querySelector(`#create-store-popup form`);

  createButtonPopup.addEventListener("click", () => {
    createNewStoreFetch(form.elements);
    favDialog.close();
  });
  cancelButtonPopup.addEventListener("click", () => favDialog.close());
};

const showModalProductCreate = () => {
  let favDialog = document.querySelector(`#create-product-popup`);
  detailsPage.addEventListener("click", e => {
    if (e.target.closest(".product-create-btn")) favDialog.showModal();
  });
  let cancelButtonPopup = document.querySelector(
    `#create-product-popup .popup-cancel-btn`
  );
  let createButtonPopup = document.querySelector(
    `#create-product-popup .popup-create-btn`
  );
  let form = document.querySelector(`#create-product-popup form`);

  createButtonPopup.addEventListener("click", () => {
    createNewProductFetch(form.elements);
    favDialog.close();
  });
  cancelButtonPopup.addEventListener("click", () => favDialog.close());
};

const createNewStoreFetch = data => {
  const newStore = {
    Name: data.Name.value,
    Email: data.Email.value,
    PhoneNumber: data.PhoneNumber.value,
    Address: data.Address.value,
    Established: data.Date.value,
    FloorArea: data.FloorArea.value
  };
  fetch(_URL + "Stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(newStore)
  }).then(response => {
    if (response.ok) getStoresFetch();
  });
};

const deleteStoreByIdFetch = id => {
  const confirmed = confirm("Are you shur you want to delete this store?");
  if (confirmed) {
    fetch(_URL + `Stores/${id}`, { method: "DELETE" }).then(response => {
      if (response.ok) {
        selectedStore = null;
        getStoresFetch();
        renderDefaultDetailsPage();
      }
    });
  }
};

const createNewProductFetch = data => {
  const newStore = {
    Name: data.Name.value,
    Price: data.Price.value,
    Photo: null,
    Specs: data.Specs.value,
    Rating: data.Rating.value,
    SupplierInfo: data.SupplierInfo.value,
    MadeIn: data.MadeIn.value,
    ProductionCompanyName: data.ProductionCompanyName.value,
    Status: data.Status.value,
    StoreId: currentStoreData.id
  };
  fetch(_URL + "Products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(newStore)
  }).then(response => {
    if (response.ok) renderDetailsPage(currentStoreData);
  });
};

const deleteProductFromStoreByIdFetch = id => {
  const confirmed = confirm("Are you shur you want to delete this product?");
  if (confirmed) {
    fetch(_URL + `Products/${id}`, { method: "DELETE" }).then(response => {
      if (response.ok) renderDetailsPage(currentStoreData);
    });
  }
};

detailsPage.addEventListener("click", e => {
  if (e.target.closest(".delete-products-btn")) {
    const prodId = e.target.closest(".table-row").attributes.prodId.value;
    deleteProductFromStoreByIdFetch(prodId);
  }
});

detailsPage.addEventListener("click", e => {
  if (e.target.closest("th button")) {
    getSortTable(e);
  }
});

detailsPage.addEventListener("click", e => {
  if (e.target.closest(".store-delete-btn")) {
    deleteStoreByIdFetch(selectedStore.id);
  }
});

getStoresFetch();

storeList.addEventListener("click", listItemOnClick);
searchStoreButton.addEventListener("click", () =>
  filterOfSearch("list-item", "stores-search")
);
showModalStoreCreate();
showModalProductCreate();
