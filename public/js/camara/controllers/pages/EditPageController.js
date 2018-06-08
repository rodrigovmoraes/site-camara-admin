(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditPageController', EditPageController);

   EditPageController.$inject = [ '$scope', 'messages',
                                  'Utils', '$state',
                                  'PagesService', '$filter',
                                  'page', 'settings',
                                  '$uibModal'];
   function EditPageController( $scope, messages,
                                Utils, $state,
                                PagesService, $filter,
                                page, settings,
                                $uibModal
                              ) {
      var $editPageItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages control
      Utils.applyMessageControls($editPageItemCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //news data
      $editPageItemCtrl.title = page.title;
      $editPageItemCtrl.body = page.body;
      $editPageItemCtrl.froalaOptions = {
        //toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
        placeholderText: messages.enterPageText,
        imageStyles: {
         newsImageFloatRight: 'Float Right',
         newsImageFloatLeft: 'Float Left'
        },
     };

      $editPageItemCtrl.isValid = function() {
         return $scope.editPageForm.$valid
      }

      $editPageItemCtrl.getNow = function() {
         var now = new Date();
         now.setSeconds(0);
         now.setMilliseconds(0);
         return now;
      }

      $editPageItemCtrl.save = function () {
         $scope.editPageForm.$setSubmitted();
         if ($editPageItemCtrl.isValid()) {
            var newpage = {
               id: page._id,
               title: $editPageItemCtrl.title,
               headline: $editPageItemCtrl.headline,
               body: $editPageItemCtrl.body,
               thumbnailFile: $editPageItemCtrl.thumbnailFilename,
               publish: $editPageItemCtrl.publish,
               publicationDate: $editPageItemCtrl.publicationDate
                                          ? $editPageItemCtrl.publicationDate : null
            }

            PagesService.savePage(newpage).then(function(result) {
                 PagesService.setHighlightPageId(newpage.id);
                 $state.go('page.list', { infoMessage: messages.pageChanged });
            }).catch(function(error) {
               $editPageItemCtrl.errorMessage = error.message;
            });
         }
      }

      $editPageItemCtrl.remove = function () {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': messages.pageRemoveDialogText
               }
            }
         }).result.then(function() {
            PagesService.deletePage(page._id).then(function(result) {
               $state.go('page.list', { infoMessage: _templateMessage( messages.pageRemoved,
                                                                       { 'title': page.title }) });
            }).catch(function(error) {
               $editPageItemCtrl.errorMessage = error.message;
            });
         });
      }

      $editPageItemCtrl.close = function () {
         $state.go('page.list');
      }

   }
})();
