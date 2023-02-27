'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var mockSuperModule = require('../../../../mockModuleSuperModule');
var baseFullProductMock = require('../../../../../test/mocks/models/product/baseFullProduct');

var productMock = {
    attributeModel: {},
    minOrderQuantity: { value: 'someValue' },
    availabilityModel: {},
    stepQuantity: { value: 'someOtherValue' },
    getPrimaryCategory: function () { return { custom: { sizeChartID: 'someID' } }; },
    getMasterProduct: function () {
        return {
            getPrimaryCategory: function () { return { custom: { sizeChartID: 'someID' } }; }
        };
    },
    ID: 'someID',
    pageTitle: 'some title',
    pageDescription: 'some description',
    pageKeywords: 'some keywords',
    pageMetaData: [{}],
    template: 'some template'
};

var optionsMock = {
    productType: 'someProductType',
    optionModel: {},
    quantity: 1,
    variationModel: {},
    promotions: [],
    variables: []
};

describe('Full Product Model', function () {
    mockSuperModule.create(baseFullProductMock);

    var decorators = require('../../../../mocks/productDecoratorsMock');

    var fullProduct = proxyquire('../../../../../cartridges/int_royalcyber_product360/cartridge/models/product/fullProduct', {
        '*/cartridge/models/product/decorators/index': decorators.mocks
    });

    afterEach(function () {
        decorators.stubs.stubBase.reset();
        decorators.stubs.stubPrice.reset();
        decorators.stubs.stubImages.reset();
        decorators.stubs.stubAvailability.reset();
        decorators.stubs.stubDescription.reset();
        decorators.stubs.stubSearchPrice.reset();
        decorators.stubs.stubPromotions.reset();
        decorators.stubs.stubQuantity.reset();
        decorators.stubs.stubQuantitySelector.reset();
        decorators.stubs.stubRatings.reset();
        decorators.stubs.stubSizeChart.reset();
        decorators.stubs.stubVariationAttributes.reset();
        decorators.stubs.stubSearchVariationAttributes.reset();
        decorators.stubs.stubAttributes.reset();
        decorators.stubs.stubOptions.reset();
        decorators.stubs.stubCurrentUrl.reset();
        decorators.stubs.stubReadyToOrder.reset();
        decorators.stubs.stubOnline.reset();
        decorators.stubs.stubSetReadyToOrder.reset();
        decorators.stubs.stubBundleReadyToOrder.reset();
        decorators.stubs.stubSetIndividualProducts.reset();
        decorators.stubs.stubBundledProducts.reset();
        decorators.stubs.stubBonusUnitPrice.reset();
        decorators.stubs.stubPageMetaData.reset();
        decorators.stubs.stubTemplate.reset();
        decorators.stubs.stubP360.reset();
    });


    it('should call P360 function for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubP360.calledOnce);
    });
});
