'use strict';

angular.
  module('myCrawler').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/crawler', {
          controller: 'CrawlerListController',
          templateUrl: 'crawler-list/crawler-list.template.html'
        }).
        otherwise('/crawler');
    }
  ]);
