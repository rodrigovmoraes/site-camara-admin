(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('NewBreakingNewsItemController', NewBreakingNewsItemController);

   NewBreakingNewsItemController.$inject = [ '$scope', 'Utils',
                                             'settings', 'messages',
                                             '$uibModal', 'BreakingNewsService',
                                             '$state', 'IonIconsService' ]
   function NewBreakingNewsItemController( $scope, Utils,
                                           settings, messages,
                                           $uibModal, BreakingNewsService,
                                           $state, IonIconsService ) {
      var $newBreakingNewsItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $newBreakingNewsItemCtrl.headline = null;
      $newBreakingNewsItemCtrl.selectedHeadlineIcon = null;
      $newBreakingNewsItemCtrl.title = null;
      $newBreakingNewsItemCtrl.date = new Date();
      $newBreakingNewsItemCtrl.headlineIcons = IonIconsService.getIconClasses();

      //the file name of the image chosen to be the banner
      $newBreakingNewsItemCtrl.breakingNewsItemImageFilename = undefined;
      $newBreakingNewsItemCtrl.uploader = BreakingNewsService.getNewBreakingNewsItemImageUploader();

      //set the name of uploaded file
      $newBreakingNewsItemCtrl.uploader.onSuccessItem  = function( item, response,
                                                                   status, headers ) {
         $newBreakingNewsItemCtrl.uploadBreakingNewsItemImageErrorMessage = "";
         $newBreakingNewsItemCtrl.breakingNewsItemImageFilename = response.filename;
         if($newBreakingNewsItemCtrl.breakingNewsItemImageFilename) {

            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });

            BreakingNewsService.requestBreakingNewsItemImageToBeResized($newBreakingNewsItemCtrl.breakingNewsItemImageFilename, function(err) {
               if (err) {
                  console.log("Error while processing image: " + err.message);
                  $newBreakingNewsItemCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });

         }
      };

      //set the name of uploaded file
      $newBreakingNewsItemCtrl.uploader.onErrorItem  = function( item, response,
                                                                 status, headers ) {
         $newBreakingNewsItemCtrl.uploadBreakingNewsItemImageErrorMessage = response.message;
         $newBreakingNewsItemCtrl.breakingNewsItemImageFilename = undefined;
      };

      //remove the breaking news item image just uploaded
      $newBreakingNewsItemCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $newBreakingNewsItemCtrl.breakingNewsItemImageFilename;
         $newBreakingNewsItemCtrl.breakingNewsItemImageFilename = null;
         BreakingNewsService.deleteBreakingNewsItemImage(fileName).catch(function(err) {
            console.log(err);
         });
      }
      //set image properties
      var imageRatio = Utils.getImageRatio(settings.BreakingNews.image.width, settings.BreakingNews.image.height);
      $newBreakingNewsItemCtrl.breakingNewsItemImageHeight = settings.BreakingNews.image.height;
      $newBreakingNewsItemCtrl.breakingNewsItemImageWidth = settings.BreakingNews.image.width;
      $newBreakingNewsItemCtrl.breakingNewsItemImageHeightRatio = imageRatio.height;
      $newBreakingNewsItemCtrl.breakingNewsItemImageWidthRatio = imageRatio.width;
      var _checkAccessInput = false;

      $newBreakingNewsItemCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $newBreakingNewsItemCtrl.getAccessCallback = function(returnedBreakingNewsItem, valid) {
         if(valid) {
            BreakingNewsService.saveNewBreakingNewsItem(returnedBreakingNewsItem).then(function(result) {
                 $state.go('breakingNews.list', { infoMessage: messages.breakingNewsItemCreated });
            }).catch(function(error) {
               $newBreakingNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $newBreakingNewsItemCtrl.isValid = function() {
         return $newBreakingNewsItemCtrl.insertNewBreakingNewsItemForm.$valid &&
                     $newBreakingNewsItemCtrl.breakingNewsItemImageFilename &&
                           _checkAccessInput;
      }

      $newBreakingNewsItemCtrl.save = function () {
         $newBreakingNewsItemCtrl.insertNewBreakingNewsItemForm.$setSubmitted();
         if ($newBreakingNewsItemCtrl.isValid()) {
            var breakingNewsItem = {
               imageFile: $newBreakingNewsItemCtrl.breakingNewsItemImageFilename,
               headline: $newBreakingNewsItemCtrl.headline,
               headlineIcon: $newBreakingNewsItemCtrl.selectedHeadlineIcon,
               title: $newBreakingNewsItemCtrl.title,
               date: $newBreakingNewsItemCtrl.date
            }
            $scope.$broadcast('request-access-property', breakingNewsItem);
         }
      }
   }

})();
