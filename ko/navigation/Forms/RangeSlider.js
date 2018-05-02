/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
        'resource!ko/knockout-range',
        'resource!ko/knockout-utils'
    ],
    function()
    {

        'use strict';

        /**
         * @constructor
         */
        function RangeSlider()
        {
            this.maxAge = ko.observable(63);
            this.minAge = ko.observable(25);
        }

        return RangeSlider;
    }
);