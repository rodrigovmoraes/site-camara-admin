(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('UsersController', UsersController);

   UsersController.$inject = [ 'HttpDispatcherService', 'UserService',
                               '$scope', 'uiGridConstants',
                               'Utils', 'GridUtils',
                               'messages', '$uibModal' ]
   function UsersController( HttpDispatcherService, UserService,
                             $scope, uiGridConstants,
                             Utils, GridUtils,
                             messages, $uibModal ) {
      var $ctrl = this;

      //messages control
      Utils.applyMessageControls($ctrl);

      $ctrl.openNewUserModal = function() {
         $ctrl.newUserModalInstance = $uibModal.open({
           templateUrl: 'newUserModalContent.html',
           animation: false,
           size: 'l',
           controller: 'NewUserModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope
         });

         $ctrl.newUserModalInstance.result.then(function(params) {
            var message = params.message;
            var id = params.id;

            $ctrl.paginationOptions.filtering = [{ "field": "_id",
                                                    "type": "string",
                                                    "term": id,
                                                    "filterType": "select"
                                                }];
            $ctrl.refresh(message);
         });
      }

      GridUtils.applyGrid($scope, $ctrl, {
         columnDefs:
             [
                {  name: 'Usuário', field: 'username', enableFiltering: true },
                {  name: 'E-mail', field: 'email', enableFiltering: true },
                {  name: 'Grupo Primário', field: 'primaryGroup', enableFiltering: true, cellTemplate: GridUtils.columnFieldTemplate('completeName'),
                   filter: {
                     type: uiGridConstants.filter.SELECT,
                     selectOptions: []
                   }
                },
                { name: 'Data de Criação', field: 'creationDate', enableFiltering: true,
                  cellFilter: 'date:"dd/MM/yyyy"', filterCellFiltered: false, sortCellFiltered: false, type:'date',
                  filter: { term: [undefined, undefined] },
                  filterHeaderTemplate: GridUtils.filterHeaderTemplate()
                },
                { name: 'Estado', field: 'status', enableFiltering: true, cellTemplate: GridUtils.booleanColumnTemplate("Habilitado", "Desabilitado"),
                  filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'Habilitado'},
                                     { value: false, label: 'Desabilitado'}
                                   ]
                  }
               },
               { name: ' ', enableFiltering: false, enableColumnMenu: false, enableSorting: false,
                 cellTemplate: GridUtils.editButtonCellTemplate("grid.appScope.$ctrl.handleEditUser(row.entity)")
               }
             ]
     }, function(page, pageSize, message) {

        App.blockUI();
        UserService.getUsers($ctrl.paginationOptions).then(function(result) {
           if(!result.totalLength) {
             //data hasn´t been returned
             $ctrl.setWarnMessage(messages.usersNotFound);
             GridUtils.setDataNotFound($ctrl);
           } else {
             //update data
             GridUtils.setFoundData($ctrl, result.users, result.totalLength, pageSize, result.selectFilters);
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

     $ctrl.handleEditUser = function (dataRowEntity) {

        $ctrl.editUserModalInstance = $uibModal.open({
             templateUrl: 'editUserModalContent.html',
             animation: false,
             size: 'm',
             controller: 'EditUserModalInstanceController',
             controllerAs: '$modalCtrl',
             scope: $scope,
             resolve: {
                user: function() {
                   return UserService.getUser(dataRowEntity._id).then(function(result) {
                      if(!result.user) {
                        $ctrl.setErrorMessage(messages.userNotFound);
                        throw new Error(messages.userNotFound);
                      } else {
                        return result.user;
                      }
                  }).catch(function(error) {
                     $ctrl.setErrorMessage(error.message);
                     throw error;
                  });
                }
             }
        });

        $ctrl.editUserModalInstance.result.then(function (message) {
           $ctrl.refresh(message);
        }, function() {
           //dimissed window
        });
     }

   }

})();
