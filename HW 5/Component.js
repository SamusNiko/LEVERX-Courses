sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/odata/v2/ODataModel"],
  function(UIComponent, ODataModel) {
    "use strict";

    return UIComponent.extend("my.app.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        // call the init function of the parent
        UIComponent.prototype.init.apply(this, arguments);

        // initialize ODataModel in component
        var oODataModel = new ODataModel("http://localhost:3000/odata/", {
          useBatch: false,
          defaultBindingMode: "TwoWay"
        });

        // set model to the component (this), so it will be available among all views/controller in the app
        this.setModel(oODataModel, "odata");

        window.odatamodel = oODataModel;

        this.getRouter().initialize();
      }
    });
  }
);
