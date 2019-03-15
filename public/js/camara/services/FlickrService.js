(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('FlickrService', FlickrService);

   FlickrService.$inject = [ 'settings', '$http', 'messages', 'Utils' ];
   function FlickrService( settings, $http, messages, Utils ) {
      //config vars, migrate this to config file
      var _flickrApiBaseUrl = settings.FlickrService.baseUrl; //Ex, "https://api.flickr.com/services/rest/"
      var _flickrApiKey = settings.FlickrService.apiKey; //
      var _flickrApiGetPhotosMethod = settings.FlickrService.getPhotosMethod; //Ex, "flickr.photosets.getPhotos"
      var _flickrApiGetPhotosetInfoMethod = settings.FlickrService.getPhotosetInfoMethod; //Ex, "flickr.photosets.getInfo"
      var _flickrApiGetPhotoInfoMethod = settings.FlickrService.getPhotoInfoMethod; //Ex, "flickr.photos.getInfo"
      var _flickrApiGetPhotosetsMethod = settings.FlickrService.getPhotosetsMethod; //Ex, "flickr.photosets.getList"
      var _flickrApiUserId = settings.FlickrService.userId;
      var _flickrPhotoUrlPattern = settings.FlickrService.photoUrlPattern; //Ex, "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_{image_type}.jpg"
      var _flickrPhotoPageUrlPattern = settings.FlickrService.photoPageUrlPattern; //Ex, https://www.flickr.com/photos/{owner}/{photoId}/;
      var _unexpectedFlickrDataFormatErrorMessage = settings.FlickrService.unexpectedFlickrDataFormatErrorMessage;
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
            'method' : _flickrApiGetPhotosetsMethod,
            'api_key' : _flickrApiKey,
            'user_id' : userId,
            'format' : 'json',
            'primary_photo_extras' : 'path_alias,url_s',
            'nojsoncallback' : 1
         };
         return $http.get( _flickrApiBaseUrl, {
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

      flickrService.getPhotoThumbnailUrlsFromSet = function(userId, photoSetId, imageType) {
         // assume large square 150x150 thumbnail format if imageType
         // is not defined by the caller
         if(imageType === undefined) {
            imageType = 'q';
         }
         var lPhotos = null;
         var params = {
            'method' : _flickrApiGetPhotosMethod,
            'api_key' : _flickrApiKey,
            'user_id' : userId,
            'photoset_id': photoSetId,
            'format' : 'json',
            'nojsoncallback' : 1
         };
         return $http.get( _flickrApiBaseUrl, {
            'params': params
         }).then(function(result) {
               var data = result.data;
               //validate data from Flickr
               if (!data.photoset || !data.photoset.photo) {
                  var error = new Error(_unexpectedFlickrDataFormatErrorMessage);
                  throw error;
               } else {
                  //valid data
                  var photosFromFlickr = data.photoset.photo;
                  var photos = _.map(photosFromFlickr, function(photoItem, index) {
                                    return {
                                       url: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                  .replace('{server-id}', photoItem.server)
                                                                  .replace('{id}', photoItem.id)
                                                                  .replace('{secret}', photoItem.secret)
                                                                  .replace('{image_type}', imageType),
                                       url_sq: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 'sq'),
                                       url_q: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 'q'),
                                       url_t: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 't'),
                                       url_s: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 's'),
                                       url_n: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 'n'),
                                       url_m: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 'm'),
                                      url_z: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                   .replace('{server-id}', photoItem.server)
                                                                   .replace('{id}', photoItem.id)
                                                                   .replace('{secret}', photoItem.secret)
                                                                   .replace('{image_type}', 'z'),
                                       url_c: _flickrPhotoUrlPattern.replace('{farm-id}', photoItem.farm)
                                                                    .replace('{server-id}', photoItem.server)
                                                                    .replace('{id}', photoItem.id)
                                                                    .replace('{secret}', photoItem.secret)
                                                                    .replace('{image_type}', 'c'),
                                       title: photoItem.title,
                                       photoid: photoItem.id,
                                       farm: photoItem.farm,
                                       server: photoItem.server,
                                       id: photoItem.id,
                                       secret: photoItem.secret
                                    };
                               });
                  lPhotos = photos;
                  return flickrService.getPhotosetInfo(data.photoset.id, data.photoset.owner);
               }
         }).then(function(result) {
            return {  'title': result ? result.photoset.title._content : '',
                      'description': result ? result.photoset.description._content : '',
                      'id': result ? result.photoset.id : '',
                      'owner' : result ? result.photoset.owner : '',
                      'creationDate': result ? Utils.dateToDDMMYYYYFormat(new Date(parseInt(result.photoset.date_create) * 1000)) : '',
                      'photos': lPhotos
                   }
         });
      }

      flickrService.getPagePhotosFromSet = function(userId, photoSetId, imageType, ppage, ppageSize) {
         return flickrService.getPhotoThumbnailUrlsFromSet(userId, photoSetId, imageType)
                              .then(function(result) {
                                 if(result && result.photos && result.photos.length > 0) {
                                    //do pagination
                                    var photos = result.photos;
                                    var total = photos ? photos.length : 0;
                                    var page = parseInt(ppage) < 0 || isNaN(ppage) ? 1 : parseInt(ppage);
                                    var pageSize = parseInt(ppageSize) < 0 || isNaN(ppageSize) ? 1 : parseInt(ppageSize);
                                    var pageCount = Math.ceil(photos.length / pageSize);
                                    page = page > pageCount ? pageCount : page;
                                    result.photos = _.slice(photos, (page - 1) * pageSize, page * pageSize);
                                    return {
                                       'flickrPhotosetTitle': result.title,
                                       'flickrPhotosetDescription': result.description,
                                       'flickrPhotosetId': result.id,
                                       'flickrPhotosetOwner': result.owner,
                                       'flickrPhotosetCreationDateDescription': result.creationDate,
                                       'flickrPhotosetPhotos': result.photos,
                                       'pageCount': pageCount,
                                       'page': page,
                                       'total': total,
                                       'setId': photoSetId

                                    };
                                 } else {
                                    return {
                                       'flickrPhotosetTitle': result.title,
                                       'flickrPhotosetDescription': result.description,
                                       'flickrPhotosetId': result.id,
                                       'flickrPhotosetOwner': result.owner,
                                       'flickrPhotosetCreationDateDescription': result.creationDate,
                                       'flickrPhotosetPhotos': [],
                                       'pageCount': 1,
                                       'page': 1,
                                       'total': 0,
                                       'setId': photoSetId
                                    };
                                 }
                              });
      }

      flickrService.getPhotosetInfo = function(photoSetId, userId) {
         var params = {
            'method' : _flickrApiGetPhotosetInfoMethod,
            'api_key' : _flickrApiKey,
            'user_id' : userId,
            'photoset_id': photoSetId,
            'format' : 'json',
            'nojsoncallback' : 1
         };
         return $http.get( _flickrApiBaseUrl, {
            'params': params
         }).then(function(result) {
            return result.data;
         });
      }

   }
})();
