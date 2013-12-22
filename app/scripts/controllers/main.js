'use strict';

angular.module('acronymApp')
.controller('MainCtrl', function ($scope, $rootScope, $http) {
  $scope.about = function () {
    jQuery('#about').modal('show');
  };

  $scope.add = function () {
    jQuery('#add').modal('show');
  };

  $rootScope.search = function (page) {
    $http.get('http://localhost:8000/acronyms', {
      params: {
        query: $scope.query,
        page: (page) ? page : 1
      }
    }).success(function (data) {
      $scope.results = data;
      $scope.pages = [];
      for (var i = 1; i <= data.pages; i++) {
        $scope.pages.push(i);
      }
    });
  };

  $scope.$watch('query', function () {
    $rootScope.search();
  });

  $scope.query = '';
});
