/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View() {
  /**
   * ID of the "stores list" DOM element
   * @constant
   * @type {string}
   */
  const STORES_LIST_ID = "stores-list";

  /**
   * ID of the "details page" DOM element
   * @constant
   * @type {string}
   */
  const DETAILS_PAGE_ID = "details-page";

  /**
   * ID of the "create store" button DOM element
   * @constant
   * @type {string}
   */
  const CREATE_STORE_BUTTON_ID = "create-store-btn";

  /**
   * ID of the "search product" button DOM element
   * @constant
   * @type {string}
   */
  const SEARCH_STORES_BUTTON_ID = "stores-search-button";

  /**
   * Returns the form of popup element .
   *
   * @returns {HTMLFormElement} the form element.
   *
   * @param {string} id id of form element
   *
   * @public
   */
  this.getFormOfPopup = id => {
    return document.querySelector("#" + id);
  };

  /**
   * Returns the popup element .
   *
   * @returns {HTMLDialogElement} the dialog element.
   *
   * @param {string} id id of dialog element
   *
   * @public
   */
  this.getPopup = id => {
    return document.querySelector("#" + id);
  };

  /**
   * Returns the search store button.
   *
   * @returns {HTMLButtonElement} the button element.
   *
   * @public
   */
  this.getStoresSearchButton = () => {
    return document.querySelector("#" + SEARCH_STORES_BUTTON_ID);
  };

  /**
   * Returns the create store button.
   *
   * @returns {HTMLButtonElement} the button element.
   *
   * @public
   */
  this.getCreateStoreButton = () => {
    return document.querySelector("#" + CREATE_STORE_BUTTON_ID);
  };

  /**
   * Returns the store list element.
   *
   * @returns {HTMLDivElement} the div element.
   *
   * @public
   */
  this.getStoresList = () => {
    return document.querySelector("#" + STORES_LIST_ID);
  };

  /**
   * Returns the details page element.
   *
   * @returns {HTMLDivElement} the div element.
   *
   * @public
   */
  this.getDetailsPage = () => {
    return document.querySelector("#" + DETAILS_PAGE_ID);
  };

  /**
   * Render details page with store data and products data
   *
   * @param {object} store the object of store data
   * @param {array} products the array of products objects
   *
   * @public
   */
  this.renderDetailsPage = (store, products) => {
    const detailsPage = this.getDetailsPage();
    detailsPage.innerHTML = "";
    const contacts = this.createDetailsContacts(store);
    const productsFilter = this.createProductsFilter(products);
    detailsPage.appendChild(contacts);
    detailsPage.appendChild(productsFilter);
    this.renderTable(products);
  };

  /**
   * Renders default details page
   * @public
   */
  this.renderDefaultDetailsPage = () => {
    const detailsPage = this.getDetailsPage();
    detailsPage.innerHTML = "";
    const template = document.querySelector("#template-default-details-page");
    const item = document.importNode(template.content, true);
    detailsPage.appendChild(item);
  };

  /**
   * Renders table with products data
   * @param {array} products the array of products objects
   *
   * @public
   */
  this.renderTable = products => {
    const tableBody = document.querySelector(".products-table tbody");
    const tableHeader = document.querySelector(".products-table thead");
    const theadData = this.createProductsTableHeader();
    const data = this.createProductsTableData(products);
    tableBody.innerHTML = "";
    tableHeader.innerHTML = "";
    tableHeader.appendChild(theadData);
    data.forEach(item => tableBody.appendChild(item));
  };

  /**
   * Renders stores list
   *
   * @param {array} stores the array of stores objects
   *
   * @public
   */
  this.renderStoresList = stores => {
    const storesList = this.getStoresList();
    storesList.innerHTML = "";
    stores.forEach(elem => {
      const listItem = this.createStoreListItem(elem);
      storesList.appendChild(listItem);
    });
  };

  /**
   * Creates store list item
   *
   * @param {object} store the object of store
   *
   * @returns {HTMLListElements} the HTML list item element
   *
   * @public
   */

  this.createStoreListItem = store => {
    const template = document.querySelector("#template-list-item");
    const item = document.importNode(template.content, true);
    const listItem = item.querySelector(".list-item");
    const itemName = item.querySelector(".list-item-name");
    const itemAddress = item.querySelector(".list-item-address");
    const itemSquare = item.querySelector(".list-item-area span");
    listItem.dataset.id = `${store.id}`;
    itemName.textContent = store.Name;
    itemAddress.textContent = store.Address;
    itemSquare.textContent = store.FloorArea;

    return item;
  };

  /**
   * Renders details page with store data and products data
   *
   * @param {object} store the object of store data
   * @param {array} products the array of products objects
   *
   * @public
   */
  this.renderDetailsPage = (store, products) => {
    const detailsPage = this.getDetailsPage();
    detailsPage.innerHTML = "";
    const contacts = this.createDetailsContacts(store);
    const productsFilter = this.createProductsFilter(products);
    detailsPage.appendChild(contacts);
    detailsPage.appendChild(productsFilter);
    this.renderTable(products);
  };

  /**
   * Creates HTML element with contacts details
   *
   * @returns HTML markup
   *
   * @param {object} store  the store data object
   *
   * @public
   */
  this.createDetailsContacts = store => {
    const template = document.querySelector("#template-details-contacts");
    const item = document.importNode(template.content, true);
    const storeEmail = item.querySelector(".contacts-email");
    const storePhone = item.querySelector(".contacts-phone");
    const storeAddres = item.querySelector(".contacts-address");
    const storeEstablished = item.querySelector(".contacts-established");
    const storeArea = item.querySelector(".contacts-area");

    storeEmail.innerHTML = `<span>Email</span>${store.Email}`;
    storePhone.innerHTML = `<span>Phone Number</span>${store.PhoneNumber}`;
    storeAddres.innerHTML = `<span>Address</span>${store.Address}`;
    storeEstablished.innerHTML = `<span>Established Date</span>${this.dateConversion(
      store.Established
    )}`;
    storeArea.innerHTML = `<span>Floor Area</span>${store.FloorArea}`;

    return item;
  };

  /**
   * Сreates a filter bar  based on product data
   *
   * @returns HTML markup
   *
   * @param {object} products  the store data object
   *
   * @public
   */
  this.createProductsFilter = products => {
    let productsOK = 0;
    let productsStorage = 0;
    let productsOutOfStock = 0;
    for (let i = 0; i < products.length; i++) {
      if (products[i].Status === "OK") {
        productsOK = productsOK + 1;
      } else if (products[i].Status === "STORAGE") {
        productsStorage = productsStorage + 1;
      } else {
        productsOutOfStock = productsOutOfStock + 1;
      }
    }

    const template = document.querySelector("#template-filter-bar");
    const item = document.importNode(template.content, true);
    const filterAll = item.querySelector(".filter-all span");
    const filterOk = item.querySelector(".filter-ok .number-of-elements");
    const filterStorage = item.querySelector(
      ".filter-storage .number-of-elements"
    );
    const filterOutOfStock = item.querySelector(
      ".filter-out-of-stock .number-of-elements"
    );

    filterAll.textContent = `${products.length}`;
    filterOk.textContent = productsOK;
    filterStorage.textContent = productsStorage;
    filterOutOfStock.textContent = productsOutOfStock;

    return item;
  };

  /**
   * Creates table header
   *
   * @returns {HTMLTableRowElement} table row (tr) element
   *
   * @public
   */
  this.createProductsTableHeader = () => {
    const template = document.querySelector(".template-table-legend");
    const item = document.importNode(template.content, true);
    return item;
  };

  /**
   * Creates array of table row elements with products data
   *
   * @param {array} products the array of products objects
   *
   * @returns {array} array of table row
   *
   * @public
   *
   */
  this.createProductsTableData = products => {
    const arrayItem = [];
    products.forEach(product => {
      const item = this.createTableRow(product);
      arrayItem.push(item);
    });
    return arrayItem;
  };

  /**
   * Create table row with product data
   *
   * @param {object} product the product object
   *
   * @returns {HTMLTableRowElement}the HTML table row element
   *
   * @public
   */

  this.createTableRow = product => {
    const template = document.querySelector(".template-table-row");
    const item = document.importNode(template.content, true);
    const itemId = item.querySelector(".table-row");
    const itemName = item.querySelector(".tb-name b");
    const itemPrice = item.querySelector(".tb-price b");
    const itemSpecs = item.querySelector(".tb-specs");
    const itemSupplierInfo = item.querySelector(".tb-supplier-info");
    const itemMadeIn = item.querySelector(".tb-country");
    const itemCompanyName = item.querySelector(".tb-prod-company");
    const itemRating = item.querySelector(".tb-rating");

    itemId.dataset.id = product.id;
    itemName.textContent = product.Name;
    itemPrice.textContent = product.Price;
    itemSpecs.textContent = product.Specs;
    itemSupplierInfo.textContent = product.SupplierInfo;
    itemMadeIn.textContent = product.MadeIn;
    itemCompanyName.textContent = product.ProductionCompanyName;
    itemRating.innerHTML = this.createProductRating(product.Rating);
    return item;
  };

  /**
   * Sorts table depending on the selected column
   *
   * @param {Event} e the DOM event object
   *
   * @public
   */
  this.getSortTable = e => {
    const { target } = e;
    const thElem = target.parentNode;
    const order = (thElem.dataset.order = -(thElem.dataset.order || -1));
    const index = [...thElem.parentNode.cells].indexOf(thElem);
    const collator = new Intl.Collator(["en", "ru"], { numeric: true });
    const comparator = (index, order) => (a, b) =>
      order *
      collator.compare(
        a.children[index].innerHTML,
        b.children[index].innerHTML
      );
    for (const tBody of thElem.closest("table").tBodies)
      tBody.append(...[...tBody.rows].sort(comparator(index, order)));
    for (const cell of thElem.parentNode.cells)
      cell.classList.toggle("sorted", cell === thElem);
  };

  /**
   * Creates product rating
   *
   * @param {string|number} rating rating of product
   *
   * @returns {string} HTML markup
   *
   * @public
   */
  this.createProductRating = rating => {
    const MAX_RATING = 5;
    let ratingHTML = "";
    for (let i = 0; i < MAX_RATING; i++) {
      if (i < rating) {
        ratingHTML =
          ratingHTML + '<i class="fas fa-star bright-rating-star"></i>';
      } else {
        ratingHTML = ratingHTML + '<i class="far fa-star"></i>';
      }
    }
    return ratingHTML;
  };

  /**
   * Formats date from this view "2019-11-21T11:40:52.259Z" to "Nov 21, 2019"
   *
   * @param {string} date
   *
   * @returns {stirng} formated date
   *
   * @public
   */
  this.dateConversion = date => {
    const currentDate = new Date(date);
    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    const newDate = currentDate.toLocaleString("en-US", dateOptions);
    return newDate;
  };

  /**
   * Filters elements by input value
   *
   * @param {string} searchItemsClassName class name of elements that we filter
   * @param {string} inputClassName class name of input
   *
   * @public
   */
  this.searchByInputValue = (searchItemsClassName, inputClassName) => {
    const listItems = document.querySelectorAll(`.${searchItemsClassName}`);
    const inputValue = document
      .querySelector(`.${inputClassName} input`)
      .value.toUpperCase();
    for (let i = 0; i < listItems.length; i++) {
      let txtValue = listItems[i].textContent;
      if (txtValue.toUpperCase().indexOf(inputValue) > -1) {
        listItems[i].style.display = "";
      } else {
        listItems[i].style.display = "none";
      }
    }
  };

  /**
   * Fill out a form with product data
   *
   * @param {object} data the product data
   *
   * @public
   */
  this.fillFormProductData = data => {
    const form = this.getFormOfPopup("edit-product-form");
    const elements = form.elements;
    for (let key1 in data) {
      if (elements[key1]) {
        elements[key1].value = data[key1];
      }
    }
  };

  /**
   * Filters product by status
   *
   * @param {string} status selected status of filter
   * @param {arrau}product the array of products objects
   *
   * @public
   */
  this.filterProductsByStatus = (status, products) => {
    if (status != "all") {
      const filteredProducts = products.filter(product => {
        return product.Status.toUpperCase() == status.toUpperCase();
      });
      this.renderTable(filteredProducts);
    } else {
      this.renderTable(products);
    }
  };

  /**
   * Add style to selected element of filter and remove style old element of filter
   *
   * @param {string} oldFilterStatus the class name of old filter element
   * @param {string} newFilterStatus the class name of new selected filter element
   *
   * @public
   */
  this.selectCurrentTableFilter = (oldFilterStatus, newFilterStatus) => {
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

  /**
   * Add style to selected list item and remove style old list item
   *
   * @param {HTMLListElements} oldElem the HTML list element of old list item
   * @param {HTMLListElements} newElem the HTML list element of new selected filter element
   *
   * @public
   */
  this.selectCurrentListItem = (oldElem, newElem) => {
    if (oldElem) {
      oldElem.classList.remove("selected");
      newElem.classList.add("selected");
    } else {
      newElem.classList.add("selected");
    }
  };
}
