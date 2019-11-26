(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').service('PurgeCacheService', PurgeCacheService);

   PurgeCacheService.$inject = [ 'HttpDispatcherService', 'settings' ];
   function PurgeCacheService( HttpDispatcherService, settings
                       ) {
      var purgeCacheService = this;

      purgeCacheService.purge = function () {
         return HttpDispatcherService.get('/purgeCache')
                                     .then(function(result) {
                                        return result.data;
                                     }).catch(function(error) {
                                        throw error
                                     });
      };
   }
})();
