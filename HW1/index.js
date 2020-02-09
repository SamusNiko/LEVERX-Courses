let selectedStoreListItem;

const storeList = document.querySelector(".stores-list");
const searchStoreButton = document.querySelector(
  ".stores-search .search-button"
);

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

const createDetailsPage = store => {
  const detailsPage = document.querySelector(".details");
  detailsPage.innerHTML = "";
  const contacts = createDetailsContacts(store);
  const productsFilter = createProductsFilter(store);
  const tableFrame = createProductsTableFrame();
  detailsPage.appendChild(contacts);
  detailsPage.appendChild(productsFilter);
  detailsPage.appendChild(tableFrame);
  createProductsTableData(store);

  const productsSearchButton = document.querySelector(
    ".products-search .search-button"
  );
  productsSearchButton.addEventListener("click", () =>
    filterOfSearch("table-row", "products-search")
  );

  const table = document.querySelector(".products-table");
  table.addEventListener("click", e => {
    console.log(e);
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

const createProductsFilter = store => {
  const { rel_Products } = store;
  let productsOK = 0;
  let productsStorage = 0;
  let productsOutOfStock = 0;
  for (let i = 0; i < rel_Products.length; i++) {
    if (rel_Products[i].Status === "OK") {
      productsOK = productsOK + 1;
    } else if (rel_Products[i].Status === "STORAGE") {
      productsStorage = productsStorage + 1;
    } else productsOutOfStock = productsOutOfStock + 1;
  }
  const temp = document.querySelector("#template-filter-bar");
  temp.content.querySelector(
    ".filter-all span"
  ).textContent = `${rel_Products.length}`;
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
  const temp = document.querySelector(".template-table-frame");
  const item = document.importNode(temp.content, true);
  return item;
};

const createProductsTableData = store => {
  const { rel_Products } = store;
  const parent = document.querySelector(".products-table tbody");
  if (parent) {
    const temp = document.querySelector(".template-table-row");
    rel_Products.map((product, index) => {
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
      parent.appendChild(item);
    });
  }
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

const listItemOnClick = e => {
  const oldStoreListItem = selectedStoreListItem;
  const newStoreListItem = e.target.closest("li");
  const currentStore = Stores.find(store => store.id == newStoreListItem.id);
  makeSelectedCurrentListItem(oldStoreListItem, newStoreListItem);
  createDetailsPage(currentStore);
  console.log(currentStore);
};

const makeSelectedCurrentListItem = (oldElem, newElem) => {
  if (oldElem) {
    oldElem.classList.remove("selected");
    newElem.classList.add("selected");
    selectedStoreListItem = newElem;
  } else {
    newElem.classList.add("selected");
    selectedStoreListItem = newElem;
  }
};

storeList.addEventListener("click", listItemOnClick);
searchStoreButton.addEventListener("click", () =>
  filterOfSearch("list-item", "stores-search")
);

createStoresList(Stores);
