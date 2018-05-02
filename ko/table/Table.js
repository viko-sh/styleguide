/*global __g_sm,Q, toggleGorila, ko, _, $, Modernizr, Tracx, require*/
define(
    [
        'resource!ko/components/table/PaginationFront', 'resource!ko/components/table/PaginationServer', 'resource!ko/components/table/HeadColumn'
    ],


    function(PaginationFront, PaginationServer, HeadColumn)
    {
        'use strict';

        /**
         * @param {element} element - component html element
         * @param {object} params - past parameters
         * @constructor
         */
        function Table(element, params)
        {
            this.params                 = params;
            this.changedSettings        = {};
            this.element                = element;
            this.width                  = params.maxWidth || null;
            this.height                 = params.height || null;

            this.data                   = ko.observableArray(this.params.data || []);
            this.headColumns            = ko.mapping.fromJS([]);
            this.columnPickerVisible    = ko.observable(false);
            this.showLoader             = ko.observable(false); // displayed loading gorilla
            this.rowTemplate            = ko.observable(this.params.rowTemplate || 'demo-tpl'); // row template to render
            this.selectedRow            = ko.observable();
            this.searchColumns          = ko.observable('');
            this.columnsSelectorState   = ko.pureComputed({read: this.__columnsSelectorStateRead, owner: this});

            this.filteredColumns        = ko.pureComputed(this.__filteredColumns, this);

            if (this.params.pagination)
            {
                if (!this.params.pagination.server)
                {
                    this.pagination = new PaginationFront(this.params.pagination, this.data, this);
                }
                else
                {
                    this.pagination = new PaginationServer(this.params.pagination, [], this);
                }

                this.records = this.pagination.records;
            }
            else
            {
                this.records = this.data;
            }

            //cache jQuery elements
            this.tBodyWrapper = $(this.element).find('.table-body').get();
            this.tBodyWrapperTable = $(this.tBodyWrapper).find('table.table').get();
            this.tHeadWrapper = $(this.element).find('.table-head').get();
            this.tHeadWrapperTable = $(this.tHeadWrapper).find('table.table').get();

            this._init.call(this);
        }

        /**
         * Main init method
         * @private
         * @return {void}
         */
        Table.prototype._init = function()
        {
            //init th columns
            this._mapHeadColumns(this.params.headOptions);
            //this.setTableEvents();
        };

        /**
         * Register events
         * 1.When clicked outside column menu
         * 2.Table scroll
         * @returns {void}
         */
        Table.prototype.setTableEvents = function()
        {
            $(document).on('click', function(e)
            {
                if (!$(e.target).hasClass('toggleColumnPicker') && !$('.column-picker').has(e.target).length)
                {
                    this.closeColumnsMenu();
                }
            }.bind(this));

            $(this.tBodyWrapper).on('scroll', function()
            {
                $(this.tHeadWrapper).scrollLeft($(this.tBodyWrapper).scrollLeft());
            }.bind(this));
        };

        /**
         * Close columns picker menu
         * @returns {void}
         */
        Table.prototype.closeColumnsMenu = function()
        {
            this.columnPickerVisible(false);
            this.searchColumns('');
        };

        /**
         * Sync headlines width
         * Set visible headers (th) width according to the hidden ones
         * @return {void}
         */
        Table.prototype.setTableHeadersWidth = function()
        {
            //show loader
            $(this.tHeadWrapper).find('.table-head-loader').show();

            this.afterRender();

            //hide loader after half a second
            setTimeout(function()
            {
                $(this.tHeadWrapper).find('.table-head-loader').hide();
                this.afterRender(); //when you select column after remove another column the width of header is not align because the loader (header is not visible)
            }.bind(this), 500);

        };

        /**
         * Callback method for the afterRender event triggered by ko template binding
         * @returns {void}
         */
        Table.prototype.afterRender = function()
        {
            var bodyWidth = $(this.tBodyWrapper).find('table').width(),
                thArr,
                w;

            $(this.tHeadWrapperTable).width(bodyWidth).css({'min-width': bodyWidth });

            thArr  = $(this.tHeadWrapper).find('th');

            $(this.tBodyWrapper).find('th').each(function(i, v)
            {
                w = $(v).outerWidth();
                $(thArr[i]).width(w).css({'min-width': w });
            });
        };


        /**
         * This method will run when all records (tr's) will be rendered
         * @returns {void}
         */
        Table.prototype.tableRenderCB = function()
        {
            this.setTableEvents();
            this.setTableHeadersWidth();
        };

        /**
         *
         * @return {boolean}
         * @private
         */
        Table.prototype.__columnsSelectorStateRead = function()
        {
            var selected = _.filter(this.headColumns(), function(_column)
            {
                return (_column.visible());
            });

            return selected.length !== this.headColumns().length;
        };

        /**
         * Column manager select All/ Un-select available columns
         * @returns {void}
         */
        Table.prototype.columnsSelectToggle = function()
        {
            var state;
            state = this.columnsSelectorState();

            _.each(this.headColumns(), function(column)
            {
                if (!column.sticky)
                {
                    column.visible(state);
                }
            });
        };

        /**
         *
         * @return {array} - collection of columns
         * @private
         */
        Table.prototype.__filteredColumns = function()
        {
            var term = this.searchColumns().trim().toLowerCase();

            return ko.utils.arrayFilter(this.headColumns(), function(column)
            {
                return  !column.sticky && column.title.toLowerCase().indexOf(term) >= 0;
            });
        };

        /**
         * Get all visible columns
         * @return {array} - collection of columns
         */
        Table.prototype.getVisibleColumns = function()
        {
            return _.filter(this.headColumns(), function(headColumn)
            {
                return headColumn.visible() === true;
            });
        };

        /**
         * Control the table horizontal scroll width buttons
         * @returns {void}
         */
        Table.prototype.scrollBack = function()
        {
            $(this.tBodyWrapper).scrollLeft($(this.tBodyWrapper).scrollLeft() + 25);
        };


        /**
         * Control the table horizontal scroll width buttons
         * @returns {void}
         */
        Table.prototype.scrollForward = function()
        {
            $(this.tBodyWrapper).scrollLeft($(this.tBodyWrapper).scrollLeft() - 25);
        };


        /**
         * Toggle column picker state
         * @return {void}
         */
        Table.prototype.toggleColumnPicker = function()
        {
            this.columnPickerVisible(!this.columnPickerVisible());
        };

        /**
         * Check if current row is selected
         * @param {object} _data - row data
         * @return {void}
         */
        Table.prototype.isRowSelected = function(_data)
        {
            if (!_.has(_data, 'isSelected'))
            {
                _data.isSelected = ko.observable(false);
            }
            _data.isSelected(!_data.isSelected());
        };

        /**
         * This method will run before user given click function
         * @param {object} _data - row data
         * @private
         * @return {void}
         */
        Table.prototype.__rowClick = function(_data)
        {
            if (this.selectedRow() === _data)
            {
                this.selectedRow(null);
                return;
            }

            this.selectedRow(_data);
        };

        Table.prototype.rowClick = function(_data)
        {
            this.__rowClick(_data);

            if (_.isFunction(this.params.rowClick))
            {
                this.params.rowClick.apply(this.params.rowClick, arguments);
            }
        };

        /**
         * @param {object} _headOptions - object with all table head columns
         * @return {void}
         * @private
         */
        Table.prototype._mapHeadColumns = function(_headOptions)
        {
            var mapping;
            mapping = {
                create: function(options)
                {
                    return new HeadColumn(options.data, this);
                }.bind(this)
            };
            ko.mapping.fromJS(_headOptions, mapping, this.headColumns);
        };


        /**
         * Reset head columns
         * @param {array} _headOptions - head columns options
         * @param {string} _tpl - tpl to much the new th structure, optional
         * @return {void}
         */
        Table.prototype.updateHeadColumns = function(_headOptions, _tpl)
        {
            if (_.isArray(_headOptions))
            {
                this.changedSettings.headColumns = _headOptions;
            }

            if (!_.isUndefined(_tpl))
            {
                this.changedSettings.rowTemplate = _tpl;
            }
        };

        /**
         * Check if any settings where changed
         * @return {boolean} - if was change in setting
         */
        Table.prototype.checkForSettingsChange = function()
        {
            return !_.isEmpty(_.keys(this.changedSettings));
        };


        /**
         * @return {void}
         */
        Table.prototype.updateSettingsChange = function()
        {
            //head columns
            if (_.has(this.changedSettings, 'headColumns'))
            {
                this.params.headColumns = this.changedSettings.headColumns;
                this.rowTemplate(''); // reset current template, this will remove the current tbody content from the dom
                this._mapHeadColumns(this.params.headColumns);
                delete this.changedSettings.headColumns;
            }

            //table tpl
            if (_.has(this.changedSettings, 'rowTemplate'))
            {
                this.params.rowTemplate = this.changedSettings.rowTemplate;
                delete this.changedSettings.rowTemplate;
            }

            this.rowTemplate(this.params.rowTemplate);
            this.setTableHeadersWidth();
        };

        /**
         * Main sort method
         * Triggered by clicking on sorting icon
         * @param {HeadColumn} column - clicked column object
         * @return {void}
         */
        Table.prototype.sortData = function(column)
        {
            var sortFunc = column.sort,
                funcName,
                dir;

            //invoke custom sort function, if given
            if (_.isFunction(sortFunc))
            {
                //sort..
                sortFunc.apply(sortFunc, arguments);
                this.__afterSort(column);
                //change sort direction, this way we get sort toggle functionality
                dir = (column.sortingDir() === 'asc') ? 'desc' : 'asc';
                column.sortingDir(dir);
                return;
            }

            //pre-defined sort function
            funcName = this[sortFunc.type + 'Sort'];

            //check if required method is a function
            if (!_.isFunction(funcName))
            {
                return;
            }

            //sort..
            this.records().sort(funcName.bind(this, column.sort.key, column.sortingDir()));
            this.__afterSort(column);
            //change sort direction, this way we get sort toggle functionality
            dir = (column.sortingDir() === 'asc') ? 'desc' : 'asc';
            column.sortingDir(dir);
        };

        Table.prototype.__afterSort = function(column)
        {
            this.records.notifySubscribers();
            //return pagination to first page
            //this.pagination.currentPage(1);

            //reset all other columns direction
            _.each(this.headColumns(), function(_column)
            {
                if (column !== _column)
                {
                    _column.sortingDir(undefined);
                }
            });
        };

        /**
         * Sort By number
         * @param {string} _key - by witch key to sort
         * @param {string} _dir - sort direction, asc | desc
         * @param {object} _a - array value
         * @param {object} _b - array value
         * @return {number} - a & b comparing result
         */
        Table.prototype.numberSort = function(_key, _dir, _a, _b)
        {
            var valueA,
                valueB;
            //check if we getting a string like key or depth, {object.a.b} for example
            if (_key.indexOf('.') === -1)
            {
                return (_dir === 'asc') ? _a[_key] - _b[_key] : _b[_key] - _a[_key];
            }
            else
            {
                valueA = _key.split('.').reduce(
                    function(a, b)
                    {
                        return a[b];
                    }, _a);

                valueB = _key.split('.').reduce(
                    function(a, b)
                    {
                        return a[b];
                    }, _b);

                return (_dir === 'asc') ? valueA - valueB : valueB - valueA;
            }
        };

        /**
         * Sort By string
         * @param {string} _key - by witch key to sort
         * @param {string} _dir - sort direction, asc | desc
         * @param {object} _a - array value
         * @param {object} _b - array value
         * @return {number} - 1,-1,0 comparing result
         */
        Table.prototype.stringSort = function(_key, _dir, _a, _b)
        {
            var strA,
                strB;

            if (_key.indexOf('.') === -1)
            {
                strA = _key.split('.').reduce(
                    function(a, b)
                    {
                        return a[b];
                    }, _a);

                strB = _key.split('.').reduce(
                    function(a, b)
                    {
                        return a[b];
                    }, _b);
            }
            else
            {
                strA = _a[_key].toLowerCase();
                strB = _b[_key].toLowerCase();
            }

            if (_dir === 'asc')
            {
                return ( strA === strB ) ? 0 : strA < strB ? -1 : 1;
            }
            else
            {
                return ( strA === strB ) ? 0 : strA > strB ? -1 : 1;
            }
        };

        /**
         * Util function, check the pagination type this instance is using
         * @return {boolean} -
         */
        Table.prototype.isServerPagination = function()
        {
            return this.pagination instanceof PaginationServer;
        };

        /**
         * Util function, check the pagination type this instance is using
         * @return {boolean} -
         */
        Table.prototype.isServerPagination = function()
        {
            return this.pagination instanceof PaginationServer;
        };

        /**
         * return a new instance or the existing instance
         * @param {object} params -
         * @param {object} componentInfo -
         * @returns {Tabs|object} -
         */
        function getInstance(params, componentInfo)
        {
            var instance;
            //if we want to use this component as single tone
            if (_.has(params, 'instance'))
            {
                //check if we have an instance already
                if (!(params.instance() instanceof Table))
                {
                    params.componentInfo = componentInfo;
                    params.instance(new Table(componentInfo.element, params));
                }
                instance = params.instance();
            }
            else
            {
                instance = new Table(componentInfo.element, params);
            }
            return instance;
        }

        return {
            viewModel: {
                createViewModel: getInstance
            }
        };
    }
);