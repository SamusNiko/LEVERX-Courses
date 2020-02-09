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
          }
        });
        this.getView().setModel(oViewModel, "appView");
        // get the route object from router attach event handler, that will be called once the URL will match
        // the pattern of a route
        oRouter
          .getRoute("SecondPage")
          .attachMatched(this.onPatternMatched, this);
      },

      /**
       * "SecondPage" route pattern matched event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       */
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

          that
            .getView()
            .getModel("odata")
            .read(`${sKey}/rel_Products/$count`, {
              success: function(oData) {
                oViewModel.setProperty("/all", oData);
              }
            });

          that
            .getView()
            .getModel("odata")
            .read(`${sKey}/rel_Products/$count`, {
              filters: [new Filter("Status", FilterOperator.EQ, "OK")],
              success: function(oData) {
                oViewModel.setProperty("/ok", oData);
              }
            });

          that
            .getView()
            .getModel("odata")
            .read(`${sKey}/rel_Products/$count`, {
              filters: [new Filter("Status", FilterOperator.EQ, "STORAGE")],
              success: function(oData) {
                oViewModel.setProperty("/storage", oData);
              }
            });

          that
            .getView()
            .getModel("odata")
            .read(`${sKey}/rel_Products/$count`, {
              filters: [
                new Filter("Status", FilterOperator.EQ, "OUT_OF_STOCK")
              ],
              success: function(oData) {
                oViewModel.setProperty("/outOfStock", oData);
              }
            });
        });
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
