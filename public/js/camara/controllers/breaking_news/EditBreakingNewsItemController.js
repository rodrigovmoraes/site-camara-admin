(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('EditBreakingNewsItemController', EditBreakingNewsItemController);

   EditBreakingNewsItemController.$inject = [ '$scope', 'Utils',
                                              'settings', 'messages',
                                              '$uibModal', 'BreakingNewsService',
                                              '$state', 'breakingNewsItem',
                                              'IonIconsService'
                                            ]
   function EditBreakingNewsItemController( $scope, Utils,
                                            settings, messages,
                                            $uibModal, BreakingNewsService,
                                            $state, breakingNewsItem,
                                            IonIconsService
                                           ) {
      var $editBreakingNewsItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $editBreakingNewsItemCtrl.breakingNewsItem = breakingNewsItem;
      $editBreakingNewsItemCtrl.order = breakingNewsItem.order;
      $editBreakingNewsItemCtrl.headline = breakingNewsItem.headline;
      $editBreakingNewsItemCtrl.selectedHeadlineIcon = breakingNewsItem.headlineIcon;
      $editBreakingNewsItemCtrl.title = breakingNewsItem.title;
      var _date = breakingNewsItem.date ? new Date(breakingNewsItem.date) : null;
      _date.setSeconds(0);
      _date.setMilliseconds(0);
      $editBreakingNewsItemCtrl.date = breakingNewsItem.date ? _date : null;
      $editBreakingNewsItemCtrl.headlineIcons = IonIconsService.getIconClasses();
      //the file name of the image chosen to be the banner
      $editBreakingNewsItemCtrl.breakingNewsItemImageFilename = breakingNewsItem.imageFile;
      $editBreakingNewsItemCtrl.breakingNewsItemImageURL = breakingNewsItem.imageFileURL;
      $editBreakingNewsItemCtrl.uploader = BreakingNewsService.getNewBreakingNewsItemImageUploader();

      //set the name of uploaded file
      $editBreakingNewsItemCtrl.uploader.onSuccessItem  = function( item, response,
                                                                    status, headers ) {
         $editBreakingNewsItemCtrl.uploadBreakingNewsItemImageErrorMessage = "";
         $editBreakingNewsItemCtrl.breakingNewsItemImageFilename = response.filename;
         if($editBreakingNewsItemCtrl.breakingNewsItemImageFilename) {

            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });

            BreakingNewsService.requestBreakingNewsItemImageToBeResized($editBreakingNewsItemCtrl.breakingNewsItemImageFilename, function(err) {
               if(err) {
                  console.log("Error while processing image: " + err.message);
                  $editBreakingNewsItemCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });

         }
      };

      //set the name of uploaded file
      $editBreakingNewsItemCtrl.uploader.onErrorItem  = function( item, response,
                                                                  status, headers ) {
         $editBreakingNewsItemCtrl.uploadBreakingNewsItemImageErrorMessage = response.message;
         $editBreakingNewsItemCtrl.breakingNewsItemImageFilename = breakingNewsItem.imageFile;
      };

      //remove the breaking news item image just uploaded
      $editBreakingNewsItemCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $editBreakingNewsItemCtrl.breakingNewsItemImageFilename;
         $editBreakingNewsItemCtrl.breakingNewsItemImageFilename = breakingNewsItem.imageFile;
         BreakingNewsService.deleteBreakingNewsItemImage(fileName).catch(function(err) {
            console.log(err);
         });
      }

      var imageRatio = Utils.getImageRatio(settings.BreakingNews.image.width, settings.BreakingNews.image.height);
      $editBreakingNewsItemCtrl.breakingNewsItemImageHeight = settings.BreakingNews.image.height;
      $editBreakingNewsItemCtrl.breakingNewsItemImageWidth = settings.BreakingNews.image.width;
      $editBreakingNewsItemCtrl.breakingNewsItemImageHeightRatio = imageRatio.height;
      $editBreakingNewsItemCtrl.breakingNewsItemImageWidthRatio = imageRatio.width;

      var _checkAccessInput = false;

      $editBreakingNewsItemCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $editBreakingNewsItemCtrl.getAccessCallback = function(returnedBreakingNewsItem, valid) {
         if(valid) {
            BreakingNewsService.editBreakingNewsItem(returnedBreakingNewsItem).then(function(result) {
               BreakingNewsService.setHighlightBreakingNewsItemId(returnedBreakingNewsItem.id);
               $state.go('breakingNews.list', { infoMessage: _templateMessage( messages.breakingNewsItemChanged,
                                                                               { 'order': breakingNewsItem.order })
                                        });
            }).catch(function(error) {
               $editBreakingNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $editBreakingNewsItemCtrl.isValid = function() {
         return $editBreakingNewsItemCtrl.editBreakingNewsItemForm.$valid &&
                     $editBreakingNewsItemCtrl.breakingNewsItemImageFilename &&
                           _checkAccessInput;
      }

      $editBreakingNewsItemCtrl.save = function () {
         $editBreakingNewsItemCtrl.editBreakingNewsItemForm.$setSubmitted();
         if ($editBreakingNewsItemCtrl.isValid()) {
            var breakingNewsItemToBeSaved = {
               id: breakingNewsItem.id,
               imageFile: $editBreakingNewsItemCtrl.breakingNewsItemImageFilename,
               headline: $editBreakingNewsItemCtrl.headline,
               headlineIcon: $editBreakingNewsItemCtrl.selectedHeadlineIcon,
               title: $editBreakingNewsItemCtrl.title,
               date: $editBreakingNewsItemCtrl.date
            }
            $scope.$broadcast('request-access-property', breakingNewsItemToBeSaved);
         }
      }

      $editBreakingNewsItemCtrl.resetAccess = function() {
         AccessService.resetAccess($editBreakingNewsItemCtrl, breakingNewsItem);
      }

   }

})();
