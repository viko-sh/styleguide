/*global __g_sm,Q, toggleGorila, ko, _, $, Modernizr, Q*/
define(
    [
        'json!resources/iconsData.json',
        'resource!ko/knockout-utils'
    ],
    function(data)
    {
        'use strict';

        /**
         *
         * @constructor
         */
        function Icons()
        {
            this.collection     = ko.mapping.fromJS([]);
            this.search         = ko.observable('');

            this.filteredCollection     = ko.pureComputed(this.__filterIcons, this);
            this.renderIcons(data);
        }

        /**
         * computed function that filters the icons by term
         * @returns {array} - the filtered array of icons
         * @private
         */
        Icons.prototype.__filterIcons = function()
        {
            var term = this.search().trim().toLowerCase();

            return ko.utils.arrayFilter(this.collection(), function(icon)
            {
                return icon.name.toLowerCase().indexOf(term) >= 0;
            });
        };

        Icons.prototype.renderIcons = function(_data)
        {
            var mapping;

            /**
             * @param {object} iconData - object contains the name
             * @return {void}
             */
            function Icon(iconData)
            {
                this.name = iconData.name;
            }

            mapping = {
                create: function(options)
                {
                    return new Icon({name: options.data.properties.name});
                }
            };
            ko.mapping.fromJS(_data.icons, mapping, this.collection);
        };

        return Icons;
    }
);