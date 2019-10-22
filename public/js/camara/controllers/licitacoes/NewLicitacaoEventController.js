(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewLicitacaoEventController', NewLicitacaoEventController);

   NewLicitacaoEventController.$inject = [ '$scope', 'messages',
                                           'Utils', '$state',
                                           'LicitacoesService', '$filter',
                                           'settings', '$uibModal', 'licitacao' ];
   function NewLicitacaoEventController( $scope, messages,
                                         Utils, $state,
                                         LicitacoesService, $filter,
                                         settings, $uibModal, licitacao ) {
      var $newLicitacaoEventCtrl = this;

      //messages control
      Utils.applyMessageControls($newLicitacaoEventCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $newLicitacaoEventCtrl.formatLicitacaoNumber = function(number, year) {
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
      $newLicitacaoEventCtrl.licitacao = licitacao;
      $newLicitacaoEventCtrl.description = "";
      $newLicitacaoEventCtrl.date = _getNow();
      //the file name of the image chosen to be the banner
      $newLicitacaoEventCtrl.eventFilename = undefined;
      $newLicitacaoEventCtrl.eventOriginalFilename = undefined;
      $newLicitacaoEventCtrl.eventFileContentType = undefined;
      $newLicitacaoEventCtrl.uploader = LicitacoesService.getEventFileUploader();
      $newLicitacaoEventCtrl.uploadedFile = null;

      //set the name of uploaded file
      $newLicitacaoEventCtrl.uploader.onSuccessItem  = function( item, response,
                                                                 status, headers ) {
         $newLicitacaoEventCtrl.uploadEventFileErrorMessage = "";
         $newLicitacaoEventCtrl.eventFilename = response.filename;
         $newLicitacaoEventCtrl.uploadedFile = response;
         $newLicitacaoEventCtrl.eventOriginalFilename = item.file.name;
         $newLicitacaoEventCtrl.eventFileContentType = response.contentType;
      };

      //set the name of uploaded file
      $newLicitacaoEventCtrl.uploader.onErrorItem  = function( item, response,
                                                               status, headers ) {
         $newLicitacaoEventCtrl.uploadEventFileErrorMessage = response.message;
         $newLicitacaoEventCtrl.eventFilename = undefined;
         $newLicitacaoEventCtrl.uploadedFile = null;
         $newLicitacaoEventCtrl.eventOriginalFilename = undefined;
         $newLicitacaoEventCtrl.eventFileContentType = undefined;
      };

      //remove the file just uploaded
      $newLicitacaoEventCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $newLicitacaoEventCtrl.eventFilename;
         $newLicitacaoEventCtrl.eventFilename = null;
         $newLicitacaoEventCtrl.uploadedFile = null;
         LicitacoesService.deleteEventFile(fileName).catch(function(err) {
            console.log(err);
         });
      }

      $newLicitacaoEventCtrl.isValid = function() {
         return $newLicitacaoEventCtrl.insertNewLicitacaoEventForm.$valid &&
                     $newLicitacaoEventCtrl.eventFilename
      }

      $newLicitacaoEventCtrl.save = function () {
         $newLicitacaoEventCtrl.insertNewLicitacaoEventForm.$setSubmitted();
         if ($newLicitacaoEventCtrl.isValid()) {
            var newLicitacaoEvent = {
               description: $newLicitacaoEventCtrl.description,
               date: $newLicitacaoEventCtrl.date,
               file: $newLicitacaoEventCtrl.eventFilename,
               originalFilename: $newLicitacaoEventCtrl.eventOriginalFilename,
               contentType: $newLicitacaoEventCtrl.eventFileContentType
            }
            LicitacoesService.newLicitacaoEvent(licitacao._id, newLicitacaoEvent)
                             .then(function(result) {
                                   $state.go('licitacao.view', {
                                      licitacaoId: licitacao._id,
                                      infoMessage: _templateMessage( messages.licitacaoEventCreated,
                                                                     { 'description': newLicitacaoEvent.description })
                                   });
                              })
                              .catch(function(error) {
                                    $newLicitacaoEventCtrl.errorMessage = error.message;
                              });
         }
      }

      $newLicitacaoEventCtrl.close = function () {
         $state.go('licitacao.view');
      }
   }
})();
