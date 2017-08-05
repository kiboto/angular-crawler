'use strict';
angular.module('myCrawler')
  .controller('CrawlerListController',
    ['$scope', '$http', '$q', '$sce', CrawlerListController]);

function CrawlerListController($scope, $http, $q, $sce) {

  //Default
  var tmpDataAttribute = {
    label: "",
    type: "text-1",
    attribute1: "",
    attribute2: ""
  };

  // Param
  $scope.dataOutput = [];
  $scope.dataInput = {
    url1: "",
    url2: "",
    dataAttribute: []
  };

  //Function add Attribute
  $scope.addAttribute = function () {
    $scope.dataInput.dataAttribute.push(angular.copy(tmpDataAttribute));
  };

  //Function remove Attribute
  $scope.removeAttribute = function (index) {
    $scope.dataInput.dataAttribute.splice(index,1);
  };


  // Crawler Data
  $scope.submit = function (data) {

    var crawler1 = $http.get(data.url1);
    var crawler2 = $http.get(data.url2);
    $q.all([crawler1, crawler2]).then(function (res) {

      var dataAttr = createAttribute(angular.copy(data));

      angular.forEach(res, function (item, key) {
        crawlerData(parseHTML(res[key]), dataAttr, key);
      });

      $scope.dataOutput = formatDataOutput(dataAttr);
    });

  };


  // Function load data Example
  $scope.loadExample = function (name) {
    if (name === 'tiki') {
      $http.get("data/tiki.json").then(function (res) {
        $scope.dataInput = res ? res.data : [];
      })
    }

  };



  // Func create Attribute
  function createAttribute(dataInput) {
    var dataOutput = [];
    if (dataInput && dataInput.dataAttribute) {
      angular.forEach(dataInput.dataAttribute, function (item) {
        var tmpResult = {
          label: item.label,
          type: item.type,
          attr: {
            0: item.attribute1,
            1: item.attribute2
          },
          value_attr: {
            0: "",
            1: ""
          }
        };
        dataOutput.push(tmpResult);
      })
    }

    return dataOutput;

  }

  // Func parse HTML
  function parseHTML(response) {
    if (response && response.data) {
      return $($.parseHTML(response.data));
    } else {
      return "";
    }

  }

  // Func crawler data
  function crawlerData(DOM, listAttribute, index) {
    angular.forEach(listAttribute, function (item) {

      if (item.type === "text-1") {
        item.value_attr[index] = DOM.find(item.attr[index]) ? DOM.find(item.attr[index]).text() : "";
      } else if (item.type === "text-n") {
        var tmpAttr = item.attr[index].split(",");
        if (tmpAttr.length > 1) {
          item.value_attr[index] = DOM.find(tmpAttr[0]) ? DOM.find(tmpAttr[0])[parseInt(tmpAttr[1])].innerText : "";
        } else {
          item.value_attr[index] = "";
        }

      } else {
        item.value_attr[index] = "";
      }

    });

    return listAttribute;
  }

  // Func format Data Outut
  function formatDataOutput(data) {
    var result = [];

    angular.forEach(data, function (item) {
      var tmpResult = {
        label: item.label,
        type: item.type,
        value_attr_0: item.value_attr[0],
        value_attr_1: item.value_attr[1],
      };

      result.push(tmpResult);
    });

    return result;
  }

  function init() {
    $scope.loadExample("tiki");
  }
  init();
}

