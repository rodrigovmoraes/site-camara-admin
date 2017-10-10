(function() {
"use strict";
   angular.module("SiteCamaraAdminApp").controller('QuickSidebarController', QuickSidebarController);

   /* Setup Layout Part - Quick Sidebar */
   QuickSidebarController.$inject = ['$scope']
   function QuickSidebarController($scope) {
       $scope.$on('$includeContentLoaded', function() {
          setTimeout(function(){
               QuickSidebar.init(); // init quick sidebar
           }, 2000)
       });
   }

})();
