(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectLegislativeProcessModalInstanceController', SelectLegislativeProcessModalInstanceController);

   SelectLegislativeProcessModalInstanceController.$inject = [ '$scope', 'Utils',
                                                                'settings', 'messages',
                                                                '$uibModalInstance',
                                                                'SyslegisService']
   function SelectLegislativeProcessModalInstanceController( $scope, Utils,
                                                             settings, messages,
                                                             $uibModalInstance,
                                                             SyslegisService ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _clear = function() {
         $modalCtrl.pager.page = 1;
         $modalCtrl.legislativeProcesses = null;
         $modalCtrl.number = null;
         $modalCtrl.year = null;
         $modalCtrl.notFoundMessage = null;
      }

      var _update = function() {
         $modalCtrl.clearMessage();
         $modalCtrl.notFoundMessage = null
         var filterOptions = {};
         //set filter
         if ($modalCtrl.selectedLegislativeProcessType) {
            filterOptions['tipoMateriaId'] = $modalCtrl.selectedLegislativeProcessType.id;
         } else {
            filterOptions['tipoMateriaId'] = null;
         }
         if ($modalCtrl.number) {
            filterOptions['numeroMateria'] = $modalCtrl.number;
         } else {
            filterOptions['numeroMateria'] = null;
         }
         if ($modalCtrl.year) {
            filterOptions['anoMateria'] = $modalCtrl.year;
         } else {
            filterOptions['anoMateria'] = null;
         }
         return Promise.resolve();
/*
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
                        $modalCtrl.notFoundMessage = messages.selectLegislativaPropositionsNotFound;
                     }
                  });
*/
      }

      $modalCtrl.formatLegislativeProcessNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      //legislative proposition types
      $modalCtrl.legislativeProcessesTypes = [];

      SyslegisService
         .getLegislativeProcessesTypes()
         .then(function(result) {
            $modalCtrl.legislativeProcessesTypes = result.tiposDeMateria;
         });

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

      $modalCtrl.selectLegislativeProcessType = function (legislativeProcessType) {
         $modalCtrl.selectedLegislativeProcessType = legislativeProcessType;
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

      $modalCtrl.selectLegislativeProcess = function(legislativeProcess) {
         $uibModalInstance.close(legislativeProcess);
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
   }
})();
