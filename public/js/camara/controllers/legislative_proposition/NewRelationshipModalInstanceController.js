(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewRelationshipModalInstanceController', NewRelationshipModalInstanceController);

   NewRelationshipModalInstanceController.$inject = [ '$scope', 'LegislativePropositionService',
                                                      'messages', 'Utils',
                                                      '$state', '$uibModalInstance',
                                                      'relationshipType', 'legislativePropositionType',
                                                      'relationships' ];
   function NewRelationshipModalInstanceController( $scope, LegislativePropositionService,
                                                    messages, Utils,
                                                    $state, $uibModalInstance,
                                                    relationshipType, legislativePropositionType,
                                                    relationships ) {
      var $modalCtrl = this;

      //messages control
      Utils.applyMessageControls($modalCtrl);

      var _clearNumberFieldMessages = function() {
         $modalCtrl.numberNotEntered = false;
         $modalCtrl.relationshipAlreadyExists = false;
         $modalCtrl.legislativePropositionNotFound = false;
      }

      var _checkIfRelationAlreadyExists = function(number) {
         if(relationships.list) {
            var i = 0;
            for( i = 0;
                 i < relationships.list.length > 0;
                 i++ ) {
                    var relation = relationships.list[i];
                    var type = relation.type;
                    var otherLegislativeProposition = relation.otherLegislativeProposition;
                    if ( type && otherLegislativeProposition &&
                         otherLegislativeProposition.number === number &&
                         otherLegislativeProposition.type === legislativePropositionType._id &&
                         relation.type._id === relationshipType._id ) {
                            return true;
                     }
            }
            return false;
         }
      }

      //form data
      $modalCtrl.number = null;
      _clearNumberFieldMessages();
      $modalCtrl.relationshipType = relationshipType;
      $modalCtrl.legislativePropositionType = legislativePropositionType;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.formatLegislativePropositionNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      $modalCtrl.searchLaw = function() {
         _clearNumberFieldMessages();
         if (!$modalCtrl.number || $modalCtrl.number <= 0) {
            $modalCtrl.numberNotEntered = true;
         } else if(_checkIfRelationAlreadyExists($modalCtrl.number)) {
            $modalCtrl.relationshipAlreadyExists = true;
         } else {
            return LegislativePropositionService
                  .getLegislativePropositionByNumber( $modalCtrl.number,
                                                      $modalCtrl.legislativePropositionType._id)
                  .then(function(result) {
                     if (!result.legislativeProposition) {
                        $modalCtrl.legislativePropositionNotFound = true;
                        $modalCtrl.legislativeProposition = null;
                     } else {
                        $modalCtrl.legislativeProposition = result.legislativeProposition;
                     }
                  }).catch(function(err) {
                     $modalCtrl.errorMessage = err.message;
                  });
         }
      }

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      }

      $modalCtrl.add = function () {
         if ($modalCtrl.legislativeProposition) {
            $uibModalInstance.close({
               'type': relationshipType,
               'otherLegislativeProposition': $modalCtrl.legislativeProposition
            });
         }
      }
   }
})();
