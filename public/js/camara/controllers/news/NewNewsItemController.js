(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('NewNewsItemController', NewNewsItemController);

   NewNewsItemController.$inject = [ '$scope', 'messages',
                                     'Utils', '$state',
                                     'NewsService', '$filter',
                                     'settings', '$uibModal' ];
   function NewNewsItemController( $scope, messages,
                                   Utils, $state,
                                   NewsService, $filter,
                                   settings, $uibModal ) {
      var $newNewsItemCtrl = this;

      //the file name of the image chosen to be the thumbnail of the news
      $newNewsItemCtrl.thumbnailFilename = undefined;

      $newNewsItemCtrl.uploader = NewsService.getNewThumbnailUploader();
      //filter options used in the list of the news
      var _filterOptions = NewsService.getFilterOptions();

      //set the name of uploaded file
      $newNewsItemCtrl.uploader.onSuccessItem  = function( item, response,
                                                           status, headers) {
         $newNewsItemCtrl.uploadThumbnailErrorMessage = "";
         $newNewsItemCtrl.thumbnailFilename = response.filename;
         if($newNewsItemCtrl.thumbnailFilename) {
            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });
            NewsService.requestThumbnailToBeResized($newNewsItemCtrl.thumbnailFilename, function(err) {
               if (err) {
                  console.log("Error while processing image: " + err.message);
                  $newNewsItemCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });
         }
      };

      $newNewsItemCtrl.openSelectFlickrPhotoModal = function(froalaScope) {
         var selectFlickrPhotoModal = $uibModal.open({
                                          templateUrl: 'tpl/camara/froala/select-flickr-photo-froala.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectFlickrPhotoFroalaModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope
                                       });
         selectFlickrPhotoModal.result.then(function(photoObject) {
            var selectFlickrPhotoSizeModal = $uibModal.open({
                                                templateUrl: 'tpl/camara/froala/select-flickr-photo-size-froala.html',
                                                animation: false,
                                                size: 'lg',
                                                controller: 'SelectFlickrPhotoSizeFroalaModalInstanceController',
                                                controllerAs: '$modalCtrl',
                                                scope: $scope
                                             });
            selectFlickrPhotoSizeModal.result.then(function(chosenSize) {
               froalaScope.html.insert('<img src=\"' + photoObject['url_' + chosenSize] + '\"/>');
            });
         });
      }

      //set the name of uploaded file
      $newNewsItemCtrl.uploader.onErrorItem  = function( item, response,
                                                         status, headers ) {
         $newNewsItemCtrl.uploadThumbnailErrorMessage = response.message;
         $newNewsItemCtrl.thumbnailFilename = undefined;
      };

      //remove the thumbnail just uploaded
      $newNewsItemCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $newNewsItemCtrl.thumbnailFilename;
         $newNewsItemCtrl.thumbnailFilename = undefined;
         NewsService.deleteThumbnail(fileName).catch(function(err) {
            console.log(err);
         });
      }

      //messages control
      Utils.applyMessageControls($newNewsItemCtrl);

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

      var _setFuturePublicationDateRestrictions = function() {
         var now = _getNow();
         $newNewsItemCtrl.futurePublicationDate = now;
         $newNewsItemCtrl.futurePublicationDateMin = now;
      }

      //news data
      $newNewsItemCtrl.title = "";
      $newNewsItemCtrl.headline = "";
      $newNewsItemCtrl.body = "";
      $newNewsItemCtrl.publish = true;
      $newNewsItemCtrl.futurePublicationDateEnabled = false;
      var imageRatio = Utils.getImageRatio(settings.News.thumbnail.width, settings.News.thumbnail.height);
      $newNewsItemCtrl.thumbnailHeight = settings.News.thumbnail.height;
      $newNewsItemCtrl.thumbnailWidth = settings.News.thumbnail.width;
      $newNewsItemCtrl.thumbnailHeightRatio = imageRatio.height;
      $newNewsItemCtrl.thumbnailWidthRatio = imageRatio.width;
      $newNewsItemCtrl.futurePublicationDateEnabled = false;
      $newNewsItemCtrl.enableFacebookComments = false;
      $newNewsItemCtrl.enableFacebookShareButton = true;
      _setFuturePublicationDateRestrictions();

      $newNewsItemCtrl.futurePublicationDateEnabledChanged = function() {
         if($newNewsItemCtrl.futurePublicationDateEnabled) {
            $newNewsItemCtrl.publish = true;
         }
         _setFuturePublicationDateRestrictions();
      }

      $newNewsItemCtrl.froalaOptions = {
         toolbarButtons : [ 'fullscreen', 'bold', 'italic', 'underline',
                            'strikeThrough', 'subscript', 'superscript', '|',
                            'fontFamily', 'fontSize', 'color', 'inlineClass',
                            'inlineStyle', 'paragraphStyle', 'lineHeight',
                            '|', 'paragraphFormat', 'align', 'formatOL',
                            'formatUL', 'outdent', 'indent', 'quote', '-',
                            'insertLink', 'insertImage', 'insertVideo',
                            'embedly', 'insertFile', 'insertTable', '|',
                            'emoticons', 'fontAwesome', 'specialCharacters',
                            'insertHR', 'selectAll', 'clearFormatting',  '|',
                            'print',    'getPDF', 'spellChecker',
                            'help', 'html', '|', 'undo', 'redo', '|', 'camaraFlickr'],
         placeholderText: messages.enterNewsText,
         imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
         fileUploadParam: 'file',
         fileUploadMethod: 'PUT',
         fileUploadURL: NewsService.getUploadWysiwygFileAttachmentURL(),
         fileMaxSize: 1024 * 1024 * 100, //100MB
         imageUploadMethod: 'PUT',
         imageUploadParam: 'file',
         imageUploadURL:  NewsService.getUploadWysiwygFileImageAttachmentURL(),
         imageMaxSize: 1024 * 1024 * 10, //10MB
         videoUploadMethod: 'PUT',
         videoUploadParam: 'file',
         videoUploadURL:  NewsService.getUploadWysiwygFileVideoAttachmentURL(),
         videoMaxSize: 1024 * 1024 * 100, //10MB
         videoEditButtons: ['videoReplace', 'videoRemove', '|', 'videoDisplay', 'videoAlign', 'videoSize', '|', 'makeVideoResponsive'],
         requestHeaders: {
             Authorization: Utils.getAuthorizationHeader()
         }
      };

      $newNewsItemCtrl.isValid = function() {
         return $scope.newNewsItemForm.$valid &&
                     $newNewsItemCtrl.thumbnailFilename;
      }

      $newNewsItemCtrl.save = function () {
         $scope.newNewsItemForm.$setSubmitted();
         if ($newNewsItemCtrl.isValid()) {
            var newNewsItem = {
               title: $newNewsItemCtrl.title,
               headline: $newNewsItemCtrl.headline,
               body: $newNewsItemCtrl.body,
               thumbnailFile: $newNewsItemCtrl.thumbnailFilename,
               publish: $newNewsItemCtrl.publish,
               publicationDate: $newNewsItemCtrl.futurePublicationDateEnabled
                                          ? $newNewsItemCtrl.futurePublicationDate : null,
               enableFacebookComments: $newNewsItemCtrl.enableFacebookComments,
               enableFacebookShareButton: $newNewsItemCtrl.enableFacebookShareButton
            }

            NewsService.newNewsItem(newNewsItem).then(function(result) {
               _filterOptions.id = result.id;
               $state.go('newsItem.list', { infoMessage: messages.newsItemCreated });
            }).catch(function(error) {
               $newNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $newNewsItemCtrl.close = function () {
         $state.go('newsItem.list');
      }
   }
})();
