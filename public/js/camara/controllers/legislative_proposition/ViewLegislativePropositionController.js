(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('ViewLicitacaoController', ViewLicitacaoController);

   ViewLicitacaoController.$inject = [ '$scope', 'messages',
                                       'Utils', '$state', '$stateParams',
                                       'LicitacoesService', '$filter',
                                       'licitacao', 'settings',
                                       '$uibModal' ];
   function ViewLicitacaoController( $scope, messages,
                                     Utils, $state, $stateParams,
                                     LicitacoesService, $filter,
                                     licitacao, settings,
                                     $uibModal
                                   ) {
      var $viewLicitacaoCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages control
      Utils.applyMessageControls($viewLicitacaoCtrl);

      $viewLicitacaoCtrl.formatLicitacaoNumber = function(number, year) {
         return _.padStart(number, 2, "0") + "/" + year
      }

      //licitacao data
      $viewLicitacaoCtrl.errorMessage = $stateParams.errorMessage;
      $viewLicitacaoCtrl.infoMessage = $stateParams.infoMessage;
      $viewLicitacaoCtrl.notFoundMessage = messages.licitacaoEventsNotFound;
      $viewLicitacaoCtrl.licitacao = licitacao;
      $viewLicitacaoCtrl.urlFileDownload = settings.baseUrlSiteCamaraApi + settings.LicitacoesEvents.downloadPath;

      $viewLicitacaoCtrl.publishLicitacao = function() {
         LicitacoesService.publishLicitacao($viewLicitacaoCtrl.licitacao._id)
                          .then(function(result) {
                             return LicitacoesService.getLicitacao($viewLicitacaoCtrl.licitacao._id);
                          }).then(function(result) {
                             $viewLicitacaoCtrl.licitacao = result.licitacao;
                             $viewLicitacaoCtrl.infoMessage = _templateMessage( messages.licitacaoPublished,
                                                                                { 'description': $viewLicitacaoCtrl.licitacao.description })
                          }).catch(function(error) {
                             $viewLicitacaoCtrl.errorMessage = error.message;
                          });
      }

      $viewLicitacaoCtrl.unpublishLicitacao = function() {
         LicitacoesService.unpublishLicitacao($viewLicitacaoCtrl.licitacao._id)
                          .then(function(result) {
                             return LicitacoesService.getLicitacao($viewLicitacaoCtrl.licitacao._id);
                          }).then(function(result) {
                             $viewLicitacaoCtrl.licitacao = result.licitacao;
                             $viewLicitacaoCtrl.infoMessage = _templateMessage( messages.licitacaoUnpublished,
                                                                                { 'description': $viewLicitacaoCtrl.licitacao.description })
                          }).catch(function(error) {
                             $viewLicitacaoCtrl.errorMessage = error.message;
                          });
      }

      $viewLicitacaoCtrl.remove = function () {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.licitacaoRemoveDialogText,
                                               { 'number':
                                                      $viewLicitacaoCtrl.formatLicitacaoNumber( licitacao.number,
                                                                                                licitacao.year) } )
               }
            }
         }).result.then(function() {
            LicitacoesService.deleteLicitacao(licitacao._id)
                             .then(function(result) {
                                 $state.go('licitacao.list', {
                                    infoMessage: _templateMessage( messages.licitacaoRemoved,
                                                                   { 'number':
                                                                        $viewLicitacaoCtrl.formatLicitacaoNumber( licitacao.number,
                                                                                                                  licitacao.year ) } )
                                 });
            }).catch(function(error) {
               $viewLicitacaoCtrl.errorMessage = error.message;
            });
         });
      }

      $viewLicitacaoCtrl.removeLicitacaoEvent = function (licitacaoEvent) {
         if ( $viewLicitacaoCtrl.licitacao.state !== 1 || //published
              $viewLicitacaoCtrl.licitacao.events &&
              $viewLicitacaoCtrl.licitacao.events.length > 1 ) {
            $uibModal.open({
               templateUrl: 'tpl/camara/includes/confirm.html',
               animation: false,
               size: 'md',
               controller: 'ConfirmModalInstanceController',
               controllerAs: '$modalCtrl',
               scope: $scope,
               resolve: {
                  texts: {
                     'message': _templateMessage( messages.licitacaoEventRemoveDialogText,
                                                  { 'description': licitacaoEvent.description })
                  }
               }
            }).result.then(function() {
               LicitacoesService.deleteLicitacaoEvent(licitacao._id, licitacaoEvent._id).then(function(result) {
                  return LicitacoesService.getLicitacao($viewLicitacaoCtrl.licitacao._id);
               }).then(function(result) {
                  $viewLicitacaoCtrl.licitacao = result.licitacao;
                  $viewLicitacaoCtrl.infoMessage = _templateMessage( messages.licitacaoEventRemoved,
                                                                     { 'description': licitacaoEvent.description })
               }).catch(function(error) {
                  $viewLicitacaoCtrl.errorMessage = error.message;
               });
            });
         } else {
            $uibModal.open({
               templateUrl: 'tpl/camara/includes/message.html',
               animation: false,
               size: 'md',
               controller: 'MessageModalInstanceController',
               controllerAs: '$modalCtrl',
               scope: $scope,
               resolve: {
                  texts: {
                     'message': _templateMessage( messages.licitacaoEventCantBeRemoved )
                  }
               }
            });
         }

      }

      $viewLicitacaoCtrl.close = function () {
         $state.go('licitacao.list');
      }
   }
})();
