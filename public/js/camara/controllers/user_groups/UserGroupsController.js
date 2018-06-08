(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('UserGroupsController', UserGroupsController);

   UserGroupsController.$inject = [ '$scope', 'UserGroupService',
                                    'Utils', 'messages', '$uibModal']
   function UserGroupsController( $scope, UserGroupService,
                                  Utils, messages, $uibModal ) {
      var $ctrl = this;

      //function for template messages
      var _templateMessage = function(messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _extractUserGroupModel = function(nodeScope) {
         var userGroupModel = _.clone(nodeScope.$modelValue);
         //flatten the children and roles properties

         //children
         if(userGroupModel.children) {
            var children = [];
            var i;
            for(i = 0; i < userGroupModel.children.length; i++) {
               if(userGroupModel.children[i]) {
                  children.push(userGroupModel.children[i]._id);
               }
            }
            userGroupModel.children = children;
         }

         //roles
         if(userGroupModel.roles) {
            var roles = [];
            var i;
            for(i = 0; i < userGroupModel.roles.length; i++) {
               if(userGroupModel.roles[i]) {
                  roles.push(userGroupModel.roles[i]._id);
               }
            }
            userGroupModel.roles = roles;
         }

         return userGroupModel;
      }

      //messages control
      Utils.applyMessageControls($ctrl);

      $ctrl.groupsToggleStatus = {}; //it stores the collapsed status odf the nodes
      $ctrl.defaultCollapsedStatus = true; //default collapsed status

      //refresh the tree, get tha data from API
      $ctrl.refresh = function () {
         return UserGroupService.getGroupsTree().then(function(result){
            $ctrl.userGroupsTree = result.userGroupsTree;
         });
      }

      //load the user group tree with the API data
      App.blockUI();
      $ctrl.refresh().catch(function(err) {
         $ctrl.setErrorMessage(err.message);
      }).finally(function() {
         App.unblockUI();
      });

      $ctrl.removeRole = function (scope) {
         var groupName = scope.$parentNodeScope.$modelValue.name;
         var roleName = scope.$modelValue.name;
         //confirm modal
         var message = _templateMessage( messages.roleRemoveFromGroupConfirm,
                                         { 'roleName': roleName,
                                           'groupName': groupName });
         $uibModal.open({
           templateUrl: 'tpl/camara/includes/confirm.html',
           animation: false,
           size: 'md',
           controller: 'ConfirmModalInstanceController',
           controllerAs: '$modalCtrl',
           scope: $scope,
           resolve: {
              texts: {
                 'message': message
              }
           }
        }).result.then(function() {
           App.blockUI();
           scope.remove();
           UserGroupService.saveGroup(_extractUserGroupModel(scope.$parentNodeScope)).then(function(result) {
              $ctrl.setMessage( _templateMessage( messages.roleRemoveFromGroup,
                                                  { 'roleName': roleName,
                                                    'groupName': groupName }));
              return $ctrl.refresh();
           }).catch(function(err) {
              $ctrl.setErrorMessage(err.message);
           }).finally(function() {
              App.unblockUI();
           });
        });

      };

      $ctrl.removeGroup = function (scope) {
         var groupName = scope.$modelValue.name;
         //confirm modal
         var message = _templateMessage( messages.userGroupRemoveConfirm,
                                         { 'groupName': groupName });
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': message
               }
            }
         }).result.then(function() {
            App.blockUI();
            scope.remove();
            UserGroupService.deleteDeeplyGroup(scope.$modelValue._id).then(function(result) {
               if(scope.$parentNodeScope) {
                  return UserGroupService.saveGroup(_extractUserGroupModel(scope.$parentNodeScope));
               } else {
                  return result;
               }
            }).then(function(result) {
               $ctrl.setMessage( _templateMessage( messages.userGroupRemoved,
                                                   { 'groupName': groupName }));
               return $ctrl.refresh();
            }).catch(function(err) {
               $ctrl.setErrorMessage(err.message);
            }).finally(function() {
               App.unblockUI();
            });
         });
      }

      $ctrl.toggle = function (scope) {
         $ctrl.groupsToggleStatus[scope.$modelValue._id] = !$ctrl.isCollapsed(scope.$modelValue);
      }

      //check the collapsed status of an user group node
      $ctrl.isCollapsed = function(userGroup) {
         if($ctrl.groupsToggleStatus[userGroup._id] === undefined) {
            return $ctrl.defaultCollapsedStatus; //default status
         } else {
            return $ctrl.groupsToggleStatus[userGroup._id];
         }
      }

      //set the collapsed status for all nodes
      var setAllCollapsedStatus = function(status) {
         Object.keys($ctrl.groupsToggleStatus).forEach(function(key) {
            $ctrl.groupsToggleStatus[key] = status;
         });
      }

      //collapse all nodes
      $ctrl.collapseAll = function () {
         $ctrl.defaultCollapsedStatus = true;
         setAllCollapsedStatus(true);
      };

      //expand all nodes
      $ctrl.expandAll = function () {
         $ctrl.defaultCollapsedStatus = false;
         setAllCollapsedStatus(false);
      };

      $ctrl.newSubgroup = function (scope) {
         if(scope && scope.$modelValue) {

            var parentGroup = _extractUserGroupModel(scope);

            $ctrl.newSubgroupModalContent = $uibModal.open( {
               templateUrl: 'newSubgroupModalContent.html',
               animation: false,
               size: 'md',
               controller: 'NewSubgroupModalInstanceController',
               controllerAs: '$modalCtrl',
               scope: $scope,
               resolve: {
                'parentGroup': parentGroup
               }
            });

            $ctrl.newSubgroupModalContent.result.then(function(message) {
               $ctrl.setMessage(message);
               $ctrl.refresh().finally(function() {
                  App.unblockUI();
               });
            });

         }
     }

     $ctrl.addRole = function (scope) {
        if(scope && scope.$modelValue) {

           var parentGroup = _extractUserGroupModel(scope);

           $ctrl.addRoleToGroupModalContent = $uibModal.open({
             templateUrl: 'addRoleModalContent.html',
             animation: false,
             size: 'md',
             controller: 'AddRoleToGroupModalInstanceController',
             controllerAs: '$modalCtrl',
             scope: $scope,
             resolve: {
               'parentGroup': parentGroup
             }
           });

           $ctrl.addRoleToGroupModalContent.result.then(function(message) {
             $ctrl.setMessage(message);
             $ctrl.refresh().finally(function() {
                 App.unblockUI();
             });
           });
        }
     }

     //retrive the users from API data. It is used by the
     //Show Users Modal Window
     var _getUsersPromise = function (group) {
           return UserGroupService.getUsers(group._id)
                                 .then(function(result) {
                                    return result.users;
                                 }).catch(function(err) {
                                    $ctrl.setErrorMessage(err.message);
                                    throw err;
                                 }).finally(function() {
                                    App.unblockUI();
                                 });
     }

     $ctrl.showUsers = function (scope) {
        if (scope && scope.$modelValue) {

           var group = _extractUserGroupModel(scope);
           App.blockUI();
           $ctrl.showUsersModalContent = $uibModal.open({
             templateUrl: 'showUsersModalContent.html',
             animation: false,
             size: 'lg',
             controller: 'ShowUsersInTheGroupModalInstanceController',
             controllerAs: '$modalCtrl',
             scope: $scope,
             resolve: {
               'group': group,
               'users': _getUsersPromise(group)
             }
           });

           $ctrl.showUsersModalContent.result.then(function(message) {
             $ctrl.setMessage(message);
             $ctrl.refresh().finally(function() {
                 App.unblockUI();
             });
          }, function () {
             //modal dismissed
             App.unblockUI();
          });
        }
     }

     $ctrl.newRootGroup = function (scope) {
           $ctrl.newRootGroupModalContent = $uibModal.open({
              templateUrl: 'newRootGroupModalContent.html',
              animation: false,
              size: 'md',
              controller: 'NewRootGroupModalInstanceController',
              controllerAs: '$modalCtrl',
              scope: $scope
           });

           $ctrl.newRootGroupModalContent.result.then(function(message) {
              $ctrl.setMessage(message);
              $ctrl.refresh().finally(function() {
                  App.unblockUI();
              });
           });
     }

     $ctrl.editGroupName = function (scope) {
        if (scope && scope.$modelValue) {
           var group = _extractUserGroupModel(scope);

           var parentGroup = null;
           if(scope.$parentNodeScope) {
              parentGroup = _extractUserGroupModel(scope.$parentNodeScope);
           }

           $ctrl.editGroupNameModalContent = $uibModal.open( {
              templateUrl: 'editGroupNameModalContent.html',
              animation: false,
              size: 'md',
              controller: 'EditGroupNameModalInstanceController',
              controllerAs: '$modalCtrl',
              scope: $scope,
              resolve: {
                'group': group,
                'parentGroup': parentGroup
              }
           });

           $ctrl.editGroupNameModalContent.result.then(function(message) {
              $ctrl.setMessage(message);
              $ctrl.refresh().finally(function() {
                  App.unblockUI();
              });
           });
        }
     }

  }

})();
