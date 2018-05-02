/*global __g_sm, ko, _, _campaignID, Tracx*/
define(['resource!ko/components/modal'],
    function()
    {
        'use strict';

        /**
         * @constructor
         */
        function Modal()
        {
            this.bindElement                = 'elementForModal';
            this.hasErrorsTextMsgModal1     = ko.observable('');
            this.hasErrorsTextMsgModal2     = ko.observable('');
            this.applyDisabledWhen          = ko.observable(false);
            this.applyDisabledWhenModal3    = ko.observable(true);
            this.model                      = ko.observable(false);

            this.displayAddSourcesForm      = ko.observable(false);
            this.isSrcBtnHovering      = ko.observable(false);

            this.headerButtons2             = [
                {
                    class: ko.computed(function()
                    {
                        if ( !this.displayAddSourcesForm())
                        {
                            return 'tr-icon-keywords-on lt-green-6';
                        }
                        else
                        {
                            return 'tr-icon-keywords-on lt-gray-78';
                        }
                    }, this),
                    click: this._changeAddSourceForm.bind(this),
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                },
                {
                    icon: 'tr-icon-owned-media-on',
                    click: this._addQueryToFormBtnClick,
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                },
                {
                    icon: 'tr-icon-source-urls-on',
                    click: this._addQueryToFormBtnClick,
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                }
            ];
            this.headerButtons3             = [
                {
                    icon: 'tr-icon-keywords-on',
                    click: this._addQueryToFormBtnClick,
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                },
                {
                    icon: 'tr-icon-owned-media-on',
                    click: this._addQueryToFormBtnClick,
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                },
                {
                    icon: 'tr-icon-source-urls-on',
                    click: this._addQueryToFormBtnClick,
                    hover   : this.isSrcBtnHovering,
                    disabled: this.displayAddSourcesForm,
                    tooltip : 'Button tooltip'
                }
            ];


        }

        Modal.prototype._changeAddSourceForm = function()
        {
            this.displayAddSourcesForm(!this.displayAddSourcesForm());
        };

        Modal.prototype._addQueryToFormBtnClick = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.NOTE_INFO, 'header Button callback');
        };

        Modal.prototype.closeClickFunction = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.NOTE_ERROR, 'Closing the Modal, thanks for using :)');
            //add confirmation popup or whatever
            return true;
        };


        Modal.prototype.applyClickFunction = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.NOTE_SUCCESS, 'applyClickFunction');
            return true;
        };

        Modal.prototype.applyClickFunctionReturnFalse = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.NOTE_ERROR, 'applyClickFunctionReturnFalse');
            this.hasErrorsTextMsgModal2('applyClickFunctionReturnFalse message');
            return false;
        };

        Modal.prototype.beforeOpenFunction = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, 'beforeOpenFunction callback', 'medium');
            return true; // false will abort opening the modal
        };


        return Modal;
    }
);