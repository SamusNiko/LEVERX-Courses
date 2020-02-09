sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.ThirdPage", {
      onInit: function() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oViewModel = new JSONModel({
          ProductComments: null,
          ProdId: null
        });

        this.getView().setModel(oViewModel, "appView");

        oRouter
          .getRoute("ThirdPage")
          .attachMatched(this.onPatternMatched, this);
      },

      onPatternMatched: function(oEvent) {
        // store the link to "this"
        var that = this;
        // get the route arguments from the event parameters
        var mRouteArguments = oEvent.getParameter("arguments");

        // get the "SupplierID" parameter from arguments
        var sProdID = mRouteArguments.prodId;
        // get the ODataModel instance form the view (as the model was instantiated and set up in the Component,
        // the view has automatically access for it)
        var oODataModel = this.getView().getModel("odata");
        var oViewModel = this.getView().getModel("appView");

        oViewModel.setProperty("/ProdId", sProdID);
        // wait until the metadata has been loaded. "metadataLoaded" method returns a promise
        oODataModel.metadataLoaded().then(function() {
          // create an existent entity key, in order to be able to bind the view to it
          // this method takes the name of EntitySet (collection) and map of key parameters
          var sKey = oODataModel.createKey("/Products", { id: sProdID });

          // bind the whole view to supplier key (ODataModel will automatically request the data)
          that.getView().bindObject({
            path: sKey,
            model: "odata"
          });

          that
            .getView()
            .getModel("odata")
            .read(`${sKey}`, {
              success: function(oData) {
                that.changeStatusStyle(oData.Status);
              }
            });
          that.filterCommentsByProdId();
        });
      },

      onPoster: function(oEvent) {
        var oItem = oEvent.getSource();
        var ctx = oItem.getBindingContext("odata");
        var payload = {
          Author: this.byId("authorOfComment").getValue(),
          Message: this.byId("textOfComment").getValue(),
          Rating: this.byId("inputRating").getValue(),
          Posted: new Date(),
          ProductId: ctx.getProperty("id")
        };
        this.createNewComment(payload);
      },

      createNewComment: function(payload) {
        this.getView()
          .getModel("odata")
          .create("/ProductComments", payload, {
            success: this.filterCommentsByProdId()
          });
      },

      filterCommentsByProdId: function(oEvent) {
        var oViewModel = this.getView().getModel("appView");
        var nProdId = oViewModel.getProperty("/ProdId");

        this.getView()
          .getModel("odata")
          .read(`/ProductComments`, {
            success: function(oData) {
              oViewModel.setProperty("/ProductComments", oData.results);
            },
            filters: [new Filter("ProductId", FilterOperator.EQ, nProdId)]
          });
      },

      changeStatusStyle: function(sStatus) {
        var statusElem = this.byId("productStatus");
        if (sStatus === "OK") {
          statusElem.setState("Success");
        } else if (sStatus === "STORAGE") {
          statusElem.setState("Warning");
        } else if (sStatus === "OUT_OF_STOCK") {
          statusElem.setState("Error");
        }
      },

      onNavLinkPress: function(oEvent) {
        var number = oEvent.getSource().getTarget();
        window.history.go(-number);
      }
    });
  }
);
