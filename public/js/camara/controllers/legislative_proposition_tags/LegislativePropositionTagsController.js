(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('LegislativePropositionTagsController', LegislativePropositionTagsController);

   LegislativePropositionTagsController.$inject = [ 'HttpDispatcherService', 'LegislativePropositionTagsService',
                                                    'LegislativePropositionService',
                                                    '$scope', 'uiGridConstants',
                                                    'Utils', 'GridUtils',
                                                    'messages', '$uibModal' ]
   function LegislativePropositionTagsController( HttpDispatcherService, LegislativePropositionTagsService,
                                                  LegislativePropositionService,
                                                  $scope, uiGridConstants,
                                                  Utils, GridUtils,
                                                  messages, $uibModal ) {
      var $ctrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages control
      Utils.applyMessageControls($ctrl);

      $ctrl.openNewLegislativePropositionTagModal = function() {
         $ctrl.newLegislativePropositionTagModalInstance = $uibModal.open({
              templateUrl: 'newLegislativePropositionTagModalContent.html',
              animation: false,
              size: 'm',
              controller: 'NewLegislativePropositionTagModalInstanceController',
              controllerAs: '$modalCtrl',
              scope: $scope,
              resolve: {
                 legislativePropositionTypes: function() {
                    return LegislativePropositionService
                                .getLegislativePropositionTypes()
                                .then(function(result) {
                       return result.legislativePropositionTypes;
                    }).catch(function(error) {
                       console.error(error);
                       throw error;
                    });
                 }
              }
         });

         $ctrl.newLegislativePropositionTagModalInstance.result.then(function (params) {
            var message = params.message;
            var id = params.id;

            $ctrl.paginationOptions.filtering = [{ "field": "_id",
                                                   "type": "string",
                                                   "term": id,
                                                   "filterType": "select"
                                                }];

            $ctrl.refresh(message);
         }, function() {
            //dimissed window
         });
      }

      GridUtils.applyGrid($scope, $ctrl, {
         columnDefs:
             [
                {  name: 'Tipo de Propositura', field: 'propositionType', enableFiltering: true, cellTemplate: GridUtils.columnFieldTemplate('description'),
                   filter: {
                     type: uiGridConstants.filter.SELECT,
                     selectOptions: []
                   }
                },
                {  name: 'Descrição', field: 'description', enableFiltering: true },
                { name: ' ', enableFiltering: false, enableColumnMenu: false, enableSorting: false,
                  cellTemplate: GridUtils.editButtonCellTemplate("grid.appScope.$ctrl.handleEditLegislativePropositionTag(row.entity)")
                }
             ]
     }, function(page, pageSize, message) {

        App.blockUI();
        LegislativePropositionTagsService
        .getLegislativePropositionTagsForGrid($ctrl.paginationOptions)
        .then(function(result) {
           if(!result.totalLength) {
             //data hasn´t been returned
             $ctrl.setWarnMessage(messages.LegislativePropositionTagsNotFound);
             GridUtils.setDataNotFound($ctrl);
           } else {
             //update data
             GridUtils.setFoundData($ctrl, result.legislativePropositionTags, result.totalLength, pageSize, result.selectFilters);
             //handle message
             if(message) {
                $ctrl.setMessage(message);
             } else {
                $ctrl.clearMessage();
             }
           }
        }).catch(function(error) {
           $ctrl.setErrorMessage(error.message);
        }).finally(function(){
           App.unblockUI();
        });

     });

     $ctrl.handleEditLegislativePropositionTag = function (dataRowEntity) {

        $ctrl.editLegislativePropositionTagModalInstance = $uibModal.open({
             templateUrl: 'editLegislativePropositionTagModalContent.html',
             animation: false,
             size: 'm',
             controller: 'EditLegislativePropositionTagModalInstanceController',
             controllerAs: '$modalCtrl',
             scope: $scope,
             resolve: {
                legislativePropositionTag: function() {
                  return LegislativePropositionTagsService
                           .getLegislativePropositionTag(dataRowEntity._id)
                           .then(function(result) {
                                  if(!result.legislativePropositionTag) {
                                    $ctrl.setErrorMessage(messages.legislativePropositionTagNotFound);
                                    throw new Error(messages.legislativePropositionTagNotFound);
                                  } else {
                                    return result.legislativePropositionTag;
                                  }
                           }).catch(function(error) {
                              $ctrl.setErrorMessage(error.message);
                              throw error;
                           });
                }
             }
        });

        $ctrl.editLegislativePropositionTagModalInstance.result.then(function (message) {
           $ctrl.refresh(message);
        }, function(reason) {
           //dimissed window
           if(reason === 'remove') {
                $uibModal.open({
                  templateUrl: 'tpl/camara/includes/confirm.html',
                  animation: false,
                  size: 'md',
                  controller: 'ConfirmModalInstanceController',
                  controllerAs: '$modalCtrl',
                  scope: $scope,
                  resolve: {
                     texts: {
                        'message': _templateMessage( messages.legislativePropositionTagRemoveDialogText,
                                                     { 'description':  dataRowEntity.description })
                     }
                  }
               }).result.then(function() {
                  LegislativePropositionTagsService
                                      .deleteLegislativePropositionTag(dataRowEntity._id)
                                      .then(function(result) {
                                         $ctrl.refresh( _templateMessage( messages.legislativePropositionTagRemoved,
                                                                          { 'description':  dataRowEntity.description }));
                                       }).catch(function(error) {
                                         $ctrl.setErrorMessage(error.message);
                                       });
               });
           }
        });
     }

   }

})();
