(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditMenuItemModalInstanceController', EditMenuItemModalInstanceController);

   EditMenuItemModalInstanceController.$inject = [ '$scope', 'MenuAdminService',
                                                   'messages', 'Utils', 'GlyphiconsService',
                                                   'menuItem', 'SecurityRoleService', '$state' ];
   function EditMenuItemModalInstanceController( $scope,  MenuAdminService,
                                                 messages, Utils, GlyphiconsService,
                                                 menuItem, SecurityRoleService, $state ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      SecurityRoleService.getSecurityRoles().then(function(result) {
         $modalCtrl.roles = result.securityRoles;
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      //form data
      $modalCtrl.menuItem = menuItem;
      $modalCtrl.title = menuItem.title;
      $modalCtrl.sref = menuItem.sref;
      $modalCtrl.selectedRole = menuItem.role;
      $modalCtrl.selectedIcon = menuItem.icon;
      $modalCtrl.menuItemsIcons = GlyphiconsService.getIconClasses();

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.close = function() {
         $state.go('menuAdmin.list');
      }

      $modalCtrl.isValid = function() {
         return $scope.editMenuItemForm.$valid;
      }

      $modalCtrl.ok = function () {
         $scope.editMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
            menuItem.title = $modalCtrl.title;
            menuItem.sref = $modalCtrl.sref;
            menuItem.icon = $modalCtrl.selectedIcon;
            menuItem.role = $modalCtrl.selectedRole ? $modalCtrl.selectedRole._id : null;
            App.blockUI();
            MenuAdminService.saveMenuItem(menuItem).then(function(result) {
               $state.go('menuAdmin.list', { infoMessage: _templateMessage( messages.menuItemChanged,
                                                                            { 'title': menuItem.title,
                                                                              'sref':  menuItem.sref }) });

            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
