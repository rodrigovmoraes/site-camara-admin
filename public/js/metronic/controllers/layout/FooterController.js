(function() {
   'use strict';

      angular.module("SiteCamaraAdminApp").controller('FooterController', FooterController);

      /* Setup Layout Part - Footer */
      FooterController.$inject = ['$scope']
      function FooterController($scope) {
          $scope.$on('$includeContentLoaded', function() {
              Layout.initFooter(); // init footer
          });
      }

}());
