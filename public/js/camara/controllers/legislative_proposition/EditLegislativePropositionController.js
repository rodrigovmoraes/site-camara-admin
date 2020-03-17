(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditLegislativePropositionController', EditLegislativePropositionController);

   EditLegislativePropositionController.$inject = [ '$scope', 'messages',
                                                    'Utils', '$state',
                                                    'LegislativePropositionService',
                                                    'SyslegisService',
                                                    'LegislativePropositionTagsService',
                                                    'legislativePropositionTypes',
                                                    '$filter', 'settings',
                                                    '$uibModal', 'legislativeProposition',  ];
   function EditLegislativePropositionController( $scope, messages,
                                                  Utils, $state,
                                                  LegislativePropositionService,
                                                  SyslegisService,
                                                  LegislativePropositionTagsService,
                                                  legislativePropositionTypes,
                                                  $filter, settings,
                                                  $uibModal, legislativeProposition ) {
      var $editLegislativePropositionCtrl = this;

      //filter options used in the list of the licitacoes
      var _filterOptions = LegislativePropositionService.getFilterOptions();

      //messages control
      Utils.applyMessageControls($editLegislativePropositionCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $editLegislativePropositionCtrl.formatLegislativeProcessNumber = function(number, year) {
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
         return LegislativePropositionTagsService
                 .getLegislativePropositionTags(selectedType._id)
                 .then(function(result) {
                    $editLegislativePropositionCtrl.legislativePropositionTags = result.legislativePropositionTags;
                    $editLegislativePropositionCtrl.selectedTags = legislativeProposition.tags;
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
                       $editLegislativePropositionCtrl.legislativePropositionRelationshipTypes = result.legislativePropositionRelationshipTypes;
                       $editLegislativePropositionCtrl.selectedRelationshipType = null;
                       $editLegislativePropositionCtrl.relationshipsToBeIncluded = legislativeProposition.relationships;
                    }
                 }).catch(function(error) {
                    $editLegislativePropositionCtrl.errorMessage = error.message;
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

      var _extractFileAttachmentsIds = function(fileAttachments) {
         var fileAttachmentsIds = [];
         if(fileAttachments) {
            var i;
            for(i = 0; i < fileAttachments.length; i++) {
               fileAttachmentsIds.push(fileAttachments[i]._id);
            }
         }
         return fileAttachmentsIds;
      }

      //news data
      var _now = _getNow();

      $editLegislativePropositionCtrl.isGeneralTabActive = true;
      $editLegislativePropositionCtrl.isAttachmentTabActive = false;
      $editLegislativePropositionCtrl.isConsolidationTabActive = false;
      $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
      $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
      $editLegislativePropositionCtrl.isRemoveTabActive = false;

      $editLegislativePropositionCtrl.selectedType = legislativeProposition.type;
      $editLegislativePropositionCtrl.number = legislativeProposition.number;
      $editLegislativePropositionCtrl.date = new Date(legislativeProposition.date);
      $editLegislativePropositionCtrl.year = $editLegislativePropositionCtrl.date.getFullYear();
      $editLegislativePropositionCtrl.description = legislativeProposition.description;
      $editLegislativePropositionCtrl.text = legislativeProposition.text;
      $editLegislativePropositionCtrl.textAttachment = legislativeProposition.textAttachment;
      $editLegislativePropositionCtrl.selectedTags = legislativeProposition.tags;
      $editLegislativePropositionCtrl.consolidatedText = legislativeProposition.consolidatedText;
      $editLegislativePropositionCtrl.consolidatedTextAttachment = legislativeProposition.consolidatedTextAttachment;
      $editLegislativePropositionCtrl.legislativePropositionTypes = legislativePropositionTypes;
      $editLegislativePropositionCtrl.legislativeProcess = null;
      $editLegislativePropositionCtrl.legislativePropositionTags = null;
      $editLegislativePropositionCtrl.selectedRelationshipType = null;
      $editLegislativePropositionCtrl.relationshipsToBeIncluded = legislativeProposition.relationships;
      $editLegislativePropositionCtrl.legislativeProcess = null;
      SyslegisService
         .getLegislativeProcess(legislativeProposition.legislativeProcessId)
         .then(function(result) {
            $editLegislativePropositionCtrl.legislativeProcess = result.materia;
         }).catch(function(error) {
            $editLegislativePropositionCtrl.errorMessage = error.message;
         });
      $editLegislativePropositionCtrl.legislativePropositionRelationshipTypes = null;
      $editLegislativePropositionCtrl.relationshipTypeNotEntered = false;
      $editLegislativePropositionCtrl.fileAttachments = legislativeProposition.fileAttachments ? legislativeProposition.fileAttachments : [];
      $editLegislativePropositionCtrl.consolidatedFileAttachments = legislativeProposition.consolidatedFileAttachments ? legislativeProposition.consolidatedFileAttachments : [];

      //select the first legislative proposition type
      if( $editLegislativePropositionCtrl.legislativePropositionTypes &&
         $editLegislativePropositionCtrl.legislativePropositionTypes.length > 0 ) {
            _updateTypeSelected($editLegislativePropositionCtrl.selectedType);
      }

      $editLegislativePropositionCtrl.formatLegislativePropositionNumber = function(number, year) {
         return _.padStart(number, 3, "0") + "/" + year
      }

      $editLegislativePropositionCtrl.textFroalaOptions = {
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

      $editLegislativePropositionCtrl.textAttachmentFroalaOptions = {
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

      $editLegislativePropositionCtrl.consolidatedTextFroalaOptions = {
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

      $editLegislativePropositionCtrl.consolidatedTextAttachmentFroalaOptions = {
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

      $editLegislativePropositionCtrl.attachmentUploader = LegislativePropositionService.getAttachmentFileUploader();
      $editLegislativePropositionCtrl.consolidatedAttachmentUploader = LegislativePropositionService.getConsolidatedAttachmentFileUploader();
      $editLegislativePropositionCtrl.viewFileAttachmentUrlBase = settings.baseUrlSiteCamaraApi + settings.LegislativeProposition.fileAttachmentDownloadPath;
      $editLegislativePropositionCtrl.viewConsolidatedFileAttachmentUrlBase = settings.baseUrlSiteCamaraApi + settings.LegislativeProposition.consolidatedFileAttachmentDownloadPath;
      //set the name of uploaded file
      $editLegislativePropositionCtrl.attachmentUploader.onSuccessItem  = function( item, response,
                                                                                    status, headers ) {
         var attachmentFile = { 'file': response.filename,
                                'originalFilename': item.file.name,
                                'contentType': response.contentType,
                                'legislativeProposition': legislativeProposition._id,
                                'consolidatedFileAttachment': false
                              };
         LegislativePropositionService
            .newAttachmentFile(attachmentFile)
            .then(function(result) {
               attachmentFile._id = result.id;
               $editLegislativePropositionCtrl.fileAttachments.push(attachmentFile);
               $editLegislativePropositionCtrl.uploadFileAttachmentMessage = _templateMessage(  messages.legislativePropositionFileAttachmentAdded,
                                                                                                { 'filename': attachmentFile.originalFilename });
               //clear the uploader queue
               $editLegislativePropositionCtrl.attachmentUploader.queue = [];
            }).catch(function(err) {
               $editLegislativePropositionCtrl.uploadFileAttachmentErrorMessage = err.message;
            });
      };

      //set the name of uploaded file
      $editLegislativePropositionCtrl.attachmentUploader.onErrorItem  = function( item, response,
                                                                                  status, headers ) {
         $editLegislativePropositionCtrl.uploadFileAttachmentErrorMessage = response.message;
      };

      //remove the file just uploaded
      $editLegislativePropositionCtrl.removeFileAttachment = function(index) {
         if($editLegislativePropositionCtrl.fileAttachments
               && $editLegislativePropositionCtrl.fileAttachments.length > index) {
                  var fileAttachment = $editLegislativePropositionCtrl.fileAttachments[index];

                  $uibModal.open({
                     templateUrl: 'tpl/camara/includes/confirm.html',
                     animation: false,
                     size: 'md',
                     controller: 'ConfirmModalInstanceController',
                     controllerAs: '$modalCtrl',
                     scope: $scope,
                     resolve: {
                        texts: {
                           'message': _templateMessage( messages.legislativePropositionFileAttachmentRemoveDialogText,
                                                        { 'filename': fileAttachment.originalFilename })
                        }
                     }
                  }).result.then(function() {
                     //20019-06-04 - Rodrigo Moraes
                     //Apenas remove a referência (propriedade fileAttachments) para o arquivo,
                     //o usuário precisa salvar para efetivar e o arquivo não é
                     //removido, ele apenas fica orfão. Embora o arquivo fique orfão, esta
                     //abordagem é mais funcional para o usuário
                     $editLegislativePropositionCtrl.fileAttachments.splice(index, 1);

                     /*
                     Código para implementar a remoção completa do arquivo
                     (o que difere da implementação acima),
                     ainda é necessário realizar um save automático
                     na propositura para remover a referência para o arquivo,
                     pois se o usuário cancelar a alteração, a
                     lista de referências para os arquivos
                     (propriedade fileAttachments) não será atualizada e
                     a lista conterá uma referência para um arquivo já removido,
                     o que é um BUG, logo a CODIGO ABAIXO NÃO ESTÁ COMPLETO:

                     LegislativePropositionService
                        .deleteAttachmentFile(fileAttachment._id)
                        .then(function(result) {
                           $editLegislativePropositionCtrl.fileAttachments.splice(index, 1);
                           $editLegislativePropositionCtrl.uploadFileAttachmentMessage = _templateMessage( messages.legislativePropositionFileAttachmentRemoved,
                                                                                                           { 'filename': fileAttachment.originalFilename } );
                        }).catch(function(err) {
                           $editLegislativePropositionCtrl.uploadFileAttachmentErrorMessage = err.message;
                        });
                    */
                  });

         }
      }

      //set the name of uploaded file
      $editLegislativePropositionCtrl.consolidatedAttachmentUploader.onSuccessItem  = function( item, response,
                                                                                    status, headers ) {
         var consolidatedAttachmentFile = { 'file': response.filename,
                                            'originalFilename': item.file.name,
                                            'contentType': response.contentType,
                                            'legislativeProposition': legislativeProposition._id,
                                            'consolidatedFileAttachment': true
                                          };
         LegislativePropositionService
            .newAttachmentFile(consolidatedAttachmentFile)
            .then(function(result) {
               consolidatedAttachmentFile._id = result.id;
               $editLegislativePropositionCtrl.consolidatedFileAttachments.push(consolidatedAttachmentFile);
               $editLegislativePropositionCtrl.uploadConsolidatedFileAttachmentMessage = _templateMessage(  messages.legislativePropositionFileAttachmentAdded,
                                                                                                            { 'filename': consolidatedAttachmentFile.originalFilename });
               //clear the uploader queue
               $editLegislativePropositionCtrl.consolidatedAttachmentUploader.queue = [];
            }).catch(function(err) {
               $editLegislativePropositionCtrl.uploadConsolidatedFileAttachmentErrorMessage = err.message;
            });
      };

      //set the name of uploaded file
      $editLegislativePropositionCtrl.consolidatedAttachmentUploader.onErrorItem  = function( item, response,
                                                                                              status, headers ) {
         $editLegislativePropositionCtrl.uploadConsolidatedFileAttachmentErrorMessage = response.message;
      };

      //remove the file just uploaded
      $editLegislativePropositionCtrl.removeConsolidatedFileAttachment = function(index) {
         if($editLegislativePropositionCtrl.consolidatedFileAttachments
               && $editLegislativePropositionCtrl.consolidatedFileAttachments.length > index) {
                  var consolidatedFileAttachment = $editLegislativePropositionCtrl.consolidatedFileAttachments[index];

                  $uibModal.open({
                     templateUrl: 'tpl/camara/includes/confirm.html',
                     animation: false,
                     size: 'md',
                     controller: 'ConfirmModalInstanceController',
                     controllerAs: '$modalCtrl',
                     scope: $scope,
                     resolve: {
                        texts: {
                           'message': _templateMessage( messages.legislativePropositionFileAttachmentRemoveDialogText,
                                                        { 'filename': consolidatedFileAttachment.originalFilename })
                        }
                     }
                  }).result.then(function() {

                     LegislativePropositionService
                        .deleteAttachmentFile(consolidatedFileAttachment._id)
                        .then(function(result) {
                           $editLegislativePropositionCtrl.consolidatedFileAttachments.splice(index, 1);
                           $editLegislativePropositionCtrl.uploadConsolidatedFileAttachmentMessage = _templateMessage( messages.legislativePropositionFileAttachmentRemoved,
                                                                                                                       { 'filename': consolidatedFileAttachment.originalFilename } );
                        }).catch(function(err) {
                           $editLegislativePropositionCtrl.uploadConsolidatedFileAttachmentErrorMessage = err.message;
                        });
                  });

         }
      }

      $editLegislativePropositionCtrl.setGeneralTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = true;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.setAttachmentTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = true;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.setConsolidationTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = true;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.setConsolidatedAttachmentTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = true;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.setRelationshipsTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = true;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.setRemoveTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = false;
         $editLegislativePropositionCtrl.isRemoveTabActive = true;
      }

      $editLegislativePropositionCtrl.setLegislativeProcessTabActive = function() {
         $editLegislativePropositionCtrl.isGeneralTabActive = false;
         $editLegislativePropositionCtrl.isAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isConsolidationTabActive = false;
         $editLegislativePropositionCtrl.isConsolidatedAttachmentTabActive = false;
         $editLegislativePropositionCtrl.isRelationshipsTabActive = false;
         $editLegislativePropositionCtrl.isLegislativeProcessTabActive = true;
         $editLegislativePropositionCtrl.isRemoveTabActive = false;
      }

      $editLegislativePropositionCtrl.addRelationship = function(relationshipType) {
         if(!relationshipType) {
            $editLegislativePropositionCtrl.relationshipTypeNotEntered = true;
         } else {
            $editLegislativePropositionCtrl.relationshipTypeNotEntered = false;
            $editLegislativePropositionCtrl.newRelationshipModalInstance = $uibModal.open({
                 templateUrl: 'views/legislative_proposition/new_relationship.html',
                 animation: false,
                 size: 'm',
                 controller: 'NewRelationshipModalInstanceController',
                 controllerAs: '$modalCtrl',
                 scope: $scope,
                 resolve: {
                    'relationshipType': $editLegislativePropositionCtrl.selectedRelationshipType,
                    'legislativePropositionType': $editLegislativePropositionCtrl.selectedType,
                    'relationships': {
                       'list': $editLegislativePropositionCtrl.relationshipsToBeIncluded
                    }
                 }
            });

            $editLegislativePropositionCtrl
               .newRelationshipModalInstance
               .result
               .then(function (result) {
                  $editLegislativePropositionCtrl.relationshipsToBeIncluded.push({
                     'type': result.type,
                     'otherLegislativeProposition': result.otherLegislativeProposition
                  })
               }, function() {
                     //dimissed window
               });
         }
      }

      $editLegislativePropositionCtrl.openSelectLegislativeProcessModal = function() {
         var selectLegislativeProcessModal = $uibModal.open({
                                          templateUrl: 'views/legislative_proposition/select-legislative-process.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectLegislativeProcessModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope
                                       });
         selectLegislativeProcessModal.result.then(function(legislativeProposition) {
            $editLegislativePropositionCtrl.legislativeProcess = legislativeProposition;
         });
      }

      $editLegislativePropositionCtrl.openSelectLegislativePropositionModal = function(froalaScope) {
         var selectLegislativePropositionModal = $uibModal.open({
                                          templateUrl: 'tpl/camara/froala/select-legislative-proposition.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectLegislativePropositionModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope,
                                          resolve: {
                                             'legislativePropositionType': $editLegislativePropositionCtrl.selectedType
                                          }
                                       });
         selectLegislativePropositionModal.result.then(function(legislativeProposition) {
            froalaScope.html.insert(legislativeProposition.typeDescription + "&nbsp;nº&nbsp;" + '<a href=\"' + settings.LegislativeProposition.froalaInsertLegislativePropositionUrlBase +  legislativeProposition._id  + '\">' + legislativeProposition.number + "/" + legislativeProposition.year + '</a>');
         });
      }

      $editLegislativePropositionCtrl.isValid = function() {
         var formValid = $editLegislativePropositionCtrl.newLegislativePropositionForm.$valid;
         if(!formValid) {
            $editLegislativePropositionCtrl.setGeneralTabActive();
         }
         return formValid;
      }

      $editLegislativePropositionCtrl.save = function () {
         $editLegislativePropositionCtrl.newLegislativePropositionForm.$setSubmitted();
         if ($editLegislativePropositionCtrl.isValid()) {
            var legislativePropositionToBeSaved = {
               id: legislativeProposition._id,
               type: $editLegislativePropositionCtrl.selectedType._id,
               number: $editLegislativePropositionCtrl.number,
               date: $editLegislativePropositionCtrl.date,
               description: $editLegislativePropositionCtrl.description,
               text: $editLegislativePropositionCtrl.text,
               textAttachment: $editLegislativePropositionCtrl.textAttachment,
               tags: _extractTagsIds($editLegislativePropositionCtrl.selectedTags),
               consolidatedText: $editLegislativePropositionCtrl.consolidatedText,
               consolidatedTextAttachment: $editLegislativePropositionCtrl.consolidatedTextAttachment,
               relationships: _extractRelationshipIds($editLegislativePropositionCtrl.relationshipsToBeIncluded),
               fileAttachments: _extractFileAttachmentsIds($editLegislativePropositionCtrl.fileAttachments),
               consolidatedFileAttachments: _extractFileAttachmentsIds($editLegislativePropositionCtrl.consolidatedFileAttachments),
               legislativeProcessId: $editLegislativePropositionCtrl.legislativeProcess ? $editLegislativePropositionCtrl.legislativeProcess.id : null
            };

            LegislativePropositionService
                        .saveLegislativeProposition(legislativePropositionToBeSaved)
                        .then(function(result) {
                 LegislativePropositionService.setHighlightLegislativePropositionId(legislativeProposition._id);
                 $state.go('legislativeProposition.list', {
                     infoMessage: _templateMessage(messages.legislativePropositionChanged,
                                                   { 'number': legislativeProposition.number,
                                                     'type': $editLegislativePropositionCtrl.selectedType.description })
                 });
            }).catch(function(error) {
               $editLegislativePropositionCtrl.errorMessage = error.message;
            });

         }
      }

      $editLegislativePropositionCtrl.unlinkLegislativeProcess = function() {
         $editLegislativePropositionCtrl.legislativeProcess = null;
      }

      $editLegislativePropositionCtrl.removeRelationship = function(index) {
         if( $editLegislativePropositionCtrl.relationshipsToBeIncluded &&
             $editLegislativePropositionCtrl.relationshipsToBeIncluded.length > index ) {
               $editLegislativePropositionCtrl.relationshipsToBeIncluded.splice(index, 1);
         }
      }

      $editLegislativePropositionCtrl.remove = function() {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.legislativePropositionRemoveDialogText,
                                               { 'type': $editLegislativePropositionCtrl.selectedType.description,
                                                 'number': $editLegislativePropositionCtrl.number })
               }
            }
         }).result.then(function() {
            LegislativePropositionService
               .deleteLegislativeProposition(legislativeProposition._id)
               .then(function(result) {
                  $state.go('legislativeProposition.list', {
                     infoMessage: _templateMessage(messages.legislativePropositionRemoved,
                                                    { 'number': legislativeProposition.number,
                                                      'type': $editLegislativePropositionCtrl.selectedType.description })
                  });
               }).catch(function(err) {
                  $editLegislativePropositionCtrl.errorMessage = err.message;
               });
         });
      }

      $editLegislativePropositionCtrl.close = function () {
         $state.go('legislativeProposition.list');
      }

      //legislative proposition type
      $scope.$watch("$editLegislativePropositionCtrl.selectedType", function (newValue, oldValue) {
         if(newValue != oldValue) {
            _updateTypeSelected($editLegislativePropositionCtrl.selectedType);
         }
      });
   }
})();
