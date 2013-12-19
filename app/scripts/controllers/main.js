'use strict';

angular.module('acronymApp')
.controller('MainCtrl', function ($scope, $http) {
  $scope.$watch('query', function (newValue) {
    if (newValue) {
      $http.get('http://localhost:8000/acronyms', {
        params: {
          query: newValue
        }
      }).success(function (data) {
        $scope.data = data;
      });
    }
  });
});
