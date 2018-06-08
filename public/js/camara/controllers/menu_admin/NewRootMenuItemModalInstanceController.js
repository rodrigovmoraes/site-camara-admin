(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewRootMenuItemModalInstanceController', NewRootMenuItemModalInstanceController);

   NewRootMenuItemModalInstanceController.$inject = [ '$scope', 'MenuAdminService',
                                                      'messages', 'Utils',
                                                      'GlyphiconsService', 'SecurityRoleService', '$state'
                                                    ];
   function NewRootMenuItemModalInstanceController( $scope, MenuAdminService,
                                                    messages, Utils,
                                                    GlyphiconsService, SecurityRoleService, $state
                                                  ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      SecurityRoleService.getSecurityRoles().then(function(result) {
         $modalCtrl.roles = result.securityRoles;
      }).catch(function(error) {
         $modalCtrl.errorMessage = error.message;
      });

      //form data
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
         return $scope.newRootMenuItemForm.$valid;
      }

      $modalCtrl.ok = function () {
         $scope.newRootMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
            var rootMenuItem = {};
            rootMenuItem.title = $modalCtrl.title;
            rootMenuItem.sref = $modalCtrl.sref;
            rootMenuItem.role = $modalCtrl.selectedRole;
            rootMenuItem.icon = $modalCtrl.selectedIcon;
            rootMenuItem.isRoot = true;
            App.blockUI();
            MenuAdminService.newMenuItem(rootMenuItem).then(function(result) {
               $state.go('menuAdmin.list', { infoMessage: _templateMessage( messages.newRootMenuItem,
                                                                            { 'title': rootMenuItem.title }) });

            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }
   }
})();
