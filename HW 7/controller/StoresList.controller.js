sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("my.app.controller.StoresList", {
      
      /**
       * Event handler for the search stores button. Will filter the
       * stores list by filters
       * @param {sap.ui.base.Event} oEvent the search field event
       * @public
       */
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

      /**
       * Event handler for the create store button. Will open the
       * dialog for create store
       * @public
       */
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

      /**
       * Event handler for the submit create store button. Will create the
       * payload and send it on the server
       * @public
       */
      onSubmitCreateStorePress: function(oEvent) {
        const payload = {
          Name: this.byId("createStoreName").getValue(),
          Email: this.byId("createStoreEmail").getValue(),
          PhoneNumber: this.byId("createStorePhone").getValue(),
          Address: this.byId("createStoreAddress").getValue(),
          Established: this.byId("createStoreDate").getValue(),
          FloorArea: this.byId("createStoreArea").getValue()
        };
        var oODataModel = this.getView().getModel("odata");
        oODataModel.create("/Stores", payload);
        this.oDialog.close();
      },

      /**
       * Event handler for the close dialog button. Will close the
       * current dialog
       * @param {sap.ui.base.Event} oEvent the button event
       * @public
       */
      onCancelPress: function() {
        this.oDialog.close();
      },

      /**
       * Event handler when a list item gets pressed
       * @param {sap.ui.base.Event} oEvent the list selectionChange event
       * @public
       */
      onListItemPress: function(oEvent) {
        var oItem, oCtx;
        oItem = oEvent.getSource();
        oCtx = oItem.getBindingContext("odata");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("StoreDetails", {
          storeId: oCtx.getProperty("id")
        });
      }
    });
  }
);
