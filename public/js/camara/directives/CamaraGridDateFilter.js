(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').directive('camaraGridDateFilter', function(){
      return {
         templateUrl: 'tpl/camara/directives/camaraGridDateFilter.html',
         controller: 'CamaraGridDateFilterController',
         controllerAs: 'camaraGridDateFilterController',
         bindToController: true,
         scope: {
            filter: '='
         },
         restrict: 'E'
      }
   });

   angular.module('SiteCamaraAdminApp').controller('CamaraGridDateFilterController', CamaraGridDateFilterController);
   CamaraGridDateFilterController.$inject = ['$scope'];
   function CamaraGridDateFilterController($scope) {
      var camaraGridDateFilterController = this;
      camaraGridDateFilterController.date1Options = {
          dateDisabled: false,
          formatYear: 'yyyy',
          maxDate: new Date(2100, 0, 1),
          minDate: 0,
          startingDay: 1
      };
      camaraGridDateFilterController.date2Options = {
         dateDisabled: false,
         formatYear: 'yyyy',
         maxDate: new Date(2020, 5, 22),
         minDate: 0,
         startingDay: 1
      };
      camaraGridDateFilterController.date1 = undefined;
      camaraGridDateFilterController.date2 = undefined;
      camaraGridDateFilterController.date1IsOpen = false;
      camaraGridDateFilterController.date2IsOpen = false;
      camaraGridDateFilterController.openDate1 = function() {
         camaraGridDateFilterController.date1IsOpen = true;
      };
      camaraGridDateFilterController.openDate2 = function() {
         camaraGridDateFilterController.date2IsOpen = true;
      };

      $scope.$watch('camaraGridDateFilterController.date1', function (newValue, oldValue, scope) {
         camaraGridDateFilterController.filter.term = [newValue, camaraGridDateFilterController.date2];
      });

      $scope.$watch('camaraGridDateFilterController.date2', function (newValue, oldValue, scope) {
         camaraGridDateFilterController.filter.term = [camaraGridDateFilterController.date1, newValue];
      });

   }

}());
