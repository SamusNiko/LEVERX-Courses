sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  function(Controller, History) {
    "use strict";

    return Controller.extend("my.app.controller.ThirdPage", {
      onInit: function() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // var oViewModel = new JSONModel({
        //   prodCount: {
        //     status: "None"
        //   }
        // });
        // get the route object from router attach event handler, that will be called once the URL will match
        // the pattern of a route
        this.changeStatusStyle();
        oRouter
          .getRoute("ThirdPage")
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
        var sProdID = mRouteArguments.prodId;
        // get the ODataModel instance form the view (as the model was instantiated and set up in the Component,
        // the view has automatically access for it)
        var oODataModel = this.getView().getModel("odata");
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
