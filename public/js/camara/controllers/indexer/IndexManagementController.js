(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('IndexManagementController', IndexManagementController);

   IndexManagementController.$inject = [ '$scope', 'messages',
                                         'Utils', '$stateParams',
                                         'IndexerService', 'settings',
                                         '$interval', '$uibModal',
                                         'GridUtils', 'uiGridConstants'
                                       ];
   function IndexManagementController( $scope, messages,
                                       Utils, $stateParams,
                                       IndexerService, settings,
                                       $interval, $uibModal,
                                       GridUtils, uiGridConstants
                                     ) {

      var pullIndexerInfoStatus = $interval(function() {
         console.log("Pulling indexer info status");
         return IndexerService
            .getInfoStatus()
            .then(function(result) {
               var infoStatus = result.info;
               $indexManagementCtrl.indexerBeingExecuted = infoStatus.beingExecuted;
               $indexManagementCtrl.currentModule = infoStatus.currentModulePath;
               $indexManagementCtrl.modulesCount = infoStatus.totalModules;
               $indexManagementCtrl.executedModules = infoStatus.modulesExecuted < $indexManagementCtrl.modulesCount ? infoStatus.modulesExecuted + 0.5 : infoStatus.modulesExecuted;
               $indexManagementCtrl.currentModuleProgress = infoStatus.currentModuleProgress;
               $indexManagementCtrl.isOnline = true;
               $indexManagementCtrl.indexerError = "";
            }).catch(function(error) {
               $indexManagementCtrl.indexerBeingExecuted = false;
               $indexManagementCtrl.currentModule = '';
               $indexManagementCtrl.modulesCount = 0;
               $indexManagementCtrl.executedModules = 0;
               $indexManagementCtrl.currentModuleProgress = 0;
               $indexManagementCtrl.isOnline = false;
               $indexManagementCtrl.indexerError = error.message ? error.message : error.toString();
            });
      }, 3500); // pull indexer info status every 3.5 seconds

      //cancel the pulling process on controller leave
      $scope.$on('$destroy', function() {
        $interval.cancel(pullIndexerInfoStatus);
      });

      var $indexManagementCtrl = this;

      //messages control
      Utils.applyMessageControls($indexManagementCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages
      $indexManagementCtrl.errorMessage = $stateParams.errorMessage;
      $indexManagementCtrl.infoMessage = $stateParams.infoMessage;
      $indexManagementCtrl.notFoundMessage = messages.newsNotFound;

      $indexManagementCtrl.formatModuleProgress = function (progress) {
         if(progress && progress > 0) {
            return Math.round(progress * 100) + "%";
         } else {
            return "0%";
         }
      }

      $indexManagementCtrl.indexerBeingExecuted = false;
      $indexManagementCtrl.modulesCount = 0;
      $indexManagementCtrl.executedModules = 0;
      $indexManagementCtrl.currentModule = '';
      $indexManagementCtrl.currentModuleProgress = 0;
      $indexManagementCtrl.isOnline = false;
      $indexManagementCtrl.indexerError = "";
      $indexManagementCtrl.statusTabActive = true;
      $indexManagementCtrl.executionLogsTabActive = false;
      $indexManagementCtrl.kibanaUrl = settings.Indexer.kibanaUrl;

      $indexManagementCtrl.index = function() {
         $indexManagementCtrl.clearMessage();
         return IndexerService
                  .index()
                  .then(function(result) {
                     console.log("indexing requested")
                  }).catch(function (error) {
                     $indexManagementCtrl.errorMessage = error.message;
                  });
      }

      $indexManagementCtrl.clearIndex = function() {
            $indexManagementCtrl.clearMessage();
            $uibModal.open({
               templateUrl: 'tpl/camara/includes/confirm.html',
               animation: false,
               size: 'md',
               controller: 'ConfirmModalInstanceController',
               controllerAs: '$modalCtrl',
               scope: $scope,
               resolve: {
                  texts: {
                     'message': messages.clearIndexDialogText
                  }
               }
            }).result.then(function() {
               return IndexerService
                        .clearIndex()
                        .then(function() {
                           $indexManagementCtrl.message = messages.clearIndexRequested;
                        }).catch(function (error) {
                           $indexManagementCtrl.errorMessage = error.message;
                        });
            });
      }

      $indexManagementCtrl.stopIndexing = function() {
         $indexManagementCtrl.clearMessage();
         return IndexerService
                  .stopIndexing()
                  .then(function(){
                     $indexManagementCtrl.refresh("");
                  }).catch(function (error) {
                     $indexManagementCtrl.errorMessage = error.message;
                  });
      }

      $indexManagementCtrl.refreshLogs = function() {
         $indexManagementCtrl.clearMessage();
         $indexManagementCtrl.refresh("");
      }

      $indexManagementCtrl.clearLogs = function() {
         $indexManagementCtrl.clearMessage();
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': messages.clearLogsDialogText
               }
            }
         }).result.then(function() {
            return IndexerService
                     .clearLogs()
                     .then(function() {
                        $indexManagementCtrl.message = messages.clearLogsRequested;
                        $indexManagementCtrl.refresh("");
                     }).catch(function (error) {
                        $indexManagementCtrl.errorMessage = error.message;
                     });
         });
      }

      $indexManagementCtrl.setStatusTabActive = function() {
         $indexManagementCtrl.statusTabActive = true;
         $indexManagementCtrl.executionLogsTabActive = false;
      }

      $indexManagementCtrl.setExecutionLogsTabActive = function() {
         $indexManagementCtrl.statusTabActive = false;
         $indexManagementCtrl.executionLogsTabActive = true;
      }

      GridUtils.applyGrid($scope, $indexManagementCtrl, {
         sortInfo: {fields:['endDate'],directions:['desc']},
         columnDefs:
             [
                { name: 'Início', field: 'startDate', enableFiltering: true,
                  cellFilter: 'date:"dd/MM/yyyy hh:mm:ss"', filterCellFiltered: false, sortCellFiltered: false, type:'date',
                  filter: { term: [undefined, undefined] },
                  filterHeaderTemplate: GridUtils.filterHeaderTemplate()
                },
                { name: 'Fim', field: 'endDate', enableFiltering: true,
                  cellFilter: 'date:"dd/MM/yyyy hh:mm:ss"', filterCellFiltered: false, sortCellFiltered: false, type:'date',
                  filter: { term: [undefined, undefined] },
                  filterHeaderTemplate: GridUtils.filterHeaderTemplate()
                },
                {  name: 'Total', field: 'totalItems', enableFiltering: false },
                {  name: 'Processados', field: 'amountOfProcessedItems', enableFiltering: false },
                {  name: 'Novos', field: 'amountOfNewItems', enableFiltering: false },
                {  name: 'Atualizados', field: 'amountOfUpdatedItems', enableFiltering: false },
                {  name: 'Removidos', field: 'amountOfRemovedItems', enableFiltering: false },
                {  name: 'Com Erro', field: 'amountOfItemsWithError', enableFiltering: false },
                {  name: 'Erro', field: 'error', enableFiltering: false, enableSorting: false,
                   cellTemplate: '<div class="ui-grid-cell-contents" ng-attr-title="{{COL_FIELD}}">{{COL_FIELD}}</div>'
                },
                {  name: ' ', enableFiltering: false, enableColumnMenu: false, enableSorting: false,
                   cellTemplate: '<div class="div-buttons"><button type="button" class="btn btn-primary btn-in-cell" ng-click="grid.appScope.$ctrl.openModuleExecutionLogsModal(row.entity)">módulos</button></div>'
                },
             ]
     }, function(page, pageSize, message) {
        $indexManagementCtrl.clearMessage();
        App.blockUI();
        IndexerService.getLogsGrid($indexManagementCtrl.paginationOptions).then(function(result) {
           if(!result.totalLength) {
             //data hasn´t been returned
             $indexManagementCtrl.setWarnMessage(messages.indexExecutionLogsNotFound);
             GridUtils.setDataNotFound($indexManagementCtrl);
           } else {
             //update data
             GridUtils.setFoundData($indexManagementCtrl, result.logs, result.totalLength, pageSize, result.selectFilters);
             //handle message
             if(message) {
                $indexManagementCtrl.setMessage(message);
             } else {
                $indexManagementCtrl.clearMessage();
             }
           }
        }).catch(function(error) {
           $indexManagementCtrl.setErrorMessage(error.message);
        }).finally(function(){
           App.unblockUI();
        });
     });

     $indexManagementCtrl.paginationOptions.sortColumns = [{ field: 'endDate', direction: 'desc', priority: 1}];

     $indexManagementCtrl.openModuleExecutionLogsModal = function(executionLog) {
        $indexManagementCtrl.moduleExecutionLogsModalInstance = $uibModal.open({
          templateUrl: 'moduleExecutionLogsModalContent.html',
          animation: false,
          size: 'lg',
          controller: 'ModuleExecutionLogsModalController',
          controllerAs: '$modalCtrl',
          scope: $scope,
          resolve: {
             params: {
                'executionLog': executionLog
             }
          }
        });
     }
   }
})();
