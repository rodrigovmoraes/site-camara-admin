(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('ListHotNewsController', ListHotNewsController);

   ListHotNewsController.$inject = [ '$scope', 'Utils',
                                     'settings', 'messages',
                                     '$uibModal', 'HotNewsService', '$stateParams']
   function ListHotNewsController( $scope, Utils,
                                   settings, messages,
                                   $uibModal, HotNewsService, $stateParams ) {
      var $listHotNewsCtrl = this;

      //messages control
      Utils.applyMessageControls($listHotNewsCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $listHotNewsCtrl.linkTargets = {
         "_blank" : "abre em uma nova janela",
         "_parent" : "abre na mesma janela",
         "specific" : null
      };
      //to show youtube videos for youtube access type
      $listHotNewsCtrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //to show youtube channel live for youtube_live access type
      $listHotNewsCtrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;
      //to show flickr photsets for flickr access type
      $listHotNewsCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      //to show news for news access type
      $listHotNewsCtrl.newsUrlBase = settings.News.newsUrlBase;
      //to show pages for page access type
      $listHotNewsCtrl.pageUrlBase = settings.Pages.pageUrlBase;;

      //messages
      $listHotNewsCtrl.errorMessage = $stateParams.errorMessage;
      $listHotNewsCtrl.infoMessage = $stateParams.infoMessage;
      $listHotNewsCtrl.notFoundMessage = messages.hotNewsNotFound;

      var _updateHotNewsList = function() {
         return HotNewsService.getHotNews().then(function(result) {
            //mark the first and the last hot news item for view control effects
            if(result.hotNewsItems && result.hotNewsItems.length > 0) {
               result.hotNewsItems[0]['first'] = true;
               result.hotNewsItems[result.hotNewsItems.length - 1]['last'] = true;
            }
            $listHotNewsCtrl.hotNewsItems = result.hotNewsItems;
            $listHotNewsCtrl.highlightHotNewsItemId = HotNewsService.getHighlightHotNewsId();
            HotNewsService.clearHighlightHotNewsId();
         });
      }

      _updateHotNewsList().catch(function(error) {
         $listHotNewsCtrl.errorMessage = error.message;
      });

      $listHotNewsCtrl.targetDescription = function(targetTag) {
         return $listHotNewsCtrl.linkTargets[targetTag]
                  ? $listHotNewsCtrl.linkTargets[targetTag]
                     : targetTag;
      }

      $listHotNewsCtrl.accessDescription = function(type) {
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

      $listHotNewsCtrl.moveHotNewsItemUp = function(hotNewsItem) {
         //if it isn't already the first
         if(hotNewsItem.order > 1) {
            HotNewsService.moveHotNewsItemUp(hotNewsItem.id).then(function(result) {
               HotNewsService.setHighlightHotNewsId(hotNewsItem.id);
               $listHotNewsCtrl.infoMessage = _templateMessage( messages.hotNewsItemMovedUp,
                                                                { 'oldOrder': hotNewsItem.order,
                                                                  'newOrder': hotNewsItem.order - 1 });
            }).then(function() {
               return _updateHotNewsList();
            }).catch(function(error) {
               $listHotNewsCtrl.errorMessage = error.message;
            });
         }
      }

      $listHotNewsCtrl.moveHotNewsItemDown = function(hotNewsItem) {
         //if it isn't already the last
         if($listHotNewsCtrl.hotNewsItems && hotNewsItem.order < $listHotNewsCtrl.hotNewsItems.length) {
            HotNewsService.moveHotNewsItemDown(hotNewsItem.id).then(function(result) {
               HotNewsService.setHighlightHotNewsId(hotNewsItem.id);
               $listHotNewsCtrl.infoMessage = _templateMessage( messages.hotNewsItemMovedDown,
                                                                { 'oldOrder': hotNewsItem.order,
                                                                  'newOrder': hotNewsItem.order + 1 });
            }).then(function() {
               return _updateHotNewsList();
            }).catch(function(error) {
               $listHotNewsCtrl.errorMessage = error.message;
            });
         }
      }

      $listHotNewsCtrl.remove = function (hotNewsItem) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.hotNewsItemRemoveDialogText,
                                               { 'order': hotNewsItem.order } )
               }
            }
         }).result.then(function() {
            HotNewsService.deleteHotNewsItem(hotNewsItem.id).then(function(result) {
               _updateHotNewsList().then(function() {
                  $listHotNewsCtrl.infoMessage = _templateMessage( messages.hotNewsItemRemoved,
                                                                   { 'order': hotNewsItem.order });
               });
            }).catch(function(error) {
               $listHotNewsCtrl.errorMessage = error.message;
            });
         });
      }

   }

})();
