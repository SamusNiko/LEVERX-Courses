sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/resource/ResourceModel"
  ],
  function(UIComponent, ODataModel, ResourceModel) {
    "use strict";

    return UIComponent.extend("my.app.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        UIComponent.prototype.init.apply(this, arguments);

        var oODataModel = new ODataModel("http://localhost:3000/odata/", {
          useBatch: false,
          defaultBindingMode: "TwoWay"
        });

        var oResourceModel = new ResourceModel({
          bundleName: "my.app.i18n.i18n"
        });

        this.setModel(oODataModel, "odata");

        sap.ui.getCore().setModel(oResourceModel, "i18n");

        window.odatamodel = oODataModel;
        sap.ui
          .getCore()
          .getConfiguration()
          .setLanguage("ru");
        this.getRouter().initialize();
      }
    });
  }
);
