(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('YoutubeService', YoutubeService);

   YoutubeService.$inject = [ 'settings', '$http', 'messages' ];
   function YoutubeService( settings, $http, messages ) {
      var youtubeService = this;

      //map errors received from the server to appropriate error message
      var _handleError = function(error) {
        if (!error.data) {
           //network error
           error.message = messages.serverCommunicationError;
        } else {
           error.message = error.data.error.message;
        }
        throw error;
      }

      //check if there are elements in the page
      var _checkPageForChannels = function(pageToken, searchOptions, check) {
         if(check === undefined) {
            check = true;
         }
         if(check) {
            if(pageToken) {
               searchOptions.pageToken = pageToken;
               return youtubeService.searchChannels(searchOptions, false).then(function(result) {
                  if(result) {
                     return result.channels && result.channels.length > 0;
                  } else {
                     return false;
                  }
               });
            } else {
               return false;
            }
         } else {
            return false;
         }

      };

      youtubeService.searchChannels = function(searchOptions, checkPages) {
         if(checkPages === undefined) {
            checkPages = true;
         }
         var params = {
            'part' : "snippet",
            'maxResults' : searchOptions.maxResults,
            'order': "date",
            'type': "channel",
            'key' : settings.YoutubeConnect.Api.key
         };
         //youtube channel
         if(searchOptions.channelId) {
            params['channelId'] = searchOptions.channelId
         } else if(searchOptions.query) {
            params['q'] = searchOptions.query;
         }
         //pageToken
         if(searchOptions.pageToken) {
            params['pageToken'] = searchOptions.pageToken;
         }

         var prevPageCheck = false;
         var prevPageToken = null;
         var nextPageCheck = false
         var nextPageToken = null;
         var mainResult = null;
         var channels = [];
         //nextPageToken
         return $http
                  .get( settings.YoutubeConnect.Api.urlBase + "/" +
                        settings.YoutubeConnect.Api.urlsMethods.search, {
                        'params': params
                  }).then(function(result) {
                     if(result &&  result.data && result.data.items) {
                        mainResult = result;
                        var items = result.data.items;
                        var i;
                        for(i = 0; i < items.length; i++) {
                           var resultItem = items[i];
                           channels.push({
                              'channelId': resultItem.id.channelId,
                              'thumbnailUrl' : resultItem.snippet.thumbnails.default.url,
                              'title' : resultItem.snippet.channelTitle,
                              'description' : resultItem.snippet.description,
                              'live' : resultItem.snippet.liveBroadcastContent === 'live',
                              'publishedAt' : resultItem.snippet.publishedAt
                           });
                        }
                        prevPageToken = result.data.prevPageToken;
                        nextPageToken = result.data.nextPageToken;
                        return _checkPageForChannels(prevPageToken, searchOptions, checkPages);
                     } else {
                        mainResult = null;
                        return null;
                     }
                  }).then(function(result) { //prev page check
                     if (mainResult) {
                        prevPageCheck = result;
                        return _checkPageForChannels(nextPageToken, searchOptions, checkPages);
                     } else {
                        prevPageCheck = false;
                        return false;
                     }
                  }).then(function(result) { //next page check
                     nextPageCheck = result;
                     return { 'prevPageToken' : prevPageCheck ? prevPageToken : null,
                              'nextPageToken' : nextPageCheck ? nextPageToken : null,
                              'channels' : channels };
                  }).catch(function(error) {
                     _handleError(error);
                  });
      }

      youtubeService.searchVideos = function(searchOptions, checkPages) {
         if(checkPages === undefined) {
            checkPages = true;
         }
         var params = {
            'part' : "snippet",
            'maxResults' : searchOptions.maxResults,
            'key' : settings.YoutubeConnect.Api.key,
            'playlistId' : searchOptions.playlistId
         };
         //pageToken
         if(searchOptions.pageToken) {
            params['pageToken'] = searchOptions.pageToken;
         }
         var prevPageCheck = false;
         var prevPageToken = null;
         var nextPageCheck = false
         var nextPageToken = null;
         var mainResult = null;
         var videos = [];
         //nextPageToken
         return $http
                  .get( settings.YoutubeConnect.Api.urlBase + "/" +
                        settings.YoutubeConnect.Api.urlsMethods.playlistItems, {
                        'params': params
                  }).then(function(result) {
                     if(result &&  result.data && result.data.items) {
                        mainResult = result;
                        var items = result.data.items;
                        var i;
                        for(i = 0; i < items.length; i++) {
                           var resultItem = items[i];
                           videos.push({
                              'videoId': resultItem.snippet && resultItem.snippet.resourceId && resultItem.snippet.resourceId.videoId ? resultItem.snippet.resourceId.videoId : '' ,
                              'channelId' : resultItem.snippet && resultItem.snippet.channelId ? resultItem.snippet.channelId : '',
                              'thumbnailUrl' : resultItem.snippet && resultItem.snippet.thumbnails &&  resultItem.snippet.thumbnails.default && resultItem.snippet.thumbnails.default.url ? resultItem.snippet.thumbnails.default.url : '',
                              'title' : resultItem.snippet && resultItem.snippet.title ?  resultItem.snippet.title : '',
                              'description' : resultItem.snippet && resultItem.snippet.description ? resultItem.snippet.description : '',
                              'publishedAt' : resultItem.snippet && resultItem.snippet.publishedAt ? resultItem.snippet.publishedAt : ''
                           });
                        }
                        prevPageToken = result.data.prevPageToken;
                        nextPageToken = result.data.nextPageToken;
                        return { 'prevPageToken' : prevPageToken ? prevPageToken : null,
                                 'nextPageToken' : nextPageToken ? nextPageToken : null,
                                 'videos' : videos };

                     } else {
                        mainResult = null;
                        return null;
                     }
                  }).catch(function(error) {
                        _handleError(error);
                  });
      };

      youtubeService.searchVideoById = function(videoId) {
         var params = {
            'part' : "snippet",
            'type': "video",
            'key' : settings.YoutubeConnect.Api.key,
            'id' : videoId
         };

         return $http
                  .get( settings.YoutubeConnect.Api.urlBase + "/" +
                        settings.YoutubeConnect.Api.urlsMethods.videos, {
                        'params': params
                  }).then(function(result) {
                     if(result &&  result.data && result.data.items) {
                        var videos = [];
                        var items = result.data.items;
                        var i;
                        for(i = 0; i < items.length; i++) {
                           var resultItem = items[i];
                           videos.push({
                              'videoId': resultItem.id,
                              'channelId' : resultItem.snippet.channelId,
                              'thumbnailUrl' : resultItem.snippet.thumbnails.default.url,
                              'title' : resultItem.snippet.title,
                              'description' : resultItem.snippet.description,
                              'publishedAt' : resultItem.snippet.publishedAt
                           });
                        }
                        return videos.length > 0 ?
                                    { 'videos' : videos } :
                                    null;
                     } else {
                        return null;
                     }
                  }).catch(function(error) {
                     _handleError(error);
                  });
      }
   }
})();
