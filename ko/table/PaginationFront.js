/**
 * Created by vikto on 1/17/2017.
 */
/*global __g_sm, ko, _, _campaignID, Tracx*/

define(
    ['resource!ko/components/table/PaginationBase'],
    function(PaginationBase)
    {
        /**
         * Pagination Front - client side pagination
         * @param {object} _options - params
         * @param {object|ko.observable} _data - rows
         * @constructor
         */
        function PaginationFront(_options, _data)
        {
            //PaginationBase.call(this);

            this.__init.apply(this, arguments);
        }

        PaginationFront.augments(PaginationBase);


        /**
         * Get Number Of Pages
         * @return {number} - number of pages
         * @private
         */
        PaginationFront.prototype.getNumberOfPages = function()
        {
            return Math.ceil(this.data().length / this.recordsPerPage());
        };

        /**
         * Get Table Records
         * @return {Array} - records
         * @private
         */
        PaginationFront.prototype.getRecords = function()
        {
            var data = this.data(),
                currentPage = this.currentPageIndex(),
                recordsPerPage = this.recordsPerPage(),
                startIndex,
                endIndex;

            startIndex = currentPage * recordsPerPage;
            endIndex = startIndex + recordsPerPage;

            //if recordsPerPage is bigger than records count, avoid empty pages
            if (startIndex >= data.length)
            {
                //return to the first page
                this.currentPage(1);
                startIndex = 0;
                endIndex = recordsPerPage;
            }

            return data.slice(startIndex, endIndex);
        };


        /**
         * Get Number Of Pages
         * @return {number} - number of pages
         * @private
         */
        PaginationFront.prototype.__getNumberOfPages = function()
        {
            return Math.ceil(this.data().length / this.recordsPerPage());
        };

        return PaginationFront;
    }
);