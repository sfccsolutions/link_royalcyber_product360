'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var site = require('../mocks/dw/system/Site');


function proxyModel() {
    return proxyquire('../../cartridges/int_royalcyber_product360/cartridge/scripts/preferences/p360Preferences', {
        'dw/system/Site': site

    });
}

module.exports = proxyModel();
