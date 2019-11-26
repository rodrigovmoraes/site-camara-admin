(function() {
"use strict";

   angular.module('SiteCamaraAdminApp').controller('PurgeCacheController', PurgeCacheController);

   PurgeCacheController.$inject = [ '$scope', 'messages',
                                     'Utils', '$stateParams',
                                     'PurgeCacheService', 'settings'
                                  ];
   function PurgeCacheController( $scope, messages,
                                  Utils, $stateParams,
                                  PurgeCacheService, settings
                                ) {

      var $purgeCacheCtrl = this;

      //messages control
      Utils.applyMessageControls($purgeCacheCtrl);

      //function for template messages
      var _templateMessage = function (messageTemplate, config) {
         return Utils.templateMessage(messageTemplate, config);
      }

      //messages
      $purgeCacheCtrl.errorMessage = $stateParams.errorMessage;
      $purgeCacheCtrl.infoMessage = $stateParams.infoMessage;
      $purgeCacheCtrl.notFoundMessage = messages.newsNotFound;

      $purgeCacheCtrl.purgeCache = function() {
            $purgeCacheCtrl.clearMessage();
            return PurgeCacheService
                     .purge()
                     .then(function(result) {
                        $purgeCacheCtrl.infoMessage = messages.cachePurged;
                     }).catch(function (error) {
                        $purgeCacheCtrl.errorMessage = error.message;
                     });
      }
   }
})();
