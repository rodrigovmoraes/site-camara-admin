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
         var page = $modalCtrl.pager.page ? $modalCtrl.pager.page : 1;
         var pageSize = $modalCtrl.pager.itemsPerPage ? $modalCtrl.pager.itemsPerPage : 3;

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
         //pagination options
         filterOptions['offset'] = page * pageSize - pageSize;
         filterOptions['limit'] = pageSize;

         return SyslegisService
                  .getLegislativeProcesses(filterOptions)
                  .then(function(result) {
                     if (result.materiasLegislativas && result.materiasLegislativas.length > 0) {
                        $modalCtrl.legislativeProcesses = result.materiasLegislativas;
                        $modalCtrl.pager.totalItems = result.total;
                        $modalCtrl.pager.currentPage = page;
                        $modalCtrl.pager.totalPages = Math.ceil(result.total / pageSize);
                     } else {
                        $modalCtrl.legislativeProcesses = [];
                        $modalCtrl.pager.totalItems = 0;
                        $modalCtrl.pager.currentPage = 1;
                        $modalCtrl.pager.totalPages = 0;
                        $modalCtrl.notFoundMessage = messages.selectLegislativeProcessNotFound;
                     }
                  });

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
          _update()
          .catch(function(error) {
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
