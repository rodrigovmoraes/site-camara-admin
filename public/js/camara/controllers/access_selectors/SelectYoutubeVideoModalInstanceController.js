(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectYoutubeVideoModalInstanceController', SelectYoutubeVideoModalInstanceController);

   SelectYoutubeVideoModalInstanceController.$inject = [ '$scope', 'Utils',
                                                         'settings', 'messages',
                                                         '$uibModalInstance', 'YoutubeService']
   function SelectYoutubeVideoModalInstanceController( $scope, Utils,
                                                       settings, messages,
                                                       $uibModalInstance, YoutubeService ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      var _selectDefaultChannel = function(channels) {
         if (channels) {
            var i;
            for(i = 0; i < channels.length; i++) {
               if(channels[i].default) {
                  return channels[i];
               }
            }
            return null;
         } else {
            return null;
         }
      }

      $modalCtrl.keywords = "";
      $modalCtrl.channels = settings.YoutubeConnect.channels;
      $modalCtrl.selectedChannel = _selectDefaultChannel(settings.YoutubeConnect.channels);
      $modalCtrl.videos = null;
      $modalCtrl.searchResult = null;
      var searchOptions = {
         channelId: null,
         query: null,
         maxResults: 4
      };
      $modalCtrl.searchSent = false;
      $modalCtrl.youtubeUrlBase = settings.YoutubeConnect.youtubeUrlBase;
      //set initial searchOptions
      searchOptions.channelId = $modalCtrl.selectedChannel ? $modalCtrl.selectedChannel.id : null;
      searchOptions.playlistId = $modalCtrl.selectedChannel ? $modalCtrl.selectedChannel.playlistId : null;

      var _updateResult = function() {
            searchOptions.channelId = $modalCtrl.selectedChannel ? $modalCtrl.selectedChannel.id : null;
            searchOptions.playlistId = $modalCtrl.selectedChannel ? $modalCtrl.selectedChannel.playlistId : null;
            searchOptions.query = $modalCtrl.keywords;
            //BEGIN - searchVideos
            var __searchVideos = function() {
               if (searchOptions.playlistId) {
                  return YoutubeService.searchVideos( searchOptions )
                                .then(function(result) {
                     $modalCtrl.videos = result.videos;
                     $modalCtrl.searchResult = result;
                     if (!result.videos || result.videos.length === 0) {
                        $modalCtrl.notFoundMessage = messages.bannerYoutubeVideosNotFound;
                     }
                  });
               } else {
                  _clear();
                  $modalCtrl.videos = [];
               }
            }
            //END - searchVideos

            if(Utils.hasJustOneToken(searchOptions.query)) {
               YoutubeService.searchVideoById(searchOptions.query)
                             .then(function(result) {
                                if (result) {
                                   $modalCtrl.videos = result.videos;
                                   $modalCtrl.searchResult = result;
                                   return true;
                                } else {
                                   return false;
                                }
                             }).then(function(found) {
                                if(!found) {
                                   return __searchVideos();
                                }
                             }).catch(function(error) {
                                $modalCtrl.errorMessage = error.message;
                             });
            } else {
               __searchVideos();
            }
      };

      var _clear = function() {
         $modalCtrl.selectedVideo = null;
         $modalCtrl.infoMessage = null;
         $modalCtrl.notFoundMessage = null;
      };

      $modalCtrl.selectVideo = function(video) {
         $modalCtrl.selectedVideo = video;
         $modalCtrl.infoMessage = _templateMessage( messages.bannerYoutubeVideoSelected,
                                                    { videoTitle: video.title });
      };

      $modalCtrl.selectChannel = function(channel) {
         $modalCtrl.selectedChannel = channel;
         searchOptions.pageToken = null; //reset the pagination
         _updateResult();
      };

      $modalCtrl.search = function() {
         $modalCtrl.searchSent = true;
         _clear();
         searchOptions.pageToken = null; //reset the pagination
         _updateResult();
      };

      $modalCtrl.searchToPage = function(pageToken) {
         if(pageToken) {
            searchOptions.pageToken = pageToken;
            _updateResult();
         }
      };

      $modalCtrl.ok = function() {
         $uibModalInstance.close($modalCtrl.selectedVideo);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      };

      _updateResult();

   }
})();
