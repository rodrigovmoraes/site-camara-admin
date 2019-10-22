(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('PagesService', PagesService);

   PagesService.$inject = [ 'HttpDispatcherService', 'settings',
                            'FileUploader', 'uuid',
                            'ImageProcessingSocketIO', 'AuthenticationService', '$q'
                          ];
   function PagesService( HttpDispatcherService, settings,
                          FileUploader, uuid,
                          imageProcessingSocketIO, AuthenticationService, $q
                        ) {
      var PagesService = this;

      PagesService.newPage = function(page) {
         return HttpDispatcherService.put('/page',
                                          { 'page':  page })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      PagesService.savePage = function(page) {
         return HttpDispatcherService.post('/page',
                                          { 'page':  page })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      PagesService.deletePage = function(pageId) {
         return HttpDispatcherService.delete('/page/' + pageId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      PagesService.getPages = function(pageOptions, filterOptions) {
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
            if(filterOptions.id) {
               params = {
                  id: filterOptions.id
               };
            }
         }
         return HttpDispatcherService.get('/pages',
                                         {
                                            'params': params
                                         }).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      };

      PagesService.getPage = function (pageId) {
         return HttpDispatcherService.get('/page/' + pageId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      PagesService.getUploadWysiwygFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.Pages.uploadWysiwygFileAttachmentURL;
      }

      PagesService.getUploadWysiwygFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.Pages.uploadWysiwygFileImageAttachmentURL;
      }

      PagesService.getUploadWysiwygFileVideoAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.Pages.uploadWysiwygFileVideoAttachmentURL;
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

      PagesService.getFilterOptions = function () {
         return _filterOptions;
      }

      var _paginationOptions = {
         currentPage: 1,
         totalItems: 1,
         itemsPerPage: 5,
         maxSize: 10,
         totalPages: 1
      }

      PagesService.getPaginationOptions = function () {
         return _paginationOptions;
      }

      //id of the news item to be highlighted
      var _highlightPageId = null;
      PagesService.setHighlightPageId  = function (pageId) {
         _highlightPageId = pageId;
      }

      PagesService.getHighlightPageId  = function () {
         return _highlightPageId;
      }

      PagesService.clearHighlightPageId  = function () {
         _highlightPageId = null;
      }

      PagesService.checkUniqueTag = function(tag) {
         var defer = $q.defer();
         HttpDispatcherService.get('/page/checkUnique/' + tag).then(function(result) {
                                      var resultData = result.data;
                                      if(!resultData.exists) {
                                         defer.resolve(result.data)
                                      } else {
                                         defer.reject(result.data);
                                      }
                                  }).catch(function(error) {
                                       defer.reject(error);
                                  });
         return defer.promise;
      }

   }
})();
