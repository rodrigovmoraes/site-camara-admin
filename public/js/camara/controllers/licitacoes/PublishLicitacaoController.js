(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('PublishLicitacaoController', PublishLicitacaoController);

   PublishLicitacaoController.$inject = [ '$scope', 'messages',
                                          'Utils', '$state',
                                          'LicitacoesService', '$filter',
                                          'settings', '$uibModal',
                                          'licitacao'];
   function PublishLicitacaoController( $scope, messages,
                                        Utils, $state,
                                        LicitacoesService, $filter,
                                        settings, $uibModal,
                                        licitacao ) {
      var $publishLicitacaoCtrl = this;

      //messages control
      Utils.applyMessageControls($publishLicitacaoCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $publishLicitacaoCtrl.publishAlertMessage = messages.licitacaoPublishAlert;

      $publishLicitacaoCtrl.formatLicitacaoNumber = function(number, year) {
         return _.padStart(number, 2, "0") + "/" + year
      }

      //return the actual date, set seconds and milliseconds to 0
      var _getNow = function() {
         var now = new Date();
         now.setMilliseconds(0);
         now.setSeconds(0);
         return now;
      }

      $publishLicitacaoCtrl.licitacao = licitacao;
      $publishLicitacaoCtrl.description = "";
      $publishLicitacaoCtrl.date = _getNow();
      //the file name of the image chosen to be the banner
      $publishLicitacaoCtrl.eventFilename = undefined;
      $publishLicitacaoCtrl.eventOriginalFilename = undefined;
      $publishLicitacaoCtrl.eventFileContentType = undefined;
      $publishLicitacaoCtrl.uploader = LicitacoesService.getEventFileUploader();
      $publishLicitacaoCtrl.viewRawFileEventUrlBase = settings.baseUrlSiteCamaraApi + settings.LicitacoesEvents.rawDownloadPath;

      //set the name of uploaded file
      $publishLicitacaoCtrl.uploader.onSuccessItem  = function( item, response,
                                                                 status, headers ) {
         $publishLicitacaoCtrl.uploadEventFileErrorMessage = "";
         $publishLicitacaoCtrl.eventFilename = response.filename;
         $publishLicitacaoCtrl.eventOriginalFilename = item.file.name;
         $publishLicitacaoCtrl.eventFileContentType = response.contentType;
      };

      //set the name of uploaded file
      $publishLicitacaoCtrl.uploader.onErrorItem  = function( item, response,
                                                               status, headers ) {
         $publishLicitacaoCtrl.uploadEventFileErrorMessage = response.message;
         $publishLicitacaoCtrl.eventFilename = undefined;
         $publishLicitacaoCtrl.eventOriginalFilename = undefined;
         $publishLicitacaoCtrl.eventFileContentType = undefined;
      };

      //remove the file just uploaded
      $publishLicitacaoCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $publishLicitacaoCtrl.eventFilename;
         $publishLicitacaoCtrl.eventFilename = null;
         LicitacoesService.deleteEventFile(fileName).catch(function(err) {
            console.log(err);
         });
      }

      $publishLicitacaoCtrl.isValid = function() {
         return $publishLicitacaoCtrl.insertNewLicitacaoEventForm.$valid &&
                     $publishLicitacaoCtrl.eventFilename
      }

      $publishLicitacaoCtrl.save = function () {
         $publishLicitacaoCtrl.insertNewLicitacaoEventForm.$setSubmitted();
         if ($publishLicitacaoCtrl.isValid()) {
            var newLicitacaoEvent = {
               description: $publishLicitacaoCtrl.description,
               date: $publishLicitacaoCtrl.date,
               file: $publishLicitacaoCtrl.eventFilename,
               originalFilename: $publishLicitacaoCtrl.eventOriginalFilename,
               contentType: $publishLicitacaoCtrl.eventFileContentType
            }

            LicitacoesService.newLicitacaoEvent(licitacao._id, newLicitacaoEvent)
                             .then(function(result) {
                                return LicitacoesService.publishLicitacao($publishLicitacaoCtrl.licitacao._id);
                             })
                             .then(function(result) {
                                $state.go('licitacao.view', {
                                   licitacaoId: licitacao._id,
                                   infoMessage: _templateMessage( messages.licitacaoPublished,
                                                                  { 'description': licitacao.description })
                                });
                             })
                             .catch(function(error) {
                                    $newLicitacaoEventCtrl.errorMessage = error.message;
                             });

         }
      }

      $publishLicitacaoCtrl.close = function () {
         $state.go('licitacao.view');
      }
   }
})();
