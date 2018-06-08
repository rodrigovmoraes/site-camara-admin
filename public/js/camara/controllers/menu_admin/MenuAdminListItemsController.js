(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('MenuAdminListItemsController', MenuAdminListItemsController);

   MenuAdminListItemsController.$inject = [ '$scope', 'Utils',
                                            'MenuAdminService', 'messages',
                                            '$uibModal', '$stateParams', '$state']
   function MenuAdminListItemsController( $scope, Utils,
                                          MenuAdminService, messages,
                                          $uibModal, $stateParams, $state ) {
      var $ctrl = this;

      $ctrl.message = $stateParams.infoMessage;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages control
      Utils.applyMessageControls($ctrl);

      var _extractMenuItemModel = function(nodeScope) {
         var menuItemModel = _.clone(nodeScope.$modelValue);
         //flatten the children

         //children (menuItems)
         if(menuItemModel.menuItems) {
            var children = [];
            var i;
            for(i = 0; i < menuItemModel.menuItems.length; i++) {
               if(menuItemModel.menuItems[i]) {
                  children.push(menuItemModel.menuItems[i]._id);
               }
            }
            menuItemModel.menuItems = children;
         }

         return menuItemModel;
      }

      $ctrl.groupsToggleStatus = MenuAdminService.getGroupsToggleStatus();; //it stores the collapsed status of the nodes
      $ctrl.defaultCollapsedStatus = true; //default collapsed status

      //refresh the tree, get tha data from API
      $ctrl.refresh = function () {
         return MenuAdminService.getMenuAdminTree().then(function(result) {
            $ctrl.menuItemsTree = result.menuAdminTree;
         });
      }

      //load the menu items tree with the API data
      $ctrl.refresh().catch(function(err) {
         $ctrl.setErrorMessage(err.message);
      }).finally(function() {
         App.unblockUI();
      });

      $ctrl.toggle = function (scope) {
         $ctrl.groupsToggleStatus[scope.$modelValue._id] = !$ctrl.isCollapsed(scope.$modelValue);
      }

      //check the collapsed status of an item
      $ctrl.isCollapsed = function(menuItem) {
         if($ctrl.groupsToggleStatus[menuItem._id] === undefined) {
            return $ctrl.defaultCollapsedStatus; //default status
         } else {
            return $ctrl.groupsToggleStatus[menuItem._id];
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

      $ctrl.newSubMenuItem = function(parentMenuItem) {
         if(parentMenuItem) {
            $state.go('menuAdmin.newSub', { 'parentMenuItem': parentMenuItem });
         }
      }

      $ctrl.editMenuItem = function (menuItem) {
         if(menuItem) {
            $state.go('menuAdmin.edit', { 'menuItem': menuItem });
         }
      }

     $ctrl.removeMenuItem = function (scope) {
        var menuItemTitle = scope.$modelValue.title;
        //confirm modal
        var message = _templateMessage( messages.menuItemRemoveConfirm,
                                        { 'title': menuItemTitle });
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
           MenuAdminService.deleteDeeplyMenuItem(scope.$modelValue._id).then(function(result) {
              if(scope.$parentNodeScope) {
                 return MenuAdminService.saveMenuItem(_extractMenuItemModel(scope.$parentNodeScope));
              } else {
                 return result;
              }
           }).then(function(result) {
              $ctrl.setMessage( _templateMessage( messages.menuItemRemoved,
                                                  { 'title': menuItemTitle }));
              return $ctrl.refresh();
           }).catch(function(err) {
              $ctrl.setErrorMessage(err.message);
           }).finally(function() {
              App.unblockUI();
           });
        });
     }

     $ctrl.treeOptions = {

        dragStop : function (e) {
            var destNodeScope = e.dest.nodesScope.$nodeScope;
            var sourceNodeScope = e.source.nodeScope;
            var offset = e.dest.index;
            var menuItem = _extractMenuItemModel(sourceNodeScope);
            App.blockUI();

            if(destNodeScope) {
               //not root
               var destParentMenuItem = _extractMenuItemModel(destNodeScope);
               var sourceParentMenuItem = sourceNodeScope.$parentNodeScope ? _extractMenuItemModel(sourceNodeScope.$parentNodeScope) : null;

               MenuAdminService.saveMenuItem(destParentMenuItem)
                                 .then(function(result) {
                  if(sourceParentMenuItem) {
                     return MenuAdminService.saveMenuItem(sourceParentMenuItem);
                  } else {
                     //the source was in the root
                     menuItem.isRoot = false;
                     return MenuAdminService.saveMenuItem(menuItem);
                  }
               }).then(function(result) {
                  $ctrl.setMessage( _templateMessage( messages.menuItemMoved,
                                                     { 'title': menuItem.title }) );
                  return $ctrl.refresh();
               }).catch(function(err) {
                  $ctrl.setErrorMessage(err.message);
               }).finally(function() {
                  App.unblockUI();
               });
            } else {
               //root
               //now, the source is in the root
               menuItem.isRoot = true;
               menuItem.order = offset;
               MenuAdminService.saveMenuItem(menuItem).then(function(result) {
                  var sourceParentMenuItem = sourceNodeScope.$parentNodeScope ? _extractMenuItemModel(sourceNodeScope.$parentNodeScope) : null;
                  if(sourceParentMenuItem) {
                     return MenuAdminService.saveMenuItem(sourceParentMenuItem);
                  } else {
                     //the source was already in the root
                     //do nothing
                     return true;
                  }
               }).then(function(result) {
                  var menuItemsOrders = [];
                  var rootMenuItems = e.dest.nodesScope.$modelValue;
                  if(rootMenuItems) {
                     var i = 0;
                     rootMenuItems.forEach(function(rootMenuItem) {
                        menuItemsOrders.push( {
                           '_id': rootMenuItem._id,
                           'order': i
                        });
                        i++;
                     });
                  }
                  return MenuAdminService.updateMenuItemsOrders(menuItemsOrders);
               }).then(function(result) {
                  $ctrl.setMessage( _templateMessage( messages.menuItemMoved,
                                                    { 'title': menuItem.title }) );
                  return $ctrl.refresh();
               }).catch(function(err) {
                  $ctrl.setErrorMessage(err.message);
               }).finally(function() {
                  App.unblockUI();
               });

            }

        }

     }
  }

})();
