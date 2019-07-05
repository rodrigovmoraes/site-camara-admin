(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectLegislativePropositionModalInstanceController', SelectLegislativePropositionModalInstanceController);

   SelectLegislativePropositionModalInstanceController.$inject = [ '$scope', 'Utils',
                                                                   'settings', 'messages',
                                                                   '$uibModalInstance',
                                                                   'LegislativePropositionService',
                                                                   'legislativePropositionType']
   function SelectLegislativePropositionModalInstanceController( $scope, Utils,
                                                                 settings, messages,
                                                                 $uibModalInstance,
                                                                 LegislativePropositionService,
                                                                 legislativePropositionType ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _clear = function() {
         $modalCtrl.pager.page = 1;
         $modalCtrl.legislativePropositions = null;
         $modalCtrl.number = null;
         $modalCtrl.year = null;
         $modalCtrl.notFoundMessage = null;
      }

      var _update = function() {
         $modalCtrl.clearMessage();
         $modalCtrl.notFoundMessage = null
         var filterOptions = {};
         //set filter
         if ($modalCtrl.selectedLegislativePropositionType) {
            filterOptions['type'] = $modalCtrl.selectedLegislativePropositionType;
         } else {
            filterOptions['type'] = null;
         }
         if ($modalCtrl.number) {
            filterOptions['number'] = $modalCtrl.number;
         } else {
            filterOptions['number'] = null;
         }
         if ($modalCtrl.year) {
            filterOptions['year'] = $modalCtrl.year;
         } else {
            filterOptions['year'] = null;
         }

         return LegislativePropositionService
                  .getLegislativePropositions(  {
                     page: $modalCtrl.pager.page,
                     pageSize: $modalCtrl.pager.itemsPerPage
                  }, filterOptions,
                  {
                     'sort': 'date',
                     'sortDirection': -1
                  }).then(function(result) {
                     if (result.legislativePropositions && result.legislativePropositions.length > 0) {
                        $modalCtrl.legislativePropositions = result.legislativePropositions;
                        $modalCtrl.pager.totalItems = result.totalLength;
                        $modalCtrl.pager.currentPage = result.page;
                        $modalCtrl.pager.totalPages = Math.ceil(result.totalLength / result.pageSize);
                     } else {
                        $modalCtrl.legislativePropositions = [];
                        $modalCtrl.pager.totalItems = 0;
                        $modalCtrl.pager.currentPage = 1;
                        $modalCtrl.pager.totalPages = 0;
                        $modalCtrl.notFoundMessage = messages.selectLegislativePropositionsNotFound;
                     }
                  });
      }

      $modalCtrl.formatLegislativePropositionNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      //legislative proposition types
      $modalCtrl.legislativePropositionTypes = [];
      LegislativePropositionService
         .getLegislativePropositionTypes()
         .then(function(result) {
            $modalCtrl.legislativePropositionTypes = result.legislativePropositionTypes;
         });

      $modalCtrl.selectedLegislativePropositionType = legislativePropositionType;
      $modalCtrl.pager = {
         totalItems: null,
         page: 1,
         itemsPerPage: 3,
         maxSize: 5,
         totalPages: 0
      }
      //handle: legislative propositions page changed
      $modalCtrl.pager.pageChanged = function() {
          //update
          $modalCtrl.clearMessage();
          _update().catch(function(error) {
             $modalCtrl.errorMessage = error.message;
          });
      }

      _update();

      $modalCtrl.selectLegislativePropositionType = function (legislativePropositionType) {
         $modalCtrl.selectedLegislativePropositionType = legislativePropositionType;
         $modalCtrl.pager.page = 1;
         _update().catch(function(error) {
            $modalCtrl.errorMessage = error.message;
         });
      }

      $modalCtrl.searchPrev = function() {
         if($modalCtrl.pager.totalItems && $modalCtrl.pager.page > 1) {
            $modalCtrl.pager.page--;
            _update().catch(function(error) {
              $modalCtrl.errorMessage = error.message;
           });
         }
      }

      $modalCtrl.searchNext = function() {
         if($modalCtrl.pager.totalItems && $modalCtrl.pager.page * $modalCtrl.pager.itemsPerPage < $modalCtrl.pager.totalItems) {
            $modalCtrl.pager.page++;
            _update().catch(function(error) {
              $modalCtrl.errorMessage = error.message;
           });
         }
      }

      $modalCtrl.selectLegislativeProposition = function(legislativeProposition) {
         $uibModalInstance.close(legislativeProposition);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.search = function() {
         //update
         $modalCtrl.clearMessage();
         _update().catch(function(error) {
           $modalCtrl.errorMessage = error.message;
         });
      }

      //number update
      $scope.$watch("$modalCtrl.number", function (newValue, oldValue) {
         //keywords updated
         if (newValue != oldValue) {
            $modalCtrl.clearMessage();
            _update().catch(function(error) {
              $modalCtrl.errorMessage = error.message;
            });
         }
      });

      //year update
      $scope.$watch("$modalCtrl.year", function (newValue, oldValue) {
         //keywords updated
         if (newValue != oldValue) {
            $modalCtrl.clearMessage();
            _update().catch(function(error) {
              $modalCtrl.errorMessage = error.message;
            });
         }
      });
   }
})();
