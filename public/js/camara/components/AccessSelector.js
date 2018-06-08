(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').component('accessSelector', {
         templateUrl: 'tpl/camara/components/access-selector.html',
         controller: 'AccessSelectorController',
         controllerAs: '$ctrl',
         bindings: {
            getAccess: '&',
            checkAccessInput: '&',
            obj: '<',
            form: '<',
            objDescription: '@',
            objDescriptionPrefix: '@'
         }
   });

   angular.module('SiteCamaraAdminApp').controller('AccessSelectorController', AccessSelectorController);
   AccessSelectorController.$inject = ['$scope', 'settings', '$uibModal'];
   function AccessSelectorController($scope, settings, $uibModal) {
      var $ctrl = this;

      //build the property access of the JSON object (used in banner,
      //portal menu item, ... objects)
      //to be sent to the API, each association type has to have a specific access
      //property format
      var _buildAccessProperty = function(ctrl) {
         var associationType = ctrl.selectedAssociationType;
         if(associationType) {
            switch(associationType.tag) {
                case "link":
                    return {
                       url: ctrl.url,
                       target: ctrl.selectedLinkTarget.tag === 'specific' ? ctrl.targetName : ctrl.selectedLinkTarget.tag
                    }
                case "news":
                     return {
                        id: ctrl.news.id,
                        publicationDate: ctrl.news.publicationDate,
                        thumbnailUrl: ctrl.news.thumbnailUrl,
                        title: ctrl.news.title
                     }
                case "page":
                      return {
                         creationDate: ctrl.page.creationDate,
                         id: ctrl.page.id,
                         title: ctrl.page.title,
                         _id: ctrl.page._id
                      }
                case "youtube":
                     return {
                        thumbnailUrl: ctrl.youtube.thumbnailUrl,
                        title: ctrl.youtube.title,
                        publishedAt: ctrl.youtube.publishedAt,
                        description: ctrl.youtube.description,
                        videoId: ctrl.youtube.videoId,
                        channelId: ctrl.youtube.channelId
                     }
               case "youtube_live":
                      return {
                         thumbnailUrl: ctrl.youtubeLive.thumbnailUrl,
                         title: ctrl.youtubeLive.title,
                         publishedAt: ctrl.youtubeLive.publishedAt,
                         description: ctrl.youtubeLive.description,
                         channelId: ctrl.youtubeLive.channelId
                      }
                case "flickr":
                      return {
                        title: ctrl.flickr.title,
                        description: ctrl.flickr.description,
                        id: ctrl.flickr.id,
                        path: ctrl.flickr.path,
                        thumbnailUrl: ctrl.flickr.thumbnailUrl,
                        thumbnailHeight: ctrl.flickr.thumbnailHeight,
                        thumbnailWidth: ctrl.flickr.thumbnailWidth,
                        creationDate: ctrl.flickr.creationDate,
                        thumbnailsShowMode: ctrl.flickrThumbnailsShowMode
                      }
                default:
                    return null;
            }
         } else {
            return null;
         }
      }

      var _processAccessProperty = function(ctrl, obj) {
         if(obj && obj.type) {
            switch(obj.type) {
                case "link":
                    ctrl.selectedLinkTargetTag = obj && obj.access ? obj.access.target : '_blank';
                    ctrl.selectedLinkTarget = _getLinkTarget(ctrl.selectedLinkTargetTag);
                    ctrl.url = obj ? obj.access.url : null;
                    break;
                case "news":
                    ctrl.news = obj ? obj.access : null;
                    break;
                case "page":
                    ctrl.page = obj ? obj.access : null;
                    break;
                case "youtube":
                    ctrl.youtube = obj ? obj.access : null;
                    break;
                case "youtube_live":
                    ctrl.youtubeLive = obj ? obj.access : null;
                    break;
                case "flickr":
                    ctrl.flickr = obj ? obj.access  : null;
                    ctrl.flickrThumbnailsShowMode = obj ? (obj.access.thumbnailsShowMode ? obj.access.thumbnailsShowMode : 'b')  : 'b';
                    break;
            }
         }
      }

      var _getLinkTarget = function (targetTag) {
         var availableTargets = settings.AccessProperty.association.linkTargets;
         var i = 0;
         var found = false;
         var target = null;
         for(i = 0; i < availableTargets.length && !found; i++) {
            target = availableTargets[i];
            if(targetTag === target.tag) {
               found = true;
            }
         }
         if(found) {
            return target;
         } else {
            availableTargets['specific']
         }
      }

      var _getAssociationType = function (typeTag) {
         var availableTypes = settings.AccessProperty.association.types;
         var i = 0;
         var found = false;
         var type = null;
         for(i = 0; i < availableTypes.length && !found; i++) {
            type = availableTypes[i];
            if(typeTag === type.tag) {
               found = true;
            }
         }
         if(found) {
            return type;
         } else {
            return null;
         }
      }

      //validate the access input for the selected access type
      var _checkAccessInput = function(ctrl) {
         var associationType = ctrl.selectedAssociationType;
         if(associationType) {
            switch(associationType.tag) {
                case "youtube":
                     return ctrl.checkYoutubeInput();
                case "youtube_live":
                     return ctrl.checkYoutubeLiveInput();
                case "flickr":
                     return ctrl.checkFlickrInput();
                case "news":
                     return ctrl.checkNewsInput();
                case "page":
                     return ctrl.checkPageInput();
                default:
                    return true;
            }
         } else {
            return true;
         }
      }

      var _resetAccess = function(ctrl, obj) {
         ctrl.selectedAssociationType = _getAssociationType(obj.type);
         _processAccessProperty(ctrl, obj);
         ctrl.accessReplaced = false;
      }

      var _markAccessChanged = function(ctrl) {
         ctrl.accessReplaced = true;
      }

      if(!$ctrl.obj) {
         $ctrl.obj = null;
      }
      if(!$ctrl.objDescription) {
         $ctrl.objDescription = "";
      }
      if(!$ctrl.objDescriptionPrefix) {
         $ctrl.objDescriptionPrefix = "";
      }
      $ctrl.associationTypes = settings.AccessProperty.association.types;
      $ctrl.selectedAssociationType = _getAssociationType($ctrl.obj && $ctrl.obj.type ? $ctrl.obj.type : 'link');
      $ctrl.accessReplaced = false;

      //link
      $ctrl.selectedLinkTargetTag = '_blank';
      $ctrl.selectedLinkTarget = _getLinkTarget($ctrl.selectedLinkTargetTag);
      $ctrl.url = null;
      $ctrl.linkTargets = settings.AccessProperty.association.linkTargets;
      //youtube
      $ctrl.youtube = null;
      $ctrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //check the input for youtube videos
      $ctrl.checkYoutubeInput = function() {
         return $ctrl.youtube !== null;
      }
      //youtube live channel
      $ctrl.youtubeLive = null;
      $ctrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;
      //check the input for youtube live channel videos
      $ctrl.checkYoutubeLiveInput = function() {
         return $ctrl.youtubeLive !== null;
      }
      //flickr
      $ctrl.flickr = null;
      $ctrl.flickrUrlBase = settings.FlickrService.visualizationBaseUrl;
      $ctrl.flickrThumbnailsShowMode = 'b';
      //check the input for flickr photosets
      $ctrl.checkFlickrInput = function() {
         return $ctrl.flickr !== null;
      }
      //news
      $ctrl.news = null;
      $ctrl.newsUrlBase = settings.News.newsUrlBase;
      $ctrl.checkNewsInput = function() {
         return $ctrl.news !== null;
      }
      //page
      $ctrl.page = null;
      $ctrl.pageUrlBase = settings.Pages.pageUrlBase;
      $ctrl.checkPageInput = function() {
         return $ctrl.page !== null;
      }
      _processAccessProperty($ctrl, $ctrl.obj);
      //config modals
      $ctrl.openSelectYoutubeVideo = function() {
         var youtubeFinder = $uibModal.open({
                                 templateUrl: 'tpl/camara/access_selectors/select-youtube-video.html',
                                 animation: false,
                                 size: 'md',
                                 controller: 'SelectYoutubeVideoModalInstanceController',
                                 controllerAs: '$modalCtrl',
                                 scope: $scope
                             });

         youtubeFinder.result.then(function(modalResult) {
            if(modalResult) {
               $ctrl.youtube = modalResult;
               _markAccessChanged($ctrl);
            }
         });
      }

      $ctrl.openSelectYoutubeLiveChannel = function() {
         var youtubeLiveChannelFinder = $uibModal.open({
                                 templateUrl: 'tpl/camara/access_selectors/select-youtube-live-channel.html',
                                 animation: false,
                                 size: 'md',
                                 controller: 'SelectYoutubeLiveChannelModalInstanceController',
                                 controllerAs: '$modalCtrl',
                                 scope: $scope
                             });

         youtubeLiveChannelFinder.result.then(function(modalResult) {
            if(modalResult) {
               $ctrl.youtubeLive = modalResult;
               _markAccessChanged($ctrl);
            }
         });
      }

      $ctrl.openSelectFlickrPhotoset = function() {
         var flickrFinder = $uibModal.open({
                                 templateUrl: 'tpl/camara/access_selectors/select-flickr-photoset.html',
                                 animation: false,
                                 size: 'md',
                                 controller: 'SelectFlickrPhotosetModalInstanceController',
                                 controllerAs: '$modalCtrl',
                                 scope: $scope
                             });

         flickrFinder.result.then(function(modalResult) {
            if(modalResult) {
               $ctrl.flickr = modalResult;
               _markAccessChanged($ctrl);
            }
         });
      }

      $ctrl.openSelectNews = function() {
         var newsFinder = $uibModal.open({
                                 templateUrl: 'tpl/camara/access_selectors/select-news-item.html',
                                 animation: false,
                                 size: 'md',
                                 controller: 'SelectNewsItemModalInstanceController',
                                 controllerAs: '$modalCtrl',
                                 scope: $scope
                             });

         newsFinder.result.then(function(modalResult) {
            if(modalResult) {
               $ctrl.news = modalResult;
               _markAccessChanged($ctrl);
            }
         });
      }

      $ctrl.openSelectPage = function() {
         var pageFinder = $uibModal.open({
                                 templateUrl: 'tpl/camara/access_selectors/select-page.html',
                                 animation: false,
                                 size: 'md',
                                 controller: 'SelectPageModalInstanceController',
                                 controllerAs: '$modalCtrl',
                                 scope: $scope
                           });

         pageFinder.result.then(function(modalResult) {
            if(modalResult) {
               $ctrl.page = modalResult;
               _markAccessChanged($ctrl);
            }
         });
      }

      $scope.$on('request-access-property', function(event, prmObj) {
         var valid = _checkAccessInput($ctrl);
         if(valid) {
            prmObj.type = $ctrl.selectedAssociationType.tag;
            prmObj.access = _buildAccessProperty($ctrl);
         }
         $ctrl.getAccess({ 'obj': prmObj,
                           'valid': valid });
      });

      //update the status of access input
      $scope.$watch('$ctrl.selectedAssociationType', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

      $scope.$watch('$ctrl.youtube', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

      $scope.$watch('$ctrl.youtubeLive', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

      $scope.$watch('$ctrl.flickr', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

      $scope.$watch('$ctrl.news', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

      $scope.$watch('$ctrl.page', function() {
         if($ctrl.checkAccessInput) {
            $ctrl.checkAccessInput({ 'valid': _checkAccessInput($ctrl) });
         }
      });

   }

}());
