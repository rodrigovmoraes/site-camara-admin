(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditLicitacaoEventController', EditLicitacaoEventController);

   EditLicitacaoEventController.$inject = [ '$scope', 'messages',
                                            'Utils', '$state',
                                            'LicitacoesService', '$filter',
                                            'settings', '$uibModal',
                                            'licitacao', 'licitacaoEvent' ];
   function EditLicitacaoEventController( $scope, messages,
                                          Utils, $state,
                                          LicitacoesService, $filter,
                                          settings, $uibModal,
                                          licitacao, licitacaoEvent ) {
      var $editLicitacaoEventCtrl = this;

      //messages control
      Utils.applyMessageControls($editLicitacaoEventCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $editLicitacaoEventCtrl.formatLicitacaoNumber = function(number, year) {
         return _.padStart(number, 2, "0") + "/" + year
      }

      //return the actual date, set seconds and milliseconds to 0
      var _getNow = function() {
         var now = new Date();
         now.setMilliseconds(0);
         now.setSeconds(0);
         return now;
      }

      //news data
      $editLicitacaoEventCtrl.licitacao = licitacao;
      $editLicitacaoEventCtrl.licitacaoEvent = licitacaoEvent;
      $editLicitacaoEventCtrl.description = licitacaoEvent.description;
      $editLicitacaoEventCtrl.date = new Date(licitacaoEvent.date);
      //the file name of the image chosen to be the banner
      $editLicitacaoEventCtrl.eventFilename = licitacaoEvent.file;
      $editLicitacaoEventCtrl.eventOriginalFilename = licitacaoEvent.originalFilename;
      $editLicitacaoEventCtrl.eventFileContentType = licitacaoEvent.contentType;
      $editLicitacaoEventCtrl.uploader = LicitacoesService.getEventFileUploader();
      $editLicitacaoEventCtrl.viewFileEventUrlBase = settings.baseUrlSiteCamaraApi + settings.LicitacoesEvents.downloadPath;
      $editLicitacaoEventCtrl.uploadedFile = null;

      //set the name of uploaded file
      $editLicitacaoEventCtrl.uploader.onSuccessItem  = function( item, response,
                                                                  status, headers ) {
         $editLicitacaoEventCtrl.uploadEventFileErrorMessage = "";
         $editLicitacaoEventCtrl.eventFilename = response.filename;
         $editLicitacaoEventCtrl.uploadedFile = response;
         $editLicitacaoEventCtrl.eventOriginalFilename = item.file.name;
         $editLicitacaoEventCtrl.eventFileContentType = response.contentType;
      };

      //set the name of uploaded file
      $editLicitacaoEventCtrl.uploader.onErrorItem  = function( item, response,
                                                                status, headers ) {
         $editLicitacaoEventCtrl.uploadEventFileErrorMessage = response.message;
         $editLicitacaoEventCtrl.eventFilename = licitacaoEvent.file;
         $editLicitacaoEventCtrl.uploadedFile = null;
         $editLicitacaoEventCtrl.eventOriginalFilename = licitacaoEvent.originalFilename;
         $editLicitacaoEventCtrl.eventFileContentType = licitacaoEvent.contentType;
      };

      //remove the file just uploaded
      $editLicitacaoEventCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $editLicitacaoEventCtrl.eventFilename;
         $editLicitacaoEventCtrl.eventFilename = licitacaoEvent.file;
         $editLicitacaoEventCtrl.uploadedFile = null;
         $editLicitacaoEventCtrl.eventOriginalFilename = licitacaoEvent.originalFilename;
         $editLicitacaoEventCtrl.eventFileContentType = licitacaoEvent.contentType;
         LicitacoesService.deleteEventFile(fileName).catch(function(err) {
            console.log(err);
         });
      }

      $editLicitacaoEventCtrl.isValid = function() {
         return $editLicitacaoEventCtrl.editLicitacaoEventForm.$valid &&
                     $editLicitacaoEventCtrl.eventFilename
      }

      $editLicitacaoEventCtrl.save = function () {
         $editLicitacaoEventCtrl.editLicitacaoEventForm.$setSubmitted();
         if ($editLicitacaoEventCtrl.isValid()) {
            var licitacaoEventToBeSaved = {
               id: licitacaoEvent._id,
               description: $editLicitacaoEventCtrl.description,
               date: $editLicitacaoEventCtrl.date,
               file: $editLicitacaoEventCtrl.eventFilename,
               originalFilename: $editLicitacaoEventCtrl.eventOriginalFilename,
               contentType: $editLicitacaoEventCtrl.eventFileContentType
            }

            LicitacoesService.saveLicitacaoEvent(licitacaoEventToBeSaved)
                             .then(function(result) {
                                   $state.go('licitacao.view', {
                                      licitacaoId: licitacao._id,
                                      infoMessage: _templateMessage( messages.licitacaoEventChanged,
                                                                     { 'description': licitacaoEventToBeSaved.description })
                                   });
                              })
                              .catch(function(error) {
                                    $editLicitacaoEventCtrl.errorMessage = error.message;
                              });
         }
      }

      $editLicitacaoEventCtrl.close = function () {
         $state.go('licitacao.view');
      }
   }
})();
