/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comlab2dev/salesorderapproval/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
