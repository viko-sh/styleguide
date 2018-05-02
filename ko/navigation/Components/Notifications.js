/*global __g_sm, ko, _, _campaignID, Tracx*/
define(
    [
    ],
    function(moment)
    {

        'use strict';

        /**
         * @constructor
         */
        function Notifications()
        {
        }

        Notifications.prototype.notifyError = function(size)
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
        };

        Notifications.prototype.notifySuccess = function(size)
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.SUCCESS, 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source');

        };

        Notifications.prototype.notifyInfo = function(size)
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.');
        };

        Notifications.prototype.confirm = function()
        {
            Tracx.notifications.confirm('Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?', 'medium', this.__approved.bind(this), this.__cancel.bind(this));
        };

        Notifications.prototype.__approved = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INFO, '__approved confirm');

        };

        Notifications.prototype.__cancel = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.ERROR, '__cancel confirm');
        };

        Notifications.prototype.notifyNote = function(type)
        {
            Tracx.notifications.notify(type, 'but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure');
        };

        Notifications.prototype.notifyInverse = function()
        {
            Tracx.notifications.notify(Tracx.NotificationEnum.Type.INVERSE, 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
        };

        return Notifications;
    }
);