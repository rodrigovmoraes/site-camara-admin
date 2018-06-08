(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('HotNewsService', HotNewsService);

   HotNewsService.$inject = [ 'HttpDispatcherService',
                              'settings' ];
   function HotNewsService( HttpDispatcherService,
                            settings
                          ) {
      var hotNewsService = this;

      hotNewsService.saveNewHotNewsItem = function(hotNewsItem) {
         return HttpDispatcherService.put('/hotnews',
                                          { 'hotNewsItem':  hotNewsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      hotNewsService.editHotNewsItem = function(hotNewsItem) {
         return HttpDispatcherService.post('/hotnews',
                                          { 'hotNewsItem':  hotNewsItem })
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      hotNewsService.getHotNews = function () {
         return HttpDispatcherService.get('/hotnews').then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      hotNewsService.getHotNewsItem = function (hotNewsItemId) {
         return HttpDispatcherService.get('/hotnews/' + hotNewsItemId).then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      hotNewsService.moveHotNewsItemUp = function (hotNewsItemId) {
         return HttpDispatcherService.get('/hotnews/' + hotNewsItemId + "/moveUp").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      hotNewsService.moveHotNewsItemDown = function (hotNewsItemId) {
         return HttpDispatcherService.get('/hotnews/' + hotNewsItemId + "/moveDown").then(function(result) {
                                             return result.data;
                                         }).catch(function(error) {
                                             throw error
                                         });
      }

      hotNewsService.deleteHotNewsItem = function(hotNewsItemId) {
         return HttpDispatcherService.delete('/hotnews/' + hotNewsItemId)
                                     .then(function(result) {
                                         return result.data;
                                     }).catch(function(error) {
                                         throw error
                                     });
      }

      //id of the banner to be highlighted
      var _highlightHotNewsId = null;
      hotNewsService.setHighlightHotNewsId  = function (hotNewsId) {
         _highlightHotNewsId = hotNewsId;
      }

      hotNewsService.getHighlightHotNewsId  = function () {
         return _highlightHotNewsId;
      }

      hotNewsService.clearHighlightHotNewsId  = function () {
         _highlightHotNewsId = null;
      }
   }
})();
