(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('NewBannerController', NewBannerController);

   NewBannerController.$inject = [ '$scope', 'Utils',
                                   'settings', 'messages',
                                   '$uibModal', 'BannersService',
                                   '$state' ]
   function NewBannerController( $scope, Utils,
                                 settings, messages,
                                 $uibModal, BannersService,
                                 $state ) {
      var $newBannerCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //the file name of the image chosen to be the banner
      $newBannerCtrl.bannerImageFilename = undefined;
      $newBannerCtrl.uploader = BannersService.getNewBannerImageUploader();

      //set the name of uploaded file
      $newBannerCtrl.uploader.onSuccessItem  = function( item, response,
                                                         status, headers ) {
         $newBannerCtrl.uploadBannerImageErrorMessage = "";
         $newBannerCtrl.bannerImageFilename = response.filename;
         if($newBannerCtrl.bannerImageFilename) {

            var imageProcessingModal = $uibModal.open({
               templateUrl: 'tpl/camara/includes/image-processing.html',
               animation: false,
               backdrop: 'static',
               keyboard  : false,
               size: 'md'
            });

            BannersService.requestBannerImageToBeResized($newBannerCtrl.bannerImageFilename, function(err) {
               if(err) {
                  console.log("Error while processing image: " + err.message);
                  $newBannerCtrl.uploadThumbnailErrorMessage = err.message;
               }
               imageProcessingModal.close();
            });

         }
      };

      //set the name of uploaded file
      $newBannerCtrl.uploader.onErrorItem  = function( item, response,
                                                       status, headers ) {
         $newBannerCtrl.uploadBannerImageErrorMessage = response.message;
         $newBannerCtrl.bannerImageFilename = undefined;
      };

      //remove the banner image just uploaded
      $newBannerCtrl.removeFileItem = function(item) {
         item.remove();
         var fileName = $newBannerCtrl.bannerImageFilename;
         $newBannerCtrl.bannerImageFilename = null;
         BannersService.deleteBannerImage(fileName).catch(function(err) {
            console.log(err);
         });
      }
      //set image properties
      var imageRatio = Utils.getImageRatio(settings.Banners.image.width, settings.Banners.image.height);
      $newBannerCtrl.bannerHeight = settings.Banners.image.height;
      $newBannerCtrl.bannerWidth = settings.Banners.image.width;
      $newBannerCtrl.bannerHeightRatio = imageRatio.height;
      $newBannerCtrl.bannerWidthRatio = imageRatio.width;
      var _checkAccessInput = false;

      $newBannerCtrl.setIsAccessInputValidCallback = function(valid) {
         _checkAccessInput = valid;
      }

      $newBannerCtrl.getAccessCallback = function(returnedBanner, valid) {
         if(valid) {
            BannersService.saveNewBanner(returnedBanner).then(function(result) {
                 $state.go('banner.list', { infoMessage: messages.bannerCreated });
            }).catch(function(error) {
               $newBannerCtrl.errorMessage = error.message;
            });
         }
      }

      $newBannerCtrl.isValid = function() {
         return $newBannerCtrl.insertNewBannerForm.$valid &&
                     $newBannerCtrl.bannerImageFilename &&
                           _checkAccessInput;
      }

      $newBannerCtrl.save = function () {
         $newBannerCtrl.insertNewBannerForm.$setSubmitted();
         if ($newBannerCtrl.isValid()) {
            var banner = {
               imageFile: $newBannerCtrl.bannerImageFilename
            }
            $scope.$broadcast('request-access-property', banner);
         }
      }
   }

})();
