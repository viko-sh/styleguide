/**
 * Created by vikto on 1/18/2017.
 */
/*global __g_sm, ko, _, _campaignID, Tracx*/

define([],
    function()
    {

        /**
         * @param {object} _data - options
         * @constructor
         */
        function HeadColumn(_data, table)
        {
            var visible;
            this.params             = _data;
            this.title              =  _data.title || '';
            this.subTitle           =  _data.subTitle || '';
            this._id                =  guid();
            this.width              = _data.width || null;
            this.sort               = _data.sort || null;
            this.highlight          = _data.highlight || false;
            this.switch             = _data.switch || null;
            this.class              = _data.class || null;
            visible                 = _data.visible || false;
            this.visible            =  ko.observable(visible);
            this.sortingDir         = ko.observable(_data.sortDefaultDirection ? _data.sortDefaultDirection : undefined);
            this.sortingIcon        = ko.pureComputed(this.getSortIcon, this);
            this.sticky             = _data.sticky || false;
            this.thClassName = ko.pureComputed(this.__thClassName, this);
            this.table = table;


            this.visible.subscribe(function (value)
            {
                this.table.setTableHeadersWidth();
                PubSub.publish('table:columns:changed',
                    {
                        status: value,
                        column: this
                    });
            }, this);

            this.initColumnActions.call(this);
        }

        HeadColumn.prototype.__thClassName = function()
        {
            var className = '';

            if (this.sort)
            {
                className += 'has-sorting';
            }

            if (this.highlight)
            {
                className += ' highlight';
            }

            if (this.width)
            {
                className += ' c-width';
            }


            if (!_.isNull(this.class))
            {
                className += ' ' + this.class;
            }

            return className;
        };

        /**
         * Toggle column state
         * @return {void}
         */
        HeadColumn.prototype.toggleColumn = function()
        {
            this.visible(!this.visible());
        };

        HeadColumn.prototype.getSortIcon = function()
        {
            var sort = this.sortingDir(),
                icon = 'float-right';

            if (_.isUndefined(sort))
            {
                return icon + ' icon-font-size-12 tr-icon-sort';
            }

            if (sort === 'asc')
            {
                return icon +  ' icon-font-size-8 tr-icon-down top-3';
            }
            else
            {
                return  icon + ' icon-font-size-8 tr-icon-up top-3';
            }
        };

        /**
         * Column can receive action object and build actions with custom icons and callback
         * @return {void}
         */
        HeadColumn.prototype.initColumnActions = function()
        {
            //stop if action object is empty
            if (_.isEmpty(this.params.actions))
            {
                return;
            }

            //create action key on column object
            this.actions = [];

            _.each(this.params.actions, function(_action)
            {
                var fn;
                //wrap click function
                if (_.isFunction(_action.click))
                {
                    fn = _action.click;
                    _action.click = function(data, event)
                    {
                        //stop from other events from triggering
                        event.stopPropagation();
                        //return the original function with the arguments
                        return fn.apply(this, arguments);
                    };
                }

                this.actions.push(_action);
            }.bind(this));
        };

        return HeadColumn;
    }
);