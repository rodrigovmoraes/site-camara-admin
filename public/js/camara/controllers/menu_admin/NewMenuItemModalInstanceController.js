(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewMenuItemModalInstanceController', NewMenuItemModalInstanceController);

   NewMenuItemModalInstanceController.$inject = [ '$scope', 'MenuAdminService',
                                                  'messages', 'Utils', 'GlyphiconsService',
                                                  'parentMenuItem', 'SecurityRoleService', '$state' ];
   function NewMenuItemModalInstanceController( $scope, MenuAdminService,
                                                messages, Utils, GlyphiconsService,
                                                parentMenuItem, SecurityRoleService, $state ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      SecurityRoleService.getSecurityRoles().then(function(result) {
         $modalCtrl.roles = result.securityRoles;
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      //form data
      $modalCtrl.parentMenuItem = parentMenuItem;
      $modalCtrl.title = "";
      $modalCtrl.sref = "";
      $modalCtrl.selectedRole = null;
      $modalCtrl.selectedIcon = null;
      $modalCtrl.menuItemsIcons = GlyphiconsService.getIconClasses()

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.close = function() {
         $state.go('menuAdmin.list');
      }

      $modalCtrl.isValid = function() {
         return $scope.newMenuItemForm.$valid;
      }

      $modalCtrl.ok = function () {
         $scope.newMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
            var menuItem = {};
            menuItem.title = $modalCtrl.title;
            menuItem.sref = $modalCtrl.sref;
            menuItem.role = $modalCtrl.selectedRole ? $modalCtrl.selectedRole._id : null;
            menuItem.icon = $modalCtrl.selectedIcon;
            menuItem.isRoot = false;
            App.blockUI();
            MenuAdminService.newMenuItem(menuItem).then(function(result) {
               if(!parentMenuItem.menuItems) {
                  parentMenuItem.menuItems = [];
               }
               parentMenuItem.menuItems.unshift(result.id);
               return MenuAdminService.saveMenuItem(parentMenuItem);
            }).then(function(result) {
               $state.go('menuAdmin.list', { infoMessage: _templateMessage( messages.newMenuItem,
                                                        { 'title': menuItem.title,
                                                          'parentTitle':  parentMenuItem.title }) });
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
