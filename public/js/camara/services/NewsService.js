(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('NewsService', NewsService);

   NewsService.$inject = [ 'HttpDispatcherService', 'settings',
                           'FileUploader', 'uuid',
                           'ImageProcessingSocketIO', 'AuthenticationService'
                         ];
   function NewsService( HttpDispatcherService, settings,
                         FileUploader, uuid,
                         imageProcessingSocketIO, AuthenticationService
                       ) {
      var newsService = this;

      newsService.getNewThumbnailUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/newsItem/thumbnail/' + uuid.v4(),
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
      };

      newsService.newNewsItem = function(newsItem) {
         return HttpDispatcherService.put('/newsItem',
                                          { 'newsItem':  newsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      newsService.saveNewsItem = function(newsItem) {
         return HttpDispatcherService.post('/newsItem',
                                          { 'newsItem':  newsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      newsService.deleteNewsItem = function(newsItemId) {
         return HttpDispatcherService.delete('/newsItem/' + newsItemId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      newsService.deleteThumbnail = function(fileName) {
         var fileNameParam = fileName ? fileName : '';
         return HttpDispatcherService.delete('/newsItem/thumbnail/' + fileNameParam).then(function(result) {
                                               return result.data;
                                            }).catch(function(error) {
                                               throw error
                                            });
      }

      newsService.requestThumbnailToBeResized = function(fileName, callback) {
         imageProcessingSocketIO.emit( 'resizeNewsThumbnail',
                                       { 'fileName': fileName,
                                         'jwtToken': AuthenticationService.getToken() },
         function(data) {
               callback(data);
         });
      }

      newsService.getNews = function(pageOptions, filterOptions) {
         var params = {
            page: pageOptions.page,
            pageSize: pageOptions.pageSize
         };
         if(filterOptions) {
            if(filterOptions.keywords) {
               params.keywords = filterOptions.keywords;
            }
            if(filterOptions.date1) {
               params.date1 = filterOptions.date1;
            }
            if(filterOptions.date2) {
               params.date2 = filterOptions.date2;
            }
            if(filterOptions.publication) {
               params.publication = filterOptions.publication;
            }
            if(filterOptions.id) {
               params = {
                  id: filterOptions.id
               };
            }
         }
         return HttpDispatcherService.get('/newsItems',
                                         {
                                            'params': params
                                         }).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      };

      newsService.getNewsItem = function (newsItemId) {
         return HttpDispatcherService.get('/newsItem/' + newsItemId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      newsService.getUploadWysiwygFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.News.uploadWysiwygFileAttachmentURL;
      }

      newsService.getUploadWysiwygFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.News.uploadWysiwygFileImageAttachmentURL;
      }

      newsService.getUploadWysiwygFileVideoAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.News.uploadWysiwygFileVideoAttachmentURL;
      }

      //filtering and pagination options controller
      var _filterOptions = {
         id: null,
         date1: undefined,
         date2: undefined,
         keywords: '',
         publication: "ALL", //"ALL", "PUBLISHED", "TO_BE_PUBLISHED", "NOT_TO_BE_PUBLISHED"
         publicationDescription: "",

         dateOptions: {
             dateDisabled: false,
             formatYear: 'yyyy',
             maxDate: new Date(2100, 0, 1),
             minDate: 0,
             startingDay: 1
         },
         openDate1: function() {
            _filterOptions.date1IsOpen = true;
         },
         openDate2: function() {
            _filterOptions.date2IsOpen = true;
         },
         date1IsOpen: false,
         date2IsOpen: false
      };

      newsService.getFilterOptions = function () {
         return _filterOptions;
      }

      var _paginationOptions = {
         currentPage: 1,
         totalItems: 1,
         itemsPerPage: 5,
         maxSize: 10,
         totalPages: 1
      }

      newsService.getPaginationOptions = function () {
         return _paginationOptions;
      }

      //id of the news item to be highlighted
      var _highlightNewsItemId = null;
      newsService.setHighlightNewsItemId  = function (newsItemId) {
         _highlightNewsItemId = newsItemId;
      }

      newsService.getHighlightNewsItemId  = function () {
         return _highlightNewsItemId;
      }

      newsService.clearHighlightNewsItemId  = function () {
         _highlightNewsItemId = null;
      }

   }
})();
