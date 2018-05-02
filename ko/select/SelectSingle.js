/*global __g_sm, ko, _, _campaignID, Tracx, Q, _campaignDateFormat, $, _campaignTimeZone */
define(
    [
        'resource!ko/components/select/Select'
    ],
    function(Select)
    {
        /**
         * single select - extending regular select.
         * @constructor
         */
        function SelectSingle(element, params)
        {
            Select.call(this, element, params);
            this.selectTemplate('ko/components/select/select-object-single');
            this.selectActionBarTemplate('ko/components/select/action-bar-select-single');
        }
        SelectSingle.augments(Select);
        SelectSingle.prototype.itemClickApproved = function(item, event)
        {
            if ( !_.isNull(this.optionsValue) )
            {
                this.selected(ko.unwrap(item[this.optionsValue]));
            }
            else
            {
                // in single we replace the observable
                this.selected(ko.unwrap(item));
            }

            this.showList(false);
            this.search('');
        };
        /**
         * this is used by the templates - to decide if an item is selected or not.
         * @param {object} _item - the item we check if its selected
         * @private
         * @return {boolean} - true or false if this item is selected.
         */
        SelectSingle.prototype.isSelected = function(_item)
        {
            var _optValue = ko.unwrap(_item[this.optionsValue]),
                _selected = this.selected();

            if ( this.optionsValue )
            {
                return _selected === _optValue;
            }

            return _selected === _item;
        };

        return SelectSingle;
    }
);