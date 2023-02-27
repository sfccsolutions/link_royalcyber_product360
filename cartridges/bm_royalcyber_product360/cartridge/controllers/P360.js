/* global request, empty, dw*/
/* eslint-disable no-param-reassign */
/* eslint-disable no-loop-func */

/**
 * Function to add Images
 */
function addImages() {
	/* API includes */
    var ISML = require('dw/template/ISML');
    var ProductMgr = require('dw/catalog/ProductMgr');

	/* Local includes */
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var localeSelected = request.httpParameterMap.localeSelected.stringValue;
    var locales = Helper.getLanguages();
    var productObj;
    var p360Publish;
    var product;

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }
    var productID = request.httpParameterMap.productID.stringValue;
    request.setLocale(localeSelected);
    if (productID !== null && productID !== '' && productID !== 'null') {
        product = ProductMgr.getProduct(productID);
        if (productObj) {
            productObj = product.custom.P360Images;
        } else {
            productObj = '{ "p360": [] }';
        }
        p360Publish = product.custom.P360Publish;
    }

    ISML.renderTemplate('addimages', {
        productID: productID,
        locales: locales,
        localeSelected: localeSelected,
        productObj: productObj,
        p360Publish: p360Publish,
        product: product
    });
}

/**
 * Function to publish Images
 */
function publishStatus() {
    var ISML = require('dw/template/ISML');
    var Transaction = require('dw/system/Transaction');
    var ProductMgr = require('dw/catalog/ProductMgr');

	/* Local includes */
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var localeSelected = request.httpParameterMap.localeSelected.stringValue;
    var locales = Helper.getLanguages();

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }

    var productID = request.httpParameterMap.productID.stringValue;
    var status = request.httpParameterMap.status.stringValue;
    if (status == null && status === '' && status === 'null') {
        status = 'false';
    }
    request.setLocale(localeSelected);
    if (productID !== null && productID !== '' && productID !== 'null') {
        var product = ProductMgr.getProduct(productID);
        var productObj = product.custom.P360Images;
        Transaction.wrap(function () {
            if (status === 'true') {
                product.custom.P360Publish = true;
            } else if (status === 'false') {
                product.custom.P360Publish = false;
            }
        });
        var p360Publish = product.custom.P360Publish;

        ISML.renderTemplate('addimages', {
            productID: productID,
            locales: locales,
            localeSelected: localeSelected,
            productObj: productObj,
            p360Publish: p360Publish,
            product: product
        });
    }
}

/**
 * Function to Create DIrectories
 * @param {string} folderName - Directory Name
 */
function createDirectories(folderName) {
	/* API includes */
    var File = require('dw/io/File');

	/* Local includes */
    var preferences = require('~/cartridge/scripts/preferences/p360Preferences');

    var currentSite = preferences.getCurrentSiteID();
    var p360Dir = preferences.getFolderName();
    var p360FolderName = '/default/' + currentSite + '/' + p360Dir + '/' + folderName;
    var p360Folder = new File(File.STATIC + p360FolderName);
    if (!p360Folder.exists()) {
        p360Folder.mkdirs();
    }
}

/**
 * Function to upload Images
 */
function uploadImages() {
	/* API includes */
    var ISML = require('dw/template/ISML');
    var File = require('dw/io/File');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Transaction = require('dw/system/Transaction');
	/* Local includes */
    var preferences = require('~/cartridge/scripts/preferences/p360Preferences');
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var currentSite = preferences.getCurrentSiteID();
    var productID = request.httpParameterMap.productIDHidden.stringValue;
    var localeSelected = request.httpParameterMap.localeSelected.stringValue;
    var imagePath = request.httpParameterMap.imagePath.stringValue;
    var locales = Helper.getLanguages();
    var productVariants;
    var tempp360ImageObject;
    var product;

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }
    var p360Dir = preferences.getFolderName();
    createDirectories(productID);
    var file;
    var params = request.httpParameterMap;
    var image;


    request.setLocale(localeSelected);

    if (productID !== null && productID !== '' && productID !== 'null') {
        product = ProductMgr.getProduct(productID);
        var p360ImageObject = JSON.parse(product.custom.P360Images);

        if (p360ImageObject == null || p360ImageObject === '' || p360ImageObject === 'null') {
            p360ImageObject = {};
            p360ImageObject.p360 = [];
        }

        if (imagePath === 'remote') {
            var p360RemoteImageList = JSON.parse(request.httpParameterMap.p360RemoteImage_hidden);
            for (var k = 0; k < p360RemoteImageList.length; k++) {
                p360ImageObject.p360.push(p360RemoteImageList[k]);
            }
        } else {
            params.processMultipart((function (field, ct, oname) {
                file = new File(File.STATIC + '/default/' + currentSite + '/' + p360Dir + '/' + productID + '/' + oname);
                image = file.getName();
                p360ImageObject.p360.push(image);
                return file;
            }));
        }

        tempp360ImageObject = JSON.stringify(p360ImageObject);
        var blankp360Array = '{"p360":[]}';
        if (product.isMaster()) {
            productVariants = product.getVariants();
            var variationGroups = product.getVariationGroups();

            for (var i = 0; i < productVariants.length; i++) {
                if (empty(productVariants[i].custom.P360Images))					{
                    Transaction.wrap(function () {
                        productVariants[i].custom.P360Images = blankp360Array;
                    });
                }
            }

            for (var j = 0; j < variationGroups.length; j++) {
                if (empty(variationGroups[j].custom.P360Images))					{
                    Transaction.wrap(function () {
                        variationGroups[j].custom.P360Images = blankp360Array;
                    });
                }
            }
        } else if (product.isVariationGroup()) {
            productVariants = product.getVariants();

            for (var l = 0; l < productVariants.length; l++) {
                if (empty(productVariants[l].custom.P360Images))					{
                    Transaction.wrap(function () {
                        productVariants[l].custom.P360Images = blankp360Array;
                    });
                }
            }
        }

        Transaction.wrap(function () {
            product.custom.P360Images = tempp360ImageObject;
        });
    }

    ISML.renderTemplate('addimages', {
        fileProcessed: 'Image(s) uploaded successfully',
        locales: locales,
        localeSelected: localeSelected,
        productID: productID,
        productObj: tempp360ImageObject,
        product: product
    });
}

/**
 * Function to upload Images
 */
function updateImages() {
    var ISML = require('dw/template/ISML');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Transaction = require('dw/system/Transaction');
	/* Local includes */
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var productID = request.httpParameterMap.productID.stringValue;
    var p360ImageObj = request.httpParameterMap.p360ImageObj.stringValue;
    var localeSelected = request.httpParameterMap.localeSelected.stringValue;
    var locales = Helper.getLanguages();

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }

    request.setLocale(localeSelected);
    var product = ProductMgr.getProduct(productID);
    var tempp360ImageObject = p360ImageObj;

    if (p360ImageObj !== '') {
        Transaction.wrap(function () {
            product.custom.P360Images = p360ImageObj;
        });
    }

    ISML.renderTemplate('addimages', {
        locales: locales,
        localeSelected: localeSelected,
        productID: productID,
        productObj: tempp360ImageObject,
        product: product
    });
}

/**
 * Function to remove Images
 */
function removeImage() {
    var ISML = require('dw/template/ISML');
    var File = require('dw/io/File');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Transaction = require('dw/system/Transaction');
	/* Local includes */
    var preferences = require('~/cartridge/scripts/preferences/p360Preferences');
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var currentSite = preferences.getCurrentSiteID();
    var productID = request.httpParameterMap.productID.stringValue;
    var image = request.httpParameterMap.image.stringValue;
    var locales = Helper.getLanguages();
    var p360Dir = preferences.getFolderName();
    var localeSelected;

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }


    request.setLocale(localeSelected);
    var product = ProductMgr.getProduct(productID);

    var p360ImageObject = JSON.parse(product.custom.P360Images);
    var imageIndex = p360ImageObject.p360.indexOf(image);
    if (imageIndex > -1) {
        p360ImageObject.p360.splice(imageIndex, 1);
        var file = new File(File.STATIC + '/default/' + currentSite + '/' + p360Dir + '/' + productID + '/' + image);
        file.remove();
    }

    var tempp360ImageObject = JSON.stringify(p360ImageObject);


    Transaction.wrap(function () {
        product.custom.P360Images = tempp360ImageObject;
    });

    ISML.renderTemplate('addimages', {
        locales: locales,
        localeSelected: localeSelected,
        productID: productID,
        productObj: tempp360ImageObject,
        product: product
    });
}

/**
 * Function to Remove Selected Images
 */
function removeSelectedImages() {
    var ISML = require('dw/template/ISML');
    var File = require('dw/io/File');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Transaction = require('dw/system/Transaction');
	/* Local includes */
    var preferences = require('~/cartridge/scripts/preferences/p360Preferences');
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var currentSite = preferences.getCurrentSiteID();
    var productID = request.httpParameterMap.productID.stringValue;
    var locales = Helper.getLanguages();
    var imageIndex;
    var selectedImagesList = JSON.parse(request.httpParameterMap.selectedImagesArray_hidden);
    var p360Dir = preferences.getFolderName();
    var localeSelected;

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }

    request.setLocale(localeSelected);
    var product = ProductMgr.getProduct(productID);

    var p360ImageObject = JSON.parse(product.custom.P360Images);

    for (var i = 0; i < selectedImagesList.length; i++) {
        imageIndex = p360ImageObject.p360.indexOf(selectedImagesList[i]);
        if (imageIndex > -1) {
            p360ImageObject.p360.splice(imageIndex, 1);
            var file = new File(File.STATIC + '/default/' + currentSite + '/' + p360Dir + '/' + productID + '/' + selectedImagesList[i]);
            file.remove();
        }
    }


    var tempp360ImageObject = JSON.stringify(p360ImageObject);


    Transaction.wrap(function () {
        product.custom.P360Images = tempp360ImageObject;
    });

    ISML.renderTemplate('addimages', {
        locales: locales,
        localeSelected: localeSelected,
        productID: productID,
        productObj: tempp360ImageObject,
        product: product
    });
}

/**
 * Fetch Master/Variant products from database and pass data to ISML.
 * @param {string} productType - product Type
 * @param {string} getVariantsOf - getVariantsOf
 * @param {string} localeSelected - locale Selected
 */
function getAllProducts(productType, getVariantsOf, localeSelected) {
	/* API includes */
    var ISML = require('dw/template/ISML');
    var ProductMgr = require('dw/catalog/ProductMgr');
    var Logger = require('dw/system').Logger.getLogger('product360', '');

	/* Local includes */
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');

    var prevPage = request.httpParameterMap.prev_page.stringValue ? request.httpParameterMap.prev_page.stringValue : '';

    var searchParam = request.httpParameterMap.search.stringValue ? request.httpParameterMap.search.stringValue : '';

    var actualPageProducts = request.httpParameterMap.actualPageProducts.intValue ? request.httpParameterMap.actualPageProducts.intValue : 1;

    var pageSize = request.httpParameterMap.pageSize.intValue ? request.httpParameterMap.pageSize.intValue : 50;

    var locales = Helper.getLanguages();
    var product;

    if (productType == null || productType === '' || empty(productType)) {
        productType = request.httpParameterMap.productType.stringValue;
    }

    if (getVariantsOf == null || getVariantsOf === '' || empty(getVariantsOf)) {
        getVariantsOf = request.httpParameterMap.getVariantsOf.stringValue;
    }
    var productArray = new dw.util.ArrayList();

    if (empty(productType)) {
        productType = 'allProducts';
    }

    if (empty(localeSelected)) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }

    request.setLocale(localeSelected);

    var totalProductCount;
    var paginationProduct;

    try {
        if (productType === 'allProducts') {
            if (searchParam !== '' && !empty(searchParam) && searchParam != null) {
                product = ProductMgr.getProduct(searchParam);

                productArray.push(product);

                totalProductCount = productArray.length;
            } else {
                var transformProductsTemp = ProductMgr.queryAllSiteProductsSorted();
                var PagingModel = require('dw/web/PagingModel');

                var pageStart = (pageSize * actualPageProducts) - pageSize;

                var pagingModel = new PagingModel(transformProductsTemp, transformProductsTemp.count);
                pagingModel.setStart(pageStart);
                pagingModel.setPageSize(pageSize);
                pagingModel.getPageCount();

                totalProductCount = pagingModel.count;

                var iter = pagingModel.pageElements;

                actualPageProducts = pagingModel.getCurrentPage();

                var numberOfPages = pagingModel.getPageCount();
                var showPrev = actualPageProducts !== 0;
                var showNext = actualPageProducts + 1 !== numberOfPages;

                var useDots = false;
                var listOfPages = [1];
                if (numberOfPages > 6) {
                    useDots = true;
                    if (actualPageProducts > 4) {
                        listOfPages.push('dots');
                    }
                    for (var i = -2; i <= 2; i++) {
                        var pageNumber = actualPageProducts + i;
                        if (pageNumber > 0 && listOfPages.indexOf(pageNumber) === -1 && pageNumber < numberOfPages) {
                            listOfPages.push(pageNumber);
                        }
                    }
                    if (actualPageProducts + 3 < numberOfPages) {
                        listOfPages.push('dots');
                    }
                }
                listOfPages.push(numberOfPages);

                paginationProduct = {
                    useDots: useDots,
                    listOfPages: listOfPages,
                    numberOfPages: numberOfPages,
                    actualPageProducts: actualPageProducts + 1,
                    showPrev: showPrev,
                    showNext: showNext,
                    showPagination: numberOfPages > 1
                };

                while (iter.hasNext()) {
                    product = iter.next();
                    productArray.push(product);
                }
                transformProductsTemp.close();
            }
        }
    } catch (e) {
        Logger.error('Exception:  - {0}', e);
    }
    ISML.renderTemplate('getallproducts', {
        transformProducts: productArray,
        productType: productType,
        locales: locales,
        localeSelected: localeSelected,
        getVariantsOf: getVariantsOf,
        paginationProduct: paginationProduct,
        count: totalProductCount,
        pageSize: pageSize,
        searchParam: searchParam,
        prev_page: prevPage
    });
}

/**
 * Main function for get All Products
 */
function allProducts() {
	/* API includes */
    var ISML = require('dw/template/ISML');

	/* Local includes */
    var preferences = require('~/cartridge/scripts/preferences/p360Preferences');

    var p360Enable = preferences.getP360Status();

    if (p360Enable) {
        getAllProducts();
    } else {
        ISML.renderTemplate('errorpage');
    }
}

/**
 * function to set auto Interval
 */
function autoInterval() {
    var ISML = require('dw/template/ISML');
    var Transaction = require('dw/system/Transaction');
    var ProductMgr = require('dw/catalog/ProductMgr');

	/* Local includes */
    var Helper = require('~/cartridge/scripts/helpers/p360Helper');
    var localeSelected = request.httpParameterMap.localeSelected.stringValue;
    var locales = Helper.getLanguages();

    if (localeSelected == null) {
        localeSelected = request.httpParameterMap.localeSelected.stringValue;
    }

    if (empty(localeSelected)) {
        localeSelected = Helper.getCurrentLanguage();
    }

    var productID = request.httpParameterMap.productIDHidden.stringValue;
    var p360AutoRotateIntervalProduct = request.httpParameterMap.P360AutoRotateIntervalProduct.stringValue;

    request.setLocale(localeSelected);
    if (productID !== null && productID !== '' && productID !== 'null') {
        var product = ProductMgr.getProduct(productID);
        var productObj = product.custom.P360Images;
        Transaction.wrap(function () {
            product.custom.P360AutoRotateIntervalProduct = p360AutoRotateIntervalProduct;
        });
        var p360Publish = product.custom.P360Publish;

        ISML.renderTemplate('addimages', {
            productID: productID,
            locales: locales,
            localeSelected: localeSelected,
            productObj: productObj,
            p360Publish: p360Publish,
            product: product
        });
    }
}


allProducts.public = true;
module.exports.AllProducts = allProducts;

getAllProducts.public = true;
module.exports.getAllProducts = getAllProducts;

addImages.public = true;
module.exports.addImages = addImages;

publishStatus.public = true;
module.exports.publishStatus = publishStatus;

uploadImages.public = true;
module.exports.uploadImages = uploadImages;

updateImages.public = true;
module.exports.updateImages = updateImages;

removeImage.public = true;
module.exports.removeImage = removeImage;

removeSelectedImages.public = true;
module.exports.removeSelectedImages = removeSelectedImages;

createDirectories.public = true;
module.exports.createDirectories = createDirectories;

autoInterval.public = true;
module.exports.autoInterval = autoInterval;

