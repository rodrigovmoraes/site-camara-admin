(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('ListBannersController', ListBannersController);

   ListBannersController.$inject = [ '$scope', 'Utils',
                                     'settings', 'messages',
                                     '$uibModal', 'BannersService', '$stateParams']
   function ListBannersController( $scope, Utils,
                                   settings, messages,
                                   $uibModal, BannersService, $stateParams ) {
      var $listBannersCtrl = this;

      //messages control
      Utils.applyMessageControls($listBannersCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $listBannersCtrl.linkTargets = {
         "_blank" : "abre em uma nova janela",
         "_parent" : "abre na mesma janela",
         "specific" : null
      };
      //to show youtube videos for youtube access type
      $listBannersCtrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //to show youtube channel live for youtube_live access type
      $listBannersCtrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;
      //to show flickr photsets for flickr access type
      $listBannersCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      //to show news for news access type
      $listBannersCtrl.newsUrlBase = settings.News.newsUrlBase;
      //to show pages for page access type
      $listBannersCtrl.pageUrlBase = settings.Pages.pageUrlBase;;

      //messages
      $listBannersCtrl.errorMessage = $stateParams.errorMessage;
      $listBannersCtrl.infoMessage = $stateParams.infoMessage;
      $listBannersCtrl.notFoundMessage = messages.bannersNotFound;

      var _updateBannerList = function() {
         return BannersService.getBanners().then(function(result) {
            //mark the first and the last banner for view control effects
            if(result.banners && result.banners.length > 0) {
               result.banners[0]['first'] = true;
               result.banners[result.banners.length - 1]['last'] = true;
            }
            $listBannersCtrl.banners = result.banners;
            $listBannersCtrl.highlightBannerId = BannersService.getHighlightBannerId();
            BannersService.clearHighlightBannerId();
         });
      }

      _updateBannerList().catch(function(error) {
         $listBannersCtrl.errorMessage = error.message;
      });

      $listBannersCtrl.targetDescription = function(targetTag) {
         return $listBannersCtrl.linkTargets[targetTag]
                  ? $listBannersCtrl.linkTargets[targetTag]
                     : targetTag;
      }

      $listBannersCtrl.accessDescription = function(type) {
         var associationTypes = settings.AccessProperty.association.types;
         if(associationTypes){
            var i;
            for(i = 0; i < associationTypes.length; i++) {
               var associationType = associationTypes[i];
               if(type === associationType.tag) {
                  return associationType.description;
               }
            }
            return type;
         } else {
            return type;
         }
      }

      $listBannersCtrl.moveBannerUp = function(banner) {
         //if it isn't already the first
         if(banner.order > 1) {
            BannersService.moveBannerUp(banner.id).then(function(result) {
               BannersService.setHighlightBannerId(banner.id);
               $listBannersCtrl.infoMessage = _templateMessage( messages.bannerMovedUp,
                                                                { 'oldOrder': banner.order,
                                                                  'newOrder': banner.order - 1 });
            }).then(function() {
               return _updateBannerList();
            }).catch(function(error) {
               $listBannersCtrl.errorMessage = error.message;
            });
         }
      }

      $listBannersCtrl.moveBannerDown = function(banner) {
         //if it isn't already the last
         if($listBannersCtrl.banners && banner.order < $listBannersCtrl.banners.length) {
            BannersService.moveBannerDown(banner.id).then(function(result) {
               BannersService.setHighlightBannerId(banner.id);
               $listBannersCtrl.infoMessage = _templateMessage( messages.bannerMovedDown,
                                                                { 'oldOrder': banner.order,
                                                                  'newOrder': banner.order + 1 });
            }).then(function() {
               return _updateBannerList();
            }).catch(function(error) {
               $listBannersCtrl.errorMessage = error.message;
            });
         }
      }

      $listBannersCtrl.remove = function (banner) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.bannerRemoveDialogText,
                                               { 'order': banner.order })
               }
            }
         }).result.then(function() {
            BannersService.deleteBanner(banner.id).then(function(result) {
               _updateBannerList().then(function() {
                  $listBannersCtrl.infoMessage = _templateMessage( messages.bannerRemoved,
                                                                   { 'order': banner.order });
               })
               BannersService.deleteBannerImage(banner.imageFile).catch(function(err) {
                  console.log(err);
               });
            }).catch(function(error) {
               $listBannersCtrl.errorMessage = error.message;
            });
         });
      }

   }

})();
