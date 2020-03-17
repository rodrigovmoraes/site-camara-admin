(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewLegislativePropositionController', NewLegislativePropositionController);

   NewLegislativePropositionController.$inject = [ '$scope', 'messages',
                                                   'Utils', '$state',
                                                   'LegislativePropositionService', 'LegislativePropositionTagsService',
                                                   'legislativePropositionTypes',
                                                   '$filter', 'settings', '$uibModal' ];
   function NewLegislativePropositionController( $scope, messages,
                                                 Utils, $state,
                                                 LegislativePropositionService, LegislativePropositionTagsService,
                                                 legislativePropositionTypes,
                                                 $filter, settings, $uibModal ) {
      var $newLegislativePropositionCtrl = this;

      //filter options used in the list of the licitacoes
      var _filterOptions = LegislativePropositionService.getFilterOptions();

      //messages control
      Utils.applyMessageControls($newLegislativePropositionCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $newLegislativePropositionCtrl.formatLegislativeProcessNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      //return the actual date, set seconds and milliseconds to 0
      var _getNow = function() {
         var now = new Date();
         now.setMilliseconds(0);
         now.setSeconds(0);
         return now;
      }

      var _updateTypeSelected = function(selectedType) {
         return LegislativePropositionService
                 .getNextNumberOfTheType(selectedType._id)
                 .then(function(result) {
                    $newLegislativePropositionCtrl.number = result.nextNumber;
                    return LegislativePropositionTagsService.getLegislativePropositionTags(selectedType._id);
                 }).then(function(result) {
                    $newLegislativePropositionCtrl.legislativePropositionTags = result.legislativePropositionTags;
                    $newLegislativePropositionCtrl.selectedTags = null;
                    if (selectedType.code === 1) {
                       //retrieve relationship types
                       return true;
                    } else {
                       //don´t retrieve relationship types
                       return false;
                    }
                 }).then(function(retrieveRelationshipTypes) {
                    if(retrieveRelationshipTypes) {
                       return LegislativePropositionService.getLegislativePropositionRelationshipTypes();
                    } else {
                       return null;
                    }
                 }).then(function(result) {
                    if(result) {
                       $newLegislativePropositionCtrl.legislativePropositionRelationshipTypes = result.legislativePropositionRelationshipTypes;
                       $newLegislativePropositionCtrl.selectedRelationshipType = null;
                       $newLegislativePropositionCtrl.relationshipsToBeIncluded = [];
                    }
                 }).catch(function(error) {
                    $newLegislativePropositionCtrl.errorMessage = error.message;
                 });
      }

      var _extractTagsIds = function(tags) {
         var tagsIds = [];
         if (tags) {
            var i;
            for(i = 0; i < tags.length; i++) {
               tagsIds.push(tags[i]._id);
            }
         }
         return tagsIds;
      }

      var _extractRelationshipIds = function(relationships) {
         var relationshipsIds = [];
         if (relationships) {
            var i;
            for(i = 0; i < relationships.length; i++) {
               var relationship = relationships[i];
               relationshipsIds.push({
                  'type': relationship.type._id,
                  'otherLegislativeProposition': relationship.otherLegislativeProposition._id
               });
            }
         }
         return relationshipsIds;
      }

      //news data
      var _now = _getNow();

      $newLegislativePropositionCtrl.isGeneralTabActive = true;
      $newLegislativePropositionCtrl.isConsolidationTabActive = false;
      $newLegislativePropositionCtrl.isRelationshipsTabActive = false;
      $newLegislativePropositionCtrl.selectedType = null;
      $newLegislativePropositionCtrl.number = null;
      $newLegislativePropositionCtrl.date = null;
      $newLegislativePropositionCtrl.description = null;
      $newLegislativePropositionCtrl.text = null;
      $newLegislativePropositionCtrl.textAttachment = null;
      $newLegislativePropositionCtrl.selectedTags = null;
      $newLegislativePropositionCtrl.consolidatedText = null;
      $newLegislativePropositionCtrl.consolidatedTextAttachment = null;
      $newLegislativePropositionCtrl.legislativePropositionTypes = legislativePropositionTypes;
      $newLegislativePropositionCtrl.legislativePropositionTags = null;
      $newLegislativePropositionCtrl.selectedRelationshipType = null;
      $newLegislativePropositionCtrl.relationshipsToBeIncluded = [];
      $newLegislativePropositionCtrl.legislativePropositionRelationshipTypes = null;
      $newLegislativePropositionCtrl.relationshipTypeNotEntered = false;
      $newLegislativePropositionCtrl.legislativeProcess = null;
      //select the first legislative proposition type
      if( $newLegislativePropositionCtrl.legislativePropositionTypes &&
          $newLegislativePropositionCtrl.legislativePropositionTypes.length > 0 ) {
               $newLegislativePropositionCtrl.selectedType = $newLegislativePropositionCtrl.legislativePropositionTypes[0];
               _updateTypeSelected($newLegislativePropositionCtrl.selectedType);
      }

      $newLegislativePropositionCtrl.formatLegislativePropositionNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      $newLegislativePropositionCtrl.textFroalaOptions = {
         fontFamily: {
            'Calibri,sans-serif': 'Calibri',
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
         },
         height: 300,
         placeholderText: messages.legislativePropositionEnterText,
         toolbarButtons: [ 'fullscreen', 'bold', 'italic', 'underline',
                           'strikeThrough', 'subscript', 'superscript', '|',
                           'fontFamily', 'fontSize', 'color', 'inlineClass',
                           'inlineStyle', 'paragraphStyle', 'lineHeight', '|',
                           'paragraphFormat', 'align', 'formatOL', 'formatUL',
                           'outdent', 'indent', 'quote', '-', 'insertLink',
                           'insertImage', 'insertFile', 'insertTable', '|',
                           'emoticons', 'insertHR', 'clearFormatting', '|',
                           'html', '|', 'undo', 'redo', '|', 'camaraSelectLegislativeProposition' ],
         pasteAllowLocalImages: false,
         pasteDeniedAttrs: [],
         pasteDeniedTags: [],
         pastePlain: false,
         wordAllowedStyleProps: ['font-family', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color', 'padding', 'margin', 'height', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'text-decoration', 'font-weight', 'font-style', 'text-indent', 'border', 'border-.*'],
         wordDeniedAttrs: [],
         wordDeniedTags: [],
         wordPasteModal: false,
         wordPasteKeepFormatting: true,
         imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
         fileUploadParam: 'file',
         fileUploadMethod: 'PUT',
         fileUploadURL: LegislativePropositionService.getUploadWysiwygTextFileAttachmentURL(),
         fileMaxSize: 1024 * 1024 * 100, //100MB
         imageUploadMethod: 'PUT',
         imageUploadParam: 'file',
         imageUploadURL:  LegislativePropositionService.getUploadWysiwygTextFileImageAttachmentURL(),
         imageMaxSize: 1024 * 1024 * 10, //10MB
         videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoDisplay', 'videoAlign', 'videoSize', '|', 'makeVideoResponsive'],
         requestHeaders: {
             Authorization: Utils.getAuthorizationHeader()
         }
      };

      $newLegislativePropositionCtrl.textAttachmentFroalaOptions = {
         fontFamily: {
            'Calibri,sans-serif': 'Calibri',
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
         },
         height: 300,
         placeholderText: messages.legislativePropositionEnterTexAttachment,
         toolbarButtons: [ 'fullscreen', 'bold', 'italic', 'underline',
                           'strikeThrough', 'subscript', 'superscript', '|',
                           'fontFamily', 'fontSize', 'color', 'inlineClass',
                           'inlineStyle', 'paragraphStyle', 'lineHeight', '|',
                           'paragraphFormat', 'align', 'formatOL', 'formatUL',
                           'outdent', 'indent', 'quote', '-', 'insertLink',
                           'insertImage', 'insertFile', 'insertTable', '|',
                           'emoticons', 'insertHR', 'clearFormatting', '|',
                           'html', '|', 'undo', 'redo', '|', 'camaraSelectLegislativeProposition' ],
         imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
         pasteAllowLocalImages: false,
         pasteDeniedAttrs: [],
         pasteDeniedTags: [],
         pastePlain: false,
         wordAllowedStyleProps: ['font-family', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color', 'padding', 'margin', 'height', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'text-decoration', 'font-weight', 'font-style', 'text-indent', 'border', 'border-.*'],
         wordDeniedAttrs: [],
         wordDeniedTags: [],
         wordPasteModal: false,
         wordPasteKeepFormatting: true,
         fileUploadParam: 'file',
         fileUploadMethod: 'PUT',
         fileUploadURL: LegislativePropositionService.getUploadWysiwygTextAttachmentFileAttachmentURL(),
         fileMaxSize: 1024 * 1024 * 100, //100MB
         imageUploadMethod: 'PUT',
         imageUploadParam: 'file',
         imageUploadURL:  LegislativePropositionService.getUploadWysiwygTextAttachmentFileImageAttachmentURL(),
         imageMaxSize: 1024 * 1024 * 10, //10MB
         videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoDisplay', 'videoAlign', 'videoSize', '|', 'makeVideoResponsive'],
         requestHeaders: {
             Authorization: Utils.getAuthorizationHeader()
         }
      };

      $newLegislativePropositionCtrl.consolidatedTextFroalaOptions = {
         fontFamily: {
            'Calibri,sans-serif': 'Calibri',
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
         },
         height: 300,
         placeholderText: messages.legislativePropositionEnterConsolidatedText,
         toolbarButtons: [ 'fullscreen', 'bold', 'italic', 'underline',
                           'strikeThrough', 'subscript', 'superscript', '|',
                           'fontFamily', 'fontSize', 'color', 'inlineClass',
                           'inlineStyle', 'paragraphStyle', 'lineHeight', '|',
                           'paragraphFormat', 'align', 'formatOL', 'formatUL',
                           'outdent', 'indent', 'quote', '-', 'insertLink',
                           'insertImage', 'insertFile', 'insertTable', '|',
                           'emoticons', 'insertHR', 'clearFormatting', '|',
                           'html', '|', 'undo', 'redo', '|', 'camaraSelectLegislativeProposition' ],
         imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
         pasteAllowLocalImages: false,
         pasteDeniedAttrs: [],
         pasteDeniedTags: [],
         pastePlain: false,
         wordAllowedStyleProps: ['font-family', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color', 'padding', 'margin', 'height', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'text-decoration', 'font-weight', 'font-style', 'text-indent', 'border', 'border-.*'],
         wordDeniedAttrs: [],
         wordDeniedTags: [],
         wordPasteModal: false,
         wordPasteKeepFormatting: true,
         fileUploadParam: 'file',
         fileUploadMethod: 'PUT',
         fileUploadURL: LegislativePropositionService.getUploadWysiwygConsolidatedTextFileAttachmentURL(),
         fileMaxSize: 1024 * 1024 * 100, //100MB
         imageUploadMethod: 'PUT',
         imageUploadParam: 'file',
         imageUploadURL:  LegislativePropositionService.getUploadWysiwygConsolidatedTextFileImageAttachmentURL(),
         imageMaxSize: 1024 * 1024 * 10, //10MB
         videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoDisplay', 'videoAlign', 'videoSize', '|', 'makeVideoResponsive'],
         requestHeaders: {
             Authorization: Utils.getAuthorizationHeader()
         }
      };

      $newLegislativePropositionCtrl.consolidatedTextAttachmentFroalaOptions = {
         fontFamily: {
            'Calibri,sans-serif': 'Calibri',
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            "'Times New Roman',Times,serif": 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana'
         },
         height: 300,
         placeholderText: messages.legislativePropositionEnterConsolidatedTexAttachment,
         toolbarButtons: [ 'fullscreen', 'bold', 'italic', 'underline',
                           'strikeThrough', 'subscript', 'superscript', '|',
                           'fontFamily', 'fontSize', 'color', 'inlineClass',
                           'inlineStyle', 'paragraphStyle', 'lineHeight', '|',
                           'paragraphFormat', 'align', 'formatOL', 'formatUL',
                           'outdent', 'indent', 'quote', '-', 'insertLink',
                           'insertImage', 'insertFile', 'insertTable', '|',
                           'emoticons', 'insertHR', 'clearFormatting', '|',
                           'html', '|', 'undo', 'redo', '|', 'camaraSelectLegislativeProposition' ],
         imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
         pasteAllowLocalImages: false,
         pasteDeniedAttrs: [],
         pasteDeniedTags: [],
         pastePlain: false,
         wordAllowedStyleProps: ['font-family', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color', 'padding', 'margin', 'height', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'text-decoration', 'font-weight', 'font-style', 'text-indent', 'border', 'border-.*'],
         wordDeniedAttrs: [],
         wordDeniedTags: [],
         wordPasteModal: false,
         wordPasteKeepFormatting: true,
         fileUploadParam: 'file',
         fileUploadMethod: 'PUT',
         fileUploadURL: LegislativePropositionService.getUploadWysiwygConsolidatedTextAttachmentFileAttachmentURL(),
         fileMaxSize: 1024 * 1024 * 100, //100MB
         imageUploadMethod: 'PUT',
         imageUploadParam: 'file',
         imageUploadURL:  LegislativePropositionService.getUploadWysiwygConsolidatedTextAttachmentFileImageAttachmentURL(),
         imageMaxSize: 1024 * 1024 * 10, //10MB
         videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoDisplay', 'videoAlign', 'videoSize', '|', 'makeVideoResponsive'],
         requestHeaders: {
             Authorization: Utils.getAuthorizationHeader()
         }
      };


      $newLegislativePropositionCtrl.setGeneralTabActive = function() {
         $newLegislativePropositionCtrl.isGeneralTabActive = true;
         $newLegislativePropositionCtrl.isConsolidationTabActive = false;
         $newLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $newLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
      }

      $newLegislativePropositionCtrl.setConsolidationTabActive = function() {
         $newLegislativePropositionCtrl.isGeneralTabActive = false;
         $newLegislativePropositionCtrl.isConsolidationTabActive = true;
         $newLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $newLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
      }

      $newLegislativePropositionCtrl.setRelationshipsTabActive = function() {
         $newLegislativePropositionCtrl.isGeneralTabActive = false;
         $newLegislativePropositionCtrl.isConsolidationTabActive = false;
         $newLegislativePropositionCtrl.isRelationshipsTabActive = true;
         $newLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
      }

      $newLegislativePropositionCtrl.setLegislativeProcessTabActive = function() {
         $newLegislativePropositionCtrl.isGeneralTabActive = false;
         $newLegislativePropositionCtrl.isConsolidationTabActive = false;
         $newLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $newLegislativePropositionCtrl.isLegislativeProcessTabActive = true;
      }

      $newLegislativePropositionCtrl.uniqueNumberValidator = function() {
         var legislativePropositionTypeId = $newLegislativePropositionCtrl.selectedType
                                                ? $newLegislativePropositionCtrl.selectedType._id
                                                : null;
         var number = $newLegislativePropositionCtrl.newLegislativePropositionForm.number.$viewValue;
         if(number && legislativePropositionTypeId) {
            return LegislativePropositionService.checkUniqueNumber(legislativePropositionTypeId, number);
         } else {
            return true;
         }
      }

      $newLegislativePropositionCtrl.addRelationship = function(relationshipType) {
         if(!relationshipType) {
            $newLegislativePropositionCtrl.relationshipTypeNotEntered = true;
         } else {
            $newLegislativePropositionCtrl.relationshipTypeNotEntered = false;
            $newLegislativePropositionCtrl.newRelationshipModalInstance = $uibModal.open({
                 templateUrl: 'views/legislative_proposition/new_relationship.html',
                 animation: false,
                 size: 'm',
                 controller: 'NewRelationshipModalInstanceController',
                 controllerAs: '$modalCtrl',
                 scope: $scope,
                 resolve: {
                    'relationshipType': $newLegislativePropositionCtrl.selectedRelationshipType,
                    'legislativePropositionType': $newLegislativePropositionCtrl.selectedType,
                    'relationships': {
                       'list': $newLegislativePropositionCtrl.relationshipsToBeIncluded
                    }
                 }
            });

            $newLegislativePropositionCtrl
               .newRelationshipModalInstance
               .result
               .then(function (result) {
                  $newLegislativePropositionCtrl.relationshipsToBeIncluded.push({
                     'type': result.type,
                     'otherLegislativeProposition': result.otherLegislativeProposition
                  })
               }, function() {
                     //dimissed window
               });
         }
      }

      $newLegislativePropositionCtrl.openSelectLegislativeProcessModal = function() {
         var selectLegislativeProcessModal = $uibModal.open({
                                          templateUrl: 'views/legislative_proposition/select-legislative-process.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectLegislativeProcessModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope
                                       });
         selectLegislativeProcessModal.result.then(function(legislativeProposition) {
            $newLegislativePropositionCtrl.legislativeProcess = legislativeProposition;
         });
      }

      $newLegislativePropositionCtrl.openSelectLegislativePropositionModal = function(froalaScope) {
         var selectLegislativePropositionModal = $uibModal.open({
                                          templateUrl: 'tpl/camara/froala/select-legislative-proposition.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectLegislativePropositionModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope,
                                          resolve: {
                                             'legislativePropositionType': $newLegislativePropositionCtrl.selectedType
                                          }
                                       });
         selectLegislativePropositionModal.result.then(function(legislativeProposition) {
            froalaScope.html.insert(legislativeProposition.typeDescription + "&nbsp;nº&nbsp;" + '<a href=\"' + settings.LegislativeProposition.froalaInsertLegislativePropositionUrlBase + legislativeProposition._id  + '\">' + legislativeProposition.number + "/" + legislativeProposition.year + '</a>');
         });
      }

      $newLegislativePropositionCtrl.isValid = function() {
         var formValid = $newLegislativePropositionCtrl.newLegislativePropositionForm.$valid;
         if(!formValid) {
            $newLegislativePropositionCtrl.setGeneralTabActive();
         }
         return formValid;
      }

      $newLegislativePropositionCtrl.save = function () {
         $newLegislativePropositionCtrl.newLegislativePropositionForm.$setSubmitted();
         if ($newLegislativePropositionCtrl.isValid()) {
            var legislativeProposition = {
               type: $newLegislativePropositionCtrl.selectedType._id,
               number: $newLegislativePropositionCtrl.number,
               date: $newLegislativePropositionCtrl.date,
               description: $newLegislativePropositionCtrl.description,
               text: $newLegislativePropositionCtrl.text,
               textAttachment: $newLegislativePropositionCtrl.textAttachment,
               tags: _extractTagsIds($newLegislativePropositionCtrl.selectedTags),
               consolidatedText: $newLegislativePropositionCtrl.consolidatedText,
               consolidatedTextAttachment: $newLegislativePropositionCtrl.consolidatedTextAttachment,
               relationships: _extractRelationshipIds($newLegislativePropositionCtrl.relationshipsToBeIncluded),
               fileAttachments: [],
               consolidatedFileAttachments: [],
               legislativeProcessId: $newLegislativePropositionCtrl.legislativeProcess ? $newLegislativePropositionCtrl.legislativeProcess.id : null
            };
            LegislativePropositionService
                        .newLegislativeProposition(legislativeProposition)
                        .then(function(result) {
                 _filterOptions.id = result.id;
                 $state.go('legislativeProposition.list', {
                     infoMessage: _templateMessage( messages.legislativePropositionCreated,
                                                    { 'number': legislativeProposition.number,
                                                      'year': legislativeProposition.year })
                 });
            }).catch(function(error) {
               $newLegislativePropositionCtrl.errorMessage = error.message;
            });
         }
      }

      $newLegislativePropositionCtrl.unlinkLegislativeProcess = function() {
         $newLegislativePropositionCtrl.legislativeProcess = null;
      }

      $newLegislativePropositionCtrl.removeRelationship = function(index) {
         if( $newLegislativePropositionCtrl.relationshipsToBeIncluded &&
             $newLegislativePropositionCtrl.relationshipsToBeIncluded.length > index ) {
               $newLegislativePropositionCtrl.relationshipsToBeIncluded.splice(index, 1);
         }
      }

      $newLegislativePropositionCtrl.close = function () {
         $state.go('legislativeProposition.list');
      }

      //legislative proposition type
      $scope.$watch("$newLegislativePropositionCtrl.selectedType", function (newValue, oldValue) {
         if(newValue != oldValue) {
            _updateTypeSelected($newLegislativePropositionCtrl.selectedType);
         }
      });
   }
})();
