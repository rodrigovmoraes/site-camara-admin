(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('PortalNewMenuItemModalInstanceController', PortalNewMenuItemModalInstanceController);

   PortalNewMenuItemModalInstanceController.$inject = [ '$state', '$scope',
                                                        'MenuPortalService', 'messages',
                                                        'Utils', 'parentMenuItem' ];
   function PortalNewMenuItemModalInstanceController( $state, $scope,
                                                      MenuPortalService, messages,
                                                      Utils, parentMenuItem ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //form data
      $modalCtrl.parentMenuItem = parentMenuItem;
      $modalCtrl.title = "";
      $modalCtrl.url = "";
      $modalCtrl.accessConfig = true;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.close = function() {
         $state.go('menuPortal.list');
      }

      var _checkAccessInput = false;

      $modalCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $modalCtrl.getAccessCallback = function(returnedMenuItem, valid) {
         if(valid) {
            MenuPortalService.newMenuItem(returnedMenuItem).then(function(result) {
               if(!parentMenuItem.menuItems) {
                  parentMenuItem.menuItems = [];
               }
               parentMenuItem.menuItems.unshift(result.id);
               return MenuPortalService.saveMenuItem(parentMenuItem);
            }).then(function(result) {
               $state.go('menuPortal.list', { infoMessage: _templateMessage( messages.portalNewMenuItem,
                                                        { 'title': returnedMenuItem.title,
                                                          'parentTitle':  parentMenuItem.title }) });
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.newMenuItemForm.$valid &&
                     (!$modalCtrl.accessConfig || _checkAccessInput);
      }

      $modalCtrl.ok = function () {
         $modalCtrl.newMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
            var menuItem = {};
            menuItem.title = $modalCtrl.title;
            menuItem.url = $modalCtrl.url;
            App.blockUI();
            if($modalCtrl.accessConfig) {
               $scope.$broadcast('request-access-property', menuItem);
            } else {
               delete menuItem.type;
               delete menuItem.access;
               $modalCtrl.getAccessCallback(menuItem, true);
            }
         }
      }
   }
})();
