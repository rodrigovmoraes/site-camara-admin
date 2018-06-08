(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('PortalNewRootMenuItemModalInstanceController', PortalNewRootMenuItemModalInstanceController);

   PortalNewRootMenuItemModalInstanceController.$inject = [ '$state', '$scope',
                                                            'MenuPortalService', 'messages',
                                                            'Utils', '$uibModal' ];
   function PortalNewRootMenuItemModalInstanceController( $state, $scope,
                                                          MenuPortalService, messages,
                                                          Utils, $uibModal ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //form data
      $modalCtrl.title = "";
      $modalCtrl.url = "";
      $modalCtrl.accessConfig = false;

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

      $modalCtrl.getAccessCallback = function(returnedRootMenuItem, valid) {
         if(valid) {
            MenuPortalService.newMenuItem(returnedRootMenuItem).then(function(result) {
               $state.go('menuPortal.list', { infoMessage: _templateMessage( messages.portalNewRootMenuItem,
                                                                            { 'title': returnedRootMenuItem.title }) });
            }).catch(function(err) {
               $modalCtrl.setErrorMessage(err.message);
               App.unblockUI();
            });
         }
      }

      $modalCtrl.isValid = function() {
         return $modalCtrl.newRootMenuItemForm.$valid &&
                     (!$modalCtrl.accessConfig || _checkAccessInput);
      }

      $modalCtrl.ok = function () {
         $modalCtrl.newRootMenuItemForm.$setSubmitted();
         if ($modalCtrl.isValid()) {
            //set menu item object
            var rootMenuItem = {};
            rootMenuItem.title = $modalCtrl.title;
            rootMenuItem.url = $modalCtrl.url;
            rootMenuItem.isRoot = true;
            App.blockUI();
            if($modalCtrl.accessConfig) {
               $scope.$broadcast('request-access-property', rootMenuItem);
            } else {
               delete rootMenuItem.type;
               delete rootMenuItem.access;
               $modalCtrl.getAccessCallback(rootMenuItem, true);
            }
         }
      }
   }
})();
