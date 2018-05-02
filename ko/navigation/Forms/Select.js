/*global __g_sm, ko, _, _campaignID, Tracx, Q, _campaignDateFormat, $, _campaignTimeZone */
define(
    [
        'resource!boost/settings/PaidBoostAccount'
    ],
    function(PaidBoostAccount)
    {

        'use strict';

        /**
         * @constructor
         */
        function Select()
        {
            var i;

            this.options            = ko.observableArray([]);
            this.options2           = ko.observableArray([]);
            this.options3           = ko.observableArray([]);
            this.options4           = ko.observableArray([]);
            this.options5           = ko.observableArray([]);
            this.selectedOption     = ko.observable(null);
            this.selectedOption2    = ko.observable(null);
            this.selectedOption3    = ko.observableArray([]);
            this.selectedOption4    = ko.observableArray([]);
            this.selectedOption5    = ko.observable(null);
            this.selectedOption6    = ko.observable(null);
            this.selectedOption7    = ko.observableArray([]);
            this.selectedOption8    = ko.observable(null);
            this.selectedOption9    = ko.observable(null);
            this.selectedOption10   = ko.observableArray([]);
            this.selectedOption11   = ko.observableArray([]);
            this.selectedOption12   = ko.observable(null); // confirm select
            this.selectedOption13   = ko.observableArray([]);
            this.selectedOption14   = ko.observableArray([]); // confirm select
            this.selectedOption15   = ko.observableArray([]); // confirm select
            this.selectedOption16   = ko.observableArray([]); // confirm select
            this.selectedOption17   = ko.observableArray([]); // confirm select

            this.caption            = 'Please Select...';

            // preparing options
            this.options.removeAll();
            ko.utils.arrayMap(this._OPTIONS, function(option)
            {
                this.options.push(new PaidBoostAccount(option, 6));
            }.bind(this));


            this.options2.push(new PaidBoostAccount({
                name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
                id: 0
            }, 6));

            for (i = 1; i < 60; i++)
            {
                this.options2.push(new PaidBoostAccount({
                    name: this.randomString(14, 'A'),
                    id: i
                }, 6));
            }

            for (i = 0; i < 10; i++)
            {
                this.options3.push(this.randomString(14, 'A'));
            }

            // preparing options with icons
            this.options4.removeAll();
            ko.utils.arrayMap(this._OPTIONSICONS, function(option)
            {
                this.options4.push(option);
            }.bind(this));


            this.categories = [ 'The Champions', 'Dinosaucers', 'Pet Force', 'The Incredibles', 'Justice Machine', 'Street Sharks'];


            for (i = 1; i < 60; i++)
            {
                this.options5.push(new PaidBoostAccount({
                    name: this.randomString(14, 'A'),
                    id: i,
                    category: this.categories[i % 6]
                }, 6));
            }
        }

        /**
         * RANDOM STRING GENERATOR
         *
         * Info:      http://stackoverflow.com/a/27872144/383904
         * Use:       randomString(length [,"A"] [,"N"] );
         * Default:   return a random alpha-numeric string
         * Arguments: If you use the optional "A", "N" flags:
         *            "A" (Alpha flag)   return random a-Z string
         *            "N" (Numeric flag) return random 0-9 string
         */
        Select.prototype.randomString = function(len, an)
        {
            var str = '',
                i = 0,
                r,
                min = an ===- 'a' ? 10 : 0,
                max = an === 'n' ? 10 : 62;

            an = an && an.toLowerCase();
            for ( ; i++ < len ; )
            {
                r = Math.random() * ( max - min ) + min << 0;
                str += String.fromCharCode( r += r > 9 ? r < 36 ? 55 : 61 : 48);
            }
            return str;
        };

        Select.prototype._OPTIONS = [
            {
                name: 'PaidBoostAccount#1',
                id: '23'
            },
            {
                name: 'PaidBoostAccount#2',
                id: '24'
            },
            {
                name: 'PaidBoostAccount#3',
                id: '8'
            },
            {
                name: 'PaidBoostAccount#4',
                id: '81'
            },
            {
                name: 'PaidBoostAccount#5',
                id: '52'
            }
        ];

        Select.prototype._OPTIONSICONS = [
            {
                name: 'networkTwitter#1',
                id: '23',
                icon: 'tr-icon-twitter network-color-twitter'
            },
            {
                name: 'networkFacebook#2',
                id: '24',
                icon: 'tr-icon-facebook network-color-facebook'
            },
            {
                name: 'networkLinkedin#3',
                id: '8',
                icon: 'tr-icon-linkdin network-color-linkedin'
            },
            {
                name: 'networkInstagram#4',
                id: '81',
                icon: 'tr-icon-instagram network-color-instagram'
            },
            {
                name: 'networkReddit#5',
                id: '52',
                icon: 'tr-icon-reddit network-color-reddit'
            }
        ];

        Select.prototype.beforeConfirm = function()
        {
            console.log('beforeConfirm hit, this is console log because we populate confirm very fast !');
        };

        Select.prototype.afterConfirm = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, 'afterConfirm', Tracx.notifications.SIZE.MEDIUM);
            console.log('afterConfirm hit');
        };

        Select.prototype.shouldChange = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, 'shouldChange', Tracx.notifications.SIZE.MEDIUM);
            console.log('shouldChange hit');
            return true;
        };

        return Select;
    }
);