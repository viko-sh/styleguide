/*global __g_sm, ko*/
define(
    [
        'resource!jquery/jstree.min',
        'resource!ko/knockout-jstree'
    ],
    function(jstree)
    {

        'use strict';

        // shir todo - add here the observable to with the default data
        function jstree()
        {
            //this.interestsCollection = ko.observableArray(
            //    [{
            //        'id': '6002839660079',
            //        'name': 'Cosmetics',
            //        'type': 'interests',
            //        'path': [
            //            'Shopping and fashion',
            //            'Beauty',
            //            'Cosmetics'
            //        ],
            //        'audience_size': 561317370
            //    }, {
            //        'id': '6002866718622',
            //        'name': 'Science',
            //        'type': 'interests',
            //        'path': [
            //            'Business and industry',
            //            'Science'
            //        ],
            //        'audience_size': 372242400
            //    }, {
            //        'id': '6002867432822',
            //        'name': 'Beauty',
            //        'type': 'interests',
            //        'path': [
            //            'Shopping and fashion',
            //            'Beauty'
            //        ],
            //        'audience_size': 963321560
            //    }]



            this.sampleData = [
                {
                    id: 'Shopping and fashion',
                    parent: '#',
                    text: 'Shopping and fashion'
                },
                {
                    id: 'Beauty',
                    parent: 'Shopping and fashion',
                    text: 'Beauty'
                },
                {
                    id: 'Cosmetics',
                    parent: 'Beauty',
                    text: 'Cosmetics'
                }
            ];
        };

        return jstree;
    }
);