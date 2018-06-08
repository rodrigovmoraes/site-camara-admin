(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('ListFBreakingNewsController', ListFBreakingNewsController);

   ListFBreakingNewsController.$inject = [ '$scope', 'Utils',
                                           'settings', 'messages',
                                           '$uibModal', 'FBreakingNewsService', '$stateParams']
   function ListFBreakingNewsController( $scope, Utils,
                                        settings, messages,
                                        $uibModal, FBreakingNewsService, $stateParams ) {
      var $listFBreakingNewsCtrl = this;

      //messages control
      Utils.applyMessageControls($listFBreakingNewsCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $listFBreakingNewsCtrl.linkTargets = {
         "_blank" : "abre em uma nova janela",
         "_parent" : "abre na mesma janela",
         "specific" : null
      };
      //image dimensions
      $listFBreakingNewsCtrl.width1 = settings.FBreakingNews.dimension1.width;
      $listFBreakingNewsCtrl.height1 = settings.FBreakingNews.dimension1.heigth;
      $listFBreakingNewsCtrl.width2 = settings.FBreakingNews.dimension2.width;
      $listFBreakingNewsCtrl.height2 = settings.FBreakingNews.dimension2.heigth;
      $listFBreakingNewsCtrl.width3 = settings.FBreakingNews.dimension3.width;
      $listFBreakingNewsCtrl.height3 = settings.FBreakingNews.dimension3.heigth;
      //to show youtube videos for youtube access type
      $listFBreakingNewsCtrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //to show youtube channel live for youtube_live access type
      $listFBreakingNewsCtrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;
      //to show flickr photsets for flickr access type
      $listFBreakingNewsCtrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      //to show news for news access type
      $listFBreakingNewsCtrl.newsUrlBase = settings.News.newsUrlBase;
      //to show pages for page access type
      $listFBreakingNewsCtrl.pageUrlBase = settings.Pages.pageUrlBase;;

      //messages
      $listFBreakingNewsCtrl.errorMessage = $stateParams.errorMessage;
      $listFBreakingNewsCtrl.infoMessage = $stateParams.infoMessage;
      $listFBreakingNewsCtrl.notFoundMessage = messages.fbreakingNewsNotFound;

      var _updateFBreakingNewsItemsList = function() {
         return FBreakingNewsService.getFBreakingNewsItems().then(function(result) {
            //mark the first and the last breaking news item for view control effects
            if(result.fbreakingNewsItems && result.fbreakingNewsItems.length > 0) {
               result.fbreakingNewsItems[0]['first'] = true;
               result.fbreakingNewsItems[result.fbreakingNewsItems.length - 1]['last'] = true;
            }
            $listFBreakingNewsCtrl.fbreakingNewsItems = result.fbreakingNewsItems;
            $listFBreakingNewsCtrl.highlightFBreakingNewsItemId = FBreakingNewsService.getHighlightFBreakingNewsItemId();
            FBreakingNewsService.clearHighlightFBreakingNewsItemId();
         });
      }

      _updateFBreakingNewsItemsList().catch(function(error) {
         $listFBreakingNewsCtrl.errorMessage = error.message;
      });

      $listFBreakingNewsCtrl.targetDescription = function(targetTag) {
         return $listFBreakingNewsCtrl.linkTargets[targetTag]
                  ? $listFBreakingNewsCtrl.linkTargets[targetTag]
                     : targetTag;
      }

      $listFBreakingNewsCtrl.accessDescription = function(type) {
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

      $listFBreakingNewsCtrl.remove = function (fbreakingNewsItem) {
         $uibModal.open({
            templateUrl: 'tpl/camara/includes/confirm.html',
            animation: false,
            size: 'md',
            controller: 'ConfirmModalInstanceController',
            controllerAs: '$modalCtrl',
            scope: $scope,
            resolve: {
               texts: {
                  'message': _templateMessage( messages.fbreakingNewsItemRemoveDialogText,
                                               { 'order': fbreakingNewsItem.order })
               }
            }
         }).result.then(function() {
            FBreakingNewsService.deleteFBreakingNewsItem(fbreakingNewsItem.id).then(function(result) {
               _updateFBreakingNewsItemsList().then(function() {
                  $listFBreakingNewsCtrl.infoMessage = _templateMessage( messages.fbreakingNewsItemRemoved,
                                                                        { 'order': fbreakingNewsItem.order });
               })
               FBreakingNewsService.deleteFBreakingNewsItemImage(fbreakingNewsItem.imageFile).catch(function(err) {
                  console.log(err);
               });
            }).catch(function(error) {
               $listFBreakingNewsCtrl.errorMessage = error.message;
            });
         });
      }

   }

})();
