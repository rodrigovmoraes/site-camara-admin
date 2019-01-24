(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewLicitacaoController', NewLicitacaoController);

   NewLicitacaoController.$inject = [ '$scope', 'messages',
                                      'Utils', '$state',
                                      'LicitacoesService', 'licitacoesCategories',
                                      '$filter', 'settings', '$uibModal' ];
   function NewLicitacaoController( $scope, messages,
                                    Utils, $state,
                                    LicitacoesService, licitacoesCategories,
                                    $filter, settings, $uibModal ) {
      var $newLicitacaoCtrl = this;

      //filter options used in the list of the licitacoes
      var _filterOptions = LicitacoesService.getFilterOptions();

      //messages control
      Utils.applyMessageControls($newLicitacaoCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //return the actual date, set seconds and milliseconds to 0
      var _getNow = function() {
         var now = new Date();
         now.setMilliseconds(0);
         now.setSeconds(0);
         return now;
      }

      //news data
      var _now = _getNow();
      $newLicitacaoCtrl.year = _now.getFullYear();
      $newLicitacaoCtrl.number = 1;
      LicitacoesService
              .getNextNumberOfTheYear($newLicitacaoCtrl.year)
              .then(function(result) {
                 $newLicitacaoCtrl.number = result.nextNumber;
              }).catch(function(error) {
                 $newLicitacaoCtrl.errorMessage = error.message;
              });
      $newLicitacaoCtrl.description = $newLicitacaoCtrl.description;
      $newLicitacaoCtrl.categories = licitacoesCategories;
      $newLicitacaoCtrl.publish = false;
      $newLicitacaoCtrl.uploader = LicitacoesService.getEventFileUploader();
      $newLicitacaoCtrl.viewRawFileEventUrlBase = settings.baseUrlSiteCamaraApi + settings.LicitacoesEvents.rawDownloadPath;
      $newLicitacaoCtrl.initialEvent = {
         description: null,
         date: _now,
         filename: null,
         originalFilename: null,
         contentType: null
      };

      $newLicitacaoCtrl.uniqueNumberValidator = function() {
         var year = $newLicitacaoCtrl.year;
         var number = $newLicitacaoCtrl.newLicitacaoForm.number.$viewValue;
         if(number) {
            return LicitacoesService.checkUniqueNumber(year, number);
         } else {
            return true;
         }
      }

      //set the name of uploaded file
      $newLicitacaoCtrl.uploader.onSuccessItem  = function( item, response,
                                                            status, headers ) {
         $newLicitacaoCtrl.uploadEventFileErrorMessage = "";
         $newLicitacaoCtrl.initialEvent.filename = response.filename;
         $newLicitacaoCtrl.initialEvent.originalFilename = item.file.name;
         $newLicitacaoCtrl.initialEvent.contentType = response.contentType;
      };

      //set the name of uploaded file
      $newLicitacaoCtrl.uploader.onErrorItem  = function( item, response,
                                                          status, headers ) {
         $newLicitacaoCtrl.uploadEventFileErrorMessage = response.message;
         $newLicitacaoCtrl.initialEvent.filename = null;
         $newLicitacaoCtrl.initialEvent.originalFilename = null;
         $newLicitacaoCtrl.initialEvent.contentType = null;
      };

      //remove the file just uploaded
      $newLicitacaoCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $newLicitacaoCtrl.initialEvent.filename;
         $newLicitacaoCtrl.initialEvent.filename = null;
         $newLicitacaoCtrl.initialEvent.originalFilename = null;
         $newLicitacaoCtrl.initialEvent.contentType = null;
         LicitacoesService.deleteEventFile(fileName).catch(function(err) {
            console.log(err);
         });
      }

      $newLicitacaoCtrl.isValid = function() {
         return $newLicitacaoCtrl.newLicitacaoForm.$valid &&
                     (!$newLicitacaoCtrl.publish || $newLicitacaoCtrl.initialEvent.filename)
      }

      $newLicitacaoCtrl.save = function () {
         $newLicitacaoCtrl.newLicitacaoForm.$setSubmitted();
         if ($newLicitacaoCtrl.isValid()) {
            var newLicitacao = {
               year: $newLicitacaoCtrl.year,
               number: $newLicitacaoCtrl.number,
               description: $newLicitacaoCtrl.description,
               category: $newLicitacaoCtrl.selectedCategory._id,
               publish: $newLicitacaoCtrl.publish
            };
            var initialEvent = {
               description: $newLicitacaoCtrl.initialEvent.description,
               date: $newLicitacaoCtrl.initialEvent.date,
               file: $newLicitacaoCtrl.initialEvent.filename,
               originalFilename: $newLicitacaoCtrl.initialEvent.originalFilename,
               contentType: $newLicitacaoCtrl.initialEvent.contentType
            }
            LicitacoesService.newLicitacao(newLicitacao)
                             .then(function(result) {
                 _filterOptions.id = result.id;
                 if(newLicitacao.publish) {
                    LicitacoesService.newLicitacaoEvent(result.id, initialEvent);
                 } else {
                    return null;
                 }
            }).then(function(result) {
                 $state.go('licitacao.list', {
                     infoMessage: _templateMessage( messages.licitacaoCreated,
                                                    { 'number': newLicitacao.number,
                                                      'year': newLicitacao.year })
                 });
            }).catch(function(error) {
               $newLicitacaoCtrl.errorMessage = error.message;
            });
         }
      }

      $newLicitacaoCtrl.close = function () {
         $state.go('licitacao.list');
      }

      //publication date, end
      $scope.$watch("$newLicitacaoCtrl.year", function (newValue, oldValue) {
         //keywords updated
         if(newValue != oldValue) {
            $newLicitacaoCtrl.clearMessage();
            LicitacoesService
                    .getNextNumberOfTheYear($newLicitacaoCtrl.year)
                    .then(function(result) {
                       $newLicitacaoCtrl.number = result.nextNumber;
                    }).catch(function(error) {
                       $newLicitacaoCtrl.errorMessage = error.message;
                    });
         }
      });
   }
})();
