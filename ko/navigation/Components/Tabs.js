/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
    ],
    function()
    {

        'use strict';

        /**
         * @constructor
         */
        function Tabs()
        {
            this.tabsInstanceA = ko.observable();
            this.tabsInstanceB = ko.observable();
            this.tabsInstanceC = ko.observable();
            this.tabsInstanceD = ko.observable();
            this.tabsInstanceF = ko.observable();
        }

        Tabs.prototype.onchange = function()
        {
        };

        Tabs.prototype._TABS = [
            {
                text: 'Mobile',
                type: 'mobile',
                icon: 'tr-icon-mobile-03',
                iframeSrc: null,
                iframeWidth: null,
                device: 'mobile',
                socialNetwork: 'facebook',
                selected: true
            },
            {
                text: 'Desktop',
                type: 'desktop',
                icon: 'tr-icon-screen-01',
                iframeSrc: null,
                iframeWidth: null,
                device: 'desktop',
                socialNetwork: 'facebook',
                facebookPositions: 'feed',
                selected: true
            },
            {
                text: 'Facebook',
                type: 'facebook',
                icon: 'tr-icon-screen-2-02',
                iframeSrc: null,
                iframeWidth: null,
                facebookPositions: 'right_hand_column',
                socialNetwork: 'facebook',
                device: 'desktop',
                selected: true
            },
            {
                text: 'Instagram',
                type: 'instagram',
                icon: 'tr-icon-instagram',
                iframeSrc: null,
                iframeWidth: null,
                device: 'mobile',
                socialNetwork: 'instagram',
                selected: true
            }
        ];

        Tabs.prototype._TABS2 = [
            {
                text: 'linkdin',
                icon: 'tr-icon-linkdin',
                selected: false
            },
            {
                text: 'facebook',
                icon: 'tr-icon-facebook',
                selected: false
            },
            {
                text: 'twitter',
                icon: 'tr-icon-twitter',
                selected: false
            },
            {
                text: 'instagram',
                icon: 'tr-icon-instagram',
                selected: true
            },
            {
                text: 'pinterest',
                icon: 'tr-icon-pinterest',
                selected: false
            }
        ];

        Tabs.prototype._TABSMULTI = [
            {
                text: 'linkdin',
                icon: 'tr-icon-linkdin',
                selected: true
            },
            {
                text: 'facebook',
                icon: 'tr-icon-facebook',
                selected: true
            },
            {
                text: 'twitter',
                icon: 'tr-icon-twitter',
                selected: false
            },
            {
                text: 'instagram',
                icon: 'tr-icon-instagram',
                selected: true
            },
            {
                text: 'pinterest',
                icon: 'tr-icon-pinterest',
                selected: false
            }
        ];

        return Tabs;
    }
);