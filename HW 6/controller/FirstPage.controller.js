sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.FirstPage", {

      onStoreSearch: function(oEvent) {
        var oStoresList = this.byId("stores-list");
        var oItemsBinding = oStoresList.getBinding("items");
        var sQuery = oEvent.getParameter("query");

        var oFilter = new Filter({
          filters: [
            new Filter({
              path: "Name",
              operator: FilterOperator.Contains,
              value1: sQuery
            }),
            new Filter({
              path: "Address",
              operator: FilterOperator.Contains,
              value1: sQuery
            })
          ],
          and: false
        });

        oItemsBinding.filter(oFilter);
      },

      onOpenCreateDialogPress: function() {
        var oView = this.getView();

        if (!this.oDialog) {
          this.oDialog = sap.ui.xmlfragment(
            oView.getId(),
            "my.app.view.fragments.CreateStoreDialog",
            this
          );

          oView.addDependent(this.oDialog);
        }
        this.oDialog.bindObject({
          path: "/formFields"
        });
        this.oDialog.open();
      },

      onSubmitCreateStorePress: function(oEvent) {
        const payload = {
          Name: this.byId("createStoreName").getValue(),
          Email: this.byId("createStoreEmail").getValue(),
          PhoneNumber: this.byId("createStorePhone").getValue(),
          Address: this.byId("createStoreAddress").getValue(),
          Established: this.byId("createStoreDate").getValue(),
          FloorArea: this.byId("createStoreArea").getValue()
        };
        this._createNewStore(payload);
        this.oDialog.close();
      },

      _createNewStore: function(payload) {
        var oODataModel = this.getView().getModel("odata");
        oODataModel.create("/Stores", payload);
      },

      onCancelPress: function() {
        this.oDialog.close();
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
  }
);
