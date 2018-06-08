(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewPageController', NewPageController);

   NewPageController.$inject = [ '$scope', 'messages',
                                 'Utils', '$state',
                                 'PagesService', '$filter',
                                 'settings', '$uibModal' ];
   function NewPageController( $scope, messages,
                               Utils, $state,
                               PagesService, $filter,
                               settings, $uibModal ) {
      var $newPageCtrl = this;

      //filter options used in the list of the news
      var _filterOptions = PagesService.getFilterOptions();

      //messages control
      Utils.applyMessageControls($newPageCtrl);

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
      $newPageCtrl.title = "";
      $newPageCtrl.body = "";

      $newPageCtrl.froalaOptions = {
        //toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
        placeholderText: messages.enterPageText
      };

      $newPageCtrl.isValid = function() {
         return $scope.newPageForm.$valid
      }

      $newPageCtrl.save = function () {
         $scope.newPageForm.$setSubmitted();
         if ($newPageCtrl.isValid()) {
            var newPage = {
               title: $newPageCtrl.title,
               body: $newPageCtrl.body
            }

            PagesService.newPage(newPage).then(function(result) {
                 _filterOptions.id = result.id;
                 $state.go('page.list', { infoMessage: messages.pageCreated });
            }).catch(function(error) {
               $newPageCtrl.errorMessage = error.message;
            });
         }
      }

      $newPageCtrl.close = function () {
         $state.go('page.list');
      }
   }
})();
