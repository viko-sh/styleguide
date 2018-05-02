/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
    ],
    function()
    {

        'use strict';

        /**
         *
         * @param params
         * @constructor
         */
        function Tag(params)
        {
            this.name   = ko.observable(params.name);
        }

        /**
         * @constructor
         */
        function Tags()
        {
            this.tags = ko.observableArray([]);
            this.tags.push(new Tag({ name: 'tag #1' }));
            this.tags.push(new Tag({ name: 'tag #2' }));
            this.tags.push(new Tag({ name: 'tag #3' }));
            this.tags.push(new Tag({ name: 'tag #4' }));
        }

        return Tags;
    }
);