/**
 * Library for providing Site Preferences
 */

(function () {
    var Preferences = function () {
        var system = require('dw/system');
        var currentSite = system.Site.getCurrent();
        var that = this;
        var p360Preferences = {};
        p360Preferences.P360ZoomPower = currentSite.getCustomPreferenceValue('P360ZoomPower');
        p360Preferences.P360ZoomRadius = currentSite.getCustomPreferenceValue('P360ZoomRadius');
        p360Preferences.P360AutoRotateInterval = currentSite.getCustomPreferenceValue('P360AutoRotateInterval');
        p360Preferences.P360AutoRotate = currentSite.getCustomPreferenceValue('P360AutoRotate');

		/**
		 * Return P360 preferences
		 *
		 * @returns {string} p360Preferences
		 */
        that.getP360Preferences = function () {
            return p360Preferences;
        };

		/**
		 * @returns {list} - currentSiteID
		 */
        that.getCurrentSiteID = function () {
            return currentSite.ID;
        };


		/**
		 * Returns P360 Enable / Disable
		 *
		 * @returns {boolean} - P360Enabled
		 */
        that.getP360Status = function () {
            return currentSite.getCustomPreferenceValue('P360Enabled');
        };


		/**
		 * Returns Folder Name used by site
		 *
		 * @returns {string} - P360FolderName
		 */
        that.getFolderName = function () {
            return currentSite.getCustomPreferenceValue('P360FolderName');
        };

		/**
		 * Return P360 Master Product Image View Type
		 *
		 * @returns {string} Master Product Image View Type
		 */
        that.getViewTypeMaster = function () {
            return currentSite.getCustomPreferenceValue('P360MasterViewType');
        };

		/**
		 * Return P360 Variant Product Image View Type
		 *
		 * @returns {string} Variant Product Image View Type
		 */
        that.getViewTypeVariant = function () {
            return currentSite.getCustomPreferenceValue('P360VariantViewType');
        };

		/**
		 * Return P360 Standard Product Image View Type
		 *
		 * @returns {string} Standard Product Image View Type
		 */
        that.getViewTypeStandard = function () {
            return currentSite.getCustomPreferenceValue('P360StandardViewType');
        };

		/**
		 * Return P360 Option Product Image View Type
		 *
		 * @returns {string} Option Product Image View Type
		 */
        that.getViewTypeOptionProduct = function () {
            return currentSite.getCustomPreferenceValue('P360StandardViewType');
        };

		/**
		 * Return P360 Product Set Image View Type
		 *
		 * @returns {string} Product Set Image View Type
		 */
        that.getViewTypeSet = function () {
            return currentSite.getCustomPreferenceValue('P360ProductSetViewType');
        };

		/**
		 * Return P360 Product Bundle Image View Type
		 *
		 * @returns {string} Product Bundle Image View Type
		 */
        that.getViewTypeBundle = function () {
            return currentSite.getCustomPreferenceValue('P360ProductBundleViewType');
        };

		/**
		 * Return P360 Variation Group Image View Type
		 *
		 * @returns {string} Variation Group Image View Type
		 */
        that.getViewTypeVariationGroup = function () {
            return currentSite.getCustomPreferenceValue('P360VariationGroupViewType');
        };
    };
    module.exports = new Preferences();
}());
