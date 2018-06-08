(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('PortalEditMenuItemModalInstanceController', PortalEditMenuItemModalInstanceController);

   PortalEditMenuItemModalInstanceController.$inject = [ '$scope', 'MenuPortalService', '$state',
                                                         'messages', 'Utils', 'menuItem' ];
   function PortalEditMenuItemModalInstanceController( $scope, MenuPortalService, $state,
                                                       messages, Utils, menuItem ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //form data
      $modalCtrl.menuItem = menuItem;
      $modalCtrl.title = menuItem.title;
      $modalCtrl.url = menuItem.url;
      $modalCtrl.accessConfig = menuItem.access ? true : false;

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
            MenuPortalService.saveMenuItem(returnedMenuItem).then(function(result) {
               $state.go('menuPortal.list', { infoMessage: _templateMessage( messages.portalMenuItemChanged,
                                                                             { 'title': returnedMenuItem.title }) });
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.editMenuItemForm.$valid &&
                     (!$modalCtrl.accessConfig || _checkAccessInput);
      }

      $modalCtrl.ok = function () {
         $modalCtrl.editMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
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
