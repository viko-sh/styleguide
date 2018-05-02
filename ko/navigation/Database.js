/*global __g_sm, ko, _, _campaignID, Tracx, ace */
define(
    [
        'resource!webStorage'
    ],
    function(WebStorage)
    {

        'use strict';

        /**
         * constructor
         * @constructor
         */
        function Database()
        {

            this.tablesList         = ko.observableArray([]);
            this.selectedTable      = ko.observable(null);
            this.tableData          = ko.observable(null);

            this.webStorage = new WebStorage();
            this.webStorage.useStorage();
            this.webStorage.setNameSpace('queryTool');

            this.localStorageListItem   = 'queryTool.list';

            this.search                 = ko.observable('#CampaignID#');
            this.replace                = ko.observable('');

            this.dbOptions              = ko.observableArray(['Master', 'Shard', 'Vertica']);
            this.savedQueries           = ko.observableArray([]);
            this.selectedDB             = ko.observable(null);
            this.selectedQueryToLoad    = ko.observable(null);

            this.results                = ko.observableArray([]);
            this.headColumns            = ko.observableArray([]);

            this.queryName              = ko.observable('');

            this.editor = ace.edit('editor');
            this.editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
            });

            // editor.setTheme('ace/theme/ambiance'); // ambiance monokai
            this.editor.getSession().setMode('ace/mode/mysql'); // ace/mode/mysql   ace/mode/javascript
            this.selectedQueryToLoad.subscribe(this._loadQuery, this);
            this.selectedDB.subscribe(this._loadTablesList, this);
            this._init();
        }

        Database.prototype._init = function()
        {
            // load to savedQueries from the local storage
            var listItems = this.webStorage.get('this.localStorageListItem');
            if (!_.isUndefined(listItems) && !_.isNull(listItems))
            {
                this.savedQueries.pushAll(_.compact(listItems.split(',')));
            }
        };

        /**
         * load query from local storage
         * @private
         */
        Database.prototype._loadQuery = function(_queryName)
        {
            if ( !_.isUndefined(_queryName) && !_.isNull(_queryName) )
            {
                var query = this.webStorage.get(_queryName);
                this.editor.getSession().setValue(query);
            }
        };

        Database.prototype._loadTablesList = function(_db)
        {
            $.tracxPostAndEval({
                url: '/internal/DeveloperTool/queryTables',
                data: {
                    format: 'json',
                    magic: __g_sm,
                    db: _db
                },
                errorHandler: function(message)
                {
                    Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, message, Tracx.notifications.SIZE.MEDIUM);
                },
                successHandler: function(data)
                {
                    if ( data.data.length)
                    {
                        this.tablesList.removeAll();
                        this.tablesList.pushAll(data.data[0]);
                    }
                }.bind(this)
            });
        };

        Database.prototype.showTableData = function()
        {
            $('.tableContentSection').append("<div class='loadingGorilla'></div>");
            $.tracxPostAndEval({
                url: '/internal/DeveloperTool/queryTable',
                data: {
                    format: 'json',
                    magic: __g_sm,
                    table: this.selectedTable(),
                    db: this.selectedDB()
                },
                errorHandler: function(message)
                {
                    $('.tableContentSection').find('.loadingGorilla').remove();
                    Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, message, Tracx.notifications.SIZE.MEDIUM);
                },
                successHandler: function(data)
                {
                    this.tableData(data.data[0][0]['Create Table']);
                    $('.tableContentSection').find('.loadingGorilla').remove();
                }.bind(this)
            });
        };

        Database.prototype.replaceOne = function()
        {
            this.editor.find(this.search());
            this.editor.replace(this.replace());
        };

        Database.prototype.replaceAll = function()
        {
            this.editor.find(this.search());
            this.editor.replaceAll(this.replace());
        };

        Database.prototype.clean = function()
        {
            this.editor.setValue('');
        };

        Database.prototype.reset = function()
        {
            this.results.removeAll();
            this.headColumns.removeAll();
        };

        Database.prototype.save = function()
        {
            var listItems;
            //localData = self.webStorage.getObjects(request.term);
            this.webStorage.set(this.queryName(), this.editor.getSession().getValue());
            // update the list of items that are saved.
            listItems = this.webStorage.get('this.localStorageListItem');
            listItems += ',' + this.queryName();
            this.webStorage.set('this.localStorageListItem', listItems);

            this.savedQueries.push(this.queryName());
        };

        Database.prototype.query = function()
        {
            $('.mainContent').append("<div class='loadingGorilla'></div>");
            $.tracxPostAndEval({
                url: '/internal/DeveloperTool/runDbQuery',
                data: {
                    format: 'json',
                    magic: __g_sm,
                    query: this.editor.getSession().getValue().replace('limit', ' limit').replace('LIMIT', ' LIMIT'),
                    db: this.selectedDB()
                },
                errorHandler: function(message)
                {
                    $('.mainContent').find('.loadingGorilla').remove();
                    Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, message, Tracx.notifications.SIZE.MEDIUM);
                },
                successHandler: function(data)
                {
                    // set all the table heads in array
                    this.headColumns.removeAll();
                    this.results.removeAll();
                    if ( data.data.length )
                    {
                        this.headColumns.pushAll(Object.keys(data.data[0]));
                        // set all the records in the table
                        this.results.pushAll(data.data);
                    }
                    else
                    {
                        Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, 'Response has No Data !!', Tracx.notifications.SIZE.MEDIUM);

                    }
                    $('.mainContent').find('.loadingGorilla').remove();
                }.bind(this)
            });
        };



        return Database;
    }
);