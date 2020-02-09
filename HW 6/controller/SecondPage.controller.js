sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.SecondPage", {
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
        // get the route object from router attach event handler, that will be called once the URL will match
        // the pattern of a route
        oRouter
          .getRoute("SecondPage")
          .attachMatched(this.onPatternMatched, this);
      },

      onPatternMatched: function(oEvent) {
        // store the link to "this"
        var that = this;
        // get the route arguments from the event parameters
        var mRouteArguments = oEvent.getParameter("arguments");
        // get the "SupplierID" parameter from arguments
        var sStoreID = mRouteArguments.storeId;

        // get the ODataModel instance form the view (as the model was instantiated and set up in the Component,
        // the view has automatically access for it)
        var oODataModel = this.getView().getModel("odata");

        var oViewModel = this.getView().getModel("appView");

        oViewModel.setProperty("/storeId", sStoreID);
        // wait until the metadata has been loaded. "metadataLoaded" method returns a promise
        oODataModel.metadataLoaded().then(function() {
          // create an existent entity key, in order to be able to bind the view to it
          // this method takes the name of EntitySet (collection) and map of key parameters
          var sKey = oODataModel.createKey("/Stores", { id: sStoreID });

          // bind the whole view to supplier key (ODataModel will automatically request the data)
          that.getView().bindObject({
            path: sKey,
            model: "odata"
          });
        });
      },

      onQuickFilter: function(oEvent) {
        var oTable = this.byId("productsTable");
        var oBinding = oTable.getBinding("items");
        var sKey = oEvent.getParameter("selectedKey");
        oBinding.filter(this._mFilters[sKey]);
      },

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

      onCreateProductPress: function() {
        var oView = this.getView();
        this.oDialog = sap.ui.xmlfragment(
          oView.getId(),
          "my.app.view.fragments.CreateProductDialog",
          this
        );

        this.oDialog.open();
      },

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
        this._createNewProduct(payload);
        this.oDialog.close();
      },

      _createNewProduct: function(payload) {
        var oODataModel = this.getView().getModel("odata");
        oODataModel.create("/Products", payload);
      },

      onDeleteStorePress: function() {
        var oView = this.getView();
        this.oDialog = sap.ui.xmlfragment(
          oView.getId(),
          "my.app.view.fragments.ConfirmDeleteStoreDialog",
          this
        );
        this.oDialog.open();
      },

      onDeleteProductPress: function(oEvent) {
        var oView = this.getView();
        var oViewModel = oView.getModel("appView");
        var oItem = oEvent.getSource();
        var sPath = oItem.getBindingContext("odata").getPath();

        this.oDialog = sap.ui.xmlfragment(
          oView.getId(),
          "my.app.view.fragments.ConfirmDeleteProductDialog",
          this
        );

        oViewModel.setProperty("/pathDeleteProd", sPath);
        this.oDialog.open();
      },

      onSubmitDeleteProduct: function() {
        var oView = this.getView();
        var oViewModel = oView.getModel("appView");

        var sPath = oViewModel.getProperty("/pathDeleteProd");
        this.getView()
          .getModel("odata")
          .remove(sPath);
        this.oDialog.close();
      },

      onSubmitDeleteStore: function() {
        var sPath = this.getView()
          .getBindingContext("odata")
          .getPath();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        this.getView()
          .getModel("odata")
          .remove(sPath);

        this.oDialog.close();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("FirstPage");
      },

      onCancelPress: function() {
        this.oDialog.close();
      },

      onNavLinkPress: function(oEvent) {
        var number = oEvent.getSource().getTarget();

        if (number !== undefined) {
          window.history.go(-number);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("FirstPage");
        }
      },

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

      onProductItemPress: function(oEvent) {
        var oItem = oEvent.getSource();
        var ctx = oItem.getBindingContext("odata");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("ThirdPage", {
          prodId: ctx.getProperty("id")
        });
      }
    });
  }
);
