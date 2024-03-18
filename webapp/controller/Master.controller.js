sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "com/lab2dev/salesorderapproval/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel, MessageToast, formatter) {
        "use strict";

        return Controller.extend("com.lab2dev.salesorderapproval.controller.Master", {
            formatter: formatter,

            onInit: function () {
                const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'))

                oModel.attachMetadataLoaded(() => {
                    oModel.read("/SalesOrderDraft", {
                        urlParameters: {
                            $expand: "items",
                        },
                        success: (oData) => {
                            var oModel = new JSONModel(oData.results.filter((order) => order.status === 'pending'))

                            this.getView().setModel(oModel, 'orders')
                        },
                        error: (oError) => {
                            var msg = 'Erro ao acessar entidade.'
                            MessageToast.show(msg);
                        }
                    })
                });

                oModel.attachMetadataFailed(() => {
                    var msg = 'Serviço não disponível no momento. Tente novamente mais tarde.'
                    MessageToast.show(msg);
                });
            },

            onListItemPress: function (oEvent) {
                const oRouter = this.getOwnerComponent().getRouter();
                const oItem = oEvent.getSource();
                const oContext = oItem.getBindingContext('orders');
                const ID = oContext.getProperty('ID');
                oRouter.navTo("RouteDetail", { orderId: ID });
            }
        });
    });
