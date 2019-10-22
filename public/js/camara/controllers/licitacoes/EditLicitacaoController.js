(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditLicitacaoController', EditLicitacaoController);

   EditLicitacaoController.$inject = [ '$scope', 'messages',
                                       'Utils', '$state',
                                       'LicitacoesService', 'licitacao',
                                       'licitacoesCategories', '$filter',
                                       'settings', '$uibModal' ];
   function EditLicitacaoController( $scope, messages,
                                     Utils, $state,
                                     LicitacoesService, licitacao,
                                     licitacoesCategories, $filter,
                                     settings, $uibModal ) {
      var $editLicitacaoCtrl = this;

      //filter options used in the list of the licitacoes
      var _filterOptions = LicitacoesService.getFilterOptions();

      //messages control
      Utils.applyMessageControls($editLicitacaoCtrl);

      $editLicitacaoCtrl.formatLicitacaoNumber = function (number, year) {
         return _.padStart(number, 2, "0") + "/" + year
      }

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
      $editLicitacaoCtrl.year = licitacao.year;
      $editLicitacaoCtrl.number = licitacao.number;
      $editLicitacaoCtrl.description = licitacao.description;
      $editLicitacaoCtrl.categories = licitacoesCategories;
      $editLicitacaoCtrl.selectedCategory = licitacao.category;

      $editLicitacaoCtrl.isValid = function() {
         return $editLicitacaoCtrl.editLicitacaoForm.$valid
      }

      $editLicitacaoCtrl.save = function () {
         $editLicitacaoCtrl.editLicitacaoForm.$setSubmitted();
         if ($editLicitacaoCtrl.isValid()) {
            var editedLicitacao = {
               id: licitacao._id,
               description: $editLicitacaoCtrl.description
            }
            LicitacoesService.saveLicitacao(editedLicitacao).then(function(result) {
                 $state.go('licitacao.view', {
                    infoMessage: _templateMessage(
                                   messages.licitacaoChanged,
                                   { 'number': $editLicitacaoCtrl
                                                  .formatLicitacaoNumber(
                                                     licitacao.number,
                                                     licitacao.year
                                                  )
                                   }),
                    licitacaoId: licitacao._id
                 });
            }).catch(function(error) {
               $editLicitacaoCtrl.errorMessage = error.message;
            });
         }
      }

      $editLicitacaoCtrl.close = function () {
         $state.go('licitacao.view', { licitacaoId: licitacao._id });
      }
   }
})();
