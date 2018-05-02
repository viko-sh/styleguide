/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
        'resource!moment',
        'resource!ko/knockout-fdatepicker',
        'resource!ko/knockout-utils'
    ],
    function(moment)
    {

        'use strict';

        /**
         * @constructor
         */
        function DatePicker()
        {
            window._campaignDateFormat = 'm-d-Y';
            this.startDate          = ko.observable(null);
            this.endDate            = ko.observable(null);

            this.dateFormat         = this.getTimezoneFormat();
            this.minDate = moment(moment.utc(), 10800).format('MM-DD-YYYY');
            this.startDate(moment(moment.utc(), 10800).format('MM-DD-YYYY'));
            this.endDate(moment(moment.utc().add(7, 'days'), 10800).format('MM-DD-YYYY'));
        }

        /**
         * @returns {XML|string}
         */
        DatePicker.prototype.getTimezoneFormat = function()
        {
            return window._campaignDateFormat.replace('m', 'MM').replace('d', 'DD').replace('Y', 'YYYY');
        };

        return DatePicker;
    }
);