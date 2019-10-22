(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('EditFBreakingNewsItemController', EditFBreakingNewsItemController);

   EditFBreakingNewsItemController.$inject = [ '$scope', 'Utils',
                                              'settings', 'messages',
                                              '$uibModal', 'FBreakingNewsService',
                                              '$state', 'fbreakingNewsItem',
                                              'IonIconsService'
                                            ]
   function EditFBreakingNewsItemController( $scope, Utils,
                                            settings, messages,
                                            $uibModal, FBreakingNewsService,
                                            $state, fbreakingNewsItem,
                                            IonIconsService
                                           ) {
      var $editFBreakingNewsItemCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }
      //save old date if it is not null
      var _oldDate = fbreakingNewsItem.date ? new Date(fbreakingNewsItem.date) : null;
      if (fbreakingNewsItem.date) {
         _oldDate.setSeconds(0);
         _oldDate.setMilliseconds(0);
      }
      $editFBreakingNewsItemCtrl.fbreakingNewsItem = fbreakingNewsItem;
      $editFBreakingNewsItemCtrl.order = fbreakingNewsItem.order;
      $editFBreakingNewsItemCtrl.headline = fbreakingNewsItem.headline;
      $editFBreakingNewsItemCtrl.selectedHeadlineIcon = fbreakingNewsItem.headlineIcon;
      $editFBreakingNewsItemCtrl.title = fbreakingNewsItem.title;
      var _date = fbreakingNewsItem.date ? new Date(fbreakingNewsItem.date) : null;
      if (_date) {
         _date.setSeconds(0);
         _date.setMilliseconds(0);
      }
      $editFBreakingNewsItemCtrl.date = fbreakingNewsItem.date ? _date : null;
      $editFBreakingNewsItemCtrl.dateDisabled = fbreakingNewsItem.date ? false : true;
      $editFBreakingNewsItemCtrl.headlineIcons = IonIconsService.getIconClasses();
      //the file name of the image chosen to be the banner
      $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename = fbreakingNewsItem.imageFile;
      $editFBreakingNewsItemCtrl.fbreakingNewsItemImageURL = fbreakingNewsItem.imageFileURL;
      $editFBreakingNewsItemCtrl.uploader = FBreakingNewsService.getNewFBreakingNewsItemImageUploader();

      $editFBreakingNewsItemCtrl.dateDisabledChanged = function() {
         if ($editFBreakingNewsItemCtrl.dateDisabled) {
            $editFBreakingNewsItemCtrl.date = null;
         } else {
            if (_oldDate) {
               $editFBreakingNewsItemCtrl.date = _oldDate;
            } else {
               $editFBreakingNewsItemCtrl.date = new Date();
               $editFBreakingNewsItemCtrl.date.setSeconds(0);
               $editFBreakingNewsItemCtrl.date.setMilliseconds(0);
            }
         }
      }

      //set the name of uploaded file
      $editFBreakingNewsItemCtrl.uploader.onSuccessItem  = function( item, response,
                                                                    status, headers ) {
         $editFBreakingNewsItemCtrl.uploadBreakingNewsItemImageErrorMessage = "";
         $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename = response.filename;
         if($editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename) {

            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });

            FBreakingNewsService.requestFBreakingNewsItemImageToBeResized($editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename,
                                                                          $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidth,
                                                                          $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeight,
            function(err) {
               if(err) {
                  console.log("Error while processing image: " + err.message);
                  $editFBreakingNewsItemCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });

         }
      };

      //set the name of uploaded file
      $editFBreakingNewsItemCtrl.uploader.onErrorItem  = function( item, response,
                                                                  status, headers ) {
         $editFBreakingNewsItemCtrl.uploadFBreakingNewsItemImageErrorMessage = response.message;
         $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename = fbreakingNewsItem.imageFile;
      };

      //remove the breaking news item image just uploaded
      $editFBreakingNewsItemCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename;
         $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename = fbreakingNewsItem.imageFile;
         FBreakingNewsService.deleteFBreakingNewsItemImage(fileName).catch(function(err) {
            console.log(err);
         });
      }

      var imageRatio = null;
      //set image dimension
      switch($editFBreakingNewsItemCtrl.order) {
         case 1:  imageRatio = Utils.getImageRatio(settings.FBreakingNews.dimension1.width, settings.FBreakingNews.dimension1.height);
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeight = settings.FBreakingNews.dimension1.height;
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidth = settings.FBreakingNews.dimension1.width;
                  break;

         case 2:  imageRatio = Utils.getImageRatio(settings.FBreakingNews.dimension2.width, settings.FBreakingNews.dimension2.height);
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeight = settings.FBreakingNews.dimension2.height;
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidth = settings.FBreakingNews.dimension2.width;
                  break;

         case 3:  imageRatio = Utils.getImageRatio(settings.FBreakingNews.dimension3.width, settings.FBreakingNews.dimension3.height);
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeight = settings.FBreakingNews.dimension3.height;
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidth = settings.FBreakingNews.dimension3.width;
                  break;
         default:
                  imageRatio = Utils.getImageRatio(settings.FBreakingNews.dimension3.width, settings.FBreakingNews.dimension3.height);
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeight = settings.FBreakingNews.dimension3.height;
                  $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidth = settings.FBreakingNews.dimension3.width;
                  break;
      }
      $editFBreakingNewsItemCtrl.fbreakingNewsItemImageHeightRatio = imageRatio.height;
      $editFBreakingNewsItemCtrl.fbreakingNewsItemImageWidthRatio = imageRatio.width;

      var _checkAccessInput = false;

      $editFBreakingNewsItemCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $editFBreakingNewsItemCtrl.getAccessCallback = function(returnedFBreakingNewsItem, valid) {
         if(valid) {
            FBreakingNewsService.editFBreakingNewsItem(returnedFBreakingNewsItem).then(function(result) {
               FBreakingNewsService.setHighlightFBreakingNewsItemId(returnedFBreakingNewsItem.id);
               $state.go('fixedBreakingNews.list', { infoMessage: _templateMessage( messages.fbreakingNewsItemChanged,
                                                                                    { 'order': fbreakingNewsItem.order })
                                                   });
            }).catch(function(error) {
               $editFBreakingNewsItemCtrl.errorMessage = error.message;
            });
         }
      }

      $editFBreakingNewsItemCtrl.dateValidator = function() {
         if (!$editFBreakingNewsItemCtrl.dateDisabled) {
            return $editFBreakingNewsItemCtrl.editFBreakingNewsItemForm.date.$viewValue;
         } else {
            return true;
         }
      }

      $editFBreakingNewsItemCtrl.isValid = function() {
         return $editFBreakingNewsItemCtrl.editFBreakingNewsItemForm.$valid &&
                     $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename &&
                           _checkAccessInput;
      }

      $editFBreakingNewsItemCtrl.save = function () {
         $editFBreakingNewsItemCtrl.editFBreakingNewsItemForm.$setSubmitted();
         if ($editFBreakingNewsItemCtrl.isValid()) {
            var fbreakingNewsItemToBeSaved = {
               id: fbreakingNewsItem.id,
               imageFile: $editFBreakingNewsItemCtrl.fbreakingNewsItemImageFilename,
               headline: $editFBreakingNewsItemCtrl.headline,
               headlineIcon: $editFBreakingNewsItemCtrl.selectedHeadlineIcon,
               title: $editFBreakingNewsItemCtrl.title,
               date: $editFBreakingNewsItemCtrl.date
            }
            $scope.$broadcast('request-access-property', fbreakingNewsItemToBeSaved);
         }
      }

      $editFBreakingNewsItemCtrl.resetAccess = function() {
         AccessService.resetAccess($editFBreakingNewsItemCtrl, fbreakingNewsItem);
      }

   }

})();
