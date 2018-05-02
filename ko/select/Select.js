/*global __g_sm, ko, _, _campaignID, Tracx, Q, _campaignDateFormat, $, _campaignTimeZone, guid */
define(
	[
		'resource!ko/knockout-utils',
		'resource!ko/knockout-delegatedEvents'
	],
	function ()
	{
		/**
		 * Constructor
		 * @constructor
		 * @param {Element} element - the element who is the KO component element
		 * @param {Object} params - the component parameter sent from html
		 * @return {void}
		 */
		function Select(element, params)
		{
			/**
			 * all the types the select support for now.
			 * @type {{DEFAULT: number, ICON_LIST: number, CHECKBOX_LEFT_LIST: number, CHECKBOX_RIGHT_LIST: number}}
			 */
			this.TYPE = {DEFAULT: 0, ICON_LIST: 1, CHECKBOX_LEFT_LIST: 2, CHECKBOX_RIGHT_LIST: 3};

			this.element = element;
			this.params = params; // options, optionsText, optionsValue, selected, multi, caption
			this._id = guid(); // unique ID for component

			this.type = params.type ? params.type : this.TYPE.DEFAULT; // default
			this.multi = params.multi ? params.multi : false; // default not multiselect
			// save bindings on our component
			this.options = params.options;
			this.optionsText = params.optionsText ? params.optionsText : null;
			this.optionsValue = params.optionsValue ? params.optionsValue : null;
			this.caption = params.caption ? params.caption : null;
			this.selected = params.selected; // can be null only if we use optionsConfirm
			// adding confirm value before change
			this.optionsConfirm = params.optionsConfirm ? params.optionsConfirm : null;
			this.optionsIcon = params.optionsIcon ? params.optionsIcon : null;
			this.optionsWidth = params.optionsWidth ? params.optionsWidth : '100%';

			// observable flags
			this.disable = ko.isObservable(params.disable) ? params.disable : ko.observable(params.disable ? params.disable : false);
            this.disableUnselected = ko.observable(false).extend({ mutate: params.disableUnselected });
            this.showList = ko.observable(false);
			this.search = ko.observable('').extend({rateLimit: 300});

			// templates
			this.selectTemplate = ko.observable('');
			this.itemTemplate = ko.observable('default-select');
			this.selectActionBarTemplate = ko.observable('');
			this.selectListTemplate = ko.observable('');

			// search feature support
			this.optionsSearch = params.optionsSearch ? params.optionsSearch : null;
			if (this.optionsSearch)
			{
				this.selectListTemplate('ko/components/select/select-list-with-search');
				this.filterOptions = ko.pureComputed(this.__filterOptions, this);
			}
			else
			{
				this.selectListTemplate('ko/components/select/select-list-no-search');
			}
			this.selectedText = ko.computed(this.__updateInputSelectedText, this); // input text of all selected values , by default show placeholder - so this is null
			// tooltip handling - creating html & show more button
			this.truncate = ko.observable(true);
			this.selectedTextTooltip = ko.computed(this.__updateInputSelectedTextTooltip, this);

			this.__init.call(this);
		}

		Select.prototype.__init = function ()
		{
			var _selectWrapper = $(this.element).find('.tr-select-component')[0];

			ko.utils.toggleDomNodeCssClass(this.element, 'tracx_select_' + this._id, true);
			if ($(this.element).hasClass('small'))
			{
				ko.utils.toggleDomNodeCssClass(_selectWrapper, 'small', true);
			}
			if ($(this.element).hasClass('large'))
			{
				ko.utils.toggleDomNodeCssClass(_selectWrapper, 'large', true);
			}

			$(document).on('click', 'div.select-box-tooltip.' + this._id + ' h6', this.__tooltipShowMore.bind(this));
		};

		/**
		 * filter function - if search is enabled.
		 * @private
		 * @return {array}
		 */
		Select.prototype.__filterOptions = function ()
		{
			var search = this.search().toLowerCase();
			return ko.utils.arrayFilter(ko.unwrap(this.options), function (option)
			{
				if (_.isBoolean(this.optionsSearch) && this.optionsSearch)
				{
					return option.toLowerCase().indexOf(search) >= 0;
				}
				// we assume optionsSearch is a string key
				return ko.unwrap(option[this.optionsSearch]).toLowerCase().indexOf(search) >= 0;
			}.bind(this));
		};

		/**
		 * item click in the list event.
		 * @param {Object|integer|string} item - can be any item that the select is handling
		 * @param {Event} event - the click event
		 * @return {void}
		 */
		Select.prototype.itemClick = function (item, event)
		{
			if (this.isItemDisabled(item))
			{
				return;
			}

			if (!_.isNull(this.optionsConfirm))
			{
				if (this.isSelected(item))
				{
					this.showList(false);
					this.search('');
					return;
				}

				if (_.isFunction(this.optionsConfirm.confirmOnlyIf) && this.optionsConfirm.confirmOnlyIf())
				{
					if (_.isFunction(this.optionsConfirm.confirmBefore))
					{
						this.optionsConfirm.confirmBefore();
					}

					Tracx.notifications.confirm(this.optionsConfirm.confirmMessage || 'are you sure?', 'medium',
						// approved
						function ()
						{
							this.itemClickApproved.call(this, item, event);
							if (_.isFunction(this.optionsConfirm.confirmAfter))
							{
								this.optionsConfirm.confirmAfter();
							}
						}.bind(this),
						// declined
						function ()
						{
							if (_.isFunction(this.optionsConfirm.confirmAfter))
							{
								this.optionsConfirm.confirmAfter();
							}
						}.bind(this)
					);
				}
				else
				{
					// no need to confirm - so we just click.
					this.itemClickApproved.call(this, item, event);
				}
			}
			else
			{
				this.itemClickApproved.call(this, item, event);
			}

		};

		/**
		 *
		 * @param {Object} item
		 * @returns {boolean}
		 */
		Select.prototype.isItemDisabled = function (item)
		{
			if (!_.isObject(item))
			{
				return false;
			}

			// console.log('%cisItemDisabled, disableUnselected? %s, isSelected? %s, \
			//     item: %s', 'color: blue;', this.disableUnselected(), this.isSelected(item), item.title);

			// If we didn't get any order to disable from the component... don't disable
			if (!this.disableUnselected())
			{
				return false;
			}

			// if the item is already selected, don't disable it
			// this will enable un checking it
			if (this.isSelected(item))
			{
				return false;
			}

			// if we got this far... the item should be disabled
			return true;
		};

		Select.prototype.__updateInputSelectedTextTooltip = function ()
		{
			var truncateLength = 370,
			    currentText    = this.selectedText();

			// check the length of the text... if needs - truncate and add button.
			if (_.isNull(currentText) || _.isUndefined(currentText))
			{
				return null;
			}

			if (this.truncate() && currentText.length > truncateLength + 3)
			{
				return $('<div class="select-box-tooltip padding-5 relative ' + this._id + '">' + currentText.substr(0, truncateLength) + '...' + '<h6 class="lt-green-6 cursor-pointer bottom-right margin-bottom-5 margin-right-5">More</h6></div>');
			}
			else
			{
				if (currentText.length > truncateLength + 3)
				{
					return $('<div class="select-box-tooltip padding-5 relative ' + this._id + '">' + currentText + '<h6 class="lt-green-6 cursor-pointer bottom-right margin-bottom-5 margin-right-5">Less</h6></div>');
				}
				else
				{
					return $('<div class="select-box-tooltip padding-5 relative ' + this._id + '">' + currentText + '</div>');
				}
			}

		};

		Select.prototype.__tooltipShowMore = function ()
		{
			this.truncate(!this.truncate());
		};

		/**
		 * this is a subscriber for the showList, when the value is false & list is closed. we update the input text
		 * @private
		 * @return {string|null} - value to show in input value
		 */
		Select.prototype.__updateInputSelectedText = function ()
		{
			var _selectedByOptionsValue = this.selected();

			if (_.isNull(this.selected()) || _.isEmpty(this.selected()))
			{
				return null;
			}

			if (!_.isNull(this.optionsValue))
			{
				_selectedByOptionsValue = this._getSelectedByOptionsValue(this.selected());
			}

			if (this.multi)
			{
				// optionsText
				return this.optionsText ? _.pluck(ko.toJS(_selectedByOptionsValue), this.optionsText).join(', ') : _selectedByOptionsValue.join(', ');
			}

			if (_.isNull(_selectedByOptionsValue)) // we check again , because maybe '_getSelectedByOptionsValue' returned us null
			{
				return null;
			}
			return this.optionsText ? ko.unwrap(_selectedByOptionsValue[this.optionsText]) : this.selected();
		};

		/**
		 * return objects of selected options value.
		 * @param {array} _ids - list or item
		 * @returns {*} - an array or object of the selected
		 * @private
		 */
		Select.prototype._getSelectedByOptionsValue = function (_ids)
		{
			if (!_.isArray(_ids))
			{
				return ko.utils.arrayFirst(ko.unwrap(this.options), function (_option)
				{
					return _ids === ko.unwrap(_option[this.optionsValue]);
				}.bind(this));
			}
			return ko.utils.arrayFilter(ko.unwrap(this.options), function (_option)
			{
				return ko.utils.arrayIndexOf(_ids, ko.unwrap(_option[this.optionsValue])) !== -1;
			}.bind(this));
		};

		/**
		 * toggle show and hide the list of options in the select list
		 * if we show the list - register to a click event on DOM
		 * @return {void}
		 */
		Select.prototype.toggle = function ()
		{
			if (!this.disable())
			{
				this.showList(!this.showList());
			}

			if (this.showList())
			{
				// when we open - we register to dom click event with namespace
				$(document).on('click.' + this._id, this.domClickEvent.bind(this));
			}
			else
			{
				this.search('');
			}
		};

		/**
		 * clearing the search
		 * @return {void}
		 */
		Select.prototype.clearSearch = function ()
		{
			this.search('');
		};

		/**
		 * select all the visible items
		 */
		Select.prototype.selectAll = function ()
		{
			var _currentVisibleItems = this.options();
			if (this.optionsSearch)
			{
				_currentVisibleItems = this.filterOptions();
			}

			this.selected.removeAll();
			if (this.optionsValue)
			{
				this.selected.pushAll(_.pluck(ko.toJS(_currentVisibleItems), this.optionsValue));
			}
			else
			{
				this.selected.pushAll(_currentVisibleItems);
			}
		};

		Select.prototype.unselectAll = function ()
		{
			if (this.optionsSearch)
			{
				this.selected.removeAll(this.filterOptions());
			}
			else
			{
				this.selected.removeAll();
			}
		};

		/**
		 * dom click event
		 * @param {Event} event - the element event object
		 * @return {void}
		 */
		Select.prototype.domClickEvent = function (event)
		{
			if (!$(event.target).parents('.tracx_select_' + this._id).length)
			{
				this.showList(false);
				this.search('');
				$(document).off('.' + this._id); // remove all dom listeners on our namespace
			}
		};

		return Select;
	}
);