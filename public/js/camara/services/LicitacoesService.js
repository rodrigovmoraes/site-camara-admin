(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('LicitacoesService', LicitacoesService);

   LicitacoesService.$inject = [ 'HttpDispatcherService', 'settings',
                                 'FileUploader', 'uuid',
                                 'ImageProcessingSocketIO', 'AuthenticationService', '$q'
                               ];
   function LicitacoesService( HttpDispatcherService, settings,
                               FileUploader, uuid,
                               imageProcessingSocketIO, AuthenticationService, $q
                             ) {
      var LicitacoesService = this;

      LicitacoesService.newLicitacaoEvent = function(licitacaoId, licitacaoEvent) {
         return HttpDispatcherService.put('/licitacao/event/' + licitacaoId,
                                          { 'licitacaoEvent':  licitacaoEvent })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LicitacoesService.saveLicitacaoEvent = function(licitacaoEvent) {
         return HttpDispatcherService.post('/licitacao/event',
                                          { 'licitacaoEvent':  licitacaoEvent })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LicitacoesService.deleteLicitacaoEvent = function(licitacaoId, licitacaoEventId) {
         return HttpDispatcherService.delete('/licitacao/event/' + licitacaoId + "/" + licitacaoEventId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LicitacoesService.newLicitacao = function(licitacao) {
         return HttpDispatcherService.put('/licitacao',
                                          { 'licitacao':  licitacao })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LicitacoesService.saveLicitacao = function(licitacao) {
         return HttpDispatcherService.post('/licitacao',
                                          { 'licitacao':  licitacao })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LicitacoesService.deleteLicitacao = function(licitacaoId) {
         return HttpDispatcherService.delete('/licitacao/' + licitacaoId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      LicitacoesService.getLicitacoes = function( licitacaoOptions,
                                                  filterOptions,
                                                  sortOptions ) {
         var params = {
            page: licitacaoOptions.page,
            pageSize: licitacaoOptions.pageSize
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
            if(filterOptions.publicationDate1) {
               params.publicationDate1 = filterOptions.publicationDate1;
            }
            if(filterOptions.publicationDate2) {
               params.publicationDate2 = filterOptions.publicationDate2;
            }
            if(filterOptions.state || filterOptions.state === 0) {
               params.state = filterOptions.state;
            }
            if(filterOptions.category !== null) {
               params.category = filterOptions.category._id;
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
         return HttpDispatcherService.get('/licitacoes',
                                         {
                                            'params': params
                                         }).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      };

      LicitacoesService.getLicitacao = function (licitacaoId) {
         return HttpDispatcherService.get('/licitacao/' + licitacaoId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LicitacoesService.getLicitacaoEvent = function (eventId) {
         return HttpDispatcherService.get('/licitacao/event/' + eventId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LicitacoesService.getNextNumberOfTheYear = function (year, category) {
         return  HttpDispatcherService.get('/licitacao/nextNumber/' + year + "/" + category)
                                      .then(function(result) {
                                          return result.data;
                                       }).catch(function(error) {
                                          throw error
                                       });
      };

      LicitacoesService.checkUniqueNumber = function (year, number, category) {
         return $q(function(resolve, reject) {
            HttpDispatcherService.get('/licitacao/checkUniqueNumber/' + year + "/" + number + "/" + category)
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

      LicitacoesService.publishLicitacao = function (licitacaoId) {
         return HttpDispatcherService.get('/licitacao/publish/' + licitacaoId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LicitacoesService.unpublishLicitacao = function (licitacaoId) {
         return HttpDispatcherService.get('/licitacao/unpublish/' + licitacaoId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LicitacoesService.getEventFileUploader = function() {
         //new upload handler
         var uploader = new FileUploader({
              url: settings.baseUrlSiteCamaraApi + '/licitacao/event/file/' + uuid.v4(),
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
                   return '|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|pdf|'.indexOf(type) !== -1;
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

      LicitacoesService.deleteEventFile = function(fileName) {
         var fileNameParam = fileName ? fileName : '';
         return HttpDispatcherService.delete('/licitacao/event/file/' + fileNameParam).then(function(result) {
                                               return result.data;
                                            }).catch(function(error) {
                                               throw error
                                            });
      }

      LicitacoesService.getLicitacoesCategories = function() {
         return HttpDispatcherService.get('/licitacoesCategories')
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      //filtering and pagination options controller
      var _filterOptions = {
         id: null,
         publicationDate1: undefined,
         publicationDate2: undefined,
         keywords: '',
         year: null,
         number: null,
         state: null, //"ALL", "PUBLISHED", "TO_BE_PUBLISHED", "NOT_TO_BE_PUBLISHED",
         category: null,
         publicationDescription: "",

         dateOptions: {
             dateDisabled: false,
             formatYear: 'yyyy',
             maxDate: new Date(2100, 0, 1),
             minDate: 0,
             startingDay: 1
         },
         openPublicationDate1: function() {
            _filterOptions.publicationDate1IsOpen = true;
         },
         openPublicationDate2: function() {
            _filterOptions.publicationDate2IsOpen = true;
         },
         publicationDate1IsOpen: false,
         publicationDate2IsOpen: false
      };

      LicitacoesService.getFilterOptions = function () {
         return _filterOptions;
      }

      var _paginationOptions = {
         currentPage: 1,
         totalItems: 1,
         itemsPerPage: 5,
         maxSize: 10,
         totalPages: 1
      }

      LicitacoesService.getPaginationOptions = function () {
         return _paginationOptions;
      }

      var _sortOptions = {
         field: 'number',
         direction: -1
      }

      LicitacoesService.getSortOptions = function () {
         return _sortOptions;
      }

      //id of the news item to be highlighted
      var _highlightLicitacaoId = null;
      LicitacoesService.setHighlightLicitacaoId  = function (licitacaoId) {
         _highlightLicitacaoId = licitacaoId;
      }

      LicitacoesService.getHighlightLicitacaoId  = function () {
         return _highlightLicitacaoId;
      }

      LicitacoesService.clearHighlightLicitacaoId  = function () {
         _highlightLicitacaoId = null;
      }

   }
})();
