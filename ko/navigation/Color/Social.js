/*global __g_sm, ko, _, _campaignID, Tracx*/
/**
 * Created by viktor on 5/9/2016.
 */
define(
    [
        'resource!ko-plugins/tinycolor-min'
    ],
    function(tinycolor)
    {
        'use strict';

        /**
         *
         * @constructor
         */
        function Social()
        {
            this.social_colors = [
                {
                    network: 'Facebook',
                    color: '#46629d'
                },
                {
                    network: 'Twitter',
                    color: '#64cbee'
                },
                {
                    network: 'YouTube',
                    color: '#ed6b52'
                },
                {
                    network: 'Reddit',
                    color: '#606364'
                },
                {
                    network: 'Blogs',
                    color: '#f6921e'
                },
                {
                    network: 'Forums',
                    color: '#29b473'
                },
                {
                    network: 'News',
                    color: '#faaf40'
                },
                {
                    network: 'Flickr',
                    color: '#d0d2d3'
                },
                {
                    network: 'Foursquare',
                    color: '#ee4a78'
                },
                {
                    network: 'Retail',
                    color: '#855ea6'
                },
                {
                    network: 'Linkedin',
                    color: '#1186c8'
                },
                {
                    network: 'Places',
                    color: '#00adee'
                },
                {
                    network: 'Tumnblr',
                    color: '#35465e'
                },
                {
                    network: 'Google+',
                    color: '#f06930'
                },
                {
                    network: 'Instagram',
                    color: '#5f6263'
                },
                {
                    network: 'GetGlue',
                    color: '#3f7ca3'
                },
                {
                    network: 'Vkontakte',
                    color: '#4d77a5'
                },
                {
                    network: 'Pinterest',
                    color: '#f05f5d'
                },
                {
                    network: 'Moikrug',
                    color: '#86bcd3'
                },
                {
                    network: 'Odnoklasssniki',
                    color: '#f28320'
                },
                {
                    network: 'MoiMir',
                    color: '#2165ad'
                }
            ];
        }


        Social.prototype.myAfterRender = function()
        {
            //Social.prototype.showColorInfo($('.color-item-primary').first()[0]);
        };

        return Social;
    }
);