(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ListPagesController', ListPagesController);

   ListPagesController.$inject = ['$scope', 'messages',
                                  'Utils', '$stateParams',
                                      'PagesService', 'settings'];
   function ListPagesController( $scope, messages,
                                 Utils, $stateParams,
                                 PagesService, settings ) {
      var $listPagesCtrl = this;

      //messages control
      Utils.applyMessageControls($listPagesCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _updatePagesList = function() {
         var paginationOptions = {
            page: $listPagesCtrl.pager.currentPage,
            pageSize: $listPagesCtrl.pager.itemsPerPage
         };
         var date1 = $listPagesCtrl.filter.date1 ? $listPagesCtrl.filter.date1 : null;
         var date2 = $listPagesCtrl.filter.date2 ? $listPagesCtrl.filter.date2 : null;
         if(date1) {
            date1.setMilliseconds(0);
            date1.setSeconds(0);
            date1.setMinutes(0);
            date1.setHours(0);
         }
         if(date2) {
            date2.setMilliseconds(999);
            date2.setSeconds(59);
            date2.setMinutes(59);
            date2.setHours(23);
         }
         var filterOptions = {
            'keywords': $listPagesCtrl.filter.keywords ? $listPagesCtrl.filter.keywords : null,
            'date1': date1,
            'date2': date2
         };
         if($listPagesCtrl.filter.id) {
            filterOptions.id = $listPagesCtrl.filter.id;
            $listPagesCtrl.filter.id = null; //reset this filter id
         }
         return PagesService.getPages(paginationOptions, filterOptions).then(function(result) {
            $listPagesCtrl.pages = result.pages;
            $listPagesCtrl.pager.totalItems = result.totalLength;
            $listPagesCtrl.pager.currentPage = result.page;
            $listPagesCtrl.pager.totalPages = Math.ceil(result.totalLength / $listPagesCtrl.pager.itemsPerPage);
            $listPagesCtrl.errorMessage = "";
         });
      }

      //messages
      $listPagesCtrl.errorMessage = $stateParams.errorMessage;
      $listPagesCtrl.infoMessage = $stateParams.infoMessage;
      $listPagesCtrl.notFoundMessage = messages.pageNotFound;
      $listPagesCtrl.highlightPageId = PagesService.getHighlightPageId();
      PagesService.clearHighlightPageId();

      //pager setup
      $listPagesCtrl.pager = PagesService.getPaginationOptions();

      $listPagesCtrl.pager.pageChanged = function() {
          //update
          $listPagesCtrl.clearMessage();
          _updatePagesList().catch(function(error) {
            $listPagesCtrl.errorMessage = error.message;
          });
      }
      //filter setup
      $listPagesCtrl.filter = PagesService.getFilterOptions();

      //initial load of the pages
      _updatePagesList();

      //filter update
      //keywords
      $scope.$watch("$listPagesCtrl.filter.keywords", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listPagesCtrl.clearMessage();
            _updatePagesList().catch(function (error) {
               $listPagesCtrl.errorMessage = error.message;
            });
         }
      });
      //publication date, begin
      $scope.$watch("$listPagesCtrl.filter.date1", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listPagesCtrl.clearMessage();
            _updatePagesList().catch(function (error) {
               $listPagesCtrl.errorMessage = error.message;
            });
         }
      });

      //publication date, end
      $scope.$watch("$listPagesCtrl.filter.date2", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $listPagesCtrl.clearMessage();
            _updatePagesList().catch(function(error) {
               $listPagesCtrl.errorMessage = error.message;
            });
         }
      });
   }
})();
