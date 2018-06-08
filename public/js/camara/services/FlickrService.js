(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('FlickrService', FlickrService);

   FlickrService.$inject = [ 'settings', '$http', 'messages' ];
   function FlickrService( settings, $http, messages ) {
      var flickrService = this;

      //map errors received from the server to appropriate error message
      var _handleError = function(error) {
         if(!error.data) {
           //network error
           error.message = messages.serverCommunicationError;
        } else {
           error.message = error.data;
        }
        throw error;
      };

      flickrService.getPhotosets = function(userId) {
         var params = {
            'method' : "flickr.photosets.getList",
            'api_key' : settings.FlickrService.apiKey,
            'user_id' : userId,
            'format' : 'json',
            'primary_photo_extras' : 'path_alias,url_s',
            'nojsoncallback' : 1
         };
         return $http.get( settings.FlickrService.baseUrl, {
                        'params': params
                      }).then(function(result) {
                         if(result.data.photosets && result.data.photosets.photoset) {
                            var photosetsResult = [];
                            var photosets = result.data.photosets.photoset;
                            //process the result
                            var i = 0;
                            for(i = 0; i < photosets.length; i++) {
                               var photoset = photosets[i];
                               photosetsResult.push({
                                  title: photoset.title && photoset.title._content ?
                                                photoset.title._content : "",
                                  description: photoset.description && photoset.description._content ?
                                                   photoset.description._content : "",
                                  id: photoset.id,
                                  path: photoset.primary_photo_extras && photoset.primary_photo_extras.pathalias
                                                      ? photoset.primary_photo_extras.pathalias : "",
                                  thumbnailUrl: photoset.primary_photo_extras && photoset.primary_photo_extras.url_s
                                                      ? photoset.primary_photo_extras.url_s : "",
                                  thumbnailHeight: photoset.primary_photo_extras && photoset.primary_photo_extras.height_s
                                                      ? photoset.primary_photo_extras.height_s : 0,
                                  thumbnailWidth: photoset.primary_photo_extras && photoset.primary_photo_extras.width_s
                                                      ? photoset.primary_photo_extras.width_s : 0,
                                  creationDate: new Date(parseInt(photoset.date_create * 1000))
                               });
                            }
                            return photosetsResult;
                         } else {
                            return null;
                         }
                      }).catch(function(error) {
                            _handleError(error);
                      });
      };
   }
})();
