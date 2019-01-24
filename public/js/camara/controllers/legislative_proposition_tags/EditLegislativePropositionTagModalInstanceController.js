(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditLegislativePropositionTagModalInstanceController', EditLegislativePropositionTagModalInstanceController);

   EditLegislativePropositionTagModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                                    'LegislativePropositionTagsService',
                                                                    'messages', 'Utils', 'legislativePropositionTag'];
   function EditLegislativePropositionTagModalInstanceController( $uibModalInstance, $scope,
                                                                  LegislativePropositionTagsService,
                                                                  messages, Utils, legislativePropositionTag ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _oldDescription = legislativePropositionTag.description;

      $modalCtrl.legislativePropositionTag = legislativePropositionTag;
      $modalCtrl.description = legislativePropositionTag.description;
      $modalCtrl.legislativePropositionTypesDescription = legislativePropositionTag.propositionType.description;

      $modalCtrl.uniqueDescriptionValidator = function() {
         var description = $scope.editLegislativePropositionTagForm.description.$viewValue;
         var legislativePropositionType = legislativePropositionTag.propositionType;
         //dont´t check if the description has not been changed
         if(description && legislativePropositionType && _oldDescription !== description) {
            return LegislativePropositionTagsService.checkUniqueDescription(legislativePropositionType._id, description);
         } else {
            return true;
         }
      }

      //form validation
      $modalCtrl.isValid = function() {
         return $scope.editLegislativePropositionTagForm.$valid;
      }

      //modal controls
      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.ok = function() {
         $scope.editLegislativePropositionTagForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            var editedLegislativePropositionTag = {
               "id": legislativePropositionTag._id,
               "description" : $modalCtrl.description
            }

            LegislativePropositionTagsService
               .saveLegislativePropositionTag(editedLegislativePropositionTag)
               .then(function(result) {
                  $uibModalInstance.close( _templateMessage( messages.legislativePropositionTagChanged ) );
               }).catch(function(error){
                  $modalCtrl.errorMessage = error.message;
               });
         }
      }

      $modalCtrl.remove = function() {
         $uibModalInstance.dismiss('remove');
      }
   }
})();
