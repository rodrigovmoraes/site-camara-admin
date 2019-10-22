(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('BreakingNewsService', BreakingNewsService);

   BreakingNewsService.$inject = [ 'HttpDispatcherService',
                                   'settings',
                                   'uuid',
                                   'ImageProcessingSocketIO',
                                   'FileUploader',
                                   'AuthenticationService' ];
   function BreakingNewsService( HttpDispatcherService,
                                 settings,
                                 uuid,
                                 imageProcessingSocketIO,
                                 FileUploader,
                                 AuthenticationService
                               ) {
      var breakingNewsService = this;

      breakingNewsService.saveNewBreakingNewsItem = function(breakingNewsItem) {
         return HttpDispatcherService.put('/breakingNews',
                                          { 'breakingNewsItem':  breakingNewsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      breakingNewsService.editBreakingNewsItem = function(breakingNewsItem) {
         return HttpDispatcherService.post('/breakingNews',
                                          { 'breakingNewsItem':  breakingNewsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      breakingNewsService.getBreakingNewsItems = function () {
         return HttpDispatcherService.get('/breakingNews').then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      breakingNewsService.getBreakingNewsItem = function (breakingNewsItemId) {
         return HttpDispatcherService.get('/breakingNews/' + breakingNewsItemId).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      breakingNewsService.moveBreakingNewsItemUp = function (breakingNewsItemId) {
         return HttpDispatcherService.get('/breakingNews/' + breakingNewsItemId + "/moveUp").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      breakingNewsService.moveBreakingNewsItemDown = function (breakingNewsItemId) {
         return HttpDispatcherService.get('/breakingNews/' + breakingNewsItemId + "/moveDown").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      breakingNewsService.deleteBreakingNewsItem = function(breakingNewsItemId) {
         return HttpDispatcherService.delete('/breakingNews/' + breakingNewsItemId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      breakingNewsService.getNewBreakingNewsItemImageUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/breakingNews/image/' + uuid.v4(),
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

      breakingNewsService.deleteBreakingNewsItemImage = function(fileName) {
         var fileNameParam = fileName ? fileName : '';
         return HttpDispatcherService.delete('/breakingNews/image/' + fileNameParam).then(function(result) {
                                               return result.data;
                                            }).catch(function(error) {
                                               throw error
                                            });
      }

      breakingNewsService.requestBreakingNewsItemImageToBeResized = function(fileName, callback) {
         imageProcessingSocketIO.emit( 'resizeBreakingNewsImage',
                                       { 'fileName': fileName,
                                         'jwtToken': AuthenticationService.getToken() },
         function(data) {
               callback(data);
         });
      }

      //id of the breaking news item to be highlighted
      var _highlightBreakingNewsItemId = null;
      breakingNewsService.setHighlightBreakingNewsItemId  = function (breakingNewsItemId) {
         _highlightBreakingNewsItemId = breakingNewsItemId;
      }

      breakingNewsService.getHighlightBreakingNewsItemId = function () {
         return _highlightBreakingNewsItemId;
      }

      breakingNewsService.clearHighlightBreakingNewsItemId  = function () {
         _highlightBreakingNewsItemId = null;
      }
   }
})();
