sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.StoreDetails", {
      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the storeDetails controller is instantiated.
       * @public
       */
      onInit: function() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oViewModel = new JSONModel({
          prodCount: {
            all: 0,
            ok: 0,
            storage: 0,
            outOfStock: 0
          },
          storeId: null
        });

        this._mFilters = {
          ok: [new Filter("Status", FilterOperator.EQ, "OK")],
          storage: [new Filter("Status", FilterOperator.EQ, "STORAGE")],
          outOfStock: [new Filter("Status", FilterOperator.EQ, "OUT_OF_STOCK")],
          all: []
        };

        this.getView().setModel(oViewModel, "appView");
        oRouter
          .getRoute("StoreDetails")
          .attachMatched(this.onPatternMatched, this);
      },

      /**
       * "StoreDetails" route pattern matched event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       */
      onPatternMatched: function(oEvent) {
        var that = this;
        var mRouteArguments = oEvent.getParameter("arguments");
        var sStoreID = mRouteArguments.storeId;
        var oODataModel = this.getView().getModel("odata");
        var oViewModel = this.getView().getModel("appView");

        oViewModel.setProperty("/storeId", sStoreID);
        oODataModel.metadataLoaded().then(function() {
          var sKey = oODataModel.createKey("/Stores", { id: sStoreID });

          that.getView().bindObject({
            path: sKey,
            model: "odata"
          });
        });
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler when a filter tab gets pressed
       * @param {sap.ui.base.Event} oEvent the filter tab event
       * @public
       */
      onQuickFilter: function(oEvent) {
        var oTable = this.byId("productsTable");
        var oBinding = oTable.getBinding("items");
        var sKey = oEvent.getParameter("selectedKey");
        oBinding.filter(this._mFilters[sKey]);
      },

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      onTableUpdateFinished: function(oEvent) {
        var oTable = oEvent.getSource();
        var oCtx = oTable.getBindingContext("odata");
        var oViewModel = this.getView().getModel("appView");

        this.getView()
          .getModel("odata")
          .read(`${oCtx}/rel_Products/$count`, {
            success: function(oData) {
              oViewModel.setProperty("/all", oData);
            }
          });

        this.getView()
          .getModel("odata")
          .read(`${oCtx}/rel_Products/$count`, {
            success: function(oData) {
              oViewModel.setProperty("/ok", oData);
            },
            filters: this._mFilters.ok
          });

        this.getView()
          .getModel("odata")
          .read(`${oCtx}/rel_Products/$count`, {
            success: function(oData) {
              oViewModel.setProperty("/storage", oData);
            },
            filters: this._mFilters.storage
          });

        this.getView()
          .getModel("odata")
          .read(`${oCtx}/rel_Products/$count`, {
            success: function(oData) {
              oViewModel.setProperty("/outOfStock", oData);
            },
            filters: this._mFilters.outOfStock
          });
      },

      /**
       * Event handler for the create product button. Will open the
       * dialog for create product
       * @public
       */
      onCreateProductPress: function() {
        var oView = this.getView();
        if (!this.oСreateProductDialog) {
          this.oСreateProductDialog = sap.ui.xmlfragment(
            oView.getId(),
            "my.app.view.fragments.CreateProductDialog",
            this
          );
        }
        this.oСreateProductDialog.open();
      },

      /**
       * Event handler for the edit product button. Will open the
       * dialog for edit product
       * @public
       */
      onEditProductPress: function(oEvent) {
        var oView = this.getView();
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext("odata");
        var sPath = oContext.getPath();

        if (!this.oEditProductDialog) {
          this.oEditProductDialog = sap.ui.xmlfragment(
            oView.getId(),
            "my.app.view.fragments.EditProductDialog",
            this
          );

          oView.addDependent(this.oEditProductDialog);
        }
        var oForm = this.byId("editProductForm");
        oForm.bindElement({ path: sPath, model: "odata" });
        this.oEditProductDialog.open();
      },

      /**
       * Event handler for the submit create product button. Will create the
       * payload and send it on the server
       * @public
       */
      onSubmitPress: function(oEvent) {
        var oViewModel = this.getView().getModel("appView");
        const payload = {
          Name: this.byId("createProductName").getValue(),
          Price: this.byId("createProductPrice").getValue(),
          Specs: this.byId("createProductSpecs").getValue(),
          Rating: this.byId("createProductRating").getValue(),
          SupplierInfo: this.byId("createProductSupplierInfo").getValue(),
          MadeIn: this.byId("createProductMadeIn").getValue(),
          ProductionCompanyName: this.byId("creatProductCompany").getValue(),
          Status: this.byId("createProductStatus").getSelectedKey(),
          StoreId: oViewModel.getProperty("/storeId")
        };

        var oODataModel = this.getView().getModel("odata");
        oODataModel.create("/Products", payload);
        this.oСreateProductDialog.close();
      },

      /**
       * Event handler for the delete store button. Will open the
       * dialog for delete store
       * @public
       */
      onDeleteStorePress: function() {
        var oView = this.getView();
        if (!this.oDeleteStoreDialog) {
          this.oDeleteStoreDialog = sap.ui.xmlfragment(
            oView.getId(),
            "my.app.view.fragments.ConfirmDeleteStoreDialog",
            this
          );
        }
        this.oDeleteStoreDialog.open();
      },

      /**
       * Event handler for the delete product button. Will open the
       * dialog for delete product
       * @public
       */
      onDeleteProductPress: function(oEvent) {
        var oView = this.getView();
        var oViewModel = oView.getModel("appView");
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext("odata").getPath();
        if (!this.oDeleteProductDialog) {
          this.oDeleteProductDialog = sap.ui.xmlfragment(
            oView.getId(),
            "my.app.view.fragments.ConfirmDeleteProductDialog",
            this
          );
        }
        oViewModel.setProperty("/pathDeleteProd", sPath);
        this.oDeleteProductDialog.open();
      },

      /**
       * Event handler for the submit delete product button. Will delete the
       * product from the model.
       * @public
       */
      onSubmitDeleteProduct: function() {
        var oView = this.getView();
        var oViewModel = oView.getModel("appView");

        var sPath = oViewModel.getProperty("/pathDeleteProd");
        this.getView()
          .getModel("odata")
          .remove(sPath);
        this.oDeleteProductDialog.close();
      },

      /**
       * Event handler for the submit delete store button. Will delete the
       * store from the model.
       * @public
       */
      onSubmitDeleteStore: function() {
        var sPath = this.getView()
          .getBindingContext("odata")
          .getPath();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        this.getView()
          .getModel("odata")
          .remove(sPath);

        this.oDeleteStoreDialog.close();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("FirstPage");
      },

      /**
       * Event handler for the submit edit product button. Will edit the
       * product in the model.
       * @public
       */
      onSubmitEditProduct: function() {
        this.getView()
          .getModel("odata")
          .submitChanges();
        this.oEditProductDialog.close();
      },

      /**
       * Event handler for the close dialog button. Will close the
       * current dialog
       * @param {sap.ui.base.Event} oEvent the button event
       * @public
       */
      onCancelPress: function(oEvent) {
        var oDialog = oEvent.getSource().getParent();
        oDialog.close();
      },

      /**
       * Event handler  for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the store list route.
       * @param {sap.ui.base.Event} oEvent the link event
       * @public
       */
      onNavLinkPress: function(oEvent) {
        var number = oEvent.getSource().getTarget();

        if (number !== undefined) {
          window.history.go(-number);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("FirstPage");
        }
      },

      /**
       * Event handler for the search product button. Will filter the
       * product list by filters
       * @param {sap.ui.base.Event} oEvent the search field event
       * @public
       */
      onProductSearch: function(oEvent) {
        var oTable = this.byId("productsTable");
        var oItemsBinding = oTable.getBinding("items");
        var sQuery = oEvent.getParameter("query");

        var oFilter = new Filter({
          filters: [
            new Filter({
              path: "Name",
              operator: FilterOperator.Contains,
              value1: sQuery
            }),
            new Filter({
              path: "Specs",
              operator: FilterOperator.Contains,
              value1: sQuery
            }),
            new Filter({
              path: "SupplierInfo",
              operator: FilterOperator.Contains,
              value1: sQuery
            }),
            new Filter({
              path: "MadeIn",
              operator: FilterOperator.Contains,
              value1: sQuery
            })
          ],
          and: false
        });
        oItemsBinding.filter(oFilter);
      },

      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onProductItemPress: function(oEvent) {
        var oItem = oEvent.getSource();
        var ctx = oItem.getBindingContext("odata");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("ProductDetails", {
          prodId: ctx.getProperty("id")
        });
      }
    });
  }
);
