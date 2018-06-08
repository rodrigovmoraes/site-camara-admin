(function() {
   'use strict';

   angular.module('SiteCamaraAdminApp').controller('SelectYoutubeLiveChannelModalInstanceController', SelectYoutubeLiveChannelModalInstanceController);

   SelectYoutubeLiveChannelModalInstanceController.$inject = [ '$scope', 'Utils',
                                                               'settings', 'messages',
                                                               '$uibModalInstance', 'YoutubeService']
   function SelectYoutubeLiveChannelModalInstanceController( $scope, Utils,
                                                             settings, messages,
                                                             $uibModalInstance, YoutubeService ) {
      var $modalCtrl = this;

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      $modalCtrl.keywords = "";
      $modalCtrl.channels = null;
      $modalCtrl.searchResult = null;
      var searchOptions = {
         query: null,
         maxResults: 4
      };
      $modalCtrl.searchSent = false;
      $modalCtrl.youtubeLiveChannelUrlBase = settings.YoutubeConnect.youtubeLiveChannelUrlBase;

      var _updateResult = function() {

         //BEGIN: __handleResult
         var __handleResult = function(result) {
            $modalCtrl.channels = result.channels;
            $modalCtrl.searchResult = result;
            if (!result.channels || result.channels.length === 0) {
               $modalCtrl.notFoundMessage = messages.bannerYoutubeLiveChannelNotFound;
            }
         }
         //END: __handleResult
         if (searchOptions.pageToken) {
            //page processing (second request onwards)
            searchOptions.query = $modalCtrl.keywords;
            searchOptions.channelId = null;

            YoutubeService.searchChannels( searchOptions )
                          .then(function(result) {
                             __handleResult(result);
                          }).catch(function(error) {
                            $modalCtrl.errorMessage = error.message;
                          });
         } else {

            if(Utils.hasJustOneToken($modalCtrl.keywords)) {
               searchOptions.query = null;
               searchOptions.channelId = $modalCtrl.keywords;
               var cont = false;

               //first, try searching by id channel
               YoutubeService.searchChannels( searchOptions )
                             .then(function(result) {
                     __handleResult(result);
               }).catch(function(error) {
                  //if it didn´t work try searching by keywords
                  searchOptions.query = searchOptions.channelId;
                  searchOptions.channelId = null;
                  cont = true;
                  return YoutubeService.searchChannels( searchOptions );
               }).then(function(result) {
                  if(cont) {
                     __handleResult(result);
                  }
               }).catch(function(error) {
                  $modalCtrl.errorMessage = error.message;
               });

            } else {
               searchOptions.query = $modalCtrl.keywords;
               searchOptions.channelId = null;

               YoutubeService.searchChannels( searchOptions )
                             .then(function(result) {
                                __handleResult(result);
                             }).catch(function(error) {
                               $modalCtrl.errorMessage = error.message;
                             });
            }
         }
      };

      var _clear = function() {
         $modalCtrl.selectedChannel = null;
         $modalCtrl.infoMessage = null;
         $modalCtrl.notFoundMessage = null;
         $modalCtrl.errorMessage = null;
      };

      $modalCtrl.selectChannel = function(channel) {
         $modalCtrl.selectedChannel = channel;
         $modalCtrl.infoMessage = _templateMessage( messages.bannerYoutubeLiveChannelSelected,
                                                    { channelTitle: channel.title });
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
         $uibModalInstance.close($modalCtrl.selectedChannel);
      };

      $modalCtrl.close = function() {
         $uibModalInstance.dismiss('cancel');
      };

   }
})();
