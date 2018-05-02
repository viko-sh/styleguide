/*global __g_sm, ko, _, _campaignID, Tracx, Q, _campaignDateFormat, $, _campaignTimeZone */
define(
    [
        'resource!ko/components/select/Select'
    ],
    function(Select)
    {
        /**
         * multi select - extending regular select.
         * @constructor
         */
        function SelectMulti(element, params)
        {
            Select.call(this, element, params);
            this.selectTemplate('ko/components/select/select-object-multi');
            this.selectActionBarTemplate('ko/components/select/action-bar-select-multi');
        }
        SelectMulti.augments(Select);
        SelectMulti.prototype.itemClickApproved = function(item, event)
        {
            if ( !_.isNull(this.optionsValue) )
            {
                // check if item is selected -> then remove it.
                if ( !(this.selected.indexOf(ko.unwrap(item[this.optionsValue])) === -1) )
                {
                    // remove item
                    this.selected.remove(ko.unwrap(item[this.optionsValue]));
                }
                else
                {
                    // in multi we push to array
                    this.selected.push(ko.unwrap(item[this.optionsValue]));
                }
            }
            else
            {
                // check if item is selected -> then remove it.
                if ( !(this.selected.indexOf(item) === -1) )
                {
                    // remove item
                    this.selected.remove(item);
                }
                else
                {
                    // in multi we push to array
                    this.selected.push(item);
                }
            }

        };
        /**
         * this is used by the templates - to decide if an item is selected or not.
         * @param {object} _item - the item we check if its selected
         * @private
         * @return {boolean} - true or false if this item is selected.
         */
        SelectMulti.prototype.isSelected = function(_item)
        {
            var _optValue = ko.unwrap(_item[this.optionsValue]),
                _selected = this.selected();

            if ( this.optionsValue )
            {
                return _.contains(_selected, _optValue);
            }

            return !(this.selected.indexOf(_item) === -1);
        };


        SelectMulti.prototype.actionBarSelectClick = function()
        {
            if ( this.optionsSearch)
            {
                if ( !_.difference(this.filterOptions(), this.selected()).length)
                {
                    this.unselectAll();
                }
                else
                {
                    this.selectAll();
                }
            }
            else
            {
                if ( this.selected().length === this.options().length)
                {
                    this.unselectAll();
                }
                else
                {
                    this.selectAll();
                }
            }
        };

        SelectMulti.prototype.actionBarIcon = function()
        {
            if ( this.optionsCategory && this.optionsSearch )
            {
                return !_.difference(_.flatten(_.pluck(this.filterOptions(), 'items')), this.selected()).length ? 'tr-icon-unselected' : 'tr-icon-select-all';
            }
            if ( this.optionsSearch)
            {
                return !_.difference(this.filterOptions(), this.selected()).length ? 'tr-icon-unselected' : 'tr-icon-select-all';
            }
            return this.selected().length === this.options().length ? 'tr-icon-unselected' : 'tr-icon-select-all';
        };

        SelectMulti.prototype.actionBarTooltip = function()
        {
            if ( this.optionsCategory && this.optionsSearch )
            {
                return !_.difference(_.flatten(_.pluck(this.filterOptions(), 'items')), this.selected()).length ? 'Unselect All' : 'Select All';
            }
            if ( this.optionsSearch)
            {
                return !_.difference(this.filterOptions(), this.selected()).length ? 'Unselect All' : 'Select All';
            }
            return this.selected().length === this.options().length ? 'Unselect All' : 'Select All';
        };

        SelectMulti.prototype.categoryIcon = function(cateogry)
        {
            if ( this.optionsCategory && this.optionsSearch )
            {
                return !_.difference(cateogry.items, this.selected()).length ? 'tr-icon-unselected' : 'tr-icon-select-all';
            }
        };

        return SelectMulti;
    }
);