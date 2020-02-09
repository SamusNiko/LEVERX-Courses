sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.ProductDetails", {
      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the ProductDetails controller is instantiated.
       * @public
       */
      onInit: function() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oViewModel = new JSONModel({
          ProductComments: null,
          ProdId: null
        });

        this.getView().setModel(oViewModel, "appView");

        oRouter
          .getRoute("ProductDetails")
          .attachMatched(this.onPatternMatched, this);
      },

      /**
       * "ProductDetails" route pattern matched event handler.
       *
       * @param {sap.ui.base.Event} oEvent event object.
       */
      onPatternMatched: function(oEvent) {
        var that = this;
        var mRouteArguments = oEvent.getParameter("arguments");
        var sProdID = mRouteArguments.prodId;
        var oODataModel = this.getView().getModel("odata");
        var oViewModel = this.getView().getModel("appView");

        oViewModel.setProperty("/ProdId", sProdID);
        oODataModel.metadataLoaded().then(function() {
          var sKey = oODataModel.createKey("/Products", { id: sProdID });

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

      /**
       * Event handler for the post comment. Will create payload and
       * send it on the server
       * @param {sap.ui.base.Event} oEvent the comment event
       * @public
       */
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
        this.getView()
          .getModel("odata")
          .create("/ProductComments", payload, {
            success: this.filterCommentsByProdId()
          });
      },

      /**
       * Filter comments by current product id.
       * @public
       */
      filterCommentsByProdId: function() {
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

      /**Change status by prodcut status
       * @param {string} sStatus the status of current product
       * @public
       */
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
      
      /**
       * Event handler  for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the store list route.
       * @param {sap.ui.base.Event} oEvent the link event
       * @public
       */
      onNavLinkPress: function(oEvent) {
        var number = oEvent.getSource().getTarget();
        window.history.go(-number);
      }
    });
  }
);
