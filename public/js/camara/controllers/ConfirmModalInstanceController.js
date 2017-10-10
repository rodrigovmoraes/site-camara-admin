(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ConfirmModalInstanceController', ConfirmModalInstanceController);

   ConfirmModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                              'UserService', 'UserGroupService',
                                              'messages', 'Utils', 'texts' ];
   function ConfirmModalInstanceController( $uibModalInstance, $scope,
                                            UserService, UserGroupService,
                                            messages, Utils, texts ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //texts
      if(texts.title) {
         $modalCtrl.title = texts.title;
      } else {
         $modalCtrl.title = messages.confirmDialogDefaultTitle;
      }
      if(texts.message) {
         $modalCtrl.message = texts.message;
      } else {
         $modalCtrl.text = messages.confirmDialogDefaultText;
      }

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.close = function () {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.ok = function () {
         $uibModalInstance.close();
      }
   }
})();
