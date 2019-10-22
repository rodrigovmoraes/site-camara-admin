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

      //filter options used in the list of the pages
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
      $newPageCtrl.enableFacebookComments = false;
      $newPageCtrl.enableFacebookShareButton = false;

      $newPageCtrl.froalaOptions = {
        //toolbarButtons : ["bold", "italic", "underline", "|", "align", "formatOL", "formatUL"],
        placeholderText: messages.enterPageText,
        imageStyles: {
         newsImageFloatRight: 'Float Right',
         newsImageFloatLeft: 'Float Left'
        },
        fileUploadParam: 'file',
        fileUploadMethod: 'PUT',
        fileUploadURL: PagesService.getUploadWysiwygFileAttachmentURL(),
        fileMaxSize: 1024 * 1024 * 100, //100MB
        imageUploadMethod: 'PUT',
        imageUploadParam: 'file',
        imageUploadURL:  PagesService.getUploadWysiwygFileImageAttachmentURL(),
        imageMaxSize: 1024 * 1024 * 10, //10MB
        videoUploadMethod: 'PUT',
        videoUploadParam: 'file',
        videoUploadURL:  PagesService.getUploadWysiwygFileVideoAttachmentURL(),
        videoMaxSize: 1024 * 1024 * 100, //10MB
        requestHeaders: {
           Authorization: Utils.getAuthorizationHeader()
        }
      };

      $newPageCtrl.uniqueTagValidator = function () {
         var tag = $scope.newPageForm.tag.$viewValue;
         if (tag) {
            //check if a page exists with the same tag
            return PagesService.checkUniqueTag(tag);
         } else {
            return true;
         }
      }

      $newPageCtrl.isValid = function() {
         return $scope.newPageForm.$valid
      }

      $newPageCtrl.save = function () {
         $scope.newPageForm.$setSubmitted();
         if ($newPageCtrl.isValid()) {
            var newPage = {
               title: $newPageCtrl.title,
               body: $newPageCtrl.body,
               enableFacebookComments: $newPageCtrl.enableFacebookComments,
               enableFacebookShareButton: $newPageCtrl.enableFacebookShareButton
            }
            //set tag
            if ($newPageCtrl.tag) {
               newPage.tag = $newPageCtrl.tag;
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
