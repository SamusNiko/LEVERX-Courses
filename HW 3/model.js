/**
 * Model class. Knows everything about API endpoint and data structure. Can farmat/map data to any structure.
 *
 * @constructor
 */
function Model() {
  const _URL = "http://localhost:3000/api/";

  /**
   * HTML element of selected store
   * @type {HTMLUListElement}
   * @private
   */
  var _selectedStoreElem;

  /**
   * Selected filter status of selected store
   * @type {string}
   * @private
   */
  var _selectedFilterStatus;

  /**
   * Current store data
   * @type {object}
   * @private
   */
  var _currentStoreData;

  /**
   * Id of selected product
   *
   * @type {string|number}
   *
   * @private
   */
  var _selectedProductId;

  /**
   * Retruns HTML element of selected store
   *
   * @return {HTMLUListElement}
   *
   * @public
   */
  this.getSelectedStoreElement = () => {
    return _selectedStoreElem;
  };

  /**
   * Sets HTML element of selected store
   *
   * @param {HTMLUListElement} item the stores list item
   *
   * @public
   */
  this.setSelectedStoreElement = item => {
    _selectedStoreElem = item;
  };

  /**
   * Returns selected filter status of products filter bar
   *
   * @returns {string} filter status of filter bar
   */
  this.getSelectedFilterStatus = () => {
    return _selectedFilterStatus;
  };

  /**
   * Sets selected filter status of products filter bar
   *
   * @param {string} status the status of filter bar
   */
  this.setSelectedFilterStatus = status => {
    _selectedFilterStatus = status;
  };

  /**
   * Sets selected product id
   *
   * @returns {string|number} product id
   *
   * @public
   */
  this.setSelectedProductId = id => {
    _selectedProductId = id;
  };

  /**
   * Returns selected product id
   *
   * @returns {string|number} product id
   *
   * @public
   */
  this.getSelectedProductId = () => {
    return _selectedProductId;
  };

  /**
   * Returns product data by id
   *
   * @returns {object} store data object
   *
   * @public
   */
  this.getProductById = id => {
    return fetch(_URL + `Products/${id}`).then(response => response.json());
  };

  /**
   * Returns current store data
   * @returns {object} current store data object
   *
   * @public
   */
  this.getCurrentStoreData = () => {
    return _currentStoreData;
  };

  this.setCurrentStoreData = data => {
    _currentStoreData = data;
  };

  /**
   * Returns store data by id
   *
   * @returns {object} store data object
   *
   * @public
   */
  this.getStoreDataById = id => {
    return fetch(_URL + `Stores/${id}`).then(response => response.json());
  };

  /**
   * Fetch the array of stores objects
   *
   * @returns {Promise} the promise will be resolved once the stores will got
   *
   * @public
   */
  this.getStores = () => {
    return fetch(_URL + "Stores")
      .then(response => response.json())
      .then(data => {
        _Stores = data;
        return data;
      })
      .catch(error => console.log(error));
  };

  /**
   * Fetch the array of store product objects
   *
   * @param {object} id store id
   *
   * @returns {Promise} the promise will be resolved once the product will got
   *
   * @public
   */
  this.getStoreProductsById = id => {
    return fetch(_URL + `/Stores/${id}/rel_Products`).then(response =>
      response.json()
    );
  };

  /**
   * Creates store 
   *
   * @param {object} data the form data object
   *
   * @returns {Promise} the promise will be resolved once the store will created
   *
   * @public
   */
  this.createNewStore = data => {
    const newStore = {
      Name: data.Name.value,
      Email: data.Email.value,
      PhoneNumber: data.PhoneNumber.value,
      Address: data.Address.value,
      Established: data.Date.value,
      FloorArea: data.FloorArea.value
    };
    return fetch(_URL + "Stores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(newStore)
    });
  };

  /**
   * Updates product 
   *
   * @param {object} data the form data object
   *
   * @returns {Promise} the promise will be resolved once the product will updated
   *
   * @public
   */
  this.updateProduct = data => {
    const updatetedProduct = {
      Name: data.Name.value,
      Price: data.Price.value,
      Photo: null,
      Specs: data.Specs.value,
      Rating: data.Rating.value,
      SupplierInfo: data.SupplierInfo.value,
      MadeIn: data.MadeIn.value,
      ProductionCompanyName: data.ProductionCompanyName.value,
      Status: data.Status.value,
      StoreId: _currentStoreData.id,
      id: _selectedProductId
    };
    return fetch(_URL + `Products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(updatetedProduct)
    });
  };

  /**
   * Deletes  store by id 
   *
   * @param {string|number} id the store id
   *
   * @returns {Promise} the promise object will be resolved once the store will deleted
   *
   * @public
   */

  this.deleteStoreById = id => {
    return fetch(_URL + `Stores/${id}`, { method: "DELETE" });
  };

  /**
   * Posts new product 
   *
   * @param {object} data the object of form data
   *
   * @returns {Promise} the promise object will be resolved once the new product will posted
   *
   * @public
   */

  this.createNewProduct = data => {
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
      StoreId: _currentStoreData.id
    };
    return fetch(_URL + "Products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(newStore)
    });
  };

  /**
   * Deletes product by id 
   *
   * @param {string|number}  id the id of product
   *
   * @returns {Promise} the promise object will be resolved once the product will deleted
   */
  this.deleteProductFromStoreById = id => {
    return fetch(_URL + `Products/${id}`, { method: "DELETE" });
  };
}
