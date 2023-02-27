'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var mockSuperModule = require('../../../../../mockModuleSuperModule');
var p360Mock = require('../../../../../mocks/models/p360');
var p360Preferences = require('../../../../../mocks/p360Preferences');
var p360Helper = require('../../../../../mocks/helpers/p360Helper');

var apiProductMock = {
    custom: {
        'P360Images': 'some value',
        'P360AutoRotateIntervalProduct': 'some value'
    },
    'basePath': 'on/demandware.store/Sites-RefArch-Site/en_US',
    'p360Enabled': true
};


var p360;

describe('product360 decorator', function () {
    beforeEach(function () {
        mockSuperModule.create(p360Mock);
        p360 = proxyquire('../../../../../../cartridges/int_royalcyber_product360/cartridge/models/product/decorators/p360', {
            '*/cartridge/scripts/preferences/p360Preferences': p360Preferences,
            '*/cartridge/scripts/helpers/p360Helper': p360Helper
        });
    });

    afterEach(function () {
        mockSuperModule.remove();
    });


    it('should get P360Images value', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.isNotNull(object.P360Images);
    });

    it('basePath should not be Null', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.isNotNull(object.basePath);
    });

    it('basePath should be type of String', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.typeOf(object.basePath, 'String');
    });

    it('P360Images should be type of String', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.typeOf(object.P360Images, 'String');
    });

    it('basePath should be type of String', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.isNotNull(object.basePath);
    });

    it('P360AutoRotateIntervalProduct should be type of String', function () {
        var object = {};
        p360(object, apiProductMock);
        assert.typeOf(object.P360AutoRotateIntervalProduct, 'String');
    });
});
