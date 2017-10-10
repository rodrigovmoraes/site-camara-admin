(function() {
"use strict";

      angular.module("SiteCamaraAdminApp").controller('HeaderController', HeaderController);

      /* Setup App Main Controller */
      HeaderController.$inject = ['$scope']
      function HeaderController($scope) {
          $scope.$on('$includeContentLoaded', function() {
              Layout.initHeader(); // init header
          });
      }

})();
