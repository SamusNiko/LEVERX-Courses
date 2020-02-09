/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them
 *
 * @param {View} view
 * @param {Model} model
 *
 * @constructor
 */
function Controller(view, model) {
  /**
   * Initialize controller.
   *
   * @public
   */
  this.init = () => {
    const storeSearchButton = view.getStoresSearchButton();
    const storesList = view.getStoresList();
    const detailsPage = view.getDetailsPage();
    const createStoreButton = view.getCreateStoreButton();
    const creatStoreForm = view.getFormOfPopup("store-form");
    const createProductForm = view.getFormOfPopup("create-product-form");
    const editProductForm = view.getFormOfPopup("edit-product-form");

    document.addEventListener("DOMContentLoaded", this._documentIsLoaded);
    storeSearchButton.addEventListener(
      "click",
      this._onStoresSearchButtonClick
    );
    storesList.addEventListener("click", e => this._listItemOnClick(e));
    detailsPage.addEventListener("click", e => this._onDetailsPageClick(e));
    createStoreButton.addEventListener("click", this._onCreateStoreClick);

    editProductForm.addEventListener("submit", this._onSubmitEditProductClick);
    editProductForm.addEventListener("reset", this._onCancelEditProductClick);
    creatStoreForm.addEventListener("submit", this._onSubmitCreateStoreClick);
    creatStoreForm.addEventListener("reset", this._onCancelCreateStoreClick);
    createProductForm.addEventListener(
      "submit",
      this._onSubmitCreateProductClick
    );
    createProductForm.addEventListener(
      "reset",
      this._onCancelCreateProductClick
    );
  };

  /**
   * Create store button click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onCreateStoreClick = () => {
    const createStorePopup = view.getPopup("create-store-popup");
    createStorePopup.showModal();
  };

  /**
   * Submit edit product button click.
   *
   * @listens click
   *
   * @private
   */
  this._onSubmitEditProductClick = () => {
    const form = view.getFormOfPopup("edit-product-form");
    model.updateProduct(form.elements).then(response => {
      if (response.ok) {
        const currentStoreData = model.getCurrentStoreData();
        model
          .getStoreProductsById(currentStoreData.id)
          .then(products => view.renderDetailsPage(currentStoreData, products));
        form.reset();
      }
    });
  };

  /**
   * Cancel button in edit product click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onCancelEditProductClick = () => {
    const editProductPopup = view.getPopup("edit-product-popup");
    editProductPopup.close();
  };

  /**
   * Submit create product button click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onSubmitCreateProductClick = () => {
    const form = view.getFormOfPopup("create-product-form");
    model.createNewProduct(form.elements).then(response => {
      if (response.ok) {
        const currentStoreData = model.getCurrentStoreData();
        model
          .getStoreProductsById(currentStoreData.id)
          .then(products => view.renderDetailsPage(currentStoreData, products));
        form.reset();
      }
    });
  };

  /**
   * Cancel button in create product click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onCancelCreateProductClick = () => {
    const createProductPopup = view.getPopup("create-product-popup");
    createProductPopup.close();
  };

  /**
   * Submit create store button click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onSubmitCreateStoreClick = () => {
    const form = view.getFormOfPopup("store-form");
    model.createNewStore(form.elements).then(response => {
      if (response.ok) {
        model.getStores().then(stores => view.renderStoresList(stores));
        form.reset();
      }
    });
  };

  /**
   * Cancel button in create store click event heandler.
   *
   * @listens click
   *
   * @private
   */
  this._onCancelCreateStoreClick = () => {
    const createStorePopup = view.getPopup("create-store-popup");
    createStorePopup.close();
  };

  /**
   * List item click event heandler
   *
   * @listens click
   *
   * @param {Event} e the DOM event object
   *
   * @private
   */
  this._listItemOnClick = e => {
    model.setSelectedFilterStatus(null);
    const oldSelectedStore = model.getSelectedStoreElement();
    const newSelectedStore = e.target.closest("li");
    model.setSelectedStoreElement(newSelectedStore);
    model.getStoreDataById(newSelectedStore.dataset.id).then(store => {
      model.setCurrentStoreData(store);
      model
        .getStoreProductsById(newSelectedStore.dataset.id)
        .then(products => {
          view.selectCurrentListItem(oldSelectedStore, newSelectedStore);
          view.renderDetailsPage(store, products);
        });
    });
  };

  /**
   * Loaded document DOMContentLoaded event
   *
   * @listens DOMContentLoaded
   *
   * @private
   */
  this._documentIsLoaded = () => {
    model.getStores().then(stores => view.renderStoresList(stores));
  };

  /**
   * Details page click event heandler
   *
   * @listens click
   *
   * @param {Event} e the DOM event
   *
   * @private
   */
  this._onDetailsPageClick = e => {
    if (e.target.closest(".delete-products-btn")) {
      this._onDeleteProductButtonClick(e);
    }
    if (e.target.closest(".product-create-btn")) {
      this._onProductCreateButtonClick();
    }
    if (e.target.closest(".edit-product-btn")) {
      this._onEditProductButtonClick(e);
    }
    if (e.target.closest(".store-delete-btn")) {
      this._onDeleteStoreButtonClick();
    }
    if (e.target.closest(".products-search .search-button")) {
      this._onSearchProductButtonClick();
    }
    if (e.target.closest("th button")) {
      this._onSortTableButtonClick(e);
    }
    if (e.target.closest(".filter")) {
      this._onFilterBarClick(e);
    }
  };

  /**
   * Delete product button click event heandler
   *
   * @param {Event} e the DOM event
   *
   * @private
   */
  this._onDeleteProductButtonClick = e => {
    const confirmed = confirm("Are you shur you want to delete this store?");
    if (confirmed) {
      const prodId = e.target.closest(".table-row").dataset.id;
      const store = model.getCurrentStoreData();
      model.deleteProductFromStoreById(prodId).then(response => {
        if (response.ok) {
          model
            .getStoreProductsById(store.id)
            .then(products => view.renderDetailsPage(store, products));
        }
      });
    }
  };

  this._onProductCreateButtonClick = () => {
    const createProductPopup = view.getPopup("create-product-popup");
    createProductPopup.showModal();
  };

  /**
   * Edit product button click event heandler
   *
   * @param {Event} e the DOM event
   *
   * @private
   */
  this._onEditProductButtonClick = e => {
    const editProductPopup = view.getPopup("edit-product-popup");
    editProductPopup.showModal();
    const prodId = e.target.closest(".table-row").dataset.id;
    model.setSelectedProductId(prodId);
    model.getProductById(prodId).then(data => view.fillFormProductData(data));
  };

  /**
   * Delete store button click event heandler
   *
   * @listens click
   *
   * @private
   */
  this._onDeleteStoreButtonClick = () => {
    const confirmed = confirm("Are you shur you want to delete this product?");
    if (confirmed) {
      const storeId = model.getCurrentStoreData().id;
      model.deleteStoreById(storeId).then(response => {
        if (response.ok) {
          model
            .getStores()
            .then(stores => view.renderStoresList(stores))
            .then(view.renderDefaultDetailsPage());
        }
      });
    }
  };

  /**
   *  Search product button click event heandler
   *
   * @listens click
   *
   * @private
   */
  this._onSearchProductButtonClick = () => {
    view.searchByInputValue("table-row", "products-search");
  };

  /**
   * Sorte table button click event heandler
   *
   * @listens click
   *
   * @param {Event} e the DOM event object
   *
   * @private
   */
  this._onSortTableButtonClick = e => {
    view.getSortTable(e);
  };

  /**
   * Filter bar button click event heandler
   * @listens click
   *
   * @param {Event} e the DOM event object
   *
   * @private
   */
  this._onFilterBarClick = e => {
    const storeId = model.getCurrentStoreData().id;

    const oldFilterStatus = model.getSelectedFilterStatus();
    const currentFilterStatus = e.target.closest(".filter").attributes.status
      .value;
    model.setSelectedFilterStatus(currentFilterStatus);
    if (currentFilterStatus !== oldFilterStatus) {
      view.selectCurrentTableFilter(oldFilterStatus, currentFilterStatus);
      model
        .getStoreProductsById(storeId)
        .then(products =>
          view.filterProductsByStatus(currentFilterStatus, products)
        );
    }
  };

  /**
   * Search button click evvent heandler
   *
   * @listens click
   *
   * @private
   */
  this._onStoresSearchButtonClick = () => {
    view.searchByInputValue("list-item", "stores-search");
  };
}

new Controller(new View(), new Model()).init();
