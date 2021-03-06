sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function(
    Controller,
  ) {
    "use strict";
  
    return Controller.extend("my.app.controller.ThirdPage", {
      onFirstButtonPress: function(oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("FirstPage");
      }
    });
  });
  