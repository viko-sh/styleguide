/*global __g_sm, ko, _, _campaignID, Tracx*/
define([
    'resource!models/SideNavModel'
],
    function(SideNavModel)
    {
        'use strict';

        /**
         * Constructor
         * returns {void}
         * @constructor
         */
        function SideNavModule(params)
        {
            this.moduleName = params.moduleName;
            //cache side nav
            this.manager = params.manager;
            this.$element = $('.asideNav');
            this.navItems = [];
            //module const
            this.const = {
                hasSubMenu: 'has-sub-menu',
                subMenuOpen: 'sub-menu-open',
                sideNavOpen: 'side-nav-open',
                activeClass: 'nav-active',
                innerActiveClass: 'nav-inner-active'
            };
            //menu navigation collection
            this.navigation = ko.mapping.fromJS([]);
            //console.log(_options);
            this.options = params || {};

            //init module
            this._init.call(this);
        }

        SideNavModule.prototype.moduleHasSubMenus = function(_module)
        {
            // find the module in the list , and check the hasSubMenu boolean
            ko.utils.arrayFirst(this.navigation(), function(sideNavModel)
            {
                if (sideNavModel.moduleName === _module)
                {
                    return sideNavModel.hasSubMenu;
                }
            });
        };

        SideNavModule.prototype.getDefaultSubMenu = function(_module)
        {
            ko.utils.arrayFirst(this.navigation(), function(sideNavModel)
            {
                if (sideNavModel.moduleName === _module)
                {
                    return sideNavModel.moduleSubMenu[0];
                }
            });
        };

        /**
         * Module initialization
         * @returns {void}
         * @private
         */
        SideNavModule.prototype._init = function()
        {
            var self = this;
            //get menu items from json
            //map json to collection <sideNavModel>
            require(['json!resources/sideNaveData.json'], function(jsonData)
            {
                var mapping = {
                    create: function(options)
                    {
                        return new SideNavModel(options.data);
                    }
                };
                ko.mapping.fromJS(jsonData[this.moduleName], mapping, self.navigation);
            }.bind(this));
            this.manager.setNavigationComponent(this);
        };

        SideNavModule.prototype.setDefault = function()
        {
            //todo: set default selected from self.options
            //$li.addClass(self.const.activeClass);
        };

        /**
         * Toggle side navigation, collapse & un-collapse
         * ko bind-click
         * @param {object} data - context
         * @param {object} event - event data
         * @returns {void}
         */
        SideNavModule.prototype.toggleMenuState = function(data, event)
        {
            //set local vars
            var $elem, self = this;

            //something wrong, best do nothing and exit
            if (typeof event.target !== 'object')
            {
                return;
            }

            $elem = $(event.target);

            //when side nav is collapsed | un-collapsed, we use class as flag to current state
            //and modifying the ui
            if (!self.$element.hasClass(self.const.sideNavOpen))
            {
                //collapse menu
                self.$element.addClass(self.const.sideNavOpen);
                $elem.removeClass('tr-icon-angle-left').addClass('tr-icon-angle-right');//change the icon

                //clean "style=display:none" from ul elements
                var navItems = self._getNavItems();
                _.each(navItems, function(li)
                {
                    $(li).find('ul').removeAttr('style');
                });
            }
            else
            {
                //un-collapse menu
                self.$element.removeClass(self.const.sideNavOpen);
                $elem.removeClass('tr-icon-angle-right').addClass('tr-icon-angle-left');//change the icon
            }
        };


        /**
         * Menu item functionality
         * 1. If sub menu is empty, default link behavior
         * 2. We have sub menu, add collapse | un-collapse functionality
         * @param {object} sideNavModel - sideNavModel
         * @param {object} elem - html element
         */
        SideNavModule.prototype.toggleMenuItem = function(sideNavModel, elem)
        {
            var self = this, // local cache for root (module)
                $li,
                $ul;
            //jQuery element wrapper
            $li = $(elem);
            //cache the reference to dom element for later usage
            sideNavModel.elem = elem;

            //1. if we don't have sub menu just redirect to module url
            if(!sideNavModel.hasSubMenu)
            {
                self._cleanSelected.call(self);
                self._collapseOpened.call(self);
                $li.addClass(self.const.activeClass);
                window.location.hash = sideNavModel.moduleUrl;
                return;
            }

            //2.we do have sub items, continue
            $ul = $li.find('ul');

            if(!$ul.is(':visible'))
            {
                //collapse opened menu item
                self._collapseOpened.call(self);
                //open the current sub menu
                self._unCollapseSingle($ul);
                $li.addClass(self.const.subMenuOpen);
            }
            else
            {
                //collapse the sub menu only if current nav item don't have any sub items selected
                if(!$li.find('a.'+self.const.innerActiveClass).length)
                {
                    self._collapseSingle($ul);
                    $li.removeClass(self.const.subMenuOpen);
                }
            }
        };

        /**
         *
         * @param sideNavModel
         * @returns {void}
         * @param elem
         */
        SideNavModule.prototype.moduleRedirect = function(sideNavModel, elem)
        {
            var self = this, url = $(elem).attr('href');
            if(!_.isUndefined(url) && !_.isEmpty(url))
            {
                self._cleanSelected();
                $(elem).addClass(self.const.innerActiveClass);
                window.location.hash = url;
                $(sideNavModel.elem).addClass(self.const.activeClass);
            }
        };

        /**
         * Collapse all opened menu (one level list displayed) items
         * @returns {void}
         * @private
         */
        SideNavModule.prototype._collapseOpened = function()
        {
            var self = this, navItems = this._getNavItems();

            _.each(navItems, function(item)
            {
                if($(item).hasClass(self.const.subMenuOpen))
                {
                    self._collapseSingle($(item).find('ul'));
                }
            });
        };

        /**
         * Close given ul list
         * @param {object} $ul - menu item to collapse
         * @returns {void}
         * @private
         */
        SideNavModule.prototype._collapseSingle = function($ul)
        {
            $ul.slideUp('fast');
        };

        /**
         * Open given ul list
         * @param {object} $ul - menu item to un-collapse
         * @private
         */
        SideNavModule.prototype._unCollapseSingle = function($ul)
        {
            $ul.slideDown('fast');
        };


        /**
         * Clean all selected items
         * remove {selected class} from first & second level list items
         * @returns {void}
         * @private
         */
        SideNavModule.prototype._cleanSelected = function()
        {
            var navItems = this._getNavItems(), self = this;
            _.each(navItems, function(li)
            {
                $(li).removeClass(self.const.activeClass).find('a').removeClass(self.const.innerActiveClass);
            });
        };

        /**
         * This function will return the first level li list
         * @returns {Array} - collection of li menu items
         * @private
         */
        SideNavModule.prototype._getNavItems = function()
        {
            //check if we already have it cached
            if(_.isEmpty(this.navItems))
            {
                this.navItems = this.$element.find('ul:first').children('li');
            }
            return this.navItems;

        };

        SideNavModule.prototype.afterRender = function()
        {
        };

        return SideNavModule;
    }
);