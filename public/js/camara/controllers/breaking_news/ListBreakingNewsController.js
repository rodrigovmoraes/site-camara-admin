(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('ListBreakingNewsController', ListBreakingNewsController);

   ListBreakingNewsController.$inject = [ '$scope', 'Utils',
                                          'settings', 'messages',
                                          '$uibModal', 'BreakingNewsService', '$stateParams']
   function ListBreakingNewsController( $scope, Utils,
                                        settings, messages,
                                        $uibModal, BreakingNewsService, $stateParams ) {
      var $listBreakingNewsCtrl = this;

      //messages control
      Utils.applyMessageControls($listBreakingNewsCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $listBreakingNewsCtrl.linkTargets = {
         "_blank" : "abre em uma nova janela",
         "_parent" : "abre na mesma janela",
         "specific" : null
      };
      //to show youtube videos for youtube access type
      $listBreakingNewsCtrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //to show youtube channel live for youtube_live access type
      $listBreakingNewsCtrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;
      //to show flickr photsets for flickr access type
      $listBreakingNewsCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      //to show news for news access type
      $listBreakingNewsCtrl.newsUrlBase = settings.News.newsUrlBase;
      //to show pages for page access type
      $listBreakingNewsCtrl.pageUrlBase = settings.Pages.pageUrlBase;;

      //messages
      $listBreakingNewsCtrl.errorMessage = $stateParams.errorMessage;
      $listBreakingNewsCtrl.infoMessage = $stateParams.infoMessage;
      $listBreakingNewsCtrl.notFoundMessage = messages.breakingNewsNotFound;

      var _updateBreakingNewsItemsList = function() {
         return BreakingNewsService.getBreakingNewsItems().then(function(result) {
            //mark the first and the last breaking news item for view control effects
            if(result.breakingNewsItems && result.breakingNewsItems.length > 0) {
               result.breakingNewsItems[0]['first'] = true;
               result.breakingNewsItems[result.breakingNewsItems.length - 1]['last'] = true;
            }
            $listBreakingNewsCtrl.breakingNewsItems = result.breakingNewsItems;
            $listBreakingNewsCtrl.highlightBreakingNewsItemId = BreakingNewsService.getHighlightBreakingNewsItemId();
            BreakingNewsService.clearHighlightBreakingNewsItemId();
         });
      }

      _updateBreakingNewsItemsList().catch(function(error) {
         $listBreakingNewsCtrl.errorMessage = error.message;
      });

      $listBreakingNewsCtrl.targetDescription = function(targetTag) {
         return $listBreakingNewsCtrl.linkTargets[targetTag]
                  ? $listBreakingNewsCtrl.linkTargets[targetTag]
                     : targetTag;
      }

      $listBreakingNewsCtrl.accessDescription = function(type) {
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

      $listBreakingNewsCtrl.moveBreakingNewsItemUp = function(breakingNewsItem) {
         //if it isn't already the first
         if(breakingNewsItem.order > 1) {
            BreakingNewsService.moveBreakingNewsItemUp(breakingNewsItem.id).then(function(result) {
               BreakingNewsService.setHighlightBreakingNewsItemId(breakingNewsItem.id);
               $listBreakingNewsCtrl.infoMessage = _templateMessage( messages.breakingNewsItemMovedUp,
                                                                { 'oldOrder': breakingNewsItem.order,
                                                                  'newOrder': breakingNewsItem.order - 1 });
            }).then(function() {
               return _updateBreakingNewsItemsList();
            }).catch(function(error) {
               $listBreakingNewsCtrl.errorMessage = error.message;
            });
         }
      }

      $listBreakingNewsCtrl.moveBreakingNewsItemDown = function(breakingNewsItem) {
         //if it isn't already the last
         if($listBreakingNewsCtrl.breakingNewsItems && breakingNewsItem.order < $listBreakingNewsCtrl.breakingNewsItems.length) {
            BreakingNewsService.moveBreakingNewsItemDown(breakingNewsItem.id).then(function(result) {
               BreakingNewsService.setHighlightBreakingNewsItemId(breakingNewsItem.id);
               $listBreakingNewsCtrl.infoMessage = _templateMessage( messages.breakingNewsItemMovedDown,
                                                                { 'oldOrder': breakingNewsItem.order,
                                                                  'newOrder': breakingNewsItem.order + 1 });
            }).then(function() {
               return _updateBreakingNewsItemsList();
            }).catch(function(error) {
               $listBreakingNewsCtrl.errorMessage = error.message;
            });
         }
      }

      $listBreakingNewsCtrl.remove = function (breakingNewsItem) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.breakingNewsItemRemoveDialogText,
                                               { 'order': breakingNewsItem.order })
               }
            }
         }).result.then(function() {
            BreakingNewsService.deleteBreakingNewsItem(breakingNewsItem.id).then(function(result) {
               _updateBreakingNewsItemsList().then(function() {
                  $listBreakingNewsCtrl.infoMessage = _templateMessage( messages.breakingNewsItemRemoved,
                                                                        { 'order': breakingNewsItem.order });
               })
               BreakingNewsService.deleteBreakingNewsItemImage(breakingNewsItem.imageFile).catch(function(err) {
                  console.log(err);
               });
            }).catch(function(error) {
               $listBreakingNewsCtrl.errorMessage = error.message;
            });
         });
      }

   }

})();
