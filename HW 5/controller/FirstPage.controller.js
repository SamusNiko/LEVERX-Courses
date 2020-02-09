sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function(
  Controller,
  MessageToast
) {
  "use strict";

  return Controller.extend("my.app.controller.FirstPage", {
    onPress: function(oEvent) {
      MessageToast.show(oEvent.getSource().getText() + " has been activated");
    },

    onListItemPress: function(oEvent) {
      var oItem, oCtx;
      oItem = oEvent.getSource();
      oCtx = oItem.getBindingContext("odata");
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("SecondPage", {
        storeId: oCtx.getProperty("id")
      });
    }
  });
});
