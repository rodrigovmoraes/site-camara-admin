(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('LegislativePropositionTagsService', LegislativePropositionTagsService);

   LegislativePropositionTagsService.$inject = [ 'HttpDispatcherService',
                                                 'settings',
                                                 '$q',
                                                 'GridUtils' ];
   function LegislativePropositionTagsService( HttpDispatcherService,
                                               settings,
                                               $q,
                                               GridUtils ) {
      var LegislativePropositionTagsService = this;

      var _applyFiltering = function(legislativePropositionTags, filtering) {
         var legislativePropositionTagsResult = legislativePropositionTags;
         if(filtering) {
            var i;
            var idFilterFound = false;
            //check if there is an _id filter

            //if there is an id filter then filter just by the id and ignore
            //the other filters
            for(i = 0; i < filtering.length && !idFilterFound; i++) {
               var filter = filtering[i];
               if(filter.filterType === 'select' && filter.field === '_id') {
                  legislativePropositionTagsResult = _.filter(legislativePropositionTagsResult, function(element) {
                     return element._id === filter.term;
                  });
                  idFilterFound = true;
               }
            }
            if(!idFilterFound) {
               //there isn´t an id filter, then apply the filters
               for(i = 0; i < filtering.length; i++) {
                  var filter = filtering[i];
                  if(filter.filterType === 'select') {
                     legislativePropositionTagsResult = _.filter(legislativePropositionTagsResult, function(element) {
                        if(element[filter.field] && filter.term) {
                           return element[filter.field]._id === filter.term;
                        } else {
                           return true;
                        }
                     });
                  } else {
                     legislativePropositionTagsResult = _.filter(legislativePropositionTagsResult, function(element) {
                        if(element[filter.field] && filter.term) {
                           return element[filter.field].toLowerCase().indexOf(filter.term.toLowerCase()) >= 0;
                        } else {
                           return true;
                        }
                     });
                  }
               }
            }
         }
         return legislativePropositionTagsResult;
      }

      var _transformLegislativePropositionTags = function(legislativePropositionTags) {
         if(legislativePropositionTags) {
            var i;
            for(i = 0; i < legislativePropositionTags.length; i++) {
               var legislativePropositionTag = legislativePropositionTags[i];
               legislativePropositionTag['descriptionLowercase'] = legislativePropositionTag.description.toLowerCase();
            }
         }
      }

      var _extractLegislativePropositionTypesOptions = function(legislativePropositionTypes) {
         var legislativePropositionTypesOptions = [];
         if(legislativePropositionTypes) {
            var i;
            for(i = 0; i < legislativePropositionTypes.length; i++) {
               legislativePropositionTypesOptions.push({
                  'value': legislativePropositionTypes[i]._id,
                  'label': legislativePropositionTypes[i].description
               });
            }
         }
         return legislativePropositionTypesOptions;
      }

      var _handleSorting = function(legislativePropositionTags, paginationOptions) {
         if(paginationOptions !== undefined && paginationOptions.sortColumns !== null) {
            var i;
            for(i = 0; i < paginationOptions.sortColumns.length; i++) {
               var sortColumn = paginationOptions.sortColumns[i];
               if(sortColumn.field === 'propositionType') {
                  sortColumn.field = 'propositionType.description'
               } else if (sortColumn.field === 'description') {
                  sortColumn.field = 'descriptionLowercase'
               }
            }
            return _.orderBy(legislativePropositionTags, _.map(paginationOptions.sortColumns, 'field'),
                                                         _.map(paginationOptions.sortColumns, 'direction'));
         } else {
            return legislativePropositionTags;
         }
      }

      LegislativePropositionTagsService.getLegislativePropositionTags = function(legislativePropositionTypeId) {
         return HttpDispatcherService.get('/legislativePropositionTags/' + legislativePropositionTypeId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionTagsService.getLegislativePropositionTagsForGrid = function(paginationOptions) {
            var legislativePropositionTags = null;
            var legislativePropositionTypes = null;
            return HttpDispatcherService.get('/legislativePropositionTags')
                                        .then(function(result) {
                                           legislativePropositionTags = result.data.legislativePropositionTags;

                                           return HttpDispatcherService.get('/legislativePropositionTypes');
                                        }).then(function(result) {
                                           legislativePropositionTypes = result.data.legislativePropositionTypes;
                                           _transformLegislativePropositionTags(legislativePropositionTags);
                                           //sorting
                                           legislativePropositionTags = _handleSorting(legislativePropositionTags, paginationOptions);

                                           //filtering
                                           legislativePropositionTags = _applyFiltering(legislativePropositionTags, paginationOptions.filtering);

                                           var totalLength = legislativePropositionTags.length;
                                           var pageNumber = paginationOptions.pageNumber;
                                           var pageSize = paginationOptions.pageSize;
                                           //pagination
                                           legislativePropositionTags = _.slice(legislativePropositionTags, (pageNumber - 1) * pageSize, Math.min(pageNumber * pageSize, legislativePropositionTags.length));
                                           return {
                                              "legislativePropositionTags" : legislativePropositionTags,
                                              "totalLength" : totalLength,
                                              "selectFilters" : [
                                                 { field: 'propositionType',
                                                   values: _extractLegislativePropositionTypesOptions(legislativePropositionTypes)
                                                 }
                                              ]
                                           }
                                        }).catch(function(error) {
                                           throw error
                                        });
      }

      LegislativePropositionTagsService.getLegislativePropositionTag = function(legislativePropositionTagId) {
         return HttpDispatcherService.get('/legislativePropositionTag/' + legislativePropositionTagId)
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };

      LegislativePropositionTagsService.newLegislativePropositionTag = function(legislativePropositionTag) {
         return HttpDispatcherService.put('/legislativePropositionTag',
                                          { 'legislativePropositionTag':  legislativePropositionTag })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionTagsService.saveLegislativePropositionTag = function(legislativePropositionTag) {
         return HttpDispatcherService.post('/legislativePropositionTag',
                                          { 'legislativePropositionTag':  legislativePropositionTag })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionTagsService.deleteLegislativePropositionTag = function(legislativePropositionTagId) {
         return HttpDispatcherService.delete('/legislativePropositionTag/' + legislativePropositionTagId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      };

      LegislativePropositionTagsService.checkUniqueDescription = function(legislativePropositionTypeId, description) {
         var defer = $q.defer();
         HttpDispatcherService.get('/checkUniqueLegislativePropositionTagDescription/' + legislativePropositionTypeId,
                                   { 'params' :
                                      {
                                          'description':  description
                                      }
                                   }
                              )
                              .then(function(result) {
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
      };

   }
})();
