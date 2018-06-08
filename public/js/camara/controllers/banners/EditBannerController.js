(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('EditBannerController', EditBannerController);

   EditBannerController.$inject = [ '$scope', 'Utils',
                                    'settings', 'messages',
                                    '$uibModal', 'BannersService',
                                    '$state', 'banner']
   function EditBannerController( $scope, Utils,
                                  settings, messages,
                                  $uibModal, BannersService,
                                  $state, banner ) {
      var $editBannerCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $editBannerCtrl.order = banner.order;
      $editBannerCtrl.banner = banner;

      //the file name of the image chosen to be the banner
      $editBannerCtrl.bannerImageFilename = banner.imageFile;
      $editBannerCtrl.bannerImageURL = banner.imageFileURL;
      $editBannerCtrl.uploader = BannersService.getNewBannerImageUploader();

      //set the name of uploaded file
      $editBannerCtrl.uploader.onSuccessItem  = function( item, response,
                                                               status, headers ) {
         $editBannerCtrl.uploadBannerImageErrorMessage = "";
         $editBannerCtrl.bannerImageFilename = response.filename;
         if($editBannerCtrl.bannerImageFilename) {

            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });

            BannersService.requestBannerImageToBeResized($editBannerCtrl.bannerImageFilename, function(err) {
               if(err) {
                  console.log("Error while processing image: " + err.message);
                  $editBannerCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });

         }
      };

      //set the name of uploaded file
      $editBannerCtrl.uploader.onErrorItem  = function( item, response,
                                                        status, headers ) {
         $editBannerCtrl.uploadBannerImageErrorMessage = response.message;
         $editBannerCtrl.bannerImageFilename = banner.imageFile;
      };

      //remove the banner image just uploaded
      $editBannerCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $editBannerCtrl.bannerImageFilename;
         $editBannerCtrl.bannerImageFilename = banner.imageFile;
         BannersService.deleteBannerImage(fileName).catch(function(err) {
            console.log(err);
         });
      }

      var imageRatio = Utils.getImageRatio(settings.Banners.image.width, settings.Banners.image.height);
      $editBannerCtrl.bannerHeight = settings.Banners.image.height;
      $editBannerCtrl.bannerWidth = settings.Banners.image.width;
      $editBannerCtrl.bannerHeightRatio = imageRatio.height;
      $editBannerCtrl.bannerWidthRatio = imageRatio.width;

      var _checkAccessInput = false;

      $editBannerCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $editBannerCtrl.getAccessCallback = function(returnedBanner, valid) {
         if(valid) {
            BannersService.editBanner(returnedBanner).then(function(result) {
               BannersService.setHighlightBannerId(returnedBanner.id);
               $state.go('banner.list', { infoMessage: _templateMessage( messages.bannerChanged,
                                                                         { 'order': banner.order })
                                        });
            }).catch(function(error) {
               $editBannerCtrl.errorMessage = error.message;
            });
         }
      }

      $editBannerCtrl.isValid = function() {
         return $editBannerCtrl.editBannerForm.$valid &&
                     $editBannerCtrl.bannerImageFilename &&
                           _checkAccessInput;
      }

      $editBannerCtrl.save = function () {
         $editBannerCtrl.editBannerForm.$setSubmitted();
         if ($editBannerCtrl.isValid()) {
            var bannerToBeSaved = {
               id: banner.id,               
               imageFile: $editBannerCtrl.bannerImageFilename
            }
            $scope.$broadcast('request-access-property', bannerToBeSaved);
         }
      }

      $editBannerCtrl.resetAccess = function() {
         AccessService.resetAccess($editBannerCtrl, banner);
      }

   }

})();
