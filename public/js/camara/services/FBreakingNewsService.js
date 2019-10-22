(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('FBreakingNewsService', FBreakingNewsService);

   FBreakingNewsService.$inject = [ 'HttpDispatcherService',
                                    'settings',
                                    'uuid',
                                    'ImageProcessingSocketIO',
                                    'FileUploader',
                                    'AuthenticationService' ];
   function FBreakingNewsService( HttpDispatcherService,
                                  settings,
                                  uuid,
                                  imageProcessingSocketIO,
                                  FileUploader,
                                  AuthenticationService
                                ) {
      var fbreakingNewsService = this;

      fbreakingNewsService.editFBreakingNewsItem = function(fbreakingNewsItem) {
         return HttpDispatcherService.post('/fbreakingNews',
                                          { 'fbreakingNewsItem':  fbreakingNewsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      fbreakingNewsService.getFBreakingNewsItems = function () {
         return HttpDispatcherService.get('/fbreakingNews').then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      fbreakingNewsService.getFBreakingNewsItem = function (fbreakingNewsItemId) {
         return HttpDispatcherService.get('/fbreakingNews/' + fbreakingNewsItemId).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      fbreakingNewsService.deleteFBreakingNewsItem = function(fbreakingNewsItemId) {
         return HttpDispatcherService.delete('/fbreakingNews/' + fbreakingNewsItemId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      fbreakingNewsService.getNewFBreakingNewsItemImageUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/fbreakingNews/image/' + uuid.v4(),
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

      fbreakingNewsService.deleteFBreakingNewsItemImage = function(fileName) {
         var fileNameParam = fileName ? fileName : '';
         return HttpDispatcherService.delete('/fbreakingNews/image/' + fileNameParam).then(function(result) {
                                               return result.data;
                                            }).catch(function(error) {
                                               throw error
                                            });
      }

      fbreakingNewsService.requestFBreakingNewsItemImageToBeResized = function(fileName, width, height, callback) {
         imageProcessingSocketIO.emit( 'resizeFBreakingNewsImage',
                                     { 'fileName': fileName,
                                       'width': width,
                                       'height': height,
                                       'jwtToken': AuthenticationService.getToken() },
         function (data) {
               callback(data);
         });
      }

      //id of the fixed breaking news item to be highlighted
      var _highlightFBreakingNewsItemId = null;
      fbreakingNewsService.setHighlightFBreakingNewsItemId  = function (fbreakingNewsItemId) {
         _highlightFBreakingNewsItemId = fbreakingNewsItemId;
      }

      fbreakingNewsService.getHighlightFBreakingNewsItemId = function () {
         return _highlightFBreakingNewsItemId;
      }

      fbreakingNewsService.clearHighlightFBreakingNewsItemId  = function () {
         _highlightFBreakingNewsItemId = null;
      }
   }
})();
