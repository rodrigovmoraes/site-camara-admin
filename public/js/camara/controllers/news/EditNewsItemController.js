(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('EditNewsItemController', EditNewsItemController);

   EditNewsItemController.$inject = [ '$scope', 'messages',
                                      'Utils', '$state',
                                      'NewsService', '$filter',
                                      'newsItem', 'settings',
                                      '$uibModal'];
   function EditNewsItemController( $scope, messages,
                                    Utils, $state,
                                    NewsService, $filter,
                                    newsItem, settings,
                                    $uibModal
                                  ) {
      var $editNewsItemCtrl = this;
      var _publicationDate = new Date(newsItem.publicationDate);
      _publicationDate.setSeconds(0);
      _publicationDate.setMilliseconds(0);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //the file name of the image chosen to be the thumbnail of the news
      $editNewsItemCtrl.thumbnailFilename = undefined;

      $editNewsItemCtrl.uploader = NewsService.getNewThumbnailUploader();

      //set the name of uploaded file
      $editNewsItemCtrl.uploader.onSuccessItem  = function( item, response,
                                                            status, headers ) {
         $editNewsItemCtrl.uploadThumbnailErrorMessage = "";
         $editNewsItemCtrl.thumbnailFilename = response.filename;
         if($editNewsItemCtrl.thumbnailFilename) {
            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });
            NewsService.requestThumbnailToBeResized($editNewsItemCtrl.thumbnailFilename, function(err) {
               if(err) {
                  console.log("Error while processing image: " + err.message);
                  $editNewsItemCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });
         }
      };

      //set the name of uploaded file
      $editNewsItemCtrl.uploader.onErrorItem  = function( item, response,
                                                         status, headers ) {
         $editNewsItemCtrl.uploadThumbnailErrorMessage = response.message;
         $editNewsItemCtrl.thumbnailFilename = undefined;
      };

      //remove the thumbnail just uploaded
      $editNewsItemCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $editNewsItemCtrl.thumbnailFilename;
         $editNewsItemCtrl.thumbnailFilename = newsItem.thumbnailFile;
         NewsService.deleteThumbnail(fileName).catch(function(err) {
            console.log(err);
         });
      }

      //messages control
      Utils.applyMessageControls($editNewsItemCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //news data
      $editNewsItemCtrl.title = newsItem.title;
      $editNewsItemCtrl.headline = newsItem.headline;
      $editNewsItemCtrl.body = newsItem.body;
      $editNewsItemCtrl.publish = newsItem.publish;
      $editNewsItemCtrl.publicationDate = $editNewsItemCtrl.publish && newsItem.publicationDate ? _publicationDate : null;
      $editNewsItemCtrl.oldPublicationDate = $editNewsItemCtrl.publish && newsItem.publicationDate ? _publicationDate : null;
      $editNewsItemCtrl.publicationDateEnabled = $editNewsItemCtrl.publish;
      $editNewsItemCtrl.thumbnailFilename = newsItem.thumbnailFile;
      $editNewsItemCtrl.thumbnailUrl = newsItem.thumbnailUrl;
      var imageRatio = Utils.getImageRatio(settings.News.thumbnail.width, settings.News.thumbnail.height);
      $editNewsItemCtrl.thumbnailHeight = settings.News.thumbnail.height;
      $editNewsItemCtrl.thumbnailWidth = settings.News.thumbnail.width;
      $editNewsItemCtrl.thumbnailHeightRatio = imageRatio.height;
      $editNewsItemCtrl.thumbnailWidthRatio = imageRatio.width;

      $editNewsItemCtrl.froalaOptions = {
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
                           'help', 'html', '|', 'undo', 'redo', '|', 'alert'],
        placeholderText: messages.enterNewsText,
        imageStyles: {
         newsImageFloatRight: 'Float Right',
         newsImageFloatLeft: 'Float Left'
        },
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
        videoMaxSize: 1024 * 1024 * 100 //10MB
     };

      $editNewsItemCtrl.isValid = function() {
         return $scope.editNewsItemForm.$valid &&
                     $editNewsItemCtrl.thumbnailFilename;
      }

      $editNewsItemCtrl.openSelectFlickrPhotoModal = function(froalaScope) {
         var selectFlickrPhotoModal = $uibModal.open({
                                          templateUrl: 'tpl/camara/froala/select-flickr-photo-froala.html',
                                          animation: false,
                                          size: 'lg',
                                          controller: 'SelectFlickrPhotoFroalaModalInstanceController',
                                          controllerAs: '$modalCtrl',
                                          scope: $scope
                                       });
         selectFlickrPhotoModal.result.then(function(photoObject) {
            console.log(photoObject);
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

      $editNewsItemCtrl.getNow = function() {
         var now = new Date();
         now.setSeconds(0);
         now.setMilliseconds(0);
         return now;
      }

      $editNewsItemCtrl.save = function () {
         $scope.editNewsItemForm.$setSubmitted();
         if ($editNewsItemCtrl.isValid()) {
            var newNewsItem = {
               id: newsItem._id,
               title: $editNewsItemCtrl.title,
               headline: $editNewsItemCtrl.headline,
               body: $editNewsItemCtrl.body,
               thumbnailFile: $editNewsItemCtrl.thumbnailFilename,
               publish: $editNewsItemCtrl.publish,
               publicationDate: $editNewsItemCtrl.publicationDate
                                          ? $editNewsItemCtrl.publicationDate : null
            }

            NewsService.saveNewsItem(newNewsItem).then(function(result) {
                 NewsService.setHighlightNewsItemId(newNewsItem.id);
                 $state.go('newsItem.list', { infoMessage: messages.newsItemChanged });
            }).catch(function(error) {
               $editNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      //publish property was changed
      var _oldPublicationDate = null;
      $scope.$watch("$editNewsItemCtrl.publish", function (newValue, oldValue) {
         if (newValue != oldValue) {
            if (newValue) { //to be published
               $editNewsItemCtrl.publicationDateEnabled = true;
               //set date
               if (!_oldPublicationDate) {
                  $editNewsItemCtrl.publicationDate = $editNewsItemCtrl.getNow();
               } else {
                  $editNewsItemCtrl.publicationDate = _oldPublicationDate;
               }
            } else { //not to be published
               _oldPublicationDate = $editNewsItemCtrl.publicationDate;
               $editNewsItemCtrl.publicationDate = null;
               $editNewsItemCtrl.publicationDateEnabled = false;
            }
         }
      });

      $editNewsItemCtrl.remove = function () {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': messages.newsRemoveDialogText
               }
            }
         }).result.then(function() {
            NewsService.deleteNewsItem(newsItem._id).then(function(result) {
               if($editNewsItemCtrl.thumbnailFilename) {
                  //request the removal of the thumbnail file
                  NewsService.deleteThumbnail($editNewsItemCtrl.thumbnailFilename);
               }

               $state.go('newsItem.list', { infoMessage: _templateMessage( messages.newsItemRemoved,
                                                                           { 'title': newsItem.title }) });
            }).catch(function(error) {
               $editNewsItemCtrl.errorMessage = error.message;
            });
         });
      }

      $editNewsItemCtrl.close = function () {
         $state.go('newsItem.list');
      }
   }
})();
