'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

function proxyModel() {
    return proxyquire('../../../cartridges/int_royalcyber_product360/cartridge/models/product/decorators/p360', {

    });
}

module.exports = proxyModel();
