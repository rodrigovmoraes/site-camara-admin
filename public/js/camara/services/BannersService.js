(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('BannersService', BannersService);

   BannersService.$inject = [ 'HttpDispatcherService',
                              'settings',
                              'uuid',
                              'ImageProcessingSocketIO',
                              'FileUploader',
                              'AuthenticationService' ];
   function BannersService( HttpDispatcherService,
                            settings,
                            uuid,
                            imageProcessingSocketIO,
                            FileUploader,
                            AuthenticationService
                          ) {
      var bannersService = this;

      bannersService.saveNewBanner = function(banner) {
         return HttpDispatcherService.put('/banner',
                                          { 'banner':  banner })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      bannersService.editBanner = function(banner) {
         return HttpDispatcherService.post('/banner',
                                          { 'banner':  banner })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      bannersService.getBanners = function () {
         return HttpDispatcherService.get('/banners').then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      bannersService.getBanner = function (bannerId) {
         return HttpDispatcherService.get('/banner/' + bannerId).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      bannersService.moveBannerUp = function (bannerId) {
         return HttpDispatcherService.get('/banner/' + bannerId + "/moveUp").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      bannersService.moveBannerDown = function (bannerId) {
         return HttpDispatcherService.get('/banner/' + bannerId + "/moveDown").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      bannersService.deleteBanner = function(bannerId) {
         return HttpDispatcherService.delete('/banner/' + bannerId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      bannersService.getNewBannerImageUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/banner/image/' + uuid.v4(),
              autoUpload: true,
              method: 'PUT',
              headers: {
                 Authorization: 'Bearer ' + AuthenticationService.getToken()
              }
         });
         //file name filter
         uploader.filters.push( {
               name: 'imageFilter',
               fn: function(item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
               }
         });
         //keep just the last element in the queue
         uploader.onAfterAddingFile = function(fileItem) {
             if(uploader.queue.length > 1) {
                //remove all elements in the queue except the last one
                uploader.queue.splice(0, uploader.queue.length - 1);
             }
         };

         return uploader;
      }

      bannersService.deleteBannerImage = function(fileName) {
         var fileNameParam = fileName ? fileName : '';
         return HttpDispatcherService.delete('/banner/image/' + fileNameParam).then(function(result) {
                                               return result.data;
                                            }).catch(function(error) {
                                               throw error
                                            });
      }

      bannersService.requestBannerImageToBeResized = function(fileName, callback) {
         imageProcessingSocketIO.emit( 'resizeBannerImage',
                                       { 'fileName': fileName,
                                         'jwtToken': AuthenticationService.getToken() },
         function(data) {
               callback(data);
         });
      }

      //id of the banner to be highlighted
      var _highlightBannerId = null;
      bannersService.setHighlightBannerId  = function (bannerId) {
         _highlightBannerId = bannerId;
      }

      bannersService.getHighlightBannerId  = function () {
         return _highlightBannerId;
      }

      bannersService.clearHighlightBannerId  = function () {
         _highlightBannerId = null;
      }
   }
})();
