(function() {
"use strict";

      angular.module('SiteCamaraAdminApp').factory('settings', ConfigService);

      ConfigService.$inject = ['$rootScope']
      function ConfigService($rootScope) {
             var settings = camaraConfig('js/camara/config/settings');

             $rootScope.settings = settings;
             return settings;
      }

})();
