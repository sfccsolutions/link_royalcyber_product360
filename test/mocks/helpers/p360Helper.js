'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var File = require('../dw/io/File');
var URLUtils = require('../dw.web.URLUtils');

function proxyModel() {
    return proxyquire('../../../cartridges/int_royalcyber_product360/cartridge/scripts/helpers/p360Helper', {
        'dw/io/File': File,
        'dw/web/URLUtils': URLUtils

    });
}

module.exports = proxyModel();
