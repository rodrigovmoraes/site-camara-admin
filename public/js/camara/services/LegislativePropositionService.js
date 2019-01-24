(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('LegislativePropositionService', LegislativePropositionService);

   LegislativePropositionService.$inject = [ 'HttpDispatcherService', 'settings',
                                             'FileUploader', 'uuid',
                                             'ImageProcessingSocketIO', 'AuthenticationService', '$q'
                                            ];
   function LegislativePropositionService( HttpDispatcherService, settings,
                                           FileUploader, uuid,
                                           imageProcessingSocketIO, AuthenticationService, $q
                                         ) {
      var LegislativePropositionService = this;

      LegislativePropositionService.newLegislativeProposition = function(legislativeProposition) {
         return HttpDispatcherService.put('/legislativeProposition',
                                          { 'legislativeProposition':  legislativeProposition })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionService.saveLegislativeProposition = function(legislativeProposition) {
         return HttpDispatcherService.post('/legislativeProposition',
                                          { 'legislativeProposition':  legislativeProposition })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionService.deleteLegislativeProposition = function(legislativePropositionId) {
         return HttpDispatcherService.delete('/legislativeProposition/' + legislativePropositionId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      LegislativePropositionService.getLegislativePropositions = function( legislativePropositionOptions,
                                                                           filterOptions,
                                                                           sortOptions ) {
         var params = {
            page: legislativePropositionOptions.page,
            pageSize: legislativePropositionOptions.pageSize
         };
         if(filterOptions) {
            if(filterOptions.keywords) {
               params.keywords = filterOptions.keywords;
            }
            if(filterOptions.year && filterOptions.year > 0) {
               params.year = filterOptions.year;
            }
            if(filterOptions.number && filterOptions.number > 0) {
               params.number = filterOptions.number;
            }
            if(filterOptions.date1) {
               params.date1 = filterOptions.date1;
            }
            if(filterOptions.date2) {
               params.date2 = filterOptions.date2;
            }
            if(filterOptions.type !== null) {
               params.type = filterOptions.type._id;
            }
            if(filterOptions.id) {
               params = {
                  id: filterOptions.id
               };
            }
         }
         if(sortOptions) {
            if(sortOptions.field) {
               params.sort = sortOptions.field;
               params.sortDirection = sortOptions.direction;
            }
         }
         return HttpDispatcherService.get('/legislativePropositions',
                                         {
                                            'params': params
                                         }).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      };

      LegislativePropositionService.getLegislativeProposition = function (legislativePropositionId) {
         return HttpDispatcherService.get('/legislativeProposition/' + legislativePropositionId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionService.getLegislativePropositionByNumber = function ( legislativePropositionNumber,
                                                                                   legislativePropositionTypeId ) {
         return HttpDispatcherService.get( '/legislativeProposition/byNumber/' + legislativePropositionTypeId + '/' +
                                           legislativePropositionNumber )
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionService.getNextNumberOfTheType = function (legislativePropositionTypeId) {
         return  HttpDispatcherService.get('/legislativeProposition/nextNumber/' + legislativePropositionTypeId)
                                      .then(function(result) {
                                          return result.data;
                                       }).catch(function(error) {
                                          throw error
                                       });
      };

      LegislativePropositionService.checkUniqueNumber = function (legislativePropositionTypeId, number) {
         return $q(function(resolve, reject) {
            HttpDispatcherService.get('/legislativeProposition/checkUniqueNumber/' + legislativePropositionTypeId + "/" + number)
                                 .then(function(result) {
                                    var resultData = result.data;
                                    if (!resultData.exists) {
                                       resolve(result.data)
                                    } else {
                                       reject(result.data);
                                    }
                                 }).catch(function(error) {
                                    reject(error)
                                 });
         });
      };

      LegislativePropositionService.getUploadWysiwygTextFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygTextFileAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygTextFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygTextFileImageAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygTextAttachmentFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygTextAttachmentFileAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygTextAttachmentFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygTextAttachmentFileImageAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygConsolidatedTextFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygConsolidatedTextFileAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygConsolidatedTextFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygConsolidatedTextFileImageAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygConsolidatedTextAttachmentFileAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygConsolidatedTextAttachmentFileAttachmentURL;
      }

      LegislativePropositionService.getUploadWysiwygConsolidatedTextAttachmentFileImageAttachmentURL = function() {
         return settings.baseUrlSiteCamaraApi +
                     settings.LegislativeProposition.uploadWysiwygConsolidatedTextAttachmentFileImageAttachmentURL;
      }

      LegislativePropositionService.getAttachmentFileUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/legislativeProposition/attachment/file/' + uuid.v4(),
              autoUpload: true,
              method: 'PUT',
              headers: {
                 Authorization: 'Bearer ' + AuthenticationService.getToken()
              }
         });
         //file name filter
         uploader.filters.push({
               name: 'docFilter',
               fn: function(item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|plain|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|pdf|'.indexOf(type) !== -1;
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

      LegislativePropositionService.getConsolidatedAttachmentFileUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/legislativeProposition/consolidatedAttachment/file/' + uuid.v4(),
              autoUpload: true,
              method: 'PUT',
              headers: {
                 Authorization: 'Bearer ' + AuthenticationService.getToken()
              }
         });
         //file name filter
         uploader.filters.push( {
               name: 'docFilter',
               fn: function(item /*{File|FileLikeObject}*/, options) {
                   var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                   return '|plain|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|pdf|'.indexOf(type) !== -1;
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

      LegislativePropositionService.getLegislativePropositionRelationshipTypes = function() {
         return HttpDispatcherService.get('/legislativePropositionRelationshipTypes')
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionService.getLegislativePropositionTypes = function() {
         return HttpDispatcherService.get('/legislativePropositionTypes')
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionService.newAttachmentFile = function(attachmentFile) {
         return HttpDispatcherService.put('/legislativeProposition/attachment',
                                          { 'legislativePropositionAttachment':  attachmentFile })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionService.deleteAttachmentFile = function(legislativePropositionFileAttachmentId) {
         return HttpDispatcherService.delete('/legislativeProposition/attachment/' + legislativePropositionFileAttachmentId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      //filtering and pagination options controller
      var _filterOptions = {
         id: null,
         date1: undefined,
         date2: undefined,
         keywords: '',
         year: null,
         number: null,
         type: null,

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

      LegislativePropositionService.getFilterOptions = function () {
         return _filterOptions;
      }

      var _paginationOptions = {
         currentPage: 1,
         totalItems: 1,
         itemsPerPage: 5,
         maxSize: 10,
         totalPages: 1
      }

      LegislativePropositionService.getPaginationOptions = function () {
         return _paginationOptions;
      }

      var _sortOptions = {
         field: 'date',
         direction: -1
      }

      LegislativePropositionService.getSortOptions = function () {
         return _sortOptions;
      }

      //id of the news item to be highlighted
      var _highlightLegislativePropositionId = null;
      LegislativePropositionService.setHighlightLegislativePropositionId  = function (legislativePropositionId) {
         _highlightLegislativePropositionId = legislativePropositionId;
      }

      LegislativePropositionService.getHighlightLegislativePropositionId  = function () {
         return _highlightLegislativePropositionId;
      }

      LegislativePropositionService.clearHighlightLegislativePropositionId  = function () {
         _highlightLegislativePropositionId = null;
      }

   }
})();
