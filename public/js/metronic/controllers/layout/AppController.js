(function() {
"use strict";

      angular.module("SiteCamaraAdminApp").controller('AppController', AppController);

      /* Setup App Main Controller */
      AppController.$inject = ['$scope','$rootScope']
      function AppController($scope, $rootScope) {
          $scope.$on('$viewContentLoaded', function() {
              //App.initComponents(); // init core components
              //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
          });
      }

})();
