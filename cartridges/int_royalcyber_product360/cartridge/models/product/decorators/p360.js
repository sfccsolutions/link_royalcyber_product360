'use strict';

module.exports = function (object, apiProduct) {
    var preferences = require('*/cartridge/scripts/preferences/p360Preferences');
    var Helper = require('*/cartridge/scripts/helpers/p360Helper');
    var currentSite = preferences.getCurrentSiteID();
    var p360Dir = preferences.getFolderName();
    var path = currentSite + '/' + p360Dir + '/' + apiProduct.ID + '/';
    var basePath = Helper.generateBasePath(path);
    var p360Enabled = preferences.getP360Status();
    if (p360Enabled === null || p360Enabled === undefined) {
        p360Enabled = false;
    }

    Object.defineProperty(object, 'P360Images', {
        enumerable: true,
        value: apiProduct.custom.P360Images
    });

    Object.defineProperty(object, 'P360Publish', {
        enumerable: true,
        value: apiProduct.custom.P360Publish
    });

    Object.defineProperty(object, 'basePath', {
        enumerable: true,
        value: basePath
    });

    Object.defineProperty(object, 'p360Enabled', {
        enumerable: true,
        value: p360Enabled
    });

    Object.defineProperty(object, 'P360AutoRotateIntervalProduct', {
        enumerable: true,
        value: apiProduct.custom.P360AutoRotateIntervalProduct
    });
};
