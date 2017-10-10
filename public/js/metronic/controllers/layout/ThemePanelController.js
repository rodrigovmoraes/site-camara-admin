(function() {
   'use strict';

      angular.module("SiteCamaraAdminApp").controller('ThemePanelController', ThemePanelController);

      /* Setup Layout Part - Theme Panel */
      ThemePanelController.$inject = ['$scope']
      function ThemePanelController($scope) {
          $scope.$on('$includeContentLoaded', function() {
              Demo.init(); // init theme panel
          });
      }

}());
