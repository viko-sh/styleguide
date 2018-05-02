/**
 * Created by vikto on 1/17/2017.
 */
/*global __g_sm, ko, _, _campaignID, Tracx, Q, $ */

define(
    ['resource!ko/components/table/PaginationBase'],
    function(PaginationBase)
    {
        /**
         * Pagination Server - client side pagination
         * @constructor
         */
        function PaginationServer()
        {
            this.totalCount = ko.observable();

            //noinspection JSUnresolvedVariable
            this.__init.apply(this, arguments);

            this.data = ko.computed(this.__getServerData, this).extend(
                {
                    async:
                    {
                        key: 'rows',
                        resolve: this.__setServerData.bind(this),
                        fail: this.__failedToGetServerData.bind(this)
                    }
                }
            );

            this.mappedRecords = ko.observableArray([]);
        }

        PaginationServer.augments(PaginationBase);


        /**
         * Get Number Of Pages
         * @return {number|void} - number of pages
         * @private
         */
        PaginationServer.prototype.__getServerData = function()
        {
            var currentPage = this.currentPage(),
                recordsPerPage = this.recordsPerPage(),
                serverParams = _.has(this.options, 'serverParams') ? ko.unwrap(this.serverParams) : {},
                deferred = Q.defer(),
                data;

            if ( _.isNull(serverParams) || this.resetLocal)
            {
                return deferred.promise;
            }

            //use this object type later for mapping
            data  = {
                format: 'json',
                magic: __g_sm,
                page: currentPage,
                limit: recordsPerPage
            };

            this.showLoader(true);

            if (!_.isEmpty(serverParams))
            {
                data = _.extend(data, serverParams);
            }

            $.tracxPostAndEval({
                url: this.url,
                data: data,
                errorHandler: function(error)
                {
                    //noinspection JSUnresolvedFunction
                    deferred.reject(error);
                },
                successHandler: function(response)
                {
                    //noinspection JSUnresolvedFunction
                    deferred.resolve(response.data);
                }
            });

            return deferred.promise;
        };

        /**
         * Handle server error
         * @param {object} failure - failure object
         * @private
         * @return {void}
         */
        PaginationServer.prototype.__failedToGetServerData = function(failure)
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, failure.message, 'medium');

            //hide loader
            this.showLoader(false);
        };


        /**
         * Set paginated data
         * @param {object|array} _data - result from the server
         * @private
         * @return {void}
         */
        PaginationServer.prototype.__setServerData = function(_data)
        {
            //check if any settings where changed
            if (this.component.checkForSettingsChange.call(this.component))
            {
                this.component.updateSettingsChange.call(this.component);
            }

            //noinspection JSUnresolvedVariable
            //update total pages
            this.totalCount(_data.rowsCount);


            //hide loader
            this.showLoader(false);
        };


        /**
         * Get Number Of Pages
         * @return {number} - number of pages
         * @private
         */
        PaginationServer.prototype.__getNumberOfPages = function()
        {
            return Math.ceil(this.totalCount() / this.recordsPerPage());
        };

        /**
         * Get Table Records async and place them in records using deferred
         * @return {Array} - records
         * @private
         */
        PaginationServer.prototype.getRecords = function()
        {
            var deferred = Q.defer();
            //
            if ( !_.isUndefined(this.component.params.rowObject))
            {
                // need to run the mapping
                this.mapRecords(this.data(), this.component.params.rowObject, deferred);
            }
            else
            {
                deferred.resolve(this.data());
            }

            return deferred.promise;
        };

        PaginationServer.prototype.mapRecords = function(_data, _object, deferred)
        {
            var mapping;
            require(['resource!' + _object], function(RowObject)
            {

                mapping = {
                    create: function(options)
                    {
                        return new RowObject(options.data);
                    }
                };
                ko.mapping.fromJS(_data, mapping, this.mappedRecords);

                deferred.resolve(this.mappedRecords());

            }.bind(this));
        };

        return PaginationServer;
    }
);