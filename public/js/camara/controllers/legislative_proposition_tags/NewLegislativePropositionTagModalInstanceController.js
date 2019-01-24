(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewLegislativePropositionTagModalInstanceController', NewLegislativePropositionTagModalInstanceController);

   NewLegislativePropositionTagModalInstanceController.$inject = [ '$uibModalInstance', '$scope',
                                                                   'LegislativePropositionTagsService',
                                                                   'messages', 'Utils', 'legislativePropositionTypes'];
   function NewLegislativePropositionTagModalInstanceController( $uibModalInstance, $scope,
                                                                 LegislativePropositionTagsService,
                                                                 messages, Utils, legislativePropositionTypes ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.description = null;
      $modalCtrl.legislativePropositionTypes = legislativePropositionTypes;
      $modalCtrl.legislativePropositionTypesDescription = null;

      $modalCtrl.uniqueDescriptionValidator = function() {
         var description = $scope.newLegislativePropositionTagForm.description.$viewValue;
         var legislativePropositionType = $modalCtrl.selectedType;
         if(description && legislativePropositionType) {
            return LegislativePropositionTagsService.checkUniqueDescription(legislativePropositionType._id, description);
         } else {
            return true;
         }
      }

      //form validation
      $modalCtrl.isValid = function() {
         return $scope.newLegislativePropositionTagForm.$valid;
      }

      //modal controls
      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.ok = function () {
         $scope.newLegislativePropositionTagForm.$setSubmitted();
         if($modalCtrl.isValid()) {
            var newLegislativePropositionTag = {
               "description": $modalCtrl.description,
               "propositionType": $modalCtrl.selectedType._id
            }

            LegislativePropositionTagsService
               .newLegislativePropositionTag(newLegislativePropositionTag)
               .then(function(result) {
                  $uibModalInstance.close( {
                     message: _templateMessage( messages.legislativePropositionTagCreated ),
                     id: result.id
                  });
               }).catch(function(error){
                  $modalCtrl.errorMessage = error.message;
               });

         }
      }
   }
})();
