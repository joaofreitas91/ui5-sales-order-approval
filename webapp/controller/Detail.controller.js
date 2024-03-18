sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "com/lab2dev/salesorderapproval/model/formatter",
    "sap/ui/model/odata/UpdateMethod",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, JSONModel, MessageToast, formatter, UpdateMethod, MessageBox) {
        "use strict";

        return Controller.extend("com.lab2dev.salesorderapproval.controller.Detail", {
            formatter: formatter,

            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
                const routeDetail = oRouter.getRoute("RouteDetail")
                routeDetail.attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched: function (oEvent) {
                const oArgs = oEvent.getParameter("arguments");
                const { orderId } = oArgs;

                const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'))

                oModel.attachMetadataLoaded(() => {
                    oModel.read(`/SalesOrderDraft(${orderId})`, {
                        urlParameters: {
                            $expand: "items",
                        },
                        success: (oData) => {
                            var oModel = new JSONModel(oData)

                            this.getView().setModel(oModel, 'ordersDetail')
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

            onApprove: function () {
                const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'), {
                    defaultUpdateMethod: UpdateMethod.Merge,
                })
                const oModelOrders = this.getView().getModel('ordersDetail').getData()
                const items = oModelOrders.items.results.map(e => ({
                    "items": e.items,
                    "material": e.material,
                    "quantity": e.quantity,
                    "quantity_unit": e.quantity_unit,
                    "amount": e.amount
                }))

                oModel.attachMetadataLoaded(() => {
                    oModel.update(`/SalesOrderDraft(ID=${oModelOrders.ID})`, {
                        "receiver": "USCU_S02",
                        "payment_condition": "NT30",
                        "total_amount": 1000,
                        "status": "approved",
                        "items": items,
                    }, {
                        success: (oData) => {
                            MessageBox.success("Solicitação aprovada com sucesso!", {
                                title: "Sucesso",
                                onClose: function () {
                                    const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'))

                                    oModel.attachMetadataLoaded(() => {
                                        oModel.read(`/SalesOrderDraft(${oModelOrders.ID})`, {
                                            urlParameters: {
                                                $expand: "items",
                                            },
                                            success: (oData) => {
                                                var oModel = new JSONModel(oData)

                                                this.getView().setModel(oModel, 'ordersDetail')
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
                                }.bind(this)
                            });
                        },
                        error: (oError) => {
                            var msg = 'Erro ao criar solicitação.'
                            MessageToast.show(msg);
                        }
                    })
                });

                oModel.attachMetadataFailed(() => {
                    var msg = 'Serviço não disponível no momento. Tente novamente mais tarde.'
                    MessageToast.show(msg);
                });

            },

            onReject: function () {
                const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'), {
                    defaultUpdateMethod: UpdateMethod.Merge,
                })
                const oModelOrders = this.getView().getModel('ordersDetail').getData()
                const items = oModelOrders.items.results.map(e => ({
                    "items": e.items,
                    "material": e.material,
                    "quantity": e.quantity,
                    "quantity_unit": e.quantity_unit,
                    "amount": e.amount
                }))

                oModel.attachMetadataLoaded(() => {
                    oModel.update(`/SalesOrderDraft(ID=${oModelOrders.ID})`, {
                        "receiver": "USCU_S02",
                        "payment_condition": "NT30",
                        "total_amount": 1000,
                        "status": "denied",
                        "items": items,
                    }, {
                        success: (oData) => {
                            MessageBox.success("Solicitação aprovada com sucesso!", {
                                title: "Sucesso",
                                onClose: function () {
                                    const oModel = new ODataModel(this.getOwnerComponent().getManifestObject().resolveUri('v2/fiori'))

                                    oModel.attachMetadataLoaded(() => {
                                        oModel.read(`/SalesOrderDraft(${oModelOrders.ID})`, {
                                            urlParameters: {
                                                $expand: "items",
                                            },
                                            success: (oData) => {
                                                var oModel = new JSONModel(oData)

                                                this.getView().setModel(oModel, 'ordersDetail')
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
                                }.bind(this)
                            });
                        },
                        error: (oError) => {
                            var msg = 'Erro ao criar solicitação.'
                            MessageToast.show(msg);
                        }
                    })
                });

                oModel.attachMetadataFailed(() => {
                    var msg = 'Serviço não disponível no momento. Tente novamente mais tarde.'
                    MessageToast.show(msg);
                });

            },

        });
    });
