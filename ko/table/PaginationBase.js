/**
 * Created by vikto on 1/16/2017.
 */
/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
    ],
    function()
    {
        ko.extenders.maxPage = function(target, _maxPage)
        {
            var maxPage = _maxPage,
                value,
                result;

            /**
             *
             * @param {string|int} _newValue - input value
             * @return {void}
             */
            function write(_newValue)
            {
                var pattern = /^\d+$/,
                    newValue = ( pattern.test(_newValue)) ? +_newValue : 1;

                if (newValue > maxPage())
                {
                    value = maxPage();
                }
                else if (newValue <= 0 )
                {
                    value = 1;
                }
                else
                {
                    value = newValue;
                }

                target(value);
            }

            result = ko.pureComputed({
                read: target,
                write: write,
                owner: this
            }).extend({ notify: 'always' });

            result(target());

            return result;
        };
        /**
         *
         * @constructor
         */
        function PaginationBase()
        {
            this.options = {};
            this.__init.call(this);
        }

        /**
         * Init Pagination
         * @param {object} _options - pagination options
         * @param {array|ko.observable} _data - pagination data
         * @param {object} _component - component data object
         * @private
         * @return {void}
         */
        PaginationBase.prototype.__init = function(_options, _data, _component)
        {
            var data;

            data = _data || [];

            this.options                = _options;
            this.component              = _component;
            this.url                    = this.options.serverUrl || null;
            this.serverParams           = this.options.serverParams;
            this.recordsPerPageOptions  = this.options.recordsPerPageOptions || [5, 10];

            this.showLoader             = _component.showLoader;

            this.data                   = ko.isObservable(data) ? data : ko.observableArray(data);
            this.recordsPerPage         = ko.observable(this.options.recordsPerPage || this.recordsPerPageOptions[0]);

            this.pagesNum               = ko.pureComputed(this.__getNumberOfPages, this);
            this.pagesNum.subscribe(this.__pagesNumChanged, this);

            this.currentPageIndex = ko.pureComputed(this.__getCurrentPageIndex, this);
            this.currentPage = ko.observable(1).extend({maxPage: this.pagesNum.bind(this)}).withPausing();
            this.canGoNext = ko.pureComputed(this.__canGoNext, this);
            this.canGoPrev = ko.pureComputed(this.__canGoPrev, this);
            this.records = ko.pureComputed(this.getRecords, this).extend({ async: true });
            this.showLoader = _component.showLoader;
            this.resetLocal = false;
        };

        /**
         * Advance to next page
         * @return {void}
         */
        PaginationBase.prototype.nextPage = function()
        {
            this.currentPage(+this.currentPage() + 1);
        };

        /**
         * check once pages amount is changed - that we are in the current page ( last or lower ) , if not , show last page.
         * fixed: https://tracxinc.atlassian.net/browse/TRACX-458
         * @param {number} _pageAmount - number of pages
         * @private
         * @return {void}
         */
        PaginationBase.prototype.__pagesNumChanged = function(_pageAmount)
        {
            if ( _pageAmount < this.currentPageIndex() )
            {
                this.currentPage(_pageAmount);
            }
        };

        /**
         * Advance to previous page
         * @return {void}
         */
        PaginationBase.prototype.prevPage = function()
        {
            this.currentPage(+this.currentPage() - 1);
        };

        /**
         * Check if it possible to advance to next page
         * @return {boolean} - state
         * @private
         */
        PaginationBase.prototype.__canGoNext = function()
        {
            return +this.currentPage() !== this.pagesNum();
        };

        /**
         * Check if it possible to get previous page
         * @return {boolean} - state
         * @private
         */
        PaginationBase.prototype.__canGoPrev = function()
        {
            return +this.currentPage() > 1;
        };

        /**
         * Get current page index
         * @return {number} - Current page index
         * @private
         */
        PaginationBase.prototype.__getCurrentPageIndex = function()
        {
            return this.currentPage() - 1;
        };

        PaginationBase.prototype.getRecords = function()
        {
        };

        PaginationBase.prototype.__getNumberOfPages = function()
        {
        };


        return PaginationBase;
    }
);
