'use strict';
angular.module('myCrawler')
  .filter('safeHtml', function ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  };
});