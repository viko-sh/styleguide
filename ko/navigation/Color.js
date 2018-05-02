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
        function Color()
        {
        }


        Color.prototype.showColorInfo = function(element)
        {
            var $element, className, funcColor,
                color, html, _tinycolor, colorClassName,
                percentageList = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90],
                colorFunctions = ['lighten', 'darken'],
                $infoHex6 = $('#hex6'),
                $infoRgb = $('#toRgb'),
                $infoPercentageRgb = $('#toPercentageRgb'),
                $infoToFilter = $('#toFilter'),
                $btnExample = $('#btnExample');

            if (element)
            {
                $element = $(element);

                $('.color-item-primary').removeClass('selected');
                $element.addClass('selected');

                color = $element.attr('data-color');
                colorClassName = $element.attr('data-color-classname');
            }

            //set the info
            _tinycolor = tinycolor(color);
            $infoHex6.html(_tinycolor.toString());
            $infoRgb.html(_tinycolor.toRgbString());
            $infoPercentageRgb.html(_tinycolor.toPercentageRgbString());
            $infoToFilter.html(_tinycolor.toFilter());

            //usage example
            $btnExample.removeAttr('class').addClass('button bg-' + colorClassName);

            if (_tinycolor.getBrightness() < 200)
            {
                $btnExample.css('color', '#fff');
            }
            else
            {
                $btnExample.css('color', '#000');
            }

            //show the color options
            _.each(colorFunctions, function(func)
            {
                html = '';

                _.each(percentageList, function(percentage)
                {
                    //init color library instance
                    _tinycolor = tinycolor(color);
                    funcColor = _tinycolor[func](percentage).toString();
                    if (funcColor === '#ffffff' || funcColor === '#000000')
                    {
                        return;
                    }
                    className = colorClassName + '-' + percentage;
                    //create html
                    html += '<div class="color-item margin-top-10">' +
                                '<div class="color" style="background:' + funcColor + '"></div>' +
                                '<code class="margin-top-5" style="display: block;">' + className + '</code>' +
                                '<code class="margin-top-5" style="display: block;">' + funcColor + '</code>' +
                            '</div>';
                    _tinycolor = null;
                });
                $('.' + func + '-data').html(html);
            });
        };

        Color.prototype.myAfterRender = function()
        {
            Color.prototype.showColorInfo($('.color-item-primary').first()[0]);
        };

        return Color;
    }
);